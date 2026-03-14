export interface Reservation {
    id: string;
    salleId: string;
    userId: string;
    date: Date;
}

export type CreateReservationDto = Omit<Reservation, 'id'>;
export type UpdateReservationDto = CreateReservationDto;
