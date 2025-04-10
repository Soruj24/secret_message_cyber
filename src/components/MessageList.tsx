'use client';
import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Message {
  _id: string;
  sender: string;
  content: string;
  timestamp: string;
}

export function MessageList({ receiverId }: { receiverId: string }) {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    async function fetchMessages() {
      const res = await fetch(`/api/messages?receiverId=${receiverId}`);
      const data = await res.json();
      setMessages(data);
    }

    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [receiverId]);

  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <Card key={message._id} className="max-w-xs">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Avatar>
                <AvatarImage src={`/avatars/${message.sender}.png`} />
                <AvatarFallback>{message.sender.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{message.content}</p>
                <p className="text-xs text-gray-500">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}