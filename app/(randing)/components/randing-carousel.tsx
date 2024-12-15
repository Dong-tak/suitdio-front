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
import { CarouselSpacingProps } from '@/app/(randing)/page';

export function CarouselSpacing({ data }: CarouselSpacingProps) {
  return (
    <Carousel
      className='w-full'
      opts={{
        startIndex: 1,
      }}
    >
      <CarouselContent className='-ml-1'>
        {data.map((item, index) => (
          <CarouselItem key={index} className='pl-1 md:basis-1/2 lg:basis-1/3'>
            <div className='p-1'>
              {/* <Card>
                <CardContent className='flex aspect-square items-center justify-center p-6'>
                  <span className='text-2xl font-semibold'>{index + 1}</span>
                </CardContent>
              </Card> */}
              <div className='flex flex-col gap-1 h-[90px]'>
                <h2 className='text-sm font-semibold'>{item.title}</h2>
                <p className='text-[16px] text-gray-500'>{item.description}</p>
              </div>
              <Image
                src={item.src}
                alt={item.title}
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
