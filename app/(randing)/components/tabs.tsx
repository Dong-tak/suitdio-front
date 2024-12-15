import { H1andH2Props, LandingTabsProps } from '@/app/(randing)/page';
import { LandingTabs } from './randing-tap';

export function LandingTabWithTitle({
  data,
  head,
}: LandingTabsProps & H1andH2Props) {
  return (
    <div className='flex flex-col items-center justify-center h-full mt-60 gap-12'>
      <div className='flex flex-col items-center justify-center gap-4'>
        <div className='text-[50px] font-bold text-center'>{head.h1}</div>
        <div className='text-[20px] font-semibold text-center'> {head.h2}</div>
      </div>
      <LandingTabs data={data} len={data.length} />
    </div>
  );
}
