<script lang="ts">
    import { onMount } from 'svelte';
    import AuthController from '../controllers/auth.controller';
    import { push } from 'svelte-spa-router';

    let isConnected = $state(false);
    let isAdmin = $state(false);

    onMount(() => {
        const authController = new AuthController();
        const connexion = authController.getConnexion();
        if (connexion.success) {
            isConnected = true;
            isAdmin = connexion.data?.admin ? true : false;
        }
    });

    function disconnect() {
        const authController = new AuthController();
        isConnected = false;
        isAdmin = false;
        authController.logout();
        push('#/');
    }
</script>

<header>
    <ul>
        {#if isConnected}
            {#if !isAdmin}
                <li><a href="#/salle">Resever</a></li>
            {:else}
                <li><a href="#/dashboard">Dashboard</a></li>
            {/if}
            <div>
                <a class="profile-btn" href="#/profile">Profil</a>
                <button onclick={disconnect}>Déconnexion</button>
            </div>
        {:else}
            <a href="#/">Connexion</a>
        {/if}
    </ul>
</header>
