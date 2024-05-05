import { CreateNoteSchema, createNoteSchema } from "@/lib/validation/note";
import { useForm } from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import LoadingButton from "./ui/loading-button";
import { useRouter } from "next/navigation";
import { Note } from "@prisma/client";
import { useState } from "react";
import { Trash2 } from "lucide-react";

interface AddEditNoteDialogProps {
    open: boolean,
    setOpen: (open: boolean) => void,
    noteToEdit?: Note
}

export default function AddEditNoteDialog({open, setOpen, noteToEdit}: AddEditNoteDialogProps){
    const [deleteInProgress, setDeleteInProgress] = useState(false)
    const router = useRouter()
    const form = useForm<CreateNoteSchema>({
        resolver: zodResolver(createNoteSchema),
        defaultValues:{
            title: noteToEdit?.title || "",
            content: noteToEdit?.content || "",
        }
    })

    async function onSubmit(input: CreateNoteSchema){
        try{
            if(noteToEdit){
                const response = await fetch("/api/notes", {
                    method: "PUT",
                    body: JSON.stringify({
                        id: noteToEdit.id,
                        ...input
                    })
                })
                if(!response.ok)
                    throw Error("Status code: "+response.status)
            }else{
                const response = await fetch("/api/notes", {
                    method: "POST",
                    body: JSON.stringify(input)
                })
    
                if(!response.ok)
                    throw Error("Status code: "+response.status)
                
                form.reset()
            }
            router.refresh()
            setOpen(false)
        }catch(err){
            console.error(err);
            alert("Qualcosa è andato storto.. Riprovare.")
        }
    }

    async function deleteNote(){
        if(!noteToEdit){
            return
        }
        setDeleteInProgress(true)
        try{
            const response = await fetch("/api/notes", {
                method: "DELETE",
                body: JSON.stringify({
                    id: noteToEdit.id
                })
            })
            if(!response.ok)
                throw Error("Status code: "+response.status)
            router.refresh()
            setOpen(false)
        }catch(err){
            console.error(err);
            alert("Qualcosa è andato storto.. Riprovare.")
        }finally{
            setDeleteInProgress(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{noteToEdit ? "Modifica una Nota" : "Aggiungi una Nota"}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                        <FormField control={form.control} name="title" render={({field}) => (
                            <FormItem>
                                <FormLabel>Titolo</FormLabel>
                                <FormControl>
                                    <Input placeholder="Titolo" {...field}></Input>
                                </FormControl>
                                <FormMessage></FormMessage>
                            </FormItem>
                        )}>
                        </FormField>
                        <FormField control={form.control} name="content" render={({field}) => (
                            <FormItem>
                                <FormLabel>Contenuto</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Scrivi qui..." {...field} />
                                </FormControl>
                                <FormMessage></FormMessage>
                            </FormItem>
                        )}>
                        </FormField>
                        <DialogFooter className="gap-1 sm:gap-0">
                            {noteToEdit && (
                                <LoadingButton variant="destructive" loading={deleteInProgress} disabled={form.formState.isSubmitting} onClick={deleteNote} type="button">
                                    <Trash2></Trash2>
                                </LoadingButton>
                            )}
                            <LoadingButton type="submit" loading={form.formState.isSubmitting} disabled={deleteInProgress}>
                                Invia
                            </LoadingButton>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )

}