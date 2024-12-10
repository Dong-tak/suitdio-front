import { PartialBlock } from "@blocknote/core";
import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import { useEffect, useRef, useState } from "react";
import { CenterWidget } from "@/types/type";

interface WidgetCenterProps extends CenterWidget {
  editable: boolean;
  autoFocus?: boolean;
  text: string;
  fontSize: number;
  onHeightChange: (height: number) => void;
}

export default function WidgetCenter({
  text,
  editable,
  fontSize,
  autoFocus,
  onHeightChange,
}: WidgetCenterProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentHeight, setCurrentHeight] = useState(200);

  const initialContent: PartialBlock[] | undefined = text
    ? JSON.parse(text)
    : undefined;

  const editor = useCreateBlockNote({
    initialContent,
  });

  useEffect(() => {
    const updateHeight = () => {
      if (containerRef.current) {
        const newHeight = containerRef.current.clientHeight;
        if (newHeight !== currentHeight) {
          setCurrentHeight(newHeight);
          onHeightChange(newHeight);
        }
      }
    };

    updateHeight();

    const resizeObserver = new ResizeObserver(updateHeight);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [currentHeight, onHeightChange]);

  useEffect(() => {
    if (autoFocus && editable) {
      editor.focus();
    }
  }, [autoFocus, editable, editor]);

  return (
    <div
      ref={containerRef}
      style={{
        zIndex: 1,
        position: "relative",
        minHeight: `200px`,
        height: `${currentHeight}px`,
      }}
    >
      <BlockNoteView editor={editor} editable={editable} />
    </div>
  );
}
