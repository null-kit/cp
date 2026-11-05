export type User = {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
};

export type UserLogin = {
  email: string;
  password: string;
};
