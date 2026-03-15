import type { Salle } from '../models/salle.entity';

export default class SalleRepository {
    private SALLE_KEY = 'salles';
    private salles: Salle[];

    constructor() {
        const sallesData = localStorage.getItem(this.SALLE_KEY);
        this.salles = sallesData ? JSON.parse(sallesData) : [];
    }

    find(): Salle[] {
        return this.salles;
    }

    findOneById(id: string): Salle | null {
        const salle = this.salles.find((salle: Salle) => salle.id === id);
        return salle ? salle : null;
    }

    findOneByName(name: string): Salle | null {
        const salle = this.salles.find((salle: Salle) => salle.name === name);
        return salle ? salle : null;
    }

    save(salle: Salle): void {
        this.salles.push(salle);
        this.synchronize();
    }

    remove(id: string): void {
        const index = this.salles.findIndex((salle: Salle) => salle.id === id);
        this.salles.splice(index, 1);
        this.synchronize();
    }

    update(salle: Salle): void {
        const index = this.salles.findIndex((salle_: Salle) => salle_.id === salle.id);
        this.salles.splice(index, 1, salle);
        this.synchronize();
    }

    synchronize(): void {
        localStorage.setItem(this.SALLE_KEY, JSON.stringify(this.salles));
    }
}
