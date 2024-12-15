import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import SvgIcon from '@/utils/svgIcon';
import { pauseSvg, recordSvg, sixBoltSvg } from '@/utils/svgBag';

interface MainContentProps {
  contentTitle: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSaveClick: (e?: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function MainContent({
  contentTitle,
  handleInputChange,
  handleSaveClick,
}: MainContentProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSaveClick();
    }
  };

  return (
    <div className='flex flex-col items-center justify-center flex-grow space-y-4'>
      <div className='text-lg font-bold text-center'>
        Focus, Make Better Choices
      </div>
      <div className='flex flex-col h-[106px] w-[560px] border rounded-lg'>
        <div className='flex-grow grid w-full p-3 items-center gap-1.5'>
          <Input
            id='title'
            value={contentTitle}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className='w-full border-none'
            placeholder='Enter any focus'
            autoFocus
          />
        </div>
        <div className='w-full flex justify-between'>
          <div className='flex items-center justify-between space-x-1 h-full pl-4'>
            <div className='text-[12px] text-muted-foreground'>v 3.26</div>
            <div className='w-[2px] h-[2px] bg-muted-foreground rounded-full' />
            <div className='text-[12px] text-muted-foreground'>Today</div>
            <div className='w-[2px] h-[2px] bg-muted-foreground rounded-full' />
            <div className='text-[12px] text-muted-foreground'>Now</div>
          </div>
          <div className='flex items-center'>
            <Button size='icon' className='rounded-md p-2 bg-white'>
              <SvgIcon
                fill='none'
                width={8}
                height={9}
                className='flex items-center justify-center text-black'
              >
                {sixBoltSvg}
              </SvgIcon>
            </Button>
            <Button size='icon' className='rounded-md p-2 bg-white'>
              <SvgIcon
                fill='none'
                width={8}
                height={9}
                className='flex items-center justify-center text-black'
              >
                {pauseSvg}
              </SvgIcon>
            </Button>
            <Button size='icon' className='rounded-md p-2 bg-white'>
              <SvgIcon
                fill='none'
                width={8}
                height={9}
                className='flex items-center justify-center text-black'
              >
                {recordSvg}
              </SvgIcon>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
