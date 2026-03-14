<script lang="ts">
    import { onMount } from 'svelte';
    import type { Salle, SalleWithReservations } from '../models/salle.entity';
    import SalleController from '../controllers/salle.controller';
    import ReservationController from '../controllers/reservation.controller';

    const salleController = new SalleController();
    const reservationController = new ReservationController();

    let salles = $state<SalleWithReservations[]>([]);

    let capacity = $state(0);
    let computers = $state(0);
    let teacherComputer = $state<boolean | null>(null);
    let airCool = $state<boolean | null>(null);

    let displayed = $derived(
        salles.filter(
            (salle: Salle) =>
                salle.capacity >= capacity &&
                salle.computers >= computers &&
                (teacherComputer === null || salle.teacherComputer === teacherComputer) &&
                (airCool === null || salle.aircool === airCool)
        )
    );

    onMount(() => {
        let _salles: Salle[] = [];
        const res = salleController.find();
        if (res.success) {
            _salles = res.data;
        }
        _salles.forEach((s: Salle) => {
            const _res = reservationController.findBySalleId(s.id);
            if (_res.success) {
                salles.push({
                    ...s,
                    reservations: _res.data,
                });
            }
        });
    });
</script>

<h1>Réserver une salle</h1>

<section>
    <h2>Filtres</h2>
    <div>
        <label for="capacity">Capacité</label>
        <input type="number" id="capacity" bind:value={capacity} />

        <label for="computers">Nombre d'ordinateurs</label>
        <input type="number" id="computers" bind:value={computers} />

        <fieldset>
            <legend>Ordinateur professeur</legend>
            {#each [true, false, null] as option}
                <label>
                    <input
                        type="radio"
                        name="teacherComputer"
                        value={option}
                        bind:group={teacherComputer}
                    />
                    {option === null ? 'Peu importe' : option ? 'Oui' : 'Non'}
                </label>
            {/each}
        </fieldset>

        <fieldset>
            <legend>Climatisation</legend>
            {#each [true, false, null] as option}
                <label>
                    <input type="radio" name="airCool" value={option} bind:group={airCool} />
                    {option === null ? 'Peu importe' : option ? 'Oui' : 'Non'}
                </label>
            {/each}
        </fieldset>
    </div>
</section>

<section>
    <h2>Salles ({displayed.length})</h2>
    {#each displayed as s}
        <p>{s.name}</p>
    {/each}
</section>
