'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Image, Paperclip, Send } from 'lucide-react';
import { MediaUpload } from './MediaUpload';
import { useWebSocket } from '@/lib/wsClient';

export function MessageInput({ 
  receiverId, 
  currentUserId,
  isGroup = false
}: { 
  receiverId: string; 
  currentUserId: string;
  isGroup?: boolean;
}) {
  const [message, setMessage] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [showMediaUpload, setShowMediaUpload] = useState(false);
  const { sendMessage: sendWsMessage } = useWebSocket('ws://localhost:3000/api/ws', () => {});

  const handleSend = async () => {
    if (!message.trim() && !mediaUrl) return;

    const messageData = {
      sender: currentUserId,
      receiver: receiverId,
      content: message,
      ...(mediaUrl && { mediaUrl, mediaType: mediaUrl.match(/\.(jpg|jpeg|png|gif)$/) ? 'image' : 'video' })
    };

    // Send via WebSocket for real-time
    sendWsMessage({
      type: 'new_message',
      message: messageData
    });

    // Also save to database
    await fetch('/api/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(messageData),
    });

    setMessage('');
    setMediaUrl('');
    setShowMediaUpload(false);
  };

  return (
    <div className="space-y-2">
      {showMediaUpload && (
        <MediaUpload 
          onUpload={(url) => {
            setMediaUrl(url);
            setShowMediaUpload(false);
          }} 
        />
      )}
      <div className="flex space-x-2">
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => setShowMediaUpload(!showMediaUpload)}
        >
          <Paperclip className="h-4 w-4" />
        </Button>
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        />
        <Button onClick={handleSend}>
          <Send className="h-4 w-4 mr-2" />
          Send
        </Button>
      </div>
      {mediaUrl && (
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Image className="h-4 w-4" />
          <span>Media attached</span>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setMediaUrl('')}
          >
            Remove
          </Button>
        </div>
      )}
    </div>
  );
}