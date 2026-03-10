<script lang="ts">
    import AuthController from '../controllers/auth.controller';
    import { Status } from '../models/response.entity';

    let email = $state('');
    let password = $state('');
    let errorMessage = $state('');

    async function onSubmit(): Promise<void> {
        const authController = new AuthController();
        const response = await authController.login({ email: email, password: password });
        if (response.status !== Status.OK) {
            errorMessage = response.message ? response.message : 'Erreur interne';
        }
    }
</script>

<h1>Connexion</h1>
<p class="errorMessage">{errorMessage}</p>
<form onsubmit={onSubmit}>
    <label for="email">email</label>
    <input type="email" name="email" id="email" bind:value={email} />

    <label for="password">password</label>
    <input type="password" name="password" id="password" bind:value={password} />

    <input type="submit" name="Se connecter" />
</form>
