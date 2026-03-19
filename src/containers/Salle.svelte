<script lang="ts">
    import { onMount } from 'svelte';
    import SalleController from '../controllers/salle.controller';
    import type { Salle } from '../models/salle.entity';
    import ManageSalles from '../components/ManageSalles.svelte';
    import CalendarPopup from '../components/CalendarPopup.svelte';
    import ReservationPopup from '../components/ReservationPopup.svelte';
    import ReservationController from '../controllers/reservation.controller';
    import AuthController from '../controllers/auth.controller';

    const salleController = new SalleController();
    const reservationController = new ReservationController();
    const authController = new AuthController();
    
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

    const today = new Date().toISOString().split('T')[0];
    let selectedDate = today;
    
    let showCalendarPopup = false;
    let showSallePopup = false;

    // filtres des salles
    let filterCapacity = 0;
    let filterType = 'tous';
    let filterAircool = false;
    
    $: sallesFiltrees = sallesDispos.filter(salle => {
        const correspondPlaces = salle.capacity >= filterCapacity;
        
        let salleType = 'classique';
        if (salle.capacity >= 100) salleType = 'amphi';
        else if (salle.computers > 0) salleType = 'informatique';
        
        const correspondType = filterType === 'tous' || salleType === filterType;
        const correspondClim = !filterAircool || salle.aircool === filterAircool;
        return correspondPlaces && correspondType && correspondClim;
    });

    function handleDateChange(event: CustomEvent<string>) {
        selectedDate = event.detail;
        console.log("Selected date:", selectedDate);
    }

    function handleReservationConfirm(event: CustomEvent<{salle: Salle, date: string, creneau: string}>) {
        const session = authController.getConnexion();
        if(session.success && session.data) {
            reservationController.save({
                userId: session.data.id,
                salleId: event.detail.salle.id,
                salleName: event.detail.salle.name,
                date: event.detail.date,
                creneau: event.detail.creneau
            });
            alert("Reservation Confirmée");
        } else {
            alert("Veuillez vous connecter");
        }
    }

    function openCalendar() {
        showCalendarPopup = true;
    }

    let selectedSalle: Salle | null = null;

    function openSalleReservation(salle: Salle) {
        selectedSalle = salle;
        showSallePopup = true;
    }
</script>

<h1>Salles</h1>

<div class="filters-bar">
    <div class="filter-group">
        <label for="filter-places">Places minimum :</label>
        <input id="filter-places" type="number" min="0" max="250" step="5" bind:value={filterCapacity} />
    </div>

    <div class="filter-group">
        <label for="filter-type">Type de salle</label>
        <select id="filter-type" bind:value={filterType}>
            <option value="tous">Tous les types</option>
            <option value="classique">Classique</option>
            <option value="informatique">Informatique</option>
            <option value="amphi">Amphi</option>
        </select>
    </div>

    <div class="filter-group">
        <span>Climatisation</span>
        <label for="filter-clim">
            <input id="filter-clim" type="checkbox" bind:checked={filterAircool} />
        </label>
    </div>
</div>

<div class="dashboard-contenu">
    <div class="calendar">
        <h2>Date</h2>
        <span>{selectedDate}</span>
        <button 
            type="button" 
            on:click={openCalendar} 
            title="Choisir une date">Choisir la date
        </button>
    </div>

    <CalendarPopup 
        bind:show={showCalendarPopup}
        bind:selectedDate={selectedDate}
        on:close={() => showCalendarPopup = false}
        on:select={handleDateChange}
    />

    <div class="salles-container">
        <h2>Salles disponibles</h2>
        {#if sallesFiltrees.length > 0}
            <ul>
                {#each sallesFiltrees as salle}
                    <li>
                        <span>
                            <strong>{salle.name}</strong>
                            ({salle.capacity} places)
                            <span id="tag">{salle.capacity >= 100 ? "Amphi" : (salle.computers > 0 ? "Informatique" : "Classique")}</span>
                            {#if salle.aircool}
                                <span id="tag">Clim</span>
                            {/if}
                        </span>
                        <button
                            type="button"
                            on:click={() => openSalleReservation(salle)}
                            title="Réserver la salle"
                        >Réserver la salle</button>
                    </li>
                {/each}
            </ul>
        {:else}
            <p>Aucune salle correspondante aux critères de recherche n'est disponible.</p>
        {/if}
    </div>
</div>

<ReservationPopup 
    bind:show={showSallePopup}
    salle={selectedSalle}
    selectedDate={selectedDate}
    on:close={() => { showSallePopup = false; selectedSalle = null; }}
    on:confirm={handleReservationConfirm}
/>

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

    .filter-group input, .filter-group select {
        padding: 8px;
        border: 1px solid #ccc;
        border-radius: 4px;
    }

    .filter-group input[type="checkbox"] {
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
