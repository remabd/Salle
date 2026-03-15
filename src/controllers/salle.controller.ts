import type { CreateSalleDto, Salle, UpdateSalleDto } from '../models/salle.entity';
import SalleRepository from '../repository/salle.repository';
import type { Response } from '../models/response.entity';
import { v4 as uuid } from 'uuid';

export default class SalleController {
    private salleRepository: SalleRepository;

    constructor() {
        this.salleRepository = new SalleRepository();
    }

    find(): Response<Salle[]> {
        const salles = this.salleRepository.find();
        return {
            success: true,
            data: salles,
        };
    }

    findOneById(id: string): Response<Salle> {
        const salle = this.salleRepository.findOneById(id);
        if (!salle) {
            return {
                success: false,
                error: { message: 'Salle introuvable' },
            };
        }
        return {
            success: true,
            data: salle,
        };
    }

    findOneByName(name: string): Response<Salle> {
        const salle = this.salleRepository.findOneByName(name);
        if (!salle) {
            return {
                success: false,
                error: { message: 'Salle introuvable' },
            };
        }
        return {
            success: true,
            data: salle,
        };
    }

    save(createSalleDto: CreateSalleDto): Response {
        const exist = this.salleRepository.findOneByName(createSalleDto.name);
        if (exist) {
            return {
                success: false,
                error: { message: 'Une salle existe déja à ce nom' },
            };
        }
        const salle: Salle = { ...createSalleDto, id: uuid() };
        this.salleRepository.save(salle);
        return {
            success: true,
            data: null,
        };
    }

    remove(id: string): Response {
        const exist = this.salleRepository.findOneById(id);
        if (!exist) {
            return {
                success: false,
                error: { message: 'Salle introuvable' },
            };
        }
        this.salleRepository.remove(id);
        return {
            success: true,
            data: null,
        };
    }

    update(id: string, updateSalleDto: UpdateSalleDto): Response {
        const exist = this.salleRepository.findOneById(id);
        if (!exist) {
            return {
                success: false,
                error: { message: 'Salle introuvable' },
            };
        }
        this.salleRepository.update({ ...updateSalleDto, id: id });
        return {
            success: true,
            data: null,
        };
    }
}
