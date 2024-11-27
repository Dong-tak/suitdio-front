// import { AllWidgetTypes, ShellWidgetProps, TextWidget } from "@/types/type";

// interface Position {
//   x: number;
//   y: number;
//   z: number;
// }

// interface Size {
//   width: number;
//   height: number;
// }

// interface WidgetInstance {
//   id: string;
//   boardId: string;
//   type: string;
//   data: {
//     content: string;
//     [key: string]: any;
//   };
//   position: Position;
//   size: Size;
//   state: string;
//   isDeleted: boolean;
//   createdAt: string;
//   updatedAt: string;
// }
// interface widgetRelations {
//   id: string;
//   widget_from: string;
//   to_instances: string[];
//   relation: string;
//   property: Record<string, any>;
//   is_deleted: boolean;
//   created_at: string;
//   updated_at: string;
// }

// interface BoardResponse {
//   board: {
//     id: string;
//     isDeleted: boolean;
//     createdAt: string;
//     updatedAt: string;
//     workspaceId: string;
//     data: {
//       focus: string;
//     };
//   };
//   widgetInstances: WidgetInstance[];
//   widgetRelations: Array<{
//     id: string;
//     widget_from: string;
//     to_instances: string[];
//     relation: string;
//     property: Record<string, any>;
//     is_deleted: boolean;
//     created_at: string;
//     updated_at: string;
//   }>;
// }

// export function parseWidgetInstance(
//   instance: WidgetInstance
// ): ShellWidgetProps<AllWidgetTypes> {
//   let innerWidget: AllWidgetTypes;

//   switch (instance.type) {
//     case "text":
//       innerWidget = {
//         id: instance.id,
//         type: "text",
//         text: instance.data.content,
//         fontSize: 16, // 기본값 설정
//         x: instance.position.x,
//         y: instance.position.y,
//         width: instance.size.width,
//         height: instance.size.height,
//         draggable: true,
//         editable: true,
//         resizeable: true,
//         headerBar: true,
//         footerBar: false,
//       } as TextWidget;
//       break;
//     // 다른 위젯 타입들에 대한 케이스 추가
//     default:
//       throw new Error(`Unsupported widget type: ${instance.type}`);
//   }

//   return {
//     id: instance.id,
//     type: "shell",
//     x: instance.position.x,
//     y: instance.position.y,
//     width: instance.size.width,
//     height: instance.size.height,
//     resizable: true,
//     editable: true,
//     draggable: true,
//     innerWidget,
//   };
// }

// export function parseBoardData(response: BoardResponse): {
//   widgets: ShellWidgetProps<AllWidgetTypes>[];
//   relations: any[]; // 관계 데이터 타입 정의 필요
// } {
//   const widgets = response.widgetInstances
//     .filter((instance) => !instance.isDeleted)
//     .map((instance) => parseWidgetInstance(instance));

//   return {
//     widgets,
//     relations: response.widgetRelations,
//   };
// }
