<script lang="ts">
    import { onMount } from 'svelte';
    import AuthController from '../controllers/auth.controller';
    import { push } from 'svelte-spa-router';
    import { authStore } from '../stores/auth.store';

    let isConnected = $state(false);
    let isAdmin = $state(false);

    onMount(() => {
        const authController = new AuthController();
        const connexion = authController.getConnexion();
        if (connexion.success) {
            authStore.set({ isConnected: true, isAdmin: connexion.data?.admin ?? false });
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
        {#if $authStore.isConnected}
            {#if !$authStore.isAdmin}
                <li><a class="profile-btn" href="#/salle">Réserver une salle</a></li>
            {:else}
                <li><a class="profile-btn" href="#/dashboard">Tableau de bord</a></li>
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

<style>
    header {
        width: 100%;
    }

    ul {
        width: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        list-style: none;
    }

    button,
    .profile-btn {
        border-radius: 8px;
        border: 1px solid transparent;
        padding: 0.6em 1.2em;
        font-size: 1em;
        font-weight: 500;
        font-family: inherit;
        background-color: var(--slatedark);
        cursor: pointer;
        transition: border-color 0.25s;
    }

    button:hover,
    .profile-btn:hover {
        opacity: 0.75;
        transition: all 0.2s ease;
    }
</style>
