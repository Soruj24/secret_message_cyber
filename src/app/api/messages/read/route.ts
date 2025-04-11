import { NextResponse } from 'next/server';
import Message from '@/models/Message';
import dbConnect from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();

  const { messageIds } = await request.json();

  await Message.updateMany(
    { _id: { $in: messageIds }, receiver: session.user.id },
    { isRead: true, readAt: new Date() }
  );

  return NextResponse.json({ success: true });
}