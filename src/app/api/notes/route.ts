import prisma from "@/lib/db/prisma";
import { createNoteSchema } from "@/lib/validation/note";
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

        const note = await prisma.note.create({
            data: {
                title: title,
                content: content,
                userId: userId
            }
        })

        return Response.json({note}, {status: 201})

    }catch(err){
        console.error(err);
        return Response.json({ error: "Internal Server Error"}, {status: 500})
    }
}