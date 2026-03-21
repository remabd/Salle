<script lang="ts">
    import type { UserDto } from '../../models/user.entity';

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

<style>
    @import '../../style/modal.css';
    @import '../../style/form.css';
</style>
