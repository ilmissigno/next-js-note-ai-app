import { notesIndex } from "@/lib/db/pinecone";
import prisma from "@/lib/db/prisma";
import { getEmbeddings } from "@/lib/openai";
import { createNoteSchema, deleteNoteSchema, updateNoteSchema } from "@/lib/validation/note";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
    try{
        const body = await req.json()
        const parseResult = createNoteSchema.safeParse(body)
        
        if(!parseResult.success){
            console.error(parseResult.error)
            return Response.json({error: "Invalid input"},{status: 400})
        }

        const {title, content} = parseResult.data
        const {userId} = auth()

        if(!userId){
            return Response.json({error: "Unauthorized"}, {status: 401})
        }

        const embedding = await getEmbeddingsForNote(title, content);

        const note = await prisma.$transaction(async (tx) => {
            const note = await tx.note.create({
                data: {
                    title: title,
                    content: content,
                    userId: userId
                }
            })

            await notesIndex.upsert([
                {
                    id: note.id,
                    values: embedding,
                    metadata: {userId}
                }
            ])

            return note;
        })

        return Response.json({note}, {status: 201})

    }catch(err){
        console.error(err);
        return Response.json({ error: "Internal Server Error"}, {status: 500})
    }
}

export async function PUT(req: Request){
    try{

        const body = await req.json()
        const parseResult = updateNoteSchema.safeParse(body)
        
        if(!parseResult.success){
            console.error(parseResult.error)
            return Response.json({error: "Invalid input"},{status: 400})
        }

        const {id, title, content} = parseResult.data
        
        const note = await prisma.note.findUnique({where: {id}})
        
        if(!note){
            return Response.json({error: "Note not found"},{status:404})
        }
        
        const {userId} = auth()

        if(!userId || userId !== note.userId){
            return Response.json({error: "Unauthorized"}, {status: 401})
        }

        const embedding = await getEmbeddingsForNote(title, content);

        const updatednote = await prisma.$transaction(async (tx) => {
            const updatednote = await tx.note.update({
                where: {id},
                data:{
                    title,
                    content
                }
            })

            await notesIndex.upsert([
                {
                    id: id,
                    values: embedding,
                    metadata: {userId}
                }
            ])

            return updatednote
        })

        return Response.json({updatednote}, {status: 200})

    }catch(err){
        console.error(err);
        return Response.json({ error: "Internal Server Error"}, {status: 500})
    }
}

export async function DELETE(req: Request){
    try{

        const body = await req.json()
        const parseResult = deleteNoteSchema.safeParse(body)
        
        if(!parseResult.success){
            console.error(parseResult.error)
            return Response.json({error: "Invalid input"},{status: 400})
        }

        const {id} = parseResult.data
        
        const note = await prisma.note.findUnique({where: {id}})
        
        if(!note){
            return Response.json({error: "Note not found"},{status:404})
        }
        
        const {userId} = auth()

        if(!userId || userId !== note.userId){
            return Response.json({error: "Unauthorized"}, {status: 401})
        }


        await prisma.$transaction(async (tx) => {
            await tx.note.delete({
                where: {id},
            })
            await notesIndex.deleteOne(id)
        })

        return Response.json({message: "Note deleted"}, {status: 200})

    }catch(err){
        console.error(err);
        return Response.json({ error: "Internal Server Error"}, {status: 500})
    }
}

async function getEmbeddingsForNote(title: string, content: string|undefined){
    return getEmbeddings(title + "\n\n" + content ?? "")
}