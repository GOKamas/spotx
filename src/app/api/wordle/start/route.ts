import { NextResponse } from 'next/server';
import { client } from '@/sanity/lib/client';

export const dynamic = 'force-dynamic';

async function getRandomWord(): Promise<string | null> {
  const words: string[] = await client.fetch(`*[_type == "wordleWord"].word`);
  if (!words || words.length === 0) return null;
  return words[Math.floor(Math.random() * words.length)];
}

export async function GET() {
  const word = await getRandomWord();
  if (!word) {
    return NextResponse.json({ error: 'no_words' }, { status: 404 });
  }

  const res = NextResponse.json({ length: word.length });
  res.cookies.set('wordle_target', word, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/api/wordle',
    maxAge: 60 * 30,
  });
  return res;
}