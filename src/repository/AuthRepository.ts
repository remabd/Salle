import type { CreateUserDto, LoginDto, UserHead } from '../models/User';
import UserRepository from './UserRepository';
import * as bcrypt from 'bcrypt';

export default class AuthRepository {
    private CONNEXION_KEY = 'connexion';
    private SALT = 10;

    private userRepository: UserRepository;
    private connexion: UserHead | null;

    constructor() {
        this.userRepository = new UserRepository();
        const connexionData = sessionStorage.getItem(this.CONNEXION_KEY);
        this.connexion = connexionData ? JSON.parse(connexionData) : null;
    }

    public async login(loginDto: LoginDto): Promise<boolean> {
        const user = this.userRepository.getUserByEmail(loginDto.email);
        if (user) {
            const valid = await bcrypt.compare(loginDto.password, user.password);
            if (valid) {
                this.connexion = {
                    id: user.id,
                    email: user.email,
                    admin: user.admin,
                };
                this.synchronize();
                return true;
            } else {
                return false;
            }
        } else {
            console.log('error');
            return false;
        }
    }

    public async register(createUserDto: CreateUserDto): Promise<void> {
        const hash = await bcrypt.hash(createUserDto.password, this.SALT);
        createUserDto.password = hash;
        this.userRepository.addUser(createUserDto);
    }

    synchronize(): void {
        sessionStorage.setItem(this.CONNEXION_KEY, JSON.stringify(this.connexion));
    }
}
