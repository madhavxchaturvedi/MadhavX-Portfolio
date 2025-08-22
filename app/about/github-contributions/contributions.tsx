'use client';

import { Fragment, useState } from 'react';
import useSWR from 'swr';
import Calendar from './calendar';
import Days from './days';
import { getContributions, GITHUB_USERNAME } from './github';
import GithubCalendarSkeleton from './github-calendar-skeleton';
import GithubStats from './github-stats';
import GithubStatsSkeleton from './github-stats-skeleton';
import YearSelect from './year-select';

export default function Contributions() {
  const [year, setYear] = useState(new Date().getFullYear());

  const { data: contributions, isLoading } = useSWR(
    ['contributions', GITHUB_USERNAME, year], // Cache key
    () => getContributions(GITHUB_USERNAME, year),
  );

  if (!contributions || isLoading) {
    return (
      <div className="flex flex-col space-y-4">
        <div className="flex space-x-2">
          <Days />
          <GithubCalendarSkeleton />
          <YearSelect selectedYear={year} onYearChange={setYear} />
        </div>
        {/* <GithubStatsSkeleton /> */}
      </div>
    );
  }

  return (
    <Fragment>
      <div className="flex space-x-2">
        <Days />
        <Calendar contributions={contributions} />
        <YearSelect selectedYear={year} onYearChange={setYear} />
      </div>
      {/* <GithubStats contributions={contributions} /> */}
      <p className="mt-1 italic text-primary-500 dark:text-primary-500">
          Low squares ≠ low grind. Most of it lives behind closed PRs 🔒
          <br/>Trust me, we’re not the same, bro 🚀
      </p>
    </Fragment>
  );
}
