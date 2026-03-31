import { NextResponse } from 'next/server';
import { fetchNowPlaying } from 'app/components/spotify/spotify';

export async function GET() {
  try {
    const nowPlaying = await fetchNowPlaying();

    return NextResponse.json(nowPlaying);
  } catch {
    return NextResponse.json(null, { status: 200 });
  }
}
