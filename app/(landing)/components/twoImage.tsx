import { CarouselSpacingProps, H1andH2Props } from '@/app/(landing)/page';
import Image from 'next/image';

export default function TwoImage({
  data,
  head,
}: CarouselSpacingProps & H1andH2Props) {
  return (
    <div className='flex flex-col w-full items-center justify-center h-full gap-12'>
      <div className='flex flex-col items-start justify-center gap-16'>
        <div className='text-[50px] font-bold text-start'>{head.h1}</div>
        <div className='grid w-full grid-cols-2 gap-10'>
          <div className='flex flex-col gap-1'>
            <h1 className='text-[20px] font-bold'>{data[0].title}</h1>
            <div className='flex flex-col justify-center text-[14px]'>
              <p>{data[0].description}</p>
              <p>{data[0].description2}</p>
            </div>
            <Image
              src={data[0].src}
              alt='협업하는 사람들을 보여주는 일러스트레이션'
              width={800}
              height={600}
              className='w-full h-full mt-4 max-w-[600px] max-h-[500px] object-cover rounded-md'
            />
          </div>
          <div className='flex flex-col gap-1 '>
            <h1 className='text-[20px] font-bold'>{data[1].title}</h1>
            <div className='flex flex-col justify-center text-[14px]'>
              <p>{data[1].description}</p>
              <p>{data[1].description2}</p>
            </div>
            <Image
              src={data[1].src}
              alt='협업하는 사람들을 보여주는 일러스트레이션'
              width={800}
              height={600}
              className='w-full h-full mt-4 max-w-[600px] max-h-[500px] rounded-md object-cover'
            />
          </div>
        </div>
      </div>
    </div>
  );
}
