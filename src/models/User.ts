export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export type CreateUserDto = Omit<User, 'id'>;
export type UpdateUserDto = Omit<User, 'id'>;
