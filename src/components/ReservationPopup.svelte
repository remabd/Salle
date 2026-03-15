<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import type { Salle } from '../models/salle.entity';

    const dispatch = createEventDispatcher();

    export let show = false;
    export let salle: Salle | null = null;
    export let selectedDate = '';

    let creneau = '';

    function close() {
        dispatch('close');
    }

    function confirm() {
        dispatch('confirm', { salle, date: selectedDate, creneau });
        close();
    }
</script>

<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
{#if show && salle}
    <div class="modal-backdrop" on:click={close}>
        <div class="calendar-modal" on:click|stopPropagation>
            <div class="calendar-header">
                <h3>{salle.name}</h3>
                <button class="nav-btn" on:click={close}>X</button>
            </div>
            
            <div class="salle-details">
                <p><strong>Type :</strong> {salle.capacity >= 100 ? "Amphi" : (salle.computers > 0 ? "Informatique" : "Classique")}</p>
                <p><strong>Places :</strong> {salle.capacity}</p>
                <p><strong>Ordinateurs :</strong> {salle.computers}</p>
                <p><strong>Bureau prof :</strong> {salle.teacherComputer ? "Oui" : "Non"}</p>
                <p><strong>Climatisation :</strong> {salle.aircool ? "Oui" : "Non"}</p>
            </div>

            <div class="creneaux">
                <h4>Créneau pour le {selectedDate}</h4>
                <label>
                    <input type="radio" name="creneau" bind:group={creneau} value="matin" />
                    Matinée - 4h (08h00 - 12h00)
                </label>
                <label>
                    <input type="radio" name="creneau" bind:group={creneau} value="apres-midi" />
                    Après-midi - 4h (13h00 - 17h00)
                </label>
            </div>
            
            <div style="display: flex; gap: 10px; margin-top: 15px;">
                <button class="close-btn" on:click={close}>Annuler</button>
                <button class="close-btn confirm-btn" on:click={confirm}>Confirmer</button>
            </div>
        </div>
    </div>
{/if}