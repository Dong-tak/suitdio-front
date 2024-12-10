import { Button } from '@/components/ui/button';
import { Ellipsis } from 'lucide-react';

export default function Header() {
  return (
    <div className='flex w-full items-center p-2 justify-end bg-background sticky top-0'>
      <Button size='icon' className='p-2 bg-background hover:bg-muted'>
        <Ellipsis className='w-4 h-4 relative text-muted-foreground' />
      </Button>
    </div>
  );
}
