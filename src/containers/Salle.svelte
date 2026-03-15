<script lang="ts">
    const today = new Date().toISOString().split('T')[0];
    let selectedDate = today;
    
    let showCalendarPopup = false;
    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();

    $: daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    $: firstDay = new Date(currentYear, currentMonth, 1).getDay();
    $: blanks = Array(firstDay === 0 ? 6 : firstDay - 1).fill(0);
    $: days = Array.from({length: daysInMonth}, (_, i) => i + 1);
    
    const monthNames = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];

    let sallesDispos = [
        { id: 1, name: 'Salle classique 101', type: 'classique', clim: false, places: 30 },
        { id: 2, name: 'Salle classique 102', type: 'classique', clim: true, places: 35 },
        { id: 3, name: 'Salle info 202', type: 'informatique', clim: true, places: 25 },
        { id: 4, name: 'Amphi A', type: 'amphi', clim: true, places: 150 },
    ];

    // filtres des salles
    let filterPlaces = 0;
    let filterType = 'tous';
    let filterClim = false;
    
    $: sallesFiltrees = sallesDispos.filter(salle => {
        const correspondPlaces = salle.places >= filterPlaces;
        const correspondType = filterType === 'tous' || salle.type === filterType;
        const correspondClim = !filterClim || salle.clim === filterClim;
        return correspondPlaces && correspondType && correspondClim;
    });

    function handleDateChange() {
        console.log("Selected date:", selectedDate);
    }

    function openCalendar() {
        showCalendarPopup = true;
    }

    function closeCalendar() {
        showCalendarPopup = false;
    }

    function selectDate(day: number) {
        const yyyy = currentYear;
        const mm = String(currentMonth + 1).padStart(2, '0');
        const dd = String(day).padStart(2, '0');
        selectedDate = `${yyyy}-${mm}-${dd}`;
        showCalendarPopup = false;
        handleDateChange();
    }

    function prevMonth() {
        if (currentMonth === 0) {
            currentMonth = 11;
            currentYear--;
        } else {
            currentMonth--;
        }
    }

    function nextMonth() {
        if (currentMonth === 11) {
            currentMonth = 0;
            currentYear++;
        } else {
            currentMonth++;
        }
    }
</script>

<h1>Salles</h1>

<div class="filters-bar">
    <div class="filter-group">
        <label for="filter-places">Places minimum :</label>
        <input id="filter-places" type="number" min="0" max="250" step="5" bind:value={filterPlaces} />
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
            <input id="filter-clim" type="checkbox" bind:checked={filterClim} />
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

    {#if showCalendarPopup}
        <div class="modal-backdrop" on:click={closeCalendar}>
            <div class="calendar-modal" on:click|stopPropagation>
                <div class="calendar-header">
                    <button class="nav-btn" on:click={prevMonth}>&lt;</button>
                    <h3>{monthNames[currentMonth]} {currentYear}</h3>
                    <button class="nav-btn" on:click={nextMonth}>&gt;</button>
                </div>
                
                <div class="days-header">
                    <span>Lu</span><span>Ma</span><span>Me</span><span>Je</span><span>Ve</span><span>Sa</span><span>Di</span>
                </div>
                
                <div class="calendar-grid">
                    {#each Array(blanks.length) as _}
                        <div class="empty-day"></div>
                    {/each}
                    {#each days as day}
                        {@const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`}
                        <button 
                            class="day-btn" 
                            class:selected={dateStr === selectedDate} 
                            class:today={dateStr === today && dateStr !== selectedDate}
                            on:click={() => selectDate(day)}>{day}</button>
                    {/each}
                </div>
                
                <button class="close-btn" on:click={closeCalendar}>Fermer</button>
            </div>
        </div>
    {/if}

    <div class="salles-container">
        <h2>Salles disponibles</h2>
        {#if sallesFiltrees.length > 0}
            <ul>
                {#each sallesFiltrees as salle}
                    <li>
                        <span>
                            <strong>{salle.name}</strong> 
                            ({salle.places} places, Type: {salle.type}, Clim: {salle.clim ? 'Oui' : 'Non'})
                        </span>
                        <button>Réserver la salle</button>
                    </li>
                {/each}
            </ul>
        {:else}
            <p>Aucune salle correspondante aux critères de recherche n'est disponible.</p>
        {/if}
    </div>
</div>

<style>
    :root {
        --borderRadius: 8px;
        --slatedark: #1a1a1a;
        --softwhite: #f1f1f1;
    }

    h1 {
        margin-bottom: 20px;
    }

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

    .modal-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    }
    
    .calendar-modal {
        background: white;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        width: 320px;
        display: flex;
        flex-direction: column;
        gap: 15px;
    }
    
    .calendar-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    
    .calendar-header h3 {
        margin: 0;
        font-size: 1.2rem;
        color: #1a1a1a;
    }

    .days-header {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        text-align: center;
        font-weight: bold;
        color: #666;
        margin-bottom: 5px;
    }
    
    .calendar-grid {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: 5px;
    }
    
    .day-btn {
        background: none;
        border: 1px solid #eee;
        padding: 10px;
        border-radius: 4px;
        cursor: pointer;
        text-align: center;
    }
    
    .day-btn:hover {
        background: #007bff;
        color: white;
    }
    
    .day-btn.selected {
        background: #007bff;
        color: white;
        font-weight: bold;
    }
    
    .day-btn.today {
        background: #e0e0e0;
        font-weight: bold;
    }
    
    .empty-day {
        padding: 5px;
    }
    
    .nav-btn {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
    }
    
    .close-btn {
        margin-top: 10px;
        padding: 10px;
        background: #f4f4f4;
        border: 1px solid #ccc;
        cursor: pointer;
        border-radius: 4px;
    }
</style>
