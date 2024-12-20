import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Check } from 'lucide-react';

interface PriceBlockProps {
  basicPrice: {
    plan: string;
    price: string;
    features: string[];
  }[];
}

export default function PriceBlock({ basicPrice }: PriceBlockProps) {
  return (
    <div className='p-10 border-2 border-gray-200 rounded-lg hover:border-3 hover:border-purple-600 '>
      <div className='flex flex-col items-start mb-1'>
        <div className='text-[16px]'>SuitdiO</div>
        <div className='text-[20px] font-semibold'>{basicPrice[0].plan}</div>
      </div>
      <Separator />
      <div className='flex flex-col items-start gap-4 py-2 mb-2'>
        {basicPrice[0].features.map((feature) => (
          <div key={feature} className='flex gap-2 items-center text-[16px]'>
            <Check className='w-4 h-4' />
            <p>{feature}</p>
          </div>
        ))}
      </div>
      <Button className='bg-purple-500'>{basicPrice[0].price}</Button>
    </div>
  );
}
