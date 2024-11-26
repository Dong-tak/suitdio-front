import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/redux/store';
import WidgetText from '@/components/widget/widgetText';
import WidgetImage from '@/components/widget/widgetImage';
import WidgetPdf from '@/components/widget/widgetPdf';
import WidgetUrl from '@/components/widget/widgetUrl';
import { AllWidgetTypes, Arrow, ShellWidgetProps } from '@/types/type';
import { DialogTitle } from '@radix-ui/react-dialog';

interface WidgetPopupProps {
  isOpen: boolean;
  onClose: () => void;
  initialWidgetId?: string;
}

export default function WidgetPopup({
  isOpen,
  onClose,
  initialWidgetId,
}: WidgetPopupProps) {
  const widgets = useSelector((state: RootState) => state.whiteboard.widgets);
  const arrows = useSelector((state: RootState) => state.arrow.arrows);
  const [travelList, setTravelList] = useState<
    ShellWidgetProps<AllWidgetTypes>[]
  >([]);
  // 필터링된 위젯 목록을 상수로 저장
  const filteredWidgets = widgets.filter((widget) =>
    ['text', 'image', 'pdf', 'url'].includes(widget.innerWidget.type)
  );

  // initialWidgetId에 해당하는 위젯의 인덱스 찾기
  const initialIndex = initialWidgetId
    ? filteredWidgets.findIndex((widget) => widget.id === initialWidgetId)
    : 0;

  const renderWidgetContent = (widget: ShellWidgetProps<AllWidgetTypes>) => {
    switch (widget.innerWidget.type) {
      case 'text':
        return (
          <WidgetText
            {...widget.innerWidget}
            height={widget.height}
            editable={true}
            autoFocus={false}
            onHeightChange={() => {}}
            onTextChange={() => {}}
            isOpen={isOpen}
          />
        );
      case 'image':
        return (
          <WidgetImage
            {...widget.innerWidget}
            width={widget.width}
            isReduced={false}
          />
        );
      case 'pdf':
        return (
          <WidgetPdf
            {...widget.innerWidget}
            width={widget.width}
            isReduced={false}
          />
        );
      case 'url':
        return (
          <WidgetUrl
            {...widget.innerWidget}
            width={widget.width}
            height={widget.height}
            isReduced={false}
            onHeightChange={() => {}}
          />
        );
      default:
        return null;
    }
  };

  const findLinkedWidgets = (
    widgetId: string,
    direction: 'from' | 'to',
    visited: Set<string> = new Set()
  ): ShellWidgetProps<AllWidgetTypes>[] => {
    if (visited.has(widgetId)) return [];
    visited.add(widgetId);

    const linkedWidgets: ShellWidgetProps<AllWidgetTypes>[] = [];

    arrows.forEach((arrow: Arrow) => {
      if (direction === 'from' && arrow.toId === widgetId) {
        const fromWidget = widgets.find((w) => w.id === arrow.fromId);
        if (fromWidget) {
          linkedWidgets.push(fromWidget);
          linkedWidgets.push(
            ...findLinkedWidgets(fromWidget.id, 'from', visited)
          );
        }
      } else if (direction === 'to' && arrow.fromId === widgetId) {
        const toWidget = widgets.find((w) => w.id === arrow.toId);
        if (toWidget) {
          linkedWidgets.push(toWidget);
          linkedWidgets.push(...findLinkedWidgets(toWidget.id, 'to', visited));
        }
      }
    });

    return linkedWidgets;
  };

  const setArrowLinkedWidget = (widget: ShellWidgetProps<AllWidgetTypes>) => {
    const visited = new Set<string>();
    const newTravelList: ShellWidgetProps<AllWidgetTypes>[] = [];

    // from 방향으로 연결된 모든 위젯 찾기
    newTravelList.push(...findLinkedWidgets(widget.id, 'from'));

    // 현재 위젯 추가
    newTravelList.push(widget);

    // to 방향으로 연결된 모든 위젯 찾기
    newTravelList.push(...findLinkedWidgets(widget.id, 'to'));

    // 중복 제거
    const uniqueList = Array.from(
      new Map(newTravelList.map((item) => [item.id, item])).values()
    );

    setTravelList(uniqueList);
  };

  // 대신 useEffect를 사용하여 처리
  useEffect(() => {
    if (widgets[initialIndex]) {
      setArrowLinkedWidget(widgets[initialIndex]);
    }
  }, [initialIndex, widgets]); // 의존성 배열 추가

  const currentWidgetIndex = travelList.findIndex(
    (widget) => widget.id === initialWidgetId
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogTitle>Widget</DialogTitle>
      <DialogContent className='max-w-[80vw] h-[80vh]'>
        <Carousel
          opts={{
            startIndex: currentWidgetIndex,
          }}
        >
          <CarouselContent>
            {travelList.map((widget, index) => (
              <CarouselItem
                key={widget.id}
                className='pointer-events-none overflow-hidden'
              >
                <div className='p-4 pointer-events-auto flex'>
                  {renderWidgetContent(widget)}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </DialogContent>
    </Dialog>
  );
}
