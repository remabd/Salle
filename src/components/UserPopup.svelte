<script lang="ts">
    import UserController from '../controllers/user.controller';
    import type { CreateUserDto, User } from '../models/user.entity';

    const userController = new UserController();
    interface Props {
        userDto: CreateUserDto;
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

<div>
    <h3>Ajouter un utilisateur</h3>
    <button onclick={close}>X</button>
    {#if errorMessage}
        <p>{errorMessage}</p>
    {/if}
    <form onsubmit={handleSubmit}>
        <div>
            <label for="firstName">Prénom</label>
            <input type="text" bind:value={userDto.firstName} id="firstName" />
        </div>
        <div>
            <label for="lastName">Nom</label>
            <input type="text" bind:value={userDto.lastName} id="lastName" />
        </div>
        <div>
            <label for="email">Email</label>
            <input type="text" bind:value={userDto.email} id="email" />
        </div>
        {#if mode !== 'update'}
            <div>
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

        <button type="submit">Ajouter la salle</button>
    </form>
</div>
