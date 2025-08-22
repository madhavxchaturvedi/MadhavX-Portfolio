export type WorkTile = {
  title: string;
  description: string;
  image: {
    src: string;
    width: number;
    height: number;
  };
};

export const workTiles: WorkTile[] = [
  {
    description: `Here are things`,
    title: `I've worked on`,
    image: {
      src: '/static/images/Untitled design (3)-Photoroom.png',
      width: 600,
      height: 770,
    },
  },
  {
    description: 'I built',
    title: 'DevTinder',
    image: {
      src: '/static/images/project/DTinder SS.png',
      width: 600,
      height: 554,
    },
  },
  {
    description: `I maintained`,
    title: 'CosmicCove',
    image: {
      src: '/static/images/project/cosmiccove ss (1).png',
      width: 600,
      height: 717,
    },
  },
  {
    description: `I built`,
    title: 'biteMe.',
    image: {
      src: '/static/images/project/BM ss.png',
      width: 600,
      height: 717,
    },
  },
];
