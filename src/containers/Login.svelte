<script lang="ts">
    import AuthController from '../controllers/auth.controller';
    import { push } from 'svelte-spa-router';

    let email = $state('');
    let password = $state('');
    let errorMessage = $state('');

    async function onsubmit(e: SubmitEvent): Promise<void> {
        e.preventDefault();
        const authController = new AuthController();
        const response = await authController.login({ email: email, password: password });
        if (!response.success) {
            errorMessage = response.error.message;
        } else {
            if (response.data.admin === true) {
                push('#/dashboard');
            } else {
                push('#/salle');
            }
        }
    }
</script>

<h1>Connexion</h1>
<p class="errorMessage">{errorMessage}</p>
<form {onsubmit}>
    <label for="email">Email</label>
    <input type="email" name="email" id="email" bind:value={email} />

    <label for="password">Mot de passe</label>
    <input type="password" name="password" id="password" bind:value={password} />

    <button type="submit">Se connecter</button>
</form>

<style>
    @import '../style/form.css';
</style>
