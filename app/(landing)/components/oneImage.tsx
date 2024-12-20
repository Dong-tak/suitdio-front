import { H1andH2Props, OneImageProps } from '@/app/(randing)/page';
import Image from 'next/image';

export default function OneImage({ data, head }: OneImageProps & H1andH2Props) {
  return (
    <div className='flex flex-col items-center justify-center h-full mt-60 gap-12'>
      <div className='flex flex-col items-center justify-center gap-4'>
        <div className='text-[50px] font-bold'>{head.h1}</div>
      </div>
      <Image
        src={data.src}
        alt={data.alt}
        width={800}
        height={600}
        className='w-full max-w-[1200px] h-auto border-2 border-black/10 rounded-md'
      />
    </div>
  );
}
