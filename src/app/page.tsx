"use client"
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Home() {
  const [name, setName] = useState("");
  const router = useRouter();

  const joinChat = () => {
    if (name.trim()) {
      router.push("/chat");
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="w-full max-w-md px-4">
        <h1 className="text-3xl font-bold mb-6 text-center">Join Chat</h1>
        <Input
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && joinChat()}
        />
        <Button className="w-full mt-4" onClick={joinChat}>
          Join
        </Button>
      </div>
    </main>
  );
}
