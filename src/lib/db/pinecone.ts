import {Pinecone} from "@pinecone-database/pinecone"

const apiKey = process.env.PINECONE_API_KEY

// if (!apiKey){
//     throw Error("PINECONE API KEY is not set")
// }

const pinecone = new Pinecone({
    apiKey
})

export const notesIndex = pinecone.Index("noteaiapp-index");