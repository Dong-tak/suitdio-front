// import { Arrow } from "@/types/type";
// import { getTsid } from "tsid-ts";

// interface RelationAction {
//   type: "action";
//   transactionId: null;
//   actions: {
//     action: "create";
//     type: "relation";
//     data: {
//       id: string;
//       fromId: string;
//       toId: string;
//       relation: "forward" | "backward";
//       property: Record<string, unknown>;
//     };
//   }[];
// }

// export const sendArrowRelation = async (
//   boardId: string,
//   fromId: string,
//   toId: string
// ): Promise<void> => {
//   const ws = new WebSocket(`ws://localhost:8000/v1/play/board/${boardId}/`);

//   return new Promise((resolve, reject) => {
//     ws.onopen = () => {
//       const relationData: RelationAction = {
//         type: "action",
//         transactionId: null,
//         actions: [
//           {
//             action: "create",
//             type: "relation",
//             data: {
//               id: getTsid().toString(),
//               fromId,
//               toId,
//               relation: "forward",
//               property: {},
//             },
//           },
//         ],
//       };

//       try {
//         ws.send(JSON.stringify(relationData));
//         resolve();
//       } catch (error) {
//         reject(error);
//       }
//     };

//     ws.onerror = (error) => {
//       console.error("WebSocket 연결 에러:", error);
//       reject(error);
//     };

//     ws.onclose = () => {
//       console.log("WebSocket 연결이 닫혔습니다.");
//     };
//   });
// };

// export const sendArrowUpdateRelation = async (
//   boardId: string,
//   fromId: string,
//   toId: string
// ): Promise<void> => {
//   const ws = new WebSocket(`ws://localhost:8000/v1/play/board/${boardId}/`);

//   return new Promise((resolve, reject) => {
//     ws.onopen = () => {
//       const relationData: RelationAction = {
//         type: "action",
//         transactionId: null,
//         actions: [
//           {
//             action: "create",
//             type: "relation",
//             data: {
//               id: getTsid().toString(),
//               fromId,
//               toId,
//               relation: "backward",
//               property: {},
//             },
//           },
//         ],
//       };

//       try {
//         ws.send(JSON.stringify(relationData));
//         resolve();
//       } catch (error) {
//         reject(error);
//       }
//     };

//     ws.onerror = (error) => {
//       console.error("WebSocket 연결 에러:", error);
//       reject(error);
//     };

//     ws.onclose = () => {
//       console.log("WebSocket 연결이 닫혔습니다.");
//     };
//   });
// };
