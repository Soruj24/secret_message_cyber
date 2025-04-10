import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import { MessageList } from '@/components/MessageList';
import { MessageInput } from '@/components/MessageInput';

export default async function ChatPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect('/login');
  }

  const receiverId = searchParams.receiverId as string;

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">Chat</h1>
      <div className="space-y-4">
        <MessageList receiverId={receiverId} />
        <MessageInput receiverId={receiverId} />
      </div>
    </div>
  );
}