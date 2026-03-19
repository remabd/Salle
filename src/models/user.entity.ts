export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    admin: boolean;
}

export type UserDto = Omit<User, 'id'>;

export type UserHead = Pick<User, 'id' | 'email' | 'admin'>;

export interface LoginDto {
    email: string;
    password: string;
}
