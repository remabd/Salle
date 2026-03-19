export interface Reservation {
    id: string;
    salleId: string;
    userId: string;
    date: string;
}

export type ReservationDto = Omit<Reservation, 'id'>;
