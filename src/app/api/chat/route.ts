import { NextResponse } from 'next/server';
import Pusher from 'pusher';

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  useTLS: true,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { text, username, avatar } = body;

    if (!text || !username) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    // Στέλνουμε το event στο κανάλι "spotx-stream"
    await pusher.trigger('spotx-stream', 'new-message', {
      text,
      username,
      avatar,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}