import { Circle, Play, Settings } from 'lucide-react';
import { Button } from '../ui/button';

interface RecordCardProps {
  cardId: string;
  cardTitle: string;
  cardConclusion: string;
}

export default function RecordCard({
  cardId,
  cardTitle,
  cardConclusion,
}: RecordCardProps) {
  return (
    <div className='relative group aspect-square rounded-xl w-full bg-muted h-full flex px-4 py-2 overflow-hidden hover:cursor-pointer'>
      <div className='flex flex-col gap-2 w-full group-hover:opacity-10 '>
        <div className='text-3xl font-bold  w-full h-full flex items-start justify-center'>
          {cardTitle}
        </div>
        <div className='text-md  text-black  w-full h-full flex items-center justify-center'>
          {cardConclusion}
        </div>
      </div>
      <div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden group-hover:block '>
        <div className='flex space-x-4 items-center'>
          <Button
            size='icon'
            className='bg-white text-black hover:bg-slate-300 rounded-full shadow-lg w-6 h-6'
          >
            <Circle className='w-4 h-4' />
          </Button>
          <Button
            size='icon'
            className='bg-white text-black hover:bg-slate-300 rounded-full shadow-lg w-11 h-11'
          >
            <Play className='w-6 h-6' />
          </Button>
          <Button
            size='icon'
            className='bg-white text-black hover:bg-slate-300 rounded-full shadow-lg w-6 h-6'
          >
            <Settings className='w-4 h-4' />
          </Button>
        </div>
      </div>
    </div>
  );
}
