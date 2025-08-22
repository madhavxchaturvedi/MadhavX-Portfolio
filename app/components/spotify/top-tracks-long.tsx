import { getTopTracksLong } from 'app/components/spotify/spotify';
import Track from './track';
import { Song, TrackInfo } from './types';

async function fetchTopTracks(): Promise<Song[] | null> {
  try {
    const response = await getTopTracksLong();
    const { items } = await response.json();

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

export default async function TopTracksLong() {
  const topTracks = await fetchTopTracks();

  if (!topTracks) {
    return null;
  }

  return (
    <section className="py-7">
      <p className="text-2xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100">
        All-Time Favorite Anthems
      </p>
      <p className="text-gray-500 dark:text-gray-400 leading-4">
        he songs I’ve listened to the most overall.
      </p>
      {topTracks.map((track, index) => (
        <Track ranking={index + 1} key={track.songUrl} track={track} />
      ))}
    </section>
  );
}
