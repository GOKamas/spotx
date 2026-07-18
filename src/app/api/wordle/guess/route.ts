import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

type LetterResult = 'correct' | 'present' | 'absent';

function evaluateGuess(guess: string, target: string): LetterResult[] {
  const result: LetterResult[] = new Array(target.length).fill('absent');
  const targetLetters = target.split('');
  const guessLetters = guess.split('');
  const used = new Array(target.length).fill(false);

  for (let i = 0; i < guessLetters.length; i++) {
    if (guessLetters[i] === targetLetters[i]) {
      result[i] = 'correct';
      used[i] = true;
    }
  }

  for (let i = 0; i < guessLetters.length; i++) {
    if (result[i] === 'correct') continue;
    const idx = targetLetters.findIndex((l, j) => l === guessLetters[i] && !used[j]);
    if (idx !== -1) {
      result[i] = 'present';
      used[idx] = true;
    }
  }

  return result;
}

export async function POST(req: NextRequest) {
  const target = req.cookies.get('wordle_target')?.value;
  if (!target) {
    return NextResponse.json({ error: 'no_active_game' }, { status: 400 });
  }

  const body = await req.json();

  if (body.giveUp) {
    const res = NextResponse.json({ word: target });
    res.cookies.delete('wordle_target');
    return res;
  }

  const { guess } = body;

  if (!guess || typeof guess !== 'string' || guess.length !== target.length) {
    return NextResponse.json({ error: 'invalid_guess' }, { status: 400 });
  }

  const normalizedGuess = guess.toUpperCase();
  const result = evaluateGuess(normalizedGuess, target);
  const won = normalizedGuess === target;

  const res = NextResponse.json({ result, won });
  if (won) {
    res.cookies.delete('wordle_target');
  }
  return res;
}