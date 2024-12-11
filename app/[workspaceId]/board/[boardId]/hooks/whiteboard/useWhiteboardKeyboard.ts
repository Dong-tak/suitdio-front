import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  redo,
  setSpacePressed,
  undo,
  updateWidget,
} from '@/redux/features/whiteboardSlice';
import { AllWidgetTypes, Arrow, ShellWidgetProps } from '@/types/type';
import { deleteArrow, setSelectedArrows } from '@/redux/features/arrowSlice';

interface UseWhiteboardKeyboardProps {
  setIsPanning: (isPanning: boolean) => void;
  selectedArrow: Arrow[];
  widgets: ShellWidgetProps<AllWidgetTypes>[];
}

export const useWhiteboardKeyboard = ({
  setIsPanning,
  selectedArrow,
  widgets,
}: UseWhiteboardKeyboardProps) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        dispatch(setSpacePressed(true));
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        dispatch(setSpacePressed(false));
        setIsPanning(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [dispatch, setIsPanning]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey) {
        // Mac의 Cmd 키와 Windows의 Ctrl 키 모두 지원
        if (e.shiftKey && e.key.toLowerCase() === 'z') {
          // Cmd/Ctrl + Shift + Z: Redo
          e.preventDefault();
          dispatch(redo());
        } else if (e.key.toLowerCase() === 'z') {
          // Cmd/Ctrl + Z: Undo
          e.preventDefault();
          dispatch(undo());
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dispatch]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        selectedArrow.length > 0 &&
        (e.key === 'Backspace' || e.key === 'Delete')
      ) {
        // 선택된 각 화살표에 대해 처리
        selectedArrow.forEach((arrow) => {
          // fromId를 가진 위젯에서 toId 제거
          const fromWidget = widgets.find((w) => w.id === arrow.fromId);
          if (fromWidget) {
            const updatedFromWidget = {
              ...fromWidget,
              to: fromWidget.to.filter((to) => to.id !== arrow.toId),
            };
            console.log('updatedFromWidget:', updatedFromWidget);
            dispatch(updateWidget(updatedFromWidget));
          }

          // toId를 가진 위젯에서 fromId 제거
          const toWidget = widgets.find((w) => w.id === arrow.toId);
          if (toWidget) {
            const updatedToWidget = {
              ...toWidget,
              from: toWidget.from.filter((from) => from.id !== arrow.fromId),
            };
            console.log('updatedToWidget:', updatedToWidget);
            dispatch(updateWidget(updatedToWidget));
          }
        });

        // 화살표 삭제 및 선택 해제
        dispatch(deleteArrow(selectedArrow));
        dispatch(setSelectedArrows([]));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedArrow, dispatch]);
};
