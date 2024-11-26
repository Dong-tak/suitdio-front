import React from 'react';
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
import { AllWidgetTypes, ShellWidgetProps } from '@/types/type';

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-w-[80vw] h-[80vh]'>
        <Carousel>
          <CarouselContent>
            {filteredWidgets.map((widget, index) => (
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
