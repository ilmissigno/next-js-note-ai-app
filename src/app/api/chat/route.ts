import { notesIndex } from "@/lib/db/pinecone";
import prisma from "@/lib/db/prisma";
import openai, { getEmbeddings } from "@/lib/openai";
import { auth, currentUser } from "@clerk/nextjs/server";
import { ChatCompletionMessage } from "openai/resources/index.mjs";
import {OpenAIStream, StreamingTextResponse} from "ai"

export async function POST(req: Request){
    try{
        const body = await req.json();
        const messages: ChatCompletionMessage[] = body.messages;

        const messagesTruncated = messages.slice(-4); //£ last 4 messages

        const embedding = await getEmbeddings(messagesTruncated.map((message) => message.content).join("\n"))

        const {userId} = auth()
        const user = await currentUser()

        console.log(user)

        const vectorQueryResponse = await notesIndex.query({
            vector: embedding,
            topK: 3,
            filter: {userId}
        })

        const relevantNotes = await prisma.note.findMany({
            where: {
                id: {
                    in: vectorQueryResponse.matches.map((m) => m.id)
                }
            }
        })

        console.log("Relevant notes found: ", relevantNotes)

        const systemMessage: ChatCompletionMessage = {
            role: "assistant",
            content: "Sei un app di note personali intelligente. Rispondi con le domande dell'utente basandoti sulle sue note esistenti." +
            "Le sue note più rilevanti sono: \n"+
            relevantNotes.map((m) => `Titolo: ${m.title}\n\nContenuto:\n${m.content}`).join("\n\n")
        }

        const response = await openai.chat.completions.create({
            model: 'gpt-4',
            stream: true,
            messages: [systemMessage, ...messagesTruncated]
        })

        const stream = OpenAIStream(response)
        return new StreamingTextResponse(stream)
    }catch(err){
        console.error(err);
        return Response.json({ error: "Internal Server Error"}, {status: 500})
    }
}