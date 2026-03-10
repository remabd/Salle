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

    public async login(loginDto: LoginDto): Promise<boolean> {
        const user = this.userRepository.getUserByEmail(loginDto.email);
        if (user) {
            const valid = await bcrypt.compare(loginDto.password, user.password);
            if (valid) {
                const connexion = {
                    id: user.id,
                    email: user.email,
                    admin: user.admin,
                };
                this.authRepository.addConnexion(connexion);
                return true;
            } else {
                return false;
            }
        } else {
            console.log('error');
            return false;
        }
    }

    public logout(): void {
        this.authRepository.removeConnection();
    }

    public async register(createUserDto: CreateUserDto): Promise<void> {
        const hash = await bcrypt.hash(createUserDto.password, this.SALT);
        createUserDto.password = hash;
        this.userRepository.addUser(createUserDto);
    }
}
