import type { Response } from '../models/response.entity';
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
                message: null,
                error: 'Informations incorrectes',
            };
        }

        const valid = await bcrypt.compare(loginDto.password, user.password);
        if (!valid) {
            return {
                message: null,
                error: 'Informations incorrectes',
            };
        }

        const connexion = {
            id: user.id,
            email: user.email,
            admin: user.admin,
        };
        this.authRepository.addConnexion(connexion);
        return {
            message: 'Utilisateur connecté',
            error: null,
        };
    }

    public logout(): void {
        this.authRepository.removeConnection();
    }

    public async register(createUserDto: CreateUserDto): Promise<Response> {
        const exist = this.userRepository.getUserByEmail(createUserDto.email);
        if (exist) {
            return {
                message: null,
                error: 'Email déja utilisé',
            };
        }
        const hash = await bcrypt.hash(createUserDto.password, this.SALT);
        createUserDto.password = hash;
        this.userRepository.addUser(createUserDto);
        return {
            message: 'Utilisateur enregistré',
            error: null,
        };
    }
}
