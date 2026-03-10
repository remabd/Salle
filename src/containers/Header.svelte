<script lang="ts">
    import { onMount } from 'svelte';
    import AuthController from '../controllers/auth.controller';

    let isConnected = $state(false);
    let isAdmin = $state(false);

    onMount(() => {
        const authController = new AuthController();
        const connexion = authController.getConnexion();
        if (connexion) {
            isConnected = true;
            connexion.data?.admin ? true : false;
        }
    });

    function disconnect() {
        const authController = new AuthController();
        authController.logout();
    }
</script>

<header>
    <ul>
        <li><a href="#/">Accueil</a></li>

        {#if isConnected}
            {#if !isAdmin}
                <li><a href="#/salle">Resever</a></li>
            {:else}
                <li><a href="#/dashboard">Dashboard</a></li>
            {/if}
            <a href="#/profile">Profil</a>
            <button onclick={disconnect}>Déconnection</button>
        {:else}
            <a href="#/">Connection</a>
        {/if}
    </ul>
</header>
