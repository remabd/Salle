<script lang="ts">
    import { onMount } from 'svelte';
    import UserController from '../controllers/user.controller';
    import type { User } from '../models/user.entity';
    import UserCard from './UserCard.svelte';

    const userController = new UserController();

    let users = $state<User[]>([]);
    let errorMessage = $state<string>('');
    let isVisible = $state<boolean>(false);

    let firstName = $state<string>('');
    let lastName = $state<string>('');
    let email = $state<string>('');
    let password = $state<string>('');
    let admin = $state<boolean>(false);

    onMount(() => refreshUsers());

    function refreshUsers() {
        const response = userController.find();
        if (response.success) {
            users = response.data;
        }
    }

    function addUser() {}

    function openPopup() {
        isVisible = true;
    }

    function close() {
        isVisible = false;
    }
</script>

<section>
    <h2>Gestion des utilisateurs</h2>

    {#if isVisible}
        <div>
            <h3>Ajouter un utilisateur</h3>
            <button onclick={close}>X</button>
            {#if errorMessage}
                <p>{errorMessage}</p>
            {/if}
            <form onsubmit={addUser}>
                <div>
                    <label for="firstName">Prénom</label>
                    <input type="text" bind:value={firstName} id="firstName" />
                </div>
                <div>
                    <label for="lastName">Nom</label>
                    <input type="text" bind:value={lastName} id="lastName" />
                </div>
                <div>
                    <label for="email">Email</label>
                    <input type="text" bind:value={email} id="email" />
                </div>
                <div>
                    <label for="password">Mot de passe</label>
                    <input type="text" bind:value={password} id="password" />
                </div>
                <div>
                    <fieldset>
                        <legend>Administrateur</legend>
                        {#each [true, false] as option}
                            <label>
                                <input
                                    type="radio"
                                    name="admin"
                                    value={option}
                                    bind:group={admin}
                                />
                                {option ? 'Oui' : 'Non'}
                            </label>
                        {/each}
                    </fieldset>
                </div>

                <button type="submit">Ajouter la salle</button>
            </form>
        </div>
    {/if}

    <button onclick={openPopup}>Ajouter</button>

    <div>
        {#if users.length}
            <ul>
                {#each users as user}
                    <li>
                        <UserCard {user} />
                    </li>
                {/each}
            </ul>
        {:else}
            <p>Pas d'utilisateurs</p>
        {/if}
    </div>
</section>
