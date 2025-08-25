import classNames from 'classnames';
import Link from 'next/link';
import { merryWeather } from '../../fonts';
import { BackgroundGradientAnimation } from '../background-gradient-animation';
import { AtSignIcon } from '../layouts/icons/at-sign-icon';
import { GithubIcon } from '../layouts/icons/github-icon';
import { LinkedinIcon } from '../layouts/icons/linkedin-icon';
import { XIcon } from '../layouts/icons/x-icon';
import ArrowDown from './arrow-down';
import { InstagramIcon } from '../layouts/icons/instagram-icon';

export default function Hero() {
  return (
    <main className="relative min-h-svh w-screen overflow-hidden">
      <BackgroundGradientAnimation>
        <div
          className={classNames('relative min-h-svh', merryWeather.className)}
        >
          <ArrowDown />
          <div className="absolute top-[20%] md:top-[40%] max-w-5xl flex-col space-y-4 justify-center px-8 md:px-24 text-shadow-lg lg:ml-14">
            <h1 className="font-serif text-2xl font-medium md:mr-4 md:text-4xl">
              Welcome to my{' '}
              <span className="font-bold">personal portfolio — </span> or, as I
              like to call it, my{' '}
              <span className="italic border-b">playground</span> on the web.
            </h1>
            <section className="relative z-10">
              <p className="text-base text-justify">
                I&apos;m Madhav Chaturvedi — a Full Stack Developer and forever a
                student of the craft. I love building things for the web and am
                always on the lookout for new challenges and opportunities to
                learn. I&apos;m passionate about creating beautiful and
                functional user experiences. Right now, I&apos;m working on projects like{' '}
                <a
                  href="https://github.com/madhavxchaturvedi/DevTinder-Frontend"
                  className="underline-magical"
                  target="_blank"
                  rel="noreferrer"
                >
                  DevTinder
                </a>
                .
              </p>
            </section>
            <section className="relative z-10 flex space-x-4 items-center text-sm">
              <div>
                <p>More about me: </p>
                <div className="flex -ml-2">
                  <Link
                    href="https://www.linkedin.com/in/madhavxchaturvedi/"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="linkedin"
                  >
                    <LinkedinIcon className="h-9 w-9" />
                  </Link>
                  <Link
                    href="https://github.com/madhavxchaturvedi"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="github"
                  >
                    <GithubIcon className="h-9 w-9" />
                  </Link>
                  {/* <Link
                    href=""
                    target="_blank"
                    rel="noreferrer"
                    aria-label="twitter"
                  >
                    <XIcon className="h-9 w-9" />
                  </Link> */}
                
                  <Link
                    href="https://www.instagram.com/madhavxchaturvedi/"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="instagram"
                  >
                    <InstagramIcon className="h-9 w-9" />
                  </Link>
              
                  <Link
                    href="mailto:madhavchaturvedi0562@gmail.com"
                    aria-label="email"
                    rel="noreferrer"
                  >
                    <AtSignIcon className="h-9 w-9" />
                  </Link>
                </div>
              </div>
              <div className="h-14 border-l border-gray-300" />
              <div className="flex flex-wrap space-x-3 space-y-1">
                <Link href="/projects">/projects</Link>
                <Link href="/thoughts">/thoughts</Link>
                <Link href="/uses">/uses</Link>
                <Link href="/stats">/stats</Link>
              </div>
            </section>
          </div>
        </div>
      </BackgroundGradientAnimation>
    </main>
  );
}
