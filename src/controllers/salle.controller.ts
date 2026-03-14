import { Status } from '../models/response.entity';
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
            status: Status.OK,
            message: null,
            data: salles,
        };
    }

    findOneById(id: string): Response<Salle> {
        const salle = this.salleRepository.findOneById(id);
        if (!salle) {
            return {
                status: Status.NOT_FOUND,
                message: 'Salle manquante',
                data: null,
            };
        }
        return {
            status: Status.OK,
            message: null,
            data: salle,
        };
    }

    findOneByName(name: string): Response<Salle> {
        const salle = this.salleRepository.findOneByName(name);
        if (!salle) {
            return {
                status: Status.NOT_FOUND,
                message: 'Salle manquante',
                data: null,
            };
        }
        return {
            status: Status.OK,
            message: null,
            data: salle,
        };
    }

    save(createSalleDto: CreateSalleDto): Response {
        const exist = this.salleRepository.findOneByName(createSalleDto.name);
        if (exist) {
            return {
                status: Status.UNAUTHORIZED,
                message: 'Une salle existe déja à ce nom',
                data: null,
            };
        }
        const salle: Salle = { ...createSalleDto, id: uuid() };
        this.salleRepository.save(salle);
        return {
            status: Status.OK,
            message: 'created',
            data: null,
        };
    }

    remove(id: string): Response {
        const exist = this.salleRepository.findOneById(id);
        if (!exist) {
            return {
                status: Status.NOT_FOUND,
                message: null,
                data: null,
            };
        }
        this.salleRepository.remove(id);
        return {
            status: Status.OK,
            message: null,
            data: null,
        };
    }

    update(id: string, updateSalleDto: UpdateSalleDto): Response {
        const exist = this.salleRepository.findOneById(id);
        if (!exist) {
            return {
                status: Status.NOT_FOUND,
                message: null,
                data: null,
            };
        }
        this.salleRepository.update({ ...updateSalleDto, id: id });
        return {
            status: Status.OK,
            message: null,
            data: null,
        };
    }
}
