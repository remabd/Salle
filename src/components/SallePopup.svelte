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

    $effect(() => {
        if(isVisible) {
            window.scrollTo({top: 0, behavior: "smooth"});
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        }
    })
</script>

<div class="modal">
    <div class="modal-content">
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
                    <legend>Ordinateur Prof</legend>
                        <label>
                            <input
                                type="radio"
                                name="teacherComputer"
                                value={true}
                                bind:group={salleDto.teacherComputer}
                            />
                            Oui
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="teacherComputer"
                                value={false}
                                bind:group={salleDto.teacherComputer}
                            />
                            Non
                        </label>
                </fieldset>
            </div>
            <div>
                <fieldset>
                    <legend>Air climatisé</legend>
                        <label>
                            <input
                                type="radio"
                                name="aircool"
                                value={false}
                                bind:group={salleDto.aircool}
                            />
                            Oui
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="aircool"
                                value={false}
                                bind:group={salleDto.aircool}
                            />
                            Non
                        </label>
                </fieldset>
            </div>
            <button type="submit">{mode === 'create' ? 'Ajouter' : 'Modifier'} la salle</button>
        </form>
    </div>
</div>
