import { SignUp } from "@clerk/nextjs";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "NoteAI App - Sign Up"
}

export default function SignUpPage(){
    return(
        <div className="flex h-screen items-center justify-center">
            <SignUp appearance={{variables: {colorPrimary: "#00123D"}}}></SignUp>
        </div>
    )
}