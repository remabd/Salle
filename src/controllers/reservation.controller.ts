import type {
    CreateReservationDto,
    Reservation,
    UpdateReservationDto,
} from '../models/reservation.entity';
import ReservationRepository from '../repository/reservation.repository';
import type { Response } from '../models/response.entity';
import { v4 as uuid } from 'uuid';

export default class ReservationController {
    private reservationRepository: ReservationRepository;

    constructor() {
        this.reservationRepository = new ReservationRepository();
    }

    find(): Response<Reservation[]> {
        const reservations = this.reservationRepository.find();
        return {
            success: true,
            data: reservations,
        };
    }

    findBySalleId(id: string): Response<Reservation[]> {
        const reservations = this.reservationRepository.findBySalleId(id);
        return {
            success: true,
            data: reservations,
        };
    }

    findByUserId(id: string): Response<Reservation[]> {
        const reservations = this.reservationRepository.findByUserId(id);
        return {
            success: true,
            data: reservations,
        };
    }

    findOneById(id: string): Response<Reservation> {
        const reservation = this.reservationRepository.findOneById(id);
        if (!reservation) {
            return {
                success: false,
                error: { message: 'Reservation introuvable' },
            };
        }
        return {
            success: true,
            data: reservation,
        };
    }

    save(createReservationDto: CreateReservationDto): Response {
        const reservation: Reservation = { ...createReservationDto, id: uuid() };
        this.reservationRepository.save(reservation);
        return {
            success: true,
            data: null,
        };
    }

    remove(id: string): Response {
        const exist = this.reservationRepository.findOneById(id);
        if (!exist) {
            return {
                success: false,
                error: { message: 'Reservation introuvable' },
            };
        }
        this.reservationRepository.remove(id);
        return {
            success: true,
            data: null,
        };
    }

    update(id: string, updateReservationDto: UpdateReservationDto): Response {
        const exist = this.reservationRepository.findOneById(id);
        if (!exist) {
            return {
                success: false,
                error: { message: 'Reservation introuvable' },
            };
        }
        this.reservationRepository.update({ ...updateReservationDto, id: id });
        return {
            success: true,
            data: null,
        };
    }
}
