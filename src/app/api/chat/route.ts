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
    
    // 1. ΕΛΕΓΧΟΣ ΓΙΑ JOIN EVENT (Είσοδος Χρήστη)
    if (body.type === 'join') {
      const { nickname, avatar } = body;

      if (!nickname) {
        return NextResponse.json({ error: 'Missing nickname' }, { status: 400 });
      }

      // Στέλνουμε το event 'user-joined' στο Pusher
      await pusher.trigger('spotx-stream', 'user-joined', {
        nickname,
        avatar,
      });

      return NextResponse.json({ success: true });
    }

    // 2. ΕΛΕΓΧΟΣ ΓΙΑ ΚΑΝΟΝΙΚΟ ΜΗΝΥΜΑ
    // Δεχόμαστε και το 'username' (παλιό payload) και το 'nickname' (νέο payload) για σιγουριά
    const text = body.text;
    const nickname = body.username || body.nickname;
    const avatar = body.avatar;

    if (!text || !nickname) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    // Στέλνουμε το event 'new-message' στο Pusher
    await pusher.trigger('spotx-stream', 'new-message', {
      text,
      nickname, // Το στέλνουμε ως nickname για να διαβάζεται σωστά από το νέο ChatCard interface
      avatar,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Pusher Trigger Error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}