<script lang="ts">
    import ManageSalles from '../components/ManageSalles.svelte';

    let visibility = $state<'user' | 'salle' | 'reservation' | 'en cours'>('salle');

    // function loadSalles() {
    //     const response = salleController.find();
    //     if (response.success && response.data) {
    //         sallesDispos = response.data;
    //     }
    // }
    //
    // onMount(() => {
    //     loadSalles();
    // });
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
{:else if visibility === 'user'}{:else}
    <p>Rien à afficher</p>
{/if}
