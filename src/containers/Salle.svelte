<script lang="ts">
    import { onMount } from 'svelte';
    import type { Salle } from '../models/salle.entity';
    import SalleController from '../controllers/salle.controller';
    const salleController = new SalleController();
    let salles = $state<Salle[]>([]);
    let displayed = $state<Salle[]>([]);

    let capacity = $state(0);
    let computers = $state(0);
    let teacherComputer = $state(false);
    let airCool = $state(false);
    // let filters = $derived({
    //     capacity: capacity,
    //     computers: computers,
    //     teacherComputer: teacherComputer,
    //     airCool: airCool,
    // });

    onMount(() => {
        const res = salleController.find();
        if (res.success) {
            salles = res.data;
        }
    });

    function onsubmit(e: SubmitEvent) {
        e.preventDefault();
        refreshFilters();
    }

    function refreshFilters() {
        salles.forEach((salle: Salle) => {
            if (
                salle.capacity < capacity ||
                salle.computers < computers ||
                (teacherComputer && !salle.teacherComputer) ||
                (airCool && !salle.aircool)
            ) {
            } else {
                displayed.push(salle);
            }
        });
    }
</script>

<h1>Réserver une salle</h1>

<section>
    <h2>Filtres</h2>
    <form {onsubmit}>
        <label for="capacity">Capacité</label>
        <input type="number" value={capacity} name="capacity" />

        <label for="computers">Nombre d'ordinateurs</label>
        <input type="number" value={computers} name="computers" />

        {#each [true, false] as boolean}
            <label>
                <input type="radio" name="teacherComputer" value={teacherComputer} />
                {boolean}
            </label>
        {/each}

        {#each [true, false] as boolean}
            <label>
                <input type="radio" name="airCool" value={airCool} />
                {boolean}
            </label>
        {/each}

        <input type="submit" value="Valider" />
    </form>
</section>

<section>
    <h2>Salles</h2>
    {#each displayed as s}
        <p>{s.name}</p>
    {/each}
</section>
