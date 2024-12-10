'use client';

import HomeView from '@/app/[workspaceId]/(home)/components/homeview';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { useBoard } from './hooks/use-createboard';

export default function Home() {
  const { contentTitle, handleInputChange, handleSaveClick } = useBoard();

  return (
    <SidebarInset>
      <SidebarTrigger className='-ml-1' />
      <HomeView
        contentTitle={contentTitle}
        handleInputChange={handleInputChange}
        handleSaveClick={handleSaveClick}
      />
    </SidebarInset>
  );
}
