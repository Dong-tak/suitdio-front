// types.ts

export interface LoginData {
  email: string;
  password: string;
}

export interface Token {
  access: string;
  refresh: string;
}

export interface User {
  id: number;
  email: string;
  nickname: string;
}

export interface LoginResponse {
  user: User;
  message: string;
  token: Token;
}

export interface ErrorResponse {
  message?: string; // message 속성을 선택적으로 변경
}
