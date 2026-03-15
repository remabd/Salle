<script lang="ts">
    import { onMount } from 'svelte';
    import SalleController from '../controllers/salle.controller';
    import type { Salle } from '../models/salle.entity';
    import ManageSalles from '../components/ManageSalles.svelte';

    const salleController = new SalleController();

    let sallesDispos: Salle[] = [];

    function loadSalles() {
        const response = salleController.find();
        if (response.success && response.data) {
            sallesDispos = response.data;
        }
    }

    onMount(() => {
        loadSalles();
    });
</script>

<h1>Dashboard</h1>

<ManageSalles on:update={loadSalles} />
