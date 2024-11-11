import { RootState } from '@/lib/redux/store';
import { IframeEmbedWidget } from '@/lib/type';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

interface WidgetUrlProps extends IframeEmbedWidget {
  onHeightChange: (height: number) => void;
  width: number;
  height?: number;
}

export default function WidgetUrl({
  width,
  height,
  onHeightChange,
  ...props
}: WidgetUrlProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const isEditMode = useSelector(
    (state: RootState) => state.whiteboard.editModeWidgets === props.id
  );

  if (height) height = height - 64;

  const handleInteractionWallClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Shell의 클릭 이벤트를 수동으로 발생시킴
    e.currentTarget.parentElement?.click();
  };

  return (
    <div
      style={{
        width: width || 472,
        height: height,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <iframe
        ref={iframeRef}
        src={props.src}
        tabIndex={0}
        allowFullScreen
        width='100%'
        height='100%'
      />
      {!isEditMode && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'transparent',
          }}
          onClick={handleInteractionWallClick}
          onDoubleClick={(e) => {
            e.stopPropagation();
            // Shell의 더블클릭 이벤트를 수동으로 발생시킴
            e.currentTarget.parentElement?.dispatchEvent(
              new MouseEvent('dblclick', {
                bubbles: true,
                cancelable: true,
              })
            );
          }}
        />
      )}
    </div>
  );
}
