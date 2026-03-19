import type { User, UserDto } from '../models/user.entity';
import { v4 as uuid } from 'uuid';

export default class UserRepository {
    private USERS_KEY = 'users';
    private users: User[];

    constructor() {
        const usersData = localStorage.getItem(this.USERS_KEY);
        this.users = usersData ? JSON.parse(usersData) : [];
    }

    find(): User[] {
        return this.users;
    }

    findOneById(id: string): User | null {
        const user = this.users.find((user: User) => user.id === id);
        return user ? user : null;
    }

    findOneByEmail(email: string): User | null {
        const user = this.users.find((user: User) => user.email === email);
        return user ? user : null;
    }

    save(userDto: UserDto): void {
        const user: User = { ...userDto, id: uuid() };
        this.users.push(user);
        this.synchronize();
    }

    remove(id: string): void {
        const index = this.users.findIndex((user: User) => user.id === id);
        this.users.splice(index, 1);
        this.synchronize();
    }

    update(id: string, userDto: UserDto): void {
        const index = this.users.findIndex((user: User) => user.id === id);
        this.users.splice(index, 1, { ...userDto, id: id });
        this.synchronize();
    }

    synchronize(): void {
        localStorage.setItem(this.USERS_KEY, JSON.stringify(this.users));
    }
}
