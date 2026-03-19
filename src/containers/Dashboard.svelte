<script lang="ts">
    import ManageReservations from '../components/ManageReservations.svelte';
    import ManageSalles from '../components/ManageSalles.svelte';
    import ManageUsers from '../components/ManageUsers.svelte';

    let visibility = $state<'user' | 'salle' | 'reservation' | 'en cours'>('salle');
</script>

<h1>Dashboard</h1>

<fieldset>
    <button onclick={() => (visibility = 'user')}>Utilisateurs</button>
    <button onclick={() => (visibility = 'salle')}>Salles</button>
    <button onclick={() => (visibility = 'reservation')}>Réservations</button>
    <button onclick={() => (visibility = 'en cours')}>En cours</button>
</fieldset>

{#if visibility === 'salle'}
    <ManageSalles />
{:else if visibility === 'user'}
    <ManageUsers />
{:else if visibility === 'reservation'}
    <ManageReservations />
{:else}
    <p>Rien à afficher</p>
{/if}
