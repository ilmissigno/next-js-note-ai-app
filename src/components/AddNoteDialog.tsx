import { CreateNoteSchema, createNoteSchema } from "@/lib/validation/note";
import { useForm } from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import LoadingButton from "./ui/loading-button";
import { useRouter } from "next/navigation";

interface AddNoteDialogProps {
    open: boolean,
    setOpen: (open: boolean) => void,
}

export default function AddNoteDialog({open, setOpen}: AddNoteDialogProps){
    const router = useRouter()
    const form = useForm<CreateNoteSchema>({
        resolver: zodResolver(createNoteSchema),
        defaultValues:{
            title: "",
            content: "",
        }
    })

    async function onSubmit(input: CreateNoteSchema){
        try{
            const response = await fetch("/api/notes", {
                method: "POST",
                body: JSON.stringify(input)
            })

            if(!response.ok)
                throw Error("Status code: "+response.status)
            
            form.reset()
            router.refresh()
            setOpen(false)
        }catch(err){
            console.error(err);
            alert("Qualcosa è andato storto.. Riprovare.")
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Aggiungi una Nota</DialogTitle>
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
                        <DialogFooter>
                            <LoadingButton type="submit" loading={form.formState.isSubmitting}>
                                Invia
                            </LoadingButton>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )

}