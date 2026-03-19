<script lang="ts">
    import type { SalleDto } from '../models/salle.entity';

    interface Props {
        salleDto: SalleDto;
        errorMessage: string;
        mode: 'create' | 'update';
        isVisible: boolean;
        onSave: () => void;
    }
    const newSalleDto = {
        name: '',
        capacity: 0,
        computers: 0,
        teacherComputer: false,
        aircool: false,
    };
    let {
        salleDto = $bindable(newSalleDto),
        errorMessage = $bindable(''),
        mode = 'create',
        isVisible = $bindable(true),
        onSave,
    }: Props = $props();

    function handleSubmit(e: SubmitEvent) {
        e.preventDefault();
        onSave();
    }

    function close() {
        isVisible = false;
    }
</script>

<div class="modal">
    <div class="row">
        <h3>Ajouter une salle</h3>
        <button onclick={close}>X</button>
    </div>
    {#if errorMessage}
        <p>{errorMessage}</p>
    {/if}
    <form onsubmit={handleSubmit} class="add-form">
        <div class="form-group">
            <label for="name">Nom</label>
            <input type="text" bind:value={salleDto.name} id="name" />
        </div>
        <div class="form-group">
            <label for="capacity">Capacité</label>
            <input type="number" bind:value={salleDto.capacity} id="capacity" />
        </div>
        <div class="form-group">
            <label for="computers">Nombre d'ordinateurs</label>
            <input type="number" bind:value={salleDto.computers} id="computers" />
        </div>
        <div>
            <fieldset>
                <legend>ordinateurs professeur</legend>
                {#each [true, false] as option}
                    <label>
                        <input
                            type="radio"
                            name="admin"
                            value={option}
                            bind:group={salleDto.teacherComputer}
                        />
                        {option ? 'Oui' : 'Non'}
                    </label>
                {/each}
            </fieldset>
        </div>
        <div>
            <fieldset>
                <legend>Air climatisé</legend>
                {#each [true, false] as option}
                    <label>
                        <input
                            type="radio"
                            name="admin"
                            value={option}
                            bind:group={salleDto.aircool}
                        />
                        {option ? 'Oui' : 'Non'}
                    </label>
                {/each}
            </fieldset>
        </div>

        <button type="submit">{mode === 'create' ? 'Ajouter' : 'Modifier'} la salle</button>
    </form>
</div>
