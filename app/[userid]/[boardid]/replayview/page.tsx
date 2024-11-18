'use client';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Sidebar, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@radix-ui/react-separator';
import { ArrowLeft, ArrowRight, Ellipsis } from 'lucide-react';
import { FaBackward, FaForward, FaStop } from 'react-icons/fa';
import { PiRecordFill } from 'react-icons/pi';
import { MdPauseCircle } from 'react-icons/md';
import { Progress } from '@radix-ui/react-progress';
import ReplayTimeProgress from '@/components/replay/replay-timeprogress';
import { useState } from 'react';

export default function ReplayView() {
  const [progress, setProgress] = useState(0);
  return (
    <SidebarInset className='justify-between'>
      <header className='flex h-11 shrink-0 items-center justify-between px-2'>
        <div className='gap-2 flex items-center'>
          <div className='flex items-center gap-1'>
            <SidebarTrigger className='-ml-1' />
            <Button
              variant='ghost'
              size='icon'
              className='hover:bg-slate-200 w-7 h-7'
            >
              <ArrowLeft className='w-4 h-4' />
            </Button>
            <Button
              variant='ghost'
              size='icon'
              className='hover:bg-slate-200 w-7 h-7'
            >
              <ArrowRight className='w-4 h-4' />
            </Button>
          </div>
          <Separator orientation='vertical' className='mr-2 h-4 ' />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className='hidden md:block'>
                <BreadcrumbLink href='#'>
                  Building Your Application
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className='hidden md:block' />
              <BreadcrumbItem>
                <BreadcrumbPage>Data Fetching</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <Button
          variant='ghost'
          size='icon'
          className='hover:bg-slate-200 w-7 h-7'
        >
          <Ellipsis className='w-4 h-4' />
        </Button>
      </header>
      <div className='flex flex-col w-full  p-4 h-[90px] gap-2'>
        <div className='w-full space-x-4 flex items-center justify-center'>
          <Button size='icon' className='p-1 w-7 h-7 bg-white text-black'>
            <FaStop className='w-3 h-3' />
          </Button>
          <Button size='icon' className='p-1 w-7 h-7 bg-white text-black'>
            <FaBackward className='w-3 h-3' />
          </Button>
          <Button
            size='icon'
            className='p-1 w-7 h-7 bg-white text-black [&_svg]:w-7 [&_svg]:h-7'
          >
            <MdPauseCircle />
          </Button>
          <Button size='icon' className='p-1 w-7 h-7 bg-white text-black'>
            <FaForward className='w-3 h-3' />
          </Button>
          <Button
            size='icon'
            className='p-1 w-7 h-7 bg-white text-black [&_svg]:w-5 [&_svg]:h-5'
          >
            <PiRecordFill />
          </Button>
        </div>
        <div className='flex gap-2 items-center'>
          <span className='text-sm text-gray-500'>00:00</span>
          <ReplayTimeProgress value={progress} onChange={setProgress} />
          <span className='text-sm text-gray-500'>00:00</span>
        </div>
      </div>
    </SidebarInset>
  );
}
