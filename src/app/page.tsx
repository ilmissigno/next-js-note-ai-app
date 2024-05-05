import Image from "next/image";
import logo from "@/assets/logo.png"
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default function Home() {

  const { userId } = auth();

  if(userId)
    redirect("/notes");

  return (
    <main className="flex flex-col h-screen items-center justify-center gap-5">
      <div className="flex items-center gap-4">
        <Image src={logo} alt="NoteAI App Logo" width={100} height={100} />
        <span className="font-extrabold tracking-tight text-4xl lg:text-5xl">NoteAI App</span>
      </div>
      <p className="text-center max-w-prose">
        Un app di note intelligente creata con OpenAI, Pinecone, Next.js, Shadcn UI, Clerk Auth e molto altro.
      </p>
      <Button asChild size="lg">
        <Link href="/notes">
          Apri le Note
        </Link>
      </Button>
    </main>
  );
}
