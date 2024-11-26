import { TextWidget } from '@/types/type';
import { PartialBlock } from '@blocknote/core';
import { useCreateBlockNote } from '@blocknote/react';
import '@blocknote/core/fonts/inter.css';
import '@blocknote/react/style.css';
import { useEffect, useRef, useState } from 'react';
import { BlockNoteView } from '@blocknote/mantine';
import { updateWidget } from '@/lib/redux/features/whiteboardSlice';
import { useDispatch } from 'react-redux';

interface WidgetTextProps extends TextWidget {
  editable: boolean;
  autoFocus?: boolean;
  onHeightChange: (height: number) => void;
  isOpen?: boolean;
  onTextChange: (text: string) => void;
}

export default function WidgetText({
  editable,
  fontSize,
  autoFocus,
  isOpen,
  onHeightChange,
  onTextChange,
  ...props
}: WidgetTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentHeight, setCurrentHeight] = useState(184);
  const dispatch = useDispatch();

  useEffect(() => {
    const loadMarkdown = async () => {
      if (props.src) {
        const response = await fetch(props.src);
        const text = await response.text();
        const blocks = await editor.tryParseMarkdownToBlocks(text);
        editor.replaceBlocks(editor.document, blocks);
      } else if (props.mkText) {
        const blocks = await editor.tryParseMarkdownToBlocks(props.mkText);
        editor.replaceBlocks(editor.document, blocks);
      }
    };

    loadMarkdown();
  }, []);

  // useEffect(() => {
  //   const blocks = editor.document;
  //   if (isReduced) {
  //     editor.updateBlock(blocks[0].id, {
  //       type: 'heading',
  //       props: { level: 2 },
  //     });

  //     // 1번째와 2번째 블록을 paragraph로 변경
  //     editor.updateBlock(blocks[1].id, {
  //       type: 'paragraph',
  //     });
  //     editor.updateBlock(blocks[2].id, {
  //       type: 'paragraph',
  //     });
  //   }
  // }, [isReduced]);

  const initialContent: PartialBlock[] | undefined = props.text
    ? JSON.parse(props.text)
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
          if (!isOpen) {
            onHeightChange(newHeight);
          }
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

  const handleDocumentChange = () => {
    console.log('editor changed');
    onTextChange(JSON.stringify(editor.document));
  };

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      <BlockNoteView
        editor={editor}
        editable={editable}
        onChange={handleDocumentChange}
      />
    </div>
  );
}
