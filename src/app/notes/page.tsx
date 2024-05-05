import Note from "@/components/Note";
import prisma from "@/lib/db/prisma";
import { auth } from "@clerk/nextjs/server"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "NoteAI App - Notes"
}
export default async function NotesPage(){

    const {userId} = auth();

    if(!userId){
        throw Error("userId not defined")
    }

    const allNotes = await prisma.note.findMany({
        where: {
            userId: userId
        }
    })

    return(
        <div className="grid gap-3 grid-cols-2 lg:grid-cols-3">
            {allNotes.map((note) => (
                <Note note={note} key={note.id}></Note>
            ))}
            {allNotes.length === 0 && (<div className="col-span-full text-center">{"Non esistono note, creane qualcuna!"}</div>)}
        </div>
    )
}