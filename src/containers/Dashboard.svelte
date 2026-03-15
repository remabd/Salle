<script lang="ts">
    const today = new Date().toISOString().split('T')[0];
    let selectedDate = today;

    let sallesDispos = [
        { id: 1, name: 'Salle classique', places: 30 },
        { id: 2, name: 'Salle info', places: 25 },
        { id: 3, name: 'Amphi', places: 150 }
    ];

    function handleDateChange() {
        console.log("Selected date:", selectedDate);
    }
</script>

<h1>Dashboard</h1>

<div class="dashboard-contenu">
    <div class="calendar">
        <h2>Date</h2>
        <input 
            type="date" 
            bind:value={selectedDate} 
            on:change={handleDateChange} 
        />
    </div>

    <div class="salles-container">
        <h2>Salles disponibles</h2>
        {#if sallesDispos.length > 0}
            <ul>
                {#each sallesDispos as salle}
                    <li>
                        <span><strong>{salle.name}</strong> (Nombres de places : {salle.places})</span>
                        <button>Réserver la salle</button>
                    </li>
                {/each}
            </ul>
        {:else}
            <p>No classrooms available for this date.</p>
        {/if}
    </div>
</div>
