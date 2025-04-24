"use client";

import { ChatHeader } from "@/components/chat-header";
import { Bot, Message } from "@prisma/client";

interface ChatClientProps {
  bot: Bot & {
    messages: Message[];
    _count: {
      messages: number;
    };
  };
}
export const ChatClient = ({ bot }: ChatClientProps) => {
  return (
    <div className="flex flex-col h-full p-4 space-y-2">
      <ChatHeader bot={bot} />
    </div>
  );
};
