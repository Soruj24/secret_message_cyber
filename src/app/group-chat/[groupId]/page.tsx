import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import Group from '@/models/Group';
import dbConnect from '@/lib/db';
import { MessageList } from '@/components/MessageList';
import { MessageInput } from '@/components/MessageInput';

export default async function GroupChatPage({
  params,
}: {
  params: { groupId: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect('/login');
  }

  await dbConnect();
  const group = await Group.findById(params.groupId).populate('members');

  if (!group) {
    redirect('/chat');
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-2xl font-bold mb-2">{group.name}</h1>
      <p className="text-gray-500 mb-4">{group.description}</p>
      
      <div className="space-y-4">
        <MessageList 
          receiverId={params.groupId} 
          currentUserId={session.user.id}
        />
        <MessageInput 
          receiverId={params.groupId} 
          currentUserId={session.user.id}
          isGroup={true}
        />
      </div>
    </div>
  );
}