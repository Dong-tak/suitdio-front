import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { addWidget } from "@/redux/features/whiteboardSlice";
import {
  AllWidgetTypes,
  ShellWidgetProps,
  TextWidget,
  IframeEmbedWidget,
} from "@/types/type";
import { getTsid } from "tsid-ts";

interface UseClipboardProps {
  tool: string;
  activeShells: {
    editModeShells: Set<string>;
    popupOpenShells: Set<string>;
  };
  scale: number;
  offset: { x: number; y: number };
  FONT_SIZE: number;
  mousePosition: { x: number; y: number } | null;
  setMousePosition: (position: { x: number; y: number } | null) => void;
}

export const useClipboard = ({
  tool,
  activeShells,
  scale,
  offset,
  FONT_SIZE,
  mousePosition,
  setMousePosition,
}: UseClipboardProps) => {
  const dispatch = useDispatch();

  const addTextWidgets = (mousePos: { x: number; y: number }, text: string) => {
    const x = (mousePos.x - offset.x * scale) / scale;
    const y = (mousePos.y - offset.y * scale) / scale;

    const innerWidget: TextWidget = {
      id: getTsid().toString(),
      type: "text",
      mkText: text,
      fontSize: FONT_SIZE,
      draggable: true,
      editable: true,
      resizeable: true,
      headerBar: true,
      footerBar: false,
    };

    const newWidget: ShellWidgetProps<AllWidgetTypes> = {
      id: getTsid().toString(),
      type: "shell",
      width: 472,
      height: 184,
      x,
      y,
      resizable: true,
      editable: true,
      draggable: true,
      from: [],
      to: [],
      innerWidget,
    };

    dispatch(addWidget(newWidget));
  };

  const addUrlWidgets = (mousePos: { x: number; y: number }, text: string) => {
    const x = (mousePos.x - offset.x * scale) / scale;
    const y = (mousePos.y - offset.y * scale) / scale;

    const innerWidget: IframeEmbedWidget = {
      id: getTsid().toString(),
      type: "url",
      src: text,
      draggable: true,
      editable: true,
      resizeable: true,
      headerBar: true,
      footerBar: false,
    };

    const newWidget: ShellWidgetProps<AllWidgetTypes> = {
      id: getTsid().toString(),
      type: "shell",
      width: 472,
      height: 712,
      x,
      y,
      resizable: true,
      editable: true,
      draggable: true,
      from: [],
      to: [],
      innerWidget,
    };

    dispatch(addWidget(newWidget));
  };

  useEffect(() => {
    if (
      tool !== "url" &&
      activeShells.editModeShells.size === 0 &&
      activeShells.popupOpenShells.size === 0
    ) {
      const handlePaste = (e: ClipboardEvent) => {
        e.preventDefault();
        const pastedText = e.clipboardData?.getData("text");

        if (pastedText && mousePosition) {
          const isUrl = /^(http|https):\/\/[^ "]+$/.test(pastedText);
          if (isUrl) {
            addUrlWidgets(mousePosition, pastedText);
          } else {
            addTextWidgets(mousePosition, pastedText);
          }
        }
      };

      const handleMouseMove = (e: MouseEvent) => {
        setMousePosition({ x: e.clientX, y: e.clientY });
      };

      document.addEventListener("paste", handlePaste);
      document.addEventListener("mousemove", handleMouseMove);

      return () => {
        document.removeEventListener("paste", handlePaste);
        document.removeEventListener("mousemove", handleMouseMove);
      };
    }
  }, [tool, activeShells, mousePosition, scale, offset]);

  return {
    addTextWidgets,
    addUrlWidgets,
  };
};
