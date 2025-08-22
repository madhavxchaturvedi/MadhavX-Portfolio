"use client";
import { useState } from 'react';
import Contact from './components/contact';
import GreetingsLoader from './components/GreetingsLoader';
import Hero from './components/hero-v2/hero';
import Intro from './components/intro';
import { ScrollProvider } from './components/providers/ScrollProvider';
import Works from './components/work/works';
import { AnimatePresence, motion } from "motion/react";

export default function Home() {
    const [bootDone, setBootDone] = useState(false);
  return (
    // <ScrollProvider>
    //   <Hero />
    //   <Intro />
    //   <Works />
    //   <Contact />
    // </ScrollProvider>
        <ScrollProvider>
      {!bootDone && (
        <GreetingsLoader
          showForMs={4200}
          stepMs={600}
          onFinish={() => setBootDone(true)}
          watermark="MADHAV"
          greetings={[
            "Hello",
            "नमस्ते",
            "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ਜੀ",
            "こんにちは",
            "안녕하세요",
            "Bonjour",
            "Привет",
            "Hallo",
            "مرحبا",
          ]}
          useFramer={false}
        />
      )}

      {bootDone && (
        <AnimatePresence mode="wait">
        {bootDone && (
          <motion.div
            key="portfolio"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1],delay: 0.2 }}
          >
            <Hero />
            <Intro />
            <Works />
            <Contact />
          </motion.div>
        )}
      </AnimatePresence>
      )}
    </ScrollProvider>
  );
}
