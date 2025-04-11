'use client';
import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useWebSocket } from '@/lib/wsClient';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

interface Message {
  _id: string;
  sender: { _id: string; name: string; avatar?: string };
  receiver: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  mediaType?: string;
  mediaUrl?: string;
}

export function MessageList({ receiverId, currentUserId }: { 
  receiverId: string; 
  currentUserId: string 
}) {
  const [messages, setMessages] = useState<Message[]>([]);

  const { sendMessage: sendWsMessage } = useWebSocket(
    'ws://localhost:3000/api/ws',
    (data) => {
      if (
        data.type === 'new_message' &&
        (data.message.sender === receiverId || data.message.receiver === currentUserId)
      ) {
        setMessages((prev) => [...prev, data.message]);
      }
    }
  );

  useEffect(() => {
    async function fetchMessages() {
      try {
        const res = await fetch(`/api/messages?receiverId=${receiverId}`);
        const data = await res.json();
        console.log('Fetched messages:', data);

        const msgs = Array.isArray(data) ? data : data.messages;
        if (!Array.isArray(msgs)) {
          console.error('Invalid messages format:', data);
          return;
        }

        setMessages(msgs);

        // Mark unread messages as read
        const unreadIds = msgs
          .filter((msg) => !msg.isRead && msg.receiver === currentUserId)
          .map((msg) => msg._id);

        if (unreadIds.length > 0) {
          await fetch('/api/messages/read', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ messageIds: unreadIds }),
          });

          // Notify sender over WebSocket
          sendWsMessage({
            type: 'messages_read',
            messageIds: unreadIds,
            receiverId: currentUserId,
          });
        }
      } catch (error) {
        console.error('Failed to fetch messages:', error);
        setMessages([]); // fallback
      }
    }

    fetchMessages();
  }, [receiverId, currentUserId]);

  const renderMedia = (message: Message) => {
    if (!message.mediaUrl) return null;

    switch (message.mediaType) {
      case 'image':
        return (
          <img
            src={message.mediaUrl}
            alt="Shared content"
            className="max-w-xs rounded mt-2"
          />
        );
      case 'video':
        return (
          <video controls className="max-w-xs rounded mt-2">
            <source src={message.mediaUrl} type="video/mp4" />
          </video>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <Card
          key={message._id}
          className={`max-w-xs ${message.sender._id === currentUserId ? 'ml-auto' : ''}`}
        >
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Avatar>
                <AvatarImage
                  src={message.sender.avatar || `/avatars/${message.sender._id}.png`}
                />
                <AvatarFallback>{message.sender.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{message.content}</p>
                {renderMedia(message)}
                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs text-gray-500">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </p>
                  {message.sender._id !== currentUserId && message.isRead && (
                    <Check className="h-3 w-3 text-blue-500" />
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
