import type { User, UserDto } from '../models/user.entity';
import UserRepository from '../repository/user.repository';
import type { Response } from '../models/response.entity';
import { v4 as uuid } from 'uuid';

export default class UserController {
    private userRepository: UserRepository;

    constructor() {
        this.userRepository = new UserRepository();
    }

    find(): Response<User[]> {
        const users = this.userRepository.find();
        return {
            success: true,
            data: users,
        };
    }

    findOneById(id: string): Response<User> {
        const user = this.userRepository.findOneById(id);
        if (!user) {
            return {
                success: false,
                error: { message: 'Utilisateur introuvable' },
            };
        }
        return {
            success: true,
            data: user,
        };
    }

    save(userDto: UserDto): Response {
        const exist = this.userRepository.findOneByEmail(userDto.email);
        if (exist) {
            return {
                success: false,
                error: { message: 'Un utilisateur existe déja à cet email' },
            };
        }
        const user: User = { ...userDto, id: uuid() };
        this.userRepository.save(user);
        return {
            success: true,
            data: null,
        };
    }

    remove(id: string): Response {
        const exist = this.userRepository.findOneById(id);
        if (!exist) {
            return {
                success: false,
                error: { message: 'Utilisateur introuvable' },
            };
        }
        this.userRepository.remove(id);
        return {
            success: true,
            data: null,
        };
    }

    update(id: string, userDto: UserDto): Response {
        const conflict = this.userRepository.findOneByEmail(userDto.email);
        if (conflict) {
            return {
                success: false,
                error: { message: 'Un utilisateur existe déja à cet email' },
            };
        }
        const exist = this.userRepository.findOneById(id);
        if (!exist) {
            return {
                success: false,
                error: { message: 'Utilisateur introuvable' },
            };
        }
        this.userRepository.update(id, userDto);
        return {
            success: true,
            data: null,
        };
    }
}
