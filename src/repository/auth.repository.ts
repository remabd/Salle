import type { UserHead } from '../models/user.entity';

export default class AuthRepository {
    private CONNEXION_KEY = 'connexion';

    private connexion: UserHead | null;

    constructor() {
        const connexionData = sessionStorage.getItem(this.CONNEXION_KEY);
        this.connexion = connexionData ? JSON.parse(connexionData) : null;
    }

    addConnexion(userhead: UserHead): void {
        this.connexion = userhead;
        this.synchronize();
    }

    removeConnection(): void {
        this.connexion = null;
        this.synchronize();
    }

    synchronize(): void {
        if (!this.connexion) {
            sessionStorage.removeItem(this.CONNEXION_KEY);
        }
        sessionStorage.setItem(this.CONNEXION_KEY, JSON.stringify(this.connexion));
    }
}
