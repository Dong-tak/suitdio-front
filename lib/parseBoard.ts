import {
  AllWidgetTypes,
  ShellWidgetProps,
  TextWidget,
  ImageEmbedWidget,
  PDFEmbedWidget,
  IframeEmbedWidget,
  SectionWidget,
  BoardWidget,
} from "@/types/type";

interface Position {
  x: number;
  y: number;
  z: number;
}

interface Size {
  width: number;
  height: number;
}

interface WidgetInstance {
  id: string;
  boardId: string;
  type: string;
  data: Record<string, unknown>;
  position: Position;
  size: Size;
  state: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

interface WidgetRelation {
  id: string;
  widget_from: string;
  to_instances: string[];
  relation: string;
  property: Record<string, unknown>;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

interface BoardResponse {
  board: {
    id: string;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
    workspaceId: string;
    data: {
      focus: string;
    };
  };
  widgetInstances: WidgetInstance[];
  widgetRelations: WidgetRelation[];
}

export function parseWidgetInstance(
  instance: WidgetInstance
): ShellWidgetProps<AllWidgetTypes> {
  console.log("위젯 파싱 시작:", instance.type, instance.id);

  let innerWidget: AllWidgetTypes;

  switch (instance.type) {
    case "text":
      const textContent =
        typeof instance.data.content === "string"
          ? JSON.parse(instance.data.content)
          : instance.data.content;

      innerWidget = {
        id: instance.id,
        type: "text",
        text: instance.data.content,
        fontSize: 16,
        x: instance.position.x,
        y: instance.position.y,
        width: instance.size.width,
        height: instance.size.height,
        draggable: true,
        editable: true,
        resizeable: true,
        headerBar: true,
        footerBar: false,
      } as TextWidget;
      break;
    case "embed_img":
      innerWidget = {
        id: instance.id,
        type: "image",
        src: instance.data.src,
        name: instance.data.name || "image",
        x: instance.position.x,
        y: instance.position.y,
        width: instance.size.width,
        height: instance.size.height,
        draggable: true,
        editable: true,
        resizeable: true,
        headerBar: true,
        footerBar: false,
      } as ImageEmbedWidget;
      break;
    case "embed_pdf":
      innerWidget = {
        id: instance.id,
        type: "pdf",
        src: instance.data.src,
        name: instance.data.name || "pdf",
        x: instance.position.x,
        y: instance.position.y,
        width: instance.size.width,
        height: instance.size.height,
        draggable: true,
        editable: true,
        resizeable: true,
        headerBar: true,
        footerBar: false,
      } as PDFEmbedWidget;
      break;
    case "embed_url":
      innerWidget = {
        id: instance.id,
        type: "url",
        src: instance.data.src,
        title: instance.data.title,
        description: instance.data.description,
        image: instance.data.image,
        favicon: instance.data.favicon,
        x: instance.position.x,
        y: instance.position.y,
        width: instance.size.width,
        height: instance.size.height,
        draggable: true,
        editable: true,
        resizeable: true,
        headerBar: true,
        footerBar: false,
      } as IframeEmbedWidget;
      break;
    case "section":
      innerWidget = {
        id: instance.id,
        type: "section",
        content: instance.data.content,
        x: instance.position.x,
        y: instance.position.y,
        width: instance.size.width,
        height: instance.size.height,
        fill: "rgba(200, 200, 200, 0.2)",
        memberIds: [],
        draggable: true,
        editable: false,
        resizeable: true,
        headerBar: false,
        footerBar: false,
      } as SectionWidget;
      break;
    default:
      throw new Error(`지원되지 않는 위젯 타입: ${instance.type}`);
  }

  const shellWidget: ShellWidgetProps<AllWidgetTypes> = {
    id: instance.id,
    type: "shell",
    x: instance.position.x,
    y: instance.position.y,
    width: instance.size.width,
    height: instance.size.height,
    resizable: true,
    editable: true,
    draggable: true,
    from: [],
    to: [],
    innerWidget,
  };

  console.log("파싱된 위젯:", shellWidget);
  return shellWidget;
}

export function parseBoardData(response: BoardResponse) {
  const widgets = response.widgetInstances.map((instance) =>
    parseWidgetInstance(instance)
  );

  response.widgetRelations.forEach((relation) => {
    if (!relation.is_deleted) {
      const fromWidget = widgets.find((w) => w.id === relation.widget_from);
      if (fromWidget) {
        relation.to_instances.forEach((toId) => {
          const toWidget = widgets.find((w) => w.id === toId);
          if (toWidget) {
            fromWidget.to.push(toWidget);
            toWidget.from.push(fromWidget);
          }
        });
      }
    }
  });

  return {
    widgets,
    relations: response.widgetRelations.filter((r) => !r.is_deleted),
    boardInfo: response.board,
  };
}
