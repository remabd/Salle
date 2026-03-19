import AuthController from '../controllers/auth.controller';

export default class AuthGuard {
    isConnected(): boolean {
        const authController = new AuthController();
        const connexion = authController.getConnexion();
        if (connexion.success) {
            return true;
        }
        return false;
    }

    isAdmin(): boolean {
        const authController = new AuthController();
        const connexion = authController.getConnexion();
        if (connexion.success && connexion.data.admin) {
            return true;
        }
        return false;
    }
}
