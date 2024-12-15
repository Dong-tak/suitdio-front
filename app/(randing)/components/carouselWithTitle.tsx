import { CarouselSpacingProps, H1andH2Props } from '@/app/(randing)/page';
import { CarouselSpacing } from './randing-carousel';

export default function CarouselWithTitle({
  data,
  head,
}: CarouselSpacingProps & H1andH2Props) {
  return (
    <div className='flex flex-col items-start justify-center h-full gap-4 w-full max-w-[1200px]'>
      <h1 className='text-[40px] font-bold'>{head.h1}</h1>

      <CarouselSpacing data={data} />
    </div>
  );
}
