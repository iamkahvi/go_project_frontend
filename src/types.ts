export interface User {
  Name: string;
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: string;
}

export interface ResponseBody {
  users: User[];
}
