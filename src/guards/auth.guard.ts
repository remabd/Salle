import AuthController from '../controllers/auth.controller';

export default class AuthGuard {
    private authController: AuthController;

    constructor() {
        this.authController = new AuthController();
    }

    isConnected(): boolean {
        const connexion = this.authController.getConnexion();
        if (connexion.data) {
            return true;
        }
        return false;
    }

    isAdmin(): boolean {
        const connexion = this.authController.getConnexion();
        if (connexion?.data?.admin) {
            return true;
        }
        return false;
    }
}
