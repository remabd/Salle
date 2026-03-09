export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    admin: boolean;
}

export type CreateUserDto = Omit<User, 'id'>;
export type UpdateUserDto = Omit<User, 'id'>;

export type LoginDto = Omit<User, 'id' | 'firstName' | 'lastName'>;
export type UserHead = Omit<User, 'password' | 'firstName' | 'lastName' | 'role'>;
