import type { CreateUserDto } from '../models/user.entity';

export default class ValidationGuard {
    validateUserDto(userDto: CreateUserDto): boolean {
        if (
            !userDto.firstName ||
            !userDto.lastName ||
            !userDto.email ||
            !userDto.password ||
            !userDto.admin
        ) {
            return false;
        }
        return true;
    }
}
