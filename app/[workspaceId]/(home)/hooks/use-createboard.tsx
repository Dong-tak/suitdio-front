import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { addMiddleWidget } from '@/redux/features/whiteboardSlice';
import { centerWidget } from '@/app/[workspaceId]/(home)/utils/createBoard';
import { boardApi } from '@/app/[workspaceId]/(home)/api';

export const useBoard = () => {
  const [contentTitle, setContentTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch();
  const params = useParams();
  const workspaceId = params.workspaceId as string;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContentTitle(e.target.value);
  };

  const handleSaveClick = async () => {
    if (contentTitle.trim() && !isLoading) {
      setIsLoading(true);

      try {
        const boardPosition = {
          x: window.innerWidth / 2 - 250,
          y: window.innerHeight / 2 - 250,
        };

        const newBoard = centerWidget({
          contentTitle,
          widgets: [],
          boardPosition,
        });
        dispatch(addMiddleWidget(newBoard));

        const Board = await boardApi.create({ workspaceId, contentTitle });
        console.log('Board', Board);
        localStorage.setItem('currentBoardId', Board.id);
        router.push(`/${workspaceId}/board/${Board.id}/`);
      } catch (error) {
        console.error('보드 생성 중 오류 발생:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return {
    contentTitle,
    isLoading,
    handleInputChange,
    handleSaveClick,
  };
};
