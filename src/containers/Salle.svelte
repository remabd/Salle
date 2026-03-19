<script lang="ts">
    import { onMount } from 'svelte';
    import type { Salle, SalleWithReservations } from '../models/salle.entity';
    import type { Reservation } from '../models/reservation.entity';

    import SalleController from '../controllers/salle.controller';
    import ReservationController from '../controllers/reservation.controller';

    import DatePicker from '../components/DatePicker.svelte';
    import AuthController from '../controllers/auth.controller';

    const salleController = new SalleController();
    const reservationController = new ReservationController();
    const authController = new AuthController();

    let salles = $state<SalleWithReservations[]>([]);

    let capacity = $state(0);
    let computers = $state(0);
    let teacherComputer = $state<boolean>(false);
    let airCool = $state<boolean>(false);
    let selectedDate = $state<string | null>();
    let disabled = $state<string[]>([]);
    let userId = $state<string>('');

    let displayed = $derived(
        salles.filter(
            (salle: SalleWithReservations) =>
                salle.capacity >= capacity &&
                salle.computers >= computers &&
                (!teacherComputer || (teacherComputer && salle.teacherComputer)) &&
                (!airCool || (airCool && salle.aircool)) &&
                !salle.reservations.some((r: Reservation) => r.date === selectedDate)
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
        const connexionResponse = authController.getConnexion();
        if (connexionResponse.success) {
            userId = connexionResponse.data.id;
        }
        const res_ = reservationController.findByUserId(userId);
        if (res_.success) {
            res_.data.forEach((r: Reservation) => {
                disabled.push(r.date);
            });
        }
    });

    function reserver(s: SalleWithReservations) {
        if (selectedDate && userId) {
            reservationController.save({
                date: selectedDate,
                userId: userId,
                salleId: s.id,
            });
        }
    }
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
            {#each [true, false] as option}
                <label>
                    <input
                        type="radio"
                        name="teacherComputer"
                        value={option}
                        bind:group={teacherComputer}
                    />
                    {option ? 'Oui' : 'Non'}
                </label>
            {/each}
        </fieldset>

        <fieldset>
            <legend>Climatisation</legend>
            {#each [true, false] as option}
                <label>
                    <input type="radio" name="airCool" value={option} bind:group={airCool} />
                    {option ? 'Oui' : 'Non'}
                </label>
            {/each}
        </fieldset>

        <fieldset>
            <legend>Date</legend>
            <DatePicker bind:selected={selectedDate} bind:disabled />
        </fieldset>
    </div>
</section>

<div class="salles-container">
    <h2>Salles disponibles</h2>
    {#if displayed.length > 0}
        <ul>
            {#each displayed as salle}
                <li>
                    <span>
                        <strong>{salle.name}</strong>
                        ({salle.capacity} places)
                        <span id="tag"
                            >{salle.capacity >= 100
                                ? 'Amphi'
                                : salle.computers > 0
                                  ? 'Informatique'
                                  : 'Classique'}</span
                        >
                        {#if salle.aircool}
                            <span id="tag">Clim</span>
                        {/if}
                    </span>
                    <button type="button" onclick={() => reserver(salle)} title="Réserver la salle"
                        >Réserver la salle</button
                    >
                </li>
            {/each}
        </ul>
    {:else}
        <p>Aucune salle correspondante aux critères de recherche n'est disponible.</p>
    {/if}
</div>

<style>
    .dashboard-contenu {
        display: flex;
        gap: 16px;
        margin: 20px 0;
    }

    .dashboard-contenu button {
        background-color: var(--softwhite);
        color: var(--slatedark);
    }

    .calendar {
        padding: 24px;
        background-color: var(--slatedark);
        border-radius: var(--borderRadius);
    }

    .salles-container {
        width: 100%;
        padding: 40px;
        background-color: var(--slatedark);
        border-radius: var(--borderRadius);
    }

    .salles-container li {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 20px;
    }

    .filters-bar {
        background: var(--slatedark);
        padding: 15px;
        border-radius: var(--borderRadius);
        display: flex;
        gap: 20px;
        margin-bottom: 20px;
        align-items: center;
        flex-wrap: wrap;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }

    .filter-group {
        display: flex;
        align-items: center;
        gap: 8px;
        font-weight: 500;
        font-size: 0.95rem;
    }

    .filter-group input,
    .filter-group select {
        padding: 8px;
        border: 1px solid #ccc;
        border-radius: 4px;
    }

    .filter-group input[type='checkbox'] {
        width: 20px;
        height: 20px;
        vertical-align: middle;
    }

    #tag {
        padding: 4px 8px;
        font-size: 12px;
        border-radius: 32px;
        background-color: var(--softwhite);
        color: var(--slatedark);
    }
</style>
