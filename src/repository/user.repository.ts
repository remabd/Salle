import type { User, CreateUserDto, UpdateUserDto } from '../models/user.entity';
import { v4 as uuid } from 'uuid';

export default class UserRepository {
    private USERS_KEY = 'users';
    private users: User[];

    constructor() {
        const usersData = localStorage.getItem(this.USERS_KEY);
        this.users = usersData ? JSON.parse(usersData) : [];
        this.synchronize();
    }

    getUsers(): User[] {
        return this.users;
    }

    getUser(id: string): User | null {
        const user = this.users.find((user: User) => user.id === id);
        return user ? user : null;
    }

    getUserByEmail(email: string): User | null {
        const user = this.users.find((user: User) => user.email === email);
        return user ? user : null;
    }

    addUser(createUserDto: CreateUserDto): void {
        const user: User = { ...createUserDto, id: uuid() };
        this.users.push(user);
        this.synchronize();
    }

    removeUser(id: string): void {
        const index = this.users.findIndex((user: User) => user.id === id);
        this.users.splice(index, 1);
        this.synchronize();
    }

    updateUser(id: string, updateUserDto: UpdateUserDto): void {
        const index = this.users.findIndex((user: User) => user.id === id);
        this.users.splice(index, 1, { ...updateUserDto, id: id });
        this.synchronize();
    }

    synchronize(): void {
        localStorage.setItem(this.USERS_KEY, JSON.stringify(this.users));
    }
}
