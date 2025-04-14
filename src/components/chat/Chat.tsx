'use client'

import { useEffect, useRef, useState } from "react";
import socket from "@/lib/socket";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Message = {
  id: number;
  text: string;
  sender: string;
};

export default function ChatBox() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    socket.on("message", (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("message");
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (input.trim()) {
      socket.emit("message", input);
      setInput("");
    }
  };

  return (
    <div className="max-w-xl mx-auto h-screen flex flex-col pt-10 px-4">
      <div className="flex-1 overflow-y-auto border rounded-lg p-4 bg-white shadow">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`mb-2 text-sm px-3 py-2 rounded-lg max-w-[80%] ${msg.sender === socket.id ? 'ml-auto bg-blue-500 text-white' : 'bg-gray-100'}`}
          >
            {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex gap-2 mt-4">
        <Input
          placeholder="মেসেজ লিখুন..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="flex-1"
        />
        <Button onClick={sendMessage}>পাঠান</Button>
      </div>
    </div>
  );
}
