import type { User, CreateUserDto, UpdateUserDto } from '../models/User';
import { v4 as uuid } from 'uuid';

export default class UserRepository {
    private KEY = 'users';
    private users: User[];

    constructor() {
        const data = localStorage.getItem(this.KEY);
        this.users = data ? JSON.parse(data) : [];
    }

    getUsers(): User[] {
        return this.users;
    }

    getUser(id: string): User | null {
        const user = this.users.find((user: User) => user.id === id);
        return user ? user : null;
    }

    addUser(createUserDto: CreateUserDto): void {
        const user: User = { ...createUserDto, id: uuid() };
        this.users.push(user);
        this.synchronize();
    }

    removeUser(id: string): void {
        const index = this.users.findIndex((user: User) => user.id === id);
        if (index === -1) {
            throw new Error();
        }
        this.users.splice(index, 1);
        this.synchronize();
    }

    updateUser(id: string, updateUserDto: UpdateUserDto): void {
        const index = this.users.findIndex((user: User) => user.id === id);
        if (index === -1) {
            throw new Error();
        }
        this.users.splice(index, 1, { ...updateUserDto, id: id });
        this.synchronize();
    }

    synchronize(): void {
        localStorage.setItem(this.KEY, JSON.stringify(this.users));
    }
}
