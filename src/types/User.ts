export interface User {
  id: number;
  name: string;
  email?: string;
  username: string;
  role: string;
  created_at: string;
}

export interface NewUser {
  name: string;
  email: string;
  username: string;
  password: string;
  role: string;
}

export interface EditUser {
  name: string;
  email: string;
  username: string;
  password: string;
  role: string;
}

export interface DeleteConfirm {
  userId: number;
  username: string;
}