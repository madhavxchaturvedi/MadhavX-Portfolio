import { getTopTracks } from 'app/components/spotify/spotify';
import Track from './track';
import { Song, TrackInfo } from './types';

async function fetchTopTracks(): Promise<Song[] | null> {
  try {
    const response = await getTopTracks();

    if (!response?.ok) {
      return null;
    }

    const data = await response.json().catch(() => null);
    const items = data?.items;

    if (!Array.isArray(items)) {
      return null;
    }

    const tracks = items?.slice(0, 5).map((track: TrackInfo) => ({
      artist: track.artists.map((_artist) => _artist.name).join(', '),
      songUrl: track.external_urls.spotify,
      title: track.name,
    }));

    return tracks;
  } catch (e) {
    if (e instanceof Error) {
      console.error(e.message);
    }
  }

  return null;
}

export default async function TopTracks() {
  const topTracks = await fetchTopTracks();

  if (!topTracks) {
    return (
      <section className="py-7">
        <p className="text-2xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100">
          On Repeat: My Current Favorites
        </p>
        <p className="text-gray-500 dark:text-gray-400 leading-4">
          My most played tracks over the past month.
        </p>
        <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
          Top tracks are unavailable right now. Check your Spotify token scopes
          (`user-top-read`) and environment variables.
        </p>
      </section>
    );
  }

  return (
    <section className="py-7">
      <p className="text-2xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100">
        On Repeat: My Current Favorites
      </p>
      <p className="text-gray-500 dark:text-gray-400 leading-4">
        My most played tracks over the past month.
      </p>
      {topTracks.map((track, index) => (
        <Track ranking={index + 1} key={track.songUrl} track={track} />
      ))}
    </section>
  );
}
