import type { ReservationDto } from '../models/reservation.entity';
import type { UserDto } from '../models/user.entity';

export default class ValidationGuard {
    validateUserDto(userDto: UserDto): boolean {
        if (
            !userDto.firstName ||
            !userDto.lastName ||
            !userDto.email ||
            !userDto.password ||
            userDto.admin === null
        ) {
            return false;
        }
        return true;
    }

    validateReservationDto(reservationDto: ReservationDto): boolean {
        const arr = reservationDto.date.split('-');
        const date = new Date(Number(arr[2]), Number(arr[1]) - 1, Number(arr[0]));
        console.log('date:', date, date < new Date());
        if (date < new Date() || !reservationDto.salleId || !reservationDto.userId) {
            return false;
        }
        return true;
    }
}
