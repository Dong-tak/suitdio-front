import FilterMenu from '@/components/record/filter-menu';
import RecordCard from '@/components/record/record-card';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { ArrowLeft, ArrowRight, Ellipsis, Search } from 'lucide-react';

export default function RecordView() {
  return (
    <SidebarInset>
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
      <div className='flex items-center gap-2 px-6 w-full '>
        <Search className='w-4 h-4 absolute left-10 text-muted-foreground ' />
        <Input
          type='text'
          placeholder='Search'
          className='w-full pl-10 bg-slate-100 border-none'
        />
      </div>
      <div className='flex items-center gap-2 px-6 justify-start mt-2'>
        <FilterMenu label='최종 수정일' items={['수정일', '생성일', '버전']} />
        <FilterMenu label='필터' items={['수정일', '생성일', '버전']} />
      </div>
      <div className='flex flex-1 flex-col gap-4 px-6 mt-4'>
        <div className='grid gap-4 grid-cols-auto-fit'>
          <RecordCard
            cardId='1'
            cardTitle='What is Real Productivity'
            cardConclusion='open인 경우 모두 사라지게 되었음 ㅋㅋ두 개를 분리해야 하는데 어떻게 할까=appSidebar에 들어가는 button은 새로 만들어야 하나새로운 sidebar toggle button을 추가해서 구현'
          />
          <RecordCard
            cardId='1'
            cardTitle='What is Real Productivity'
            cardConclusion='open인 경우 모두 사라지게 되었음 ㅋㅋ두 개를 분리해야 하는데 어떻게 할까=appSidebar에 들어가는 button은 새로 만들어야 하나새로운 sidebar toggle button을 추가해서 구현'
          />
          <RecordCard
            cardId='1'
            cardTitle='What is Real Productivity'
            cardConclusion='open인 경우 모두 사라지게 되었음 ㅋㅋ두 개를 분리해야 하는데 어떻게 할까=appSidebar에 들어가는 button은 새로 만들어야 하나새로운 sidebar toggle button을 추가해서 구현'
          />
          <RecordCard
            cardId='1'
            cardTitle='What is Real Productivity'
            cardConclusion='open인 경우 모두 사라지게 되었음 ㅋㅋ두 개를 분리해야 하는데 어떻게 할까=appSidebar에 들어가는 button은 새로 만들어야 하나새로운 sidebar toggle button을 추가해서 구현'
          />
          <RecordCard
            cardId='1'
            cardTitle='What is Real Productivity'
            cardConclusion='open인 경우 모두 사라지게 되었음 ㅋㅋ두 개를 분리해야 하는데 어떻게 할까=appSidebar에 들어가는 button은 새로 만들어야 하나새로운 sidebar toggle button을 추가해서 구현'
          />
        </div>
        <div className='min-h-[100vh] flex-1 rounded-xl bg-muted md:min-h-min' />
      </div>
    </SidebarInset>
  );
}
