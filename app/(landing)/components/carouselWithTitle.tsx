import { CarouselSpacingProps, H1andH2Props } from '@/app/(landing)/page';
import { CarouselSpacing } from './randing-carousel';

export default function CarouselWithTitle({
  data,
  head,
}: CarouselSpacingProps & H1andH2Props) {
  return (
    <div className='flex flex-col items-start justify-center w-full max-w-[1200px] mx-auto'>
      <h1 className='text-[40px] font-bold mb-8'>{head.h1}</h1>
      <div className='w-full'>
        <CarouselSpacing data={data} />
      </div>
    </div>
  );
}
