'use client';

import { Button } from '@/components/ui/button';
import { useSidebar } from '@/components/ui/sidebar';
import { PanelLeft, PanelRight, PanelRightOpen } from 'lucide-react';
import React from 'react';
import { cn } from '@/lib/utils';

export const OnSidebarToggle = React.forwardRef<
  React.ElementRef<typeof Button>,
  React.ComponentProps<typeof Button>
>(({ className, onClick, ...props }, ref) => {
  const { toggleSidebar } = useSidebar();
  const { open } = useSidebar();

  return (
    <Button
      ref={ref}
      data-sidebar='trigger'
      variant='ghost'
      size='icon'
      className={cn('h-7 w-7', className)}
      onClick={(event) => {
        onClick?.(event);
        toggleSidebar();
      }}
      {...props}
    >
      <PanelRight className='w-4 h-4' />
      <span className='sr-only'>Toggle Sidebar</span>
    </Button>
  );
});
OnSidebarToggle.displayName = 'OnSidebarToggle';
