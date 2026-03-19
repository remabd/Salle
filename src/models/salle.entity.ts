import type { Reservation } from './reservation.entity';

export interface Salle {
    id: string;
    name: string;
    capacity: number;
    computers: number;
    teacherComputer: boolean;
    aircool: boolean;
}

export type SalleWithReservations = Salle & { reservations: Reservation[] };

export type SalleDto = Omit<Salle, 'id'>;
