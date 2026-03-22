<script lang="ts">
    import { onMount } from 'svelte';
    import SalleController from '../controllers/salle.controller';
    import type { Salle, SalleDto } from '../models/salle.entity';
    import SallePopup from './popup/SallePopup.svelte';

    const salleController = new SalleController();

    let salles: Salle[] = $state<Salle[]>([]);
    let errorMessage = $state<string>('');
    let successMessage = $state<string>('');
    let isVisible = $state<boolean>(false);

    let mode = $state<'create' | 'update'>('create');
    let salleDto = $state<SalleDto>({
        name: '',
        capacity: 30,
        computers: 0,
        teacherComputer: false,
        aircool: false,
    });
    let id = $state<string>('');

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

    function createSalle(salle: SalleDto) {
        errorMessage = '';
        if (!salle.name.trim()) {
            errorMessage = 'Le nom de la salle est requis.';
            return;
        }

        const response = salleController.save(salle);
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

    function addSalle(e: SubmitEvent) {
        e.preventDefault();
        const newSalle: SalleDto = {
            name,
            capacity,
            computers,
            teacherComputer,
            aircool,
        };
        createSalle(newSalle);
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

    function updateSalle(id: string, salle: SalleDto) {
        const response = salleController.update(id, salle);
        if (response.success) {
            successMessage = 'Salle modifiée';
            isVisible = false;
            salleDto = {
                name: '',
                capacity: 30,
                computers: 0,
                teacherComputer: false,
                aircool: false,
            };
            mode = 'create';
            id = '';
            refreshSalles();
        } else {
            errorMessage = response.error.message;
        }
    }

    function openUpdatePopup(salles_: Salle) {
        salleDto = { ...salles_ };
        mode = 'update';
        id = salles_.id;
        isVisible = true;
    }

    function onSave() {
        if (mode === 'create') {
            createSalle(salleDto);
        } else {
            updateSalle(id, salleDto);
        }
    }

    function openPopup() {
        isVisible = true;
    }
</script>

<div class="manage-salles">
    <div>
        <h2>Gestion des salles</h2>
        {#if isVisible}
            <SallePopup bind:salleDto bind:errorMessage bind:isVisible {mode} {onSave} />
        {/if}
        <p>{errorMessage ? errorMessage : null}</p>
        {#if successMessage}
            <div class="successMessage">{successMessage}</div>
        {/if}
        {#if errorMessage}
            <div class="errorMessage">{errorMessage}</div>
        {/if}
        <button class="btn-add" onclick={openPopup}>Ajouter une salle</button>
    </div>

    <div>
        {#if salles.length}
            <table>
                <thead>
                    <tr>
                        <th scope="col">Salle</th>
                        <th scope="col">Capacité</th>
                        <th scope="col">Ordinateurs</th>
                        <th scope="col">PC Prof</th>
                        <th scope="col">Climatisation</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {#each salles as salle}
                        <tr>
                            <td>{salle.name}</td>
                            <td>{salle.capacity}</td>
                            <td>{salle.computers}</td>
                            <td>{salle.teacherComputer ? 'Oui' : 'Non'}</td>
                            <td>{salle.aircool ? 'Oui' : 'Non'}</td>
                            <td>
                                <button class="btn-edit" onclick={() => openUpdatePopup(salle)}
                                    >Modifier</button
                                >
                                <button class="btn-delete" onclick={() => removeSalle(salle.id)}
                                    >Supprimer</button
                                >
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        {:else}
            <p>Aucune salle enregistrée.</p>
        {/if}
    </div>
</div>

<style>
    @import '../style/table.css';

    div:first-child {
        display: flex;
        flex-direction: column;
        gap: 8px;
        padding: 20px 0;
    }
</style>
