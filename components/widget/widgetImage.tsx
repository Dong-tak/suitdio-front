import { ImageEmbedWidget } from '@/types/type';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function WidgetImage({
  onHeightChange,
  width,
  isReduced,
  ...props
}: ImageEmbedWidget & { onHeightChange?: (height: number) => void }) {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [height, setHeight] = useState<number>(props.height || 0);

  useEffect(() => {
    const img = new window.Image();
    img.src = props.src;
    img.onload = () => {
      const aspectRatio = img.height / img.width;
      const newHeight = Math.round(width ? width * aspectRatio : 0);
      setHeight(newHeight);
      onHeightChange?.(newHeight);
      setImage(img);
    };
  }, [props.src, width]);

  if (!image || width === 0) {
    return null;
  }

  return (
    <>
      {isReduced ? (
        <div className='p-1 h-[132px] w-full flex items-center justify-between'>
          <h2 className='h-[53px] text-start text-lg font-bold flex-1 truncate overflow-hidden whitespace-nowrap'>
            {props.name}
          </h2>
        </div>
      ) : (
        <div className='relative w-full h-full'>
          <Image
            src={props.src}
            alt='image'
            width={width}
            height={height}
            objectFit='contain'
          />
        </div>
      )}
    </>
  );
}
