import { memo } from 'react';
import WidgetShell from './widgetShell';
import { ShellWidgetProps, AllWidgetTypes } from '@/types/type';

interface MemoizedWidgetShellProps {
  widget: ShellWidgetProps<AllWidgetTypes>;
  scale: number;
  offset: { x: number; y: number };
  draggable: boolean;
  editable: boolean;
  resizeable: boolean;
  headerBar: boolean;
  footerBar: boolean;
  fill?: string;
  memberIds?: string[];
  onEditModeChange?: (isEditMode: boolean) => void;
  onPopupOpenChange?: (isPopupOpen: boolean) => void;
}

const areEqual = (
  prevProps: MemoizedWidgetShellProps,
  nextProps: MemoizedWidgetShellProps
) => {
  return (
    prevProps.widget.x === nextProps.widget.x &&
    prevProps.widget.y === nextProps.widget.y &&
    prevProps.widget.width === nextProps.widget.width &&
    prevProps.widget.height === nextProps.widget.height &&
    prevProps.scale === nextProps.scale &&
    prevProps.offset.x === nextProps.offset.x &&
    prevProps.offset.y === nextProps.offset.y &&
    prevProps.draggable === nextProps.draggable &&
    prevProps.editable === nextProps.editable &&
    prevProps.resizeable === nextProps.resizeable &&
    prevProps.headerBar === nextProps.headerBar &&
    prevProps.footerBar === nextProps.footerBar &&
    prevProps.fill === nextProps.fill &&
    JSON.stringify(prevProps.widget.innerWidget) ===
      JSON.stringify(nextProps.widget.innerWidget)
  );
};

export const MemoizedWidgetShell = memo(WidgetShell, areEqual);
