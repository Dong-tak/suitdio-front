import * as React from 'react';

import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  RandingCarouselNext,
  RandingCarouselPrevious,
} from '@/components/ui/carousel';
import Image from 'next/image';

export function CarouselSpacing() {
  return (
    <Carousel
      className='w-full'
      opts={{
        startIndex: 1,
      }}
    >
      <CarouselContent className='-ml-1'>
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={index} className='pl-1 md:basis-1/2 lg:basis-1/3'>
            <div className='p-1'>
              {/* <Card>
                <CardContent className='flex aspect-square items-center justify-center p-6'>
                  <span className='text-2xl font-semibold'>{index + 1}</span>
                </CardContent>
              </Card> */}
              <Image
                src='/images/mileque-image.jpg'
                alt='협업하는 사람들을 보여주는 일러스트레이션'
                width={300}
                height={500}
                className='w-full  aspect-[1.5/2] object-cover h-auto border-2 border-black/10 rounded-md'
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className='flex justify-center items-center gap-4 mt-4'>
        <RandingCarouselPrevious />
        <RandingCarouselNext />
      </div>
    </Carousel>
  );
}
