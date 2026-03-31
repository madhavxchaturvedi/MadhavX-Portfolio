import GithubContributions from '../about/github-contributions/github-contributions';
import Header from '../components/header';
import NowPlaying from '../components/spotify/now-playing';

export const metadata = {
  title: 'Stats',
  description: 'My Stats - Madhav Chaturvedi',
};

export default function StatsPage() {
  return (
    <div>
      <Header title="Stats" />
      <div className="space-y-2 md:space-y-5 mb-5">
        <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">
          Here are some personal stats that I managed to gather over different
          APIs.
        </p>
      </div>

      <section className="space-y-3">
        <GithubContributions />
        <NowPlaying />
      </section>
    </div>
  );
}
