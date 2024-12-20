import { useDispatch } from "react-redux";
import { addWidget, addSelectedWidget } from "@/redux/features/whiteboardSlice";
import { AllWidgetType, AllWidgetTypes, ShellWidgetProps } from "@/types/type";
import { getTsid } from "tsid-ts";

interface UseFileUploadProps {
  scale: number;
  offset: { x: number; y: number };
  baseSpacing: number;
  FONT_SIZE: number;
  setTool: (tool: "select" | AllWidgetType) => void;
}

export const useFileUpload = ({
  scale,
  offset,
  baseSpacing,
  FONT_SIZE,
  setTool,
}: UseFileUploadProps) => {
  const dispatch = useDispatch();

  const processFile = (file: File, dataUrl: string) => {
    const centerX = (window.innerWidth / 2 - offset.x * scale) / scale;
    const centerY = (window.innerHeight / 2 - offset.y * scale) / scale;
    let innerWidget: AllWidgetTypes;

    if (file.type.startsWith("image/")) {
      innerWidget = {
        id: getTsid().toString(),
        type: "image",
        src: dataUrl,
        x: Math.round(centerX / baseSpacing) * baseSpacing,
        y: Math.round(centerY / baseSpacing) * baseSpacing,
        width: 472,
        name: file.name,
        draggable: true,
        editable: true,
        resizeable: true,
        headerBar: true,
        footerBar: false,
      };
    } else if (file.type === "application/pdf") {
      innerWidget = {
        id: getTsid().toString(),
        type: "pdf",
        src: dataUrl,
        x: Math.round(centerX / baseSpacing) * baseSpacing,
        y: Math.round(centerY / baseSpacing) * baseSpacing,
        width: 460,
        name: file.name,
        draggable: true,
        editable: true,
        resizeable: true,
        headerBar: true,
        footerBar: false,
      };
    } else if (
      file.type === "text/markdown" ||
      file.type === "text/x-markdown"
    ) {
      innerWidget = {
        id: getTsid().toString(),
        type: "text",
        src: dataUrl,
        fontSize: FONT_SIZE,
        x: Math.round(centerX / baseSpacing) * baseSpacing,
        y: Math.round(centerY / baseSpacing) * baseSpacing,
        draggable: true,
        editable: true,
        resizeable: true,
        headerBar: true,
        footerBar: false,
      };
    } else {
      console.warn(`지원되지 않는 파일 형식: ${file.type}`);
      return;
    }

    const newWidget: ShellWidgetProps<AllWidgetTypes> = {
      id: getTsid().toString(),
      type: "shell",
      x: Math.round(centerX / baseSpacing) * baseSpacing,
      y: Math.round(centerY / baseSpacing) * baseSpacing,
      width: 472,
      height: 136,
      resizable: true,
      editable: true,
      draggable: true,
      from: [],
      to: [],
      innerWidget,
    };

    dispatch(addWidget(newWidget));
    dispatch(addSelectedWidget(newWidget.id));
    setTool("select");
  };

  const handleFileUpload = (dragFile?: File) => {
    const handleFile = (file: File) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          processFile(file, event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    };

    if (dragFile) {
      handleFile(dragFile);
      return;
    }

    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*, application/pdf, text/markdown";
    fileInput.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (target.files?.[0]) {
        handleFile(target.files[0]);
      }
    };
    fileInput.click();
  };

  return { handleFileUpload };
};
