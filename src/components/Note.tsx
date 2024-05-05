import { Note as NoteModel } from "@prisma/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";

interface NoteProps {
    note: NoteModel
}

export default function Note({note} : NoteProps){
    const wasUpdated = note.updatedAt > note.createdAt
    const createdUpdatedAtTimestamp = (
        wasUpdated ? note.updatedAt : note.createdAt
    ).toLocaleDateString('it-IT', {'weekday': 'long', 'month': 'long', 'day': '2-digit', 'year': '2-digit'})

    return (
        <Card>
            <CardHeader>
                <CardTitle>{note.title}</CardTitle>
                <CardDescription>
                    {createdUpdatedAtTimestamp}
                    {wasUpdated && " (updated)"}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p className="whitespace-pre-line">
                    {note.content}
                </p>
            </CardContent>
        </Card>
    )
}