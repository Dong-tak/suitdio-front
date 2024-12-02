import { PartialBlock } from "@blocknote/core";
import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import { useEffect, useRef, useState } from "react";
import { BoardWidget } from "@/types/type";
import Link from "next/link";

interface WidgetBoardProps extends BoardWidget {
  editable: boolean;
  autoFocus?: boolean;
  text: string;
  titleBlock: string;
  fontSize: number;
  onHeightChange: (height: number) => void;
}

export default function WidgetBoard({
  text,
  titleBlock,
  editable,
  fontSize,
  autoFocus,
  onHeightChange,
}: WidgetBoardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentHeight, setCurrentHeight] = useState(184);

  const initialContent: PartialBlock[] = [
    {
      type: "paragraph",
      content: titleBlock,
    },
  ];

  const editor = useCreateBlockNote({
    initialContent,
    editable: false,
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

  return (
    <Link href={text} style={{ textDecoration: "none", color: "inherit" }}>
      <div ref={containerRef} style={{ zIndex: -1, position: "relative" }}>
        <BlockNoteView editor={editor} editable={false} />
      </div>
    </Link>
  );
}
