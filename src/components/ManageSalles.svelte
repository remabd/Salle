<script lang="ts">
    import { onMount } from 'svelte';
    import SalleController from '../controllers/salle.controller';
    import type { Salle, CreateSalleDto } from '../models/salle.entity';

    const salleController = new SalleController();

    let salles: Salle[] = $state<Salle[]>([]);
    let errorMessage = $state<string>('');

    let name = $state<string>('');
    let capacity = $state<number>(30);
    let computers = $state<number>(0);
    let teacherComputer = $state<boolean>(false);
    let aircool = $state<boolean>(false);

    function refreshSalles() {
        const response = salleController.find();
        if (response.success) {
            salles = response.data;
        }
    }

    onMount(() => {
        refreshSalles();
    });

    function addSalle(e: SubmitEvent) {
        e.preventDefault();
        errorMessage = '';
        if (!name.trim()) {
            errorMessage = 'Le nom de la salle est requis.';
            return;
        }

        const newSalle: CreateSalleDto = {
            name,
            capacity,
            computers,
            teacherComputer,
            aircool,
        };

        const response = salleController.save(newSalle);
        if (response.success) {
            refreshSalles();
            name = '';
            capacity = 30;
            computers = 0;
            teacherComputer = true;
            aircool = false;
        } else if (response.error) {
            errorMessage = response.error.message;
        }
    }

    function removeSalle(id: string) {
        if (confirm('Voulez-vous vraiment supprimer cette salle ?')) {
            const response = salleController.remove(id);
            if (response.success) {
                refreshSalles();
            } else if (response.error) {
                errorMessage = response.error.message;
            }
        }
    }
</script>

<div class="manage-salles">
    <h2>Gestion des salles</h2>

    {#if errorMessage}
        <div class="errorMessage">{errorMessage}</div>
    {/if}

    <form onsubmit={addSalle} class="add-form">
        <div class="form-group">
            <label for="name">Nom de la salle</label>
            <input type="text" id="name" bind:value={name} placeholder="Ex: Salle 101" required />
        </div>

        <div class="form-group">
            <label for="capacity">Capacité (places)</label>
            <input type="number" id="capacity" min="1" bind:value={capacity} required />
        </div>

        <div class="form-group">
            <label for="computers">Nombre d'ordinateurs</label>
            <input type="number" id="computers" min="0" bind:value={computers} />
        </div>

        <div class="form-group-checkbox">
            <label>
                <input type="checkbox" bind:checked={teacherComputer} />
                Ordinateur prof
            </label>
        </div>

        <div class="form-group-checkbox">
            <label>
                <input type="checkbox" bind:checked={aircool} />
                Climatisation
            </label>
        </div>

        <button type="submit" class="btn-add">Ajouter la salle</button>
    </form>

    <div class="salles-list">
        <h3>Salles existantes ({salles.length})</h3>
        {#if salles.length > 0}
            <ul>
                {#each salles as salle}
                    <li>
                        <div class="salle-info">
                            <strong>{salle.name}</strong> - {salle.capacity} places
                            <span class="details">
                                ({salle.computers} pc{salle.teacherComputer
                                    ? ', pc prof'
                                    : ''}{salle.aircool ? ', clim' : ''})
                            </span>
                        </div>
                        <button class="btn-delete" onclick={() => removeSalle(salle.id)}
                            >Supprimer</button
                        >
                    </li>
                {/each}
            </ul>
        {:else}
            <p>Aucune salle enregistrée.</p>
        {/if}
    </div>
</div>

<style>
    .manage-salles {
        background-color: var(--slatedark, #1a1a1a);
        padding: 24px;
        border-radius: var(--borderRadius, 8px);
        margin-bottom: 24px;
        color: white;
    }

    h2,
    h3 {
        margin-top: 0;
        margin-bottom: 16px;
    }

    .salles-list {
        display: flex;
        flex-direction: column;
        gap: 0px;
    }

    .add-form {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        align-items: end;
        border-bottom: 1px solid #333;
    }

    .form-group {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    .form-group input {
        padding: 8px;
        border-radius: 4px;
        border: 1px solid #444;
        background: #2a2a2a;
        color: white;
    }

    .form-group-checkbox {
        display: flex;
        align-items: center;
        height: 35px;
    }

    .form-group-checkbox label {
        display: flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
    }

    .btn-add {
        background: #4caf50;
        color: white;
        border: none;
        padding: 10px 16px;
        border-radius: 4px;
        cursor: pointer;
        font-weight: bold;
    }

    .btn-add:hover {
        background: #45a049;
    }

    .btn-delete {
        background: #ff5252;
        color: white;
        border: none;
        padding: 6px 12px;
        border-radius: 4px;
        cursor: pointer;
    }

    .btn-delete:hover {
        background: #f44336;
    }

    ul {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    li {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: #2a2a2a;
        padding: 12px 16px;
        margin: 0;
        gap: 16px;
        border-radius: 4px;
    }

    .details {
        font-size: 0.85em;
        color: #aaa;
        margin-left: 8px;
    }
</style>
