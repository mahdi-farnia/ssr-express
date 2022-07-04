declare interface IUser {
  id: string;
  username: string;
  age: number;
  password: string;
}

// NOTE don't forget to change the schema parameter to match the same key in types.d.ts
declare interface IUserFormData extends Omit<IUser, 'id'> {
  passConfirm: string;
  agreement: 'on' | 'off';
}

declare namespace Express {
  export interface User extends IUser {}
}
