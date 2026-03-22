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
    let disabled = $state([]);

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
    });

    function reserver(s: SalleWithReservations) {
        const resAuth = authController.getConnexion();
        let userId = '';
        if (resAuth.success) {
            userId = resAuth.data.id;
        }
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

<main>
    <aside>
        <h2>Date</h2>
        <fieldset>
            <DatePicker showSalleMessage={true} bind:selected={selectedDate} bind:disabled />
        </fieldset>
    </aside>

    <section>
        <div>
            <h2>Filtres</h2>
            <div class="filtres-container">
                <label for="capacity">Capacité</label>
                <input type="number" id="capacity" bind:value={capacity} />

                <label for="computers">Nombre d'ordinateurs</label>
                <input type="number" id="computers" bind:value={computers} />

                <label for="teacherComputer">PC Prof</label>
                <input type="checkbox" name="teacherComputer" bind:checked={teacherComputer} />

                <label for="airCool">Climatisation</label>
                <input type="checkbox" name="airCool" bind:checked={airCool} />
            </div>
        </div>

        <div class="salles-container">
            <h3>Salles disponibles</h3>
            {#if displayed.length > 0}
                <ul>
                    {#each displayed as salle}
                        <li>
                            <span>
                                <strong>{salle.name}</strong>
                                ({salle.capacity} places)
                                <span id="tag">
                                    {salle.capacity >= 100
                                        ? 'Amphi'
                                        : salle.computers > 0
                                          ? 'Informatique'
                                          : 'Classique'}
                                </span>
                                {#if salle.teacherComputer}
                                    <span id="tag">PC Prof</span>
                                {/if}
                                {#if salle.computers > 0}
                                    <span id="tag">{salle.computers} postes</span>
                                {/if}
                                {#if salle.aircool}
                                    <span id="tag">Clim</span>
                                {/if}
                            </span>
                            <button
                                class="btn-add"
                                type="button"
                                onclick={() => reserver(salle)}
                                title="Réserver la salle">Réserver la salle</button
                            >
                        </li>
                    {/each}
                </ul>
            {:else}
                <p>Aucune salle correspondante aux critères de recherche n'est disponible.</p>
            {/if}
        </div>
    </section>
</main>

<style>
    main {
        display: flex;
        gap: 16px;
    }

    aside {
        min-width: 30vw;
    }

    section {
        display: flex;
        flex-direction: column;
        flex: auto;
        gap: 8px;
    }

    .filtres-container {
        background-color: var(--slatedark);
        padding: 24px;
        border-radius: var(--borderRadius);
        display: flex;
        align-items: center;
        gap: 8px;

        input {
            max-width: 64px;
            height: 32px;
        }
    }

    .salles-container {
        padding: 24px;
        height: max-content;
        background-color: var(--slatedark);
        border-radius: var(--borderRadius);

        h3 {
            color: white;
        }
    }

    .salles-container li {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 20px;
    }

    #tag {
        padding: 4px 8px;
        font-size: 12px;
        border-radius: 32px;
        background-color: var(--softwhite);
        color: var(--slatedark);
    }

    @media screen and (max-width: 769px) {
        main {
            display: grid;
        }
    }
</style>
