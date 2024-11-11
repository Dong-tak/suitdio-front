import * as React from 'react';

import { SearchForm } from '@/components/sidebar/search-form';
import { VersionSwitcher } from '@/components/sidebar/version-switcher';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '../ui/button';
import {
  Box,
  Calendar,
  Disc2,
  Home,
  Inbox,
  LayoutGrid,
  Settings,
} from 'lucide-react';
import { OnSidebarToggle } from '../sidebar/onsidebar-toggle';

// This is sample data.
const data = {
  versions: ['1.0.1', '1.1.0-alpha', '2.0.0-beta1'],
  navMain: [
    {
      title: 'V 0.0',
      date: '24.08.12',
      url: '#',
      items: [
        {
          title: 'Board',
          url: '#',
          from: '00:00',
          to: '10:00',
          icon: Disc2,
        },
        {
          title: 'Board',
          url: '#',
          from: '00:00',
          to: '10:00',
          icon: Disc2,
        },
      ],
    },
    {
      error: 'Unconnect',
      time: '10:00',
    },
    {
      title: 'V 0.1',
      date: '24.08.12',
      url: '#',
      items: [
        {
          title: 'Board',
          url: '#',
          from: '00:00',
          to: '10:00',
          icon: Disc2,
        },
        {
          title: 'Board',
          url: '#',
          from: '00:00',
          to: '10:00',
          icon: Disc2,
        },
        {
          title: 'Rendering',
          url: '#',
          from: '00:00',
          to: '10:00',
          icon: Disc2,
        },
      ],
    },
  ],
};

// Menu items.
const items = [
  {
    title: 'Home',
    url: '#',
    icon: Home,
  },
  {
    title: 'Records',
    url: '#',
    icon: Disc2,
  },
  {
    title: 'Deck',
    url: '#',
    icon: Box,
  },
  {
    title: 'Draw',
    url: '#',
    icon: LayoutGrid,
  },
  {
    title: 'Callender',
    url: '#',
    icon: Calendar,
  },
];

export function ReplaySidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <div
        className={`w-full h-11 p-2 flex items-center ${
          props.side === 'right' ? 'justify-start' : 'justify-end'
        }`}
      >
        <Button
          variant='ghost'
          size='icon'
          className={`${props.side === 'right' ? 'hidden' : ''}`}
        >
          <Settings className='w-4 h-4' />
        </Button>
        <OnSidebarToggle />
      </div>
      <SidebarContent className='px-2'>
        {/* We create a SidebarGroup for each parent. */}
        {data.navMain.map((item) => {
          if (item.error) {
            return (
              <div className='flex items-center gap-2 py-2 text-red-500'>
                <span className='h-[1px] flex-1 bg-red-300' />
                <span className='text-sm'>{item.error} </span>
                <span className='text-xs text-red-400'>{item.time}</span>
                <span className='h-[1px] flex-1 bg-red-300' />
              </div>
            );
          }

          return (
            <SidebarGroup key={item.title}>
              <div className='flex items-center justify-between'>
                <SidebarGroupLabel className='text-lg font-bold'>
                  {item.title}
                </SidebarGroupLabel>
                <span className='text-sm text-gray-500'>{item.date}</span>
              </div>
              <SidebarGroupContent>
                <SidebarMenu>
                  {item.items?.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild isActive={false}>
                        <a href={item.url}>
                          {item.icon && <item.icon />}
                          <span>{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          );
        })}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
