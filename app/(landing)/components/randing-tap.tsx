import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Image from 'next/image';

interface LandingTabsProps {
  data: {
    title: string;
    src: string;
  }[];
  len: number;
}

export function LandingTabs({ data, len }: LandingTabsProps) {
  return (
    <Tabs
      defaultValue={data[0].title}
      className='w-full flex flex-col items-center gap-2'
    >
      <TabsList
        className={`w-1/2 gap-2`}
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${len}, 1fr)`,
        }}
      >
        {data.map((item, index) => (
          <TabsTrigger key={index} value={item.title}>
            {item.title}
          </TabsTrigger>
        ))}
      </TabsList>
      <div className='w-full h-full'>
        {data.map((item, index) => (
          <TabsContent
            key={index}
            value={item.title}
            className='w-full items-center justify-center flex'
          >
            <Image
              src={item.src}
              alt='협업하는 사람들을 보여주는 일러스트레이션'
              width={800}
              height={600}
              className='w-full max-w-[1200px] h-auto border-2 border-black/10 rounded-md'
            />
          </TabsContent>
        ))}
      </div>
    </Tabs>
  );
}
