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

  // Await searchParams and check for receiverId
  const { receiverId } = await searchParams;
console.log(receiverId);
  if (typeof receiverId !== 'string') {
    // Handle missing or incorrect receiverId
    console.error('No receiverId provided!');
    return <div>No receiver selected</div>; // or redirect to another page
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">Chat</h1>
      <div className="space-y-4">
        <MessageList receiverId={receiverId} currentUserId={session.user.id} />
        <MessageInput receiverId={receiverId} currentUserId={session.user.id} />
      </div>
    </div>
  );
}
