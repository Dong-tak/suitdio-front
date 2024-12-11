import { useEffect } from 'react';

interface UseDragAndDropProps {
  containerRef: React.RefObject<HTMLDivElement>;
  handleFileUpload: (file: File) => void;
}

export const useDragAndDrop = ({
  containerRef,
  handleFileUpload,
}: UseDragAndDropProps) => {
  useEffect(() => {
    const container = containerRef.current;

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (e.dataTransfer?.files[0]) {
        handleFileUpload(e.dataTransfer.files[0]);
      }
    };

    if (container) {
      container.addEventListener('dragover', handleDragOver);
      container.addEventListener('drop', handleDrop);
    }

    return () => {
      if (container) {
        container.removeEventListener('dragover', handleDragOver);
        container.removeEventListener('drop', handleDrop);
      }
    };
  }, [containerRef, handleFileUpload]);
};
