import { NextRequest, NextResponse } from 'next/server';
import Message from '@/models/Message';
import dbConnect from '@/lib/db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';

// GET method
export async function GET(request: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const receiverId = searchParams.get('receiverId');

    if (!receiverId) {
        return NextResponse.json({ error: 'receiverId is required' }, { status: 400 });
    }

    try {
        const messages = await Message.find({
            $or: [
                { sender: session.user.id, receiver: receiverId },
                { sender: receiverId, receiver: session.user.id },
            ],
        }).sort({ timestamp: 1 });

        return NextResponse.json(messages);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
    }
}

// POST method
export async function POST(request: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    try {
        const { receiverId, content }: { receiverId: string; content: string } = await request.json();

        if (!receiverId || !content) {
            return NextResponse.json({ error: 'receiverId and content are required' }, { status: 400 });
        }

        const newMessage = new Message({
            sender: session.user.id,
            receiver: receiverId,
            content,
        });

        await newMessage.save();

        return NextResponse.json(newMessage);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
    }
}
