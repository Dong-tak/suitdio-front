import * as React from 'react';

import NavigationMenuCustom from '@/components/custom-shadcn/navigation-menu';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { LandingTabs } from '@/components/custom-shadcn/randing-tap';
import { CarouselSpacing } from '@/components/custom-shadcn/randing-carousel';

export default function Home() {
  return (
    <div>
      {/* Navbar */}
      <div className='flex fixed top-0 left-0 items-center justify-between w-screen px-32 py-2 backdrop-blur-sm z-50'>
        <div className='flex items-center gap-2 justify-center'>
          <Image
            src='/images/mileque-image.jpg'
            alt='logo'
            width={32}
            height={32}
          />
          <div className='text-[20px] font-bold'>SuitdiO</div>
        </div>
        <NavigationMenuCustom />
        <div>
          <Button variant='outline' size='sm' className='text-[16px]'>
            Login
          </Button>
        </div>
      </div>
      {/* Home Section */}
      <div className='flex flex-col items-center justify-center h-full mt-60 gap-12'>
        <div className='flex flex-col items-center justify-center gap-4'>
          <div className='text-[50px] font-bold'>
            AI-Powered Suit Design for Your Business
          </div>
          <div className='text-[20px] font-semibold text-center'>
            Streamline feedback collection, reduce support loads <br /> and
            announce product changes — all with one tool
          </div>
        </div>
        <LandingTabs />
      </div>
      {/* Carousel Section */}
      <div className='flex flex-col items-start justify-center h-full mt-28 gap-4 px-48 w-full'>
        <h1 className='text-[40px] font-medium'>
          The modern feedback platform
        </h1>
        <CarouselSpacing />
      </div>
      {/* Home Section */}
      <div className='flex flex-col items-center justify-center h-full mt-60 gap-12'>
        <div className='flex flex-col items-center justify-center gap-4'>
          <div className='text-[50px] font-bold'>
            AI-Powered Suit Design for Your Business
          </div>
          <div className='text-[20px] font-semibold text-center'>
            Streamline feedback collection, reduce support loads <br /> and
            announce product changes — all with one tool
          </div>
        </div>
        <LandingTabs />
      </div>
      {/* OneImage Section */}
      <div className='flex flex-col items-center justify-center h-full mt-60 gap-12'>
        <div className='flex flex-col items-center justify-center gap-4'>
          <div className='text-[50px] font-bold'>
            AI-Powered Suit Design for Your Business
          </div>
        </div>
        <Image
          src='/images/mileque-image.jpg'
          alt='협업하는 사람들을 보여주는 일러스트레이션'
          width={800}
          height={600}
          className='w-full max-w-[1200px] h-auto border-2 border-black/10 rounded-md'
        />
      </div>
    </div>
  );
}
