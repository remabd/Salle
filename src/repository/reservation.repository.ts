import type { Reservation } from '../models/reservation.entity';

export default class ReservationRepository {
    private RESERVATION_KEY = 'reservations';
    private reservations: Reservation[];

    constructor() {
        const reservationsData = localStorage.getItem(this.RESERVATION_KEY);
        this.reservations = reservationsData ? JSON.parse(reservationsData) : [];
    }

    find(): Reservation[] {
        return this.reservations;
    }

    findOneById(id: string): Reservation | null {
        const reservation = this.reservations.find(
            (reservation: Reservation) => reservation.id === id
        );
        return reservation ? reservation : null;
    }

    findBySalleId(salleId: string): Reservation[] {
        return this.reservations.filter(
            (reservation: Reservation) => reservation.salleId === salleId
        );
    }

    findByUserId(userId: string): Reservation[] {
        return this.reservations.filter(
            (reservation: Reservation) => reservation.userId === userId
        );
    }

    save(reservation: Reservation): void {
        this.reservations.push(reservation);
        this.synchronize();
    }

    remove(id: string): void {
        const index = this.reservations.findIndex(
            (reservation: Reservation) => reservation.id === id
        );
        this.reservations.splice(index, 1);
        this.synchronize();
    }

    update(reservation: Reservation): void {
        const index = this.reservations.findIndex(
            (reservation_: Reservation) => reservation_.id === reservation.id
        );
        this.reservations.splice(index, 1, reservation);
        this.synchronize();
    }

    synchronize(): void {
        localStorage.setItem(this.RESERVATION_KEY, JSON.stringify(this.reservations));
    }
}
