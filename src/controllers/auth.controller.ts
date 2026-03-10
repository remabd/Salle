import { Status, type Response } from '../models/response.entity';
import type { LoginDto, CreateUserDto } from '../models/user.entity';
import AuthRepository from '../repository/auth.repository';
import UserRepository from '../repository/user.repository';
import * as bcrypt from 'bcrypt';

export default class AuthController {
    private authRepository: AuthRepository;
    private userRepository: UserRepository;

    private SALT = 10;

    constructor() {
        this.authRepository = new AuthRepository();
        this.userRepository = new UserRepository();
    }

    public async login(loginDto: LoginDto): Promise<Response> {
        const user = this.userRepository.getUserByEmail(loginDto.email);
        if (!user) {
            return {
                status: Status.UNAUTHORIZED,
                message: null,
                data: null,
            };
        }

        const valid = await bcrypt.compare(loginDto.password, user.password);
        if (!valid) {
            return {
                status: Status.UNAUTHORIZED,
                message: null,
                data: null,
            };
        }

        const connexion = {
            id: user.id,
            email: user.email,
            admin: user.admin,
        };
        this.authRepository.addConnexion(connexion);
        return {
            status: Status.OK,
            message: 'Utilisateur connecté',
            data: user,
        };
    }

    public logout(): void {
        this.authRepository.removeConnection();
    }

    public async register(createUserDto: CreateUserDto): Promise<Response> {
        const exist = this.userRepository.getUserByEmail(createUserDto.email);
        if (exist) {
            return {
                status: Status.UNAUTHORIZED,
                message: 'Email déja utilisé',
                data: null,
            };
        }
        const hash = await bcrypt.hash(createUserDto.password, this.SALT);
        createUserDto.password = hash;
        this.userRepository.addUser(createUserDto);
        return {
            status: Status.OK,
            message: 'Utilisateur enregistré',
            data: null,
        };
    }
}
