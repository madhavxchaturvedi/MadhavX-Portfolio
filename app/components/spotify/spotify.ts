import 'server-only';

import { cache } from 'react';
import { Artist, NowPlayingSong } from './types';

const client_id =
  process.env.SPOTIFY_CLIENT_ID ||
  process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID ||
  '';
const client_secret =
  process.env.SPOTIFY_CLIENT_SECRET ||
  process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET ||
  '';
const refresh_token =
  process.env.SPOTIFY_REFRESH_TOKEN ||
  process.env.NEXT_PUBLIC_SPOTIFY_REFRESH_TOKEN ||
  '';

const basic = Buffer.from(`${client_id}:${client_secret}`).toString('base64');
const NOW_PLAYING_ENDPOINT = `https://api.spotify.com/v1/me/player/currently-playing`;
const TOP_TRACKS_ENDPOINT = `https://api.spotify.com/v1/me/top/tracks?time_range=short_term`;
const TOP_TRACKS_LONG = `https://api.spotify.com/v1/me/top/tracks?time_range=long_term&limit=5`;
const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;

type SpotifyNowPlayingResponse = {
  is_playing: boolean;
  item?: {
    name: string;
    artists: Artist[];
    album: {
      name: string;
      images: Array<{ url: string }>;
    };
    external_urls: {
      spotify: string;
    };
  };
};

async function parseJsonSafely<T>(response: Response): Promise<T | null> {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    console.error(
      `Spotify API returned non-JSON response (status ${response.status}): ${text.slice(0, 120)}`,
    );

    return null;
  }
}

async function readResponseTextSafely(response: Response): Promise<string> {
  try {
    return await response.text();
  } catch {
    return '';
  }
}

const getAccessToken = cache(async () => {
  if (!client_id || !client_secret || !refresh_token) {
    console.error(
      'Spotify env vars are missing (client_id/client_secret/refresh_token).',
    );
    return null;
  }

  const response = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token,
    }),
    next: {
      revalidate: 3600,
    },
  });

  if (!response.ok) {
    const body = await readResponseTextSafely(response);
    console.error(
      `Spotify token request failed (${response.status}): ${body.slice(0, 160)}`,
    );
    return null;
  }

  return parseJsonSafely<{ access_token: string }>(response);
});

export const getNowPlaying = cache(async () => {
  const token = await getAccessToken();

  if (!token?.access_token) {
    return null;
  }

  return fetch(NOW_PLAYING_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${token.access_token}`,
    },
    next: {
      revalidate: 30,
    },
  });
});

export const getTopTracks = cache(async () => {
  const token = await getAccessToken();

  if (!token?.access_token) {
    return null;
  }

  const response = await fetch(TOP_TRACKS_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${token.access_token}`,
    },
  });

  if (!response.ok) {
    const body = await readResponseTextSafely(response);
    console.error(
      `Spotify top tracks (short) failed (${response.status}): ${body.slice(0, 160)}`,
    );
  }

  return response;
});

export const getTopTracksLong = cache(async () => {
  const token = await getAccessToken();

  if (!token?.access_token) {
    return null;
  }

  const response = await fetch(TOP_TRACKS_LONG, {
    headers: {
      Authorization: `Bearer ${token.access_token}`,
    },
  });

  if (!response.ok) {
    const body = await readResponseTextSafely(response);
    console.error(
      `Spotify top tracks (long) failed (${response.status}): ${body.slice(0, 160)}`,
    );
  }

  return response;
});

export async function fetchNowPlaying(): Promise<NowPlayingSong | null> {
  try {
    const response = await getNowPlaying();

    if (!response) {
      return null;
    }

    if (response.status === 204 || response.status > 400) {
      return null;
    }

    const song = await parseJsonSafely<SpotifyNowPlayingResponse>(response);

    if (!song) {
      return null;
    }

    const isPlaying = song.is_playing;

    if (!song.item) {
      return null;
    }

    const title = song.item.name;
    const artist = song.item.artists
      .map((artist: Artist) => artist.name)
      .join(', ');
    const album = song.item.album.name;
    const albumImageUrl = song.item.album.images[0].url;
    const songUrl = song.item.external_urls.spotify;

    return {
      album,
      albumImageUrl,
      artist,
      isPlaying,
      songUrl,
      title,
    };
  } catch (e) {
    if (e instanceof Error) {
      console.error(e.message);
    }
  }

  return null;
}
