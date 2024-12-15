import { ShellWidgetProps, AllWidgetTypes } from '@/types/type';
import { CenterWidgetParams } from '../types/types';

export const centerWidget = ({
  contentTitle,
  widgets,
  boardPosition,
  initialHeight = 200,
}: CenterWidgetParams): ShellWidgetProps<AllWidgetTypes> => {
  const timestamp = Date.now();
  return {
    id: `CenterWidget-${timestamp}`,
    type: 'shell',
    ...boardPosition,
    width: 750,
    height: initialHeight,
    resizable: true,
    editable: true,
    draggable: false,
    from: [],
    to: [],
    innerWidget: {
      id: `CenterWidget-${timestamp}`,
      type: 'center',
      titleBlock: contentTitle,
      width: 750,
      height: initialHeight,
      ...boardPosition,
      draggable: false,
      editable: true,
      resizeable: false,
      headerBar: true,
      footerBar: false,
      text: '',
    },
  };
};
