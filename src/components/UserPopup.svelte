<script lang="ts">
    import type { UserDto } from '../models/user.entity';

    interface Props {
        userDto: UserDto;
        errorMessage: string;
        mode: 'create' | 'update';
        isVisible: boolean;
        onSave: () => void;
    }
    const newUserDto = {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        admin: false,
    };
    let {
        userDto = $bindable(newUserDto),
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
    <div class="modal-content">
        <div class="row">
            <h3>Ajouter un utilisateur</h3>
            <button onclick={close}>X</button>
        </div>
        {#if errorMessage}
            <p>{errorMessage}</p>
        {/if}
        <form onsubmit={handleSubmit} class="add-form">
            <div class="form-group">
                <label for="firstName">Prénom</label>
                <input type="text" bind:value={userDto.firstName} id="firstName" />
            </div>
            <div class="form-group">
                <label for="lastName">Nom</label>
                <input type="text" bind:value={userDto.lastName} id="lastName" />
            </div>
            <div class="form-group">
                <label for="email">Email</label>
                <input type="text" bind:value={userDto.email} id="email" />
            </div>
            {#if mode !== 'update'}
                <div class="form-group">
                    <label for="password">Mot de passe</label>
                    <input type="text" bind:value={userDto.password} id="password" />
                </div>
            {/if}
            <div>
                <fieldset>
                    <legend>Administrateur</legend>
                    {#each [true, false] as option}
                        <label>
                            <input
                                type="radio"
                                name="admin"
                                value={option}
                                bind:group={userDto.admin}
                            />
                            {option ? 'Oui' : 'Non'}
                        </label>
                    {/each}
                </fieldset>
            </div>
            <button class="btn-add" type="submit">Ajouter l'utilisateur</button>
        </form>
    </div>
</div>

<!-- <style>
    .modal {
        position: absolute;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background-color: rgba(0,0,0,0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        backdrop-filter: blur(8px);
        z-index: 99;
    }

    .modal-content {
        background-color: white;
        padding: 40px;
        border-radius: var(--borderRadius);
        width: 35%;

        h3 {
            color: var(--slatedark);
        }

        p {
            font-size: 1rem;
            text-align: start;
            font-weight: bold;
            color: var(--red);
        }

        form div {
            display: grid;
            justify-content: stretch;
        }

        form input {
            background-color: var(--grey);
            border: none;
        }

        form input[type=text] {
            border: none;
        }

        fieldset {
            display: flex;
            gap: 8px;
        }
    }

    .row {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }

    h3 {
        font-size: 2em;
    }
</style> -->
