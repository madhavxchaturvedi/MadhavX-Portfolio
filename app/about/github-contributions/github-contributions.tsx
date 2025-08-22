import Contributions from './contributions';

export default function GithubContributions() {
  return (
    <section className="space-y-4">
      <div>
        <p className="text-2xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100">
          Github
        </p>
        <p className="text-gray-500 dark:text-gray-400 leading-4">
          Contributions Stats
        </p>
        <p className="mt-1 text-sm italic text-gray-400 dark:text-gray-500">
          Private repos got all the drama 👀.
        </p>
      </div>
      <Contributions />
    </section>
  );
}
