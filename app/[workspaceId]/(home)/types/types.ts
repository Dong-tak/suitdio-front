import { AllWidgetTypes, ShellWidgetProps } from '@/types/type';

export interface BoardPosition {
  x: number;
  y: number;
}

export interface CenterWidgetParams {
  contentTitle: string;
  widgets: ShellWidgetProps<AllWidgetTypes>[];
  boardPosition: BoardPosition;
  initialHeight?: number;
}
