import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Check } from 'lucide-react';
import {
  BASIC_PRICING_DATA,
  PRO_PRICING_DATA,
  BELIEVER_PRICING_DATA,
} from '@/constant/randing-price-const';
import PriceBlock from '../../components/price-block';

export default function Pricing() {
  const basicPrice = BASIC_PRICING_DATA;
  const proPrice = PRO_PRICING_DATA;
  const believerPrice = BELIEVER_PRICING_DATA;
  return (
    <div className='flex flex-col items-center gap-10'>
      <div className='flex flex-col items-center gap-2'>
        <h1 className='text-[50px] font-bold text-center mt-60'>
          MileQue는 구독 모델로 수익을 창출합니다.
        </h1>
        <p className="'text-[20px] font-semibold text-center'">
          현재는 모든 기능을 무료로 사용할 수 있습니다.
        </p>
      </div>
      <div className='grid grid-cols-3 gap-10'>
        <PriceBlock basicPrice={basicPrice} />
        <PriceBlock basicPrice={proPrice} />
        <PriceBlock basicPrice={believerPrice} />
      </div>
    </div>
  );
}
