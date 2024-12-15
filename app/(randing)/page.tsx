import * as React from 'react';

import { LandingTabWithTitle } from '@/app/(randing)/components/tabs';
import TwoImage from '@/app/(randing)/components/twoImage';
import CarouselWithTitle from '@/app/(randing)/components/carouselWithTitle';
import {
  MAINPAGE_TABS_DATA,
  MAINPAGE_TABS_TITLE,
  MAINPAGE_TWOIMAGE_DATA,
  MAINPAGE_TWOIMAGE_TITLE,
  MAINPAGE_CAROUSEL_DATA,
  MAINPAGE_CAROUSEL_TITLE,
} from '@/constant/randing-const';
export interface CarouselSpacingProps {
  data: {
    title: string;
    src: string;
    description: string;
    description2?: string;
  }[];
}
export interface LandingTabsProps {
  data: {
    title: string;
    src: string;
  }[];
}
export interface H1andH2Props {
  head: {
    h1: string;
    h2: string;
  };
}

export interface OneImageProps {
  data: {
    src: string;
    alt: string;
  };
}

export interface TwoImageProps {
  data: {
    src: string;
    alt: string;
  }[];
}

export default function Home() {
  return (
    <div className='flex flex-col gap-40'>
      {/* Home Section1 */}
      <LandingTabWithTitle
        data={MAINPAGE_TABS_DATA}
        head={MAINPAGE_TABS_TITLE}
      />
      {/* Home Section2 */}
      <TwoImage data={MAINPAGE_TWOIMAGE_DATA} head={MAINPAGE_TWOIMAGE_TITLE} />
      {/* Carousel Section */}
      <CarouselWithTitle
        data={MAINPAGE_CAROUSEL_DATA}
        head={MAINPAGE_CAROUSEL_TITLE}
      />
      {/* OneImage Section */}
      {/* <OneImage data={oneImageData} head={h1andh2} /> */}
    </div>
  );
}
