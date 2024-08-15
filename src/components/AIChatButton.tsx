import { useState } from "react";
import { Button } from "./ui/button";
import AIChatBox from "./AIChatBox";
import { Bot } from "lucide-react";

export default function AIChatButton(){
    const [chatBoxOpen, setChatBoxOpen] = useState(false);

    return (
        <>
            <Button onClick={() => setChatBoxOpen(true)} className="size-auto">
                <Bot size={15}></Bot>
            </Button>
            <AIChatBox open={chatBoxOpen} onClose={() => setChatBoxOpen(false)}></AIChatBox>
        </>
    )
}