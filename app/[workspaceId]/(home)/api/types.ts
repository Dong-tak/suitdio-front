export interface Board {
  id: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  workspaceId: string;
  data: {
    focus: string;
  };
}

export interface CreateBoardRequest {
  workspaceId: string;
  contentTitle: string;
}
