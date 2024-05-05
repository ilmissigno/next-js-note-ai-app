"use client"
import Link from "next/link"
import Image from "next/image"
import logo from "@/assets/logo.png"
import { UserButton } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useState } from "react"
import AddEditNoteDialog from "@/components/AddEditNoteDialog"
import ThemeToggleButton from "@/components/ThemeToggleButton"
import {dark} from "@clerk/themes"
import { useTheme } from "next-themes"

export default function Navbar(){

    const { theme } = useTheme()

    const [showAddEditNoteDialog, setShowAddEditNoteDialog] = useState(false)

    return (
        <>
            <div className="p-4 shadow">
                <div className="flex flex-wrap gap-3 items-center justify-between max-w-7xl m-auto">
                    <Link href="/notes" className="flex items-center gap-1">
                        <Image src={logo} alt="NoteAI App Logo" width={60} height={60}/>
                        <span className="font-bold">NoteAI App</span>
                    </Link>
                    <div className="flex items-center gap-2">
                        <Button onClick={() => setShowAddEditNoteDialog(true)}>
                            <Plus size={20} className="mr-2"></Plus>
                            Aggiungi una Nota
                        </Button>
                        <UserButton afterSignOutUrl="/"
                        appearance={{
                            baseTheme: theme === 'dark' ? dark : undefined,
                            elements: { avatarBox: { width: "2.5rem", height: "2.5rem" } }
                        }}
                        />
                        <ThemeToggleButton></ThemeToggleButton>
                    </div>
                </div>
            </div>
            <AddEditNoteDialog open={showAddEditNoteDialog} setOpen={setShowAddEditNoteDialog}></AddEditNoteDialog>
        </>
    )
}