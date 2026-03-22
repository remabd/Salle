import type { ReservationDto, Reservation } from '../models/reservation.entity';
import ReservationRepository from '../repository/reservation.repository';
import type { Response } from '../models/response.entity';
import { v4 as uuid } from 'uuid';
import { DateUtils } from '../utils/date.utils';

export default class ReservationController {
    private reservationRepository: ReservationRepository;
    private dateUtils: DateUtils;

    constructor() {
        this.reservationRepository = new ReservationRepository();
        this.dateUtils = new DateUtils();
    }

    find(): Response<Reservation[]> {
        const reservations = this.reservationRepository.find();
        return {
            success: true,
            data: reservations,
        };
    }

    findCurrent(): Response<Reservation[]> {
        const reservations = this.reservationRepository.find();
        const today = new Date();
        const todayAsString = this.dateUtils.stringifyDate(today);
        const result = reservations.filter(
            (r: Reservation) => r.date.slice(0, r.date.lastIndexOf('-')) === todayAsString
        );
        return {
            success: true,
            data: result,
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

    save(reservationDto: ReservationDto): Response {
        const reservation: Reservation = { ...reservationDto, id: uuid() };
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

    update(id: string, reservationDto: ReservationDto): Response {
        const exist = this.reservationRepository.findOneById(id);
        if (!exist) {
            return {
                success: false,
                error: { message: 'Reservation introuvable' },
            };
        }
        this.reservationRepository.update({ ...reservationDto, id: id });
        return {
            success: true,
            data: null,
        };
    }
}
