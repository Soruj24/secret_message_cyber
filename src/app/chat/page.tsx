'use client';

import ChatBox from '@/components/chat/Chat';
import { useRouter } from 'next/navigation';
 
export default function ChatPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-slate-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800">
            Real-time Chat
          </h1>
          <button
            onClick={() => router.push('/')}
            className="text-slate-600 hover:text-slate-800 px-4 py-2 rounded-lg"
          >
            Leave Chat
          </button>
        </div>
        <ChatBox />
      </div>
    </main>
  );
}
