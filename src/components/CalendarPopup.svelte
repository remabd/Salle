<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();

    export let show = false;
    export let selectedDate = '';

    const today = new Date().toISOString().split('T')[0];
    
    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();

    $: daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    $: firstDay = new Date(currentYear, currentMonth, 1).getDay();
    $: blanks = Array(firstDay === 0 ? 6 : firstDay - 1).fill(0);
    $: days = Array.from({length: daysInMonth}, (_, i) => i + 1);
    
    const monthNames = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];

    function close() {
        dispatch('close');
    }

    function selectDate(day: number) {
        const yyyy = currentYear;
        const mm = String(currentMonth + 1).padStart(2, '0');
        const dd = String(day).padStart(2, '0');
        selectedDate = `${yyyy}-${mm}-${dd}`;
        dispatch('select', selectedDate);
        close();
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

<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
{#if show}
    <div class="modal-backdrop" on:click={close}>
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
            
            <button class="close-btn" on:click={close}>Fermer</button>
        </div>
    </div>
{/if}