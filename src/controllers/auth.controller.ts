import { type Response } from '../models/response.entity';
import type { LoginDto, CreateUserDto, User, UserHead } from '../models/user.entity';
import AuthRepository from '../repository/auth.repository';
import UserRepository from '../repository/user.repository';
import * as bcrypt from 'bcryptjs';

export default class AuthController {
    private authRepository: AuthRepository;
    private userRepository: UserRepository;

    private SALT = 10;

    constructor() {
        this.authRepository = new AuthRepository();
        this.userRepository = new UserRepository();
    }

    public async login(loginDto: LoginDto): Promise<Response<User>> {
        const user = this.userRepository.getUserByEmail(loginDto.email);
        if (!user) {
            return {
                success: false,
                error: { message: 'indentifiants incorrects' },
            };
        }

        const valid = await bcrypt.compare(loginDto.password, user.password);
        if (!valid) {
            return {
                success: false,
                error: { message: 'indentifiants incorrects' },
            };
        }

        const connexion = {
            id: user.id,
            email: user.email,
            admin: user.admin,
        };
        this.authRepository.addConnexion(connexion);
        return {
            success: true,
            data: user,
        };
    }

    public getConnexion(): Response<UserHead> {
        const connexion = this.authRepository.getConnexion();
        if (!connexion) {
            return {
                success: false,
                error: { message: 'No connexion' },
            };
        }
        return {
            success: true,
            data: connexion,
        };
    }

    public logout(): void {
        this.authRepository.removeConnexion();
    }

    public async register(createUserDto: CreateUserDto): Promise<Response> {
        const exist = this.userRepository.getUserByEmail(createUserDto.email);
        if (exist) {
            return {
                success: false,
                error: { message: 'Email déja utilisé' },
            };
        }
        const hash = await bcrypt.hash(createUserDto.password, this.SALT);
        createUserDto.password = hash;
        this.userRepository.addUser(createUserDto);
        return {
            success: true,
            data: null,
        };
    }
}
