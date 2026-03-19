<script lang="ts">
    import { onMount } from 'svelte';
    import UserController from '../controllers/user.controller';
    import type { CreateUserDto, UpdateUserDto, User } from '../models/user.entity';
    import UserPopup from './UserPopup.svelte';
    import ValidationGuard from '../guards/validation.guard';

    const userController = new UserController();
    const validationGuard = new ValidationGuard();

    let users = $state<User[]>([]);
    let errorMessage = $state<string>('');
    let isVisible = $state<boolean>(false);

    let mode = $state<'create' | 'update'>('create');
    let userDto = $state<CreateUserDto>({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        admin: false,
    });
    let id = $state<string>('');

    onMount(() => refreshUsers());

    function refreshUsers() {
        const response = userController.find();
        if (response.success) {
            users = response.data;
        }
    }

    function deleteUser(id: string) {
        const response = userController.remove(id);
        if (response.success) {
            errorMessage = 'Utilisateur supprimé';
            refreshUsers();
        } else {
            errorMessage = response.error.message;
        }
    }

    function addUser(user: CreateUserDto) {
        if (!validationGuard.validateUserDto(user)) {
            errorMessage = 'Erreur de saisie';
        } else {
            const response = userController.save(user);
            if (response.success) {
                errorMessage = 'Utilisateur enregistré';
                isVisible = false;
                userDto = {
                    firstName: '',
                    lastName: '',
                    email: '',
                    password: '',
                    admin: false,
                };
                mode = 'create';
                id = '';
                refreshUsers();
            } else {
                errorMessage = response.error.message;
            }
        }
    }

    function updateUser(id: string, user: UpdateUserDto) {
        if (!validationGuard.validateUserDto(user)) {
            errorMessage = 'Erreur de saisie';
        } else {
            const response = userController.update(id, user);
            if (response.success) {
                errorMessage = 'Utilisateur modifié';
                isVisible = false;
                userDto = {
                    firstName: '',
                    lastName: '',
                    email: '',
                    password: '',
                    admin: false,
                };
                mode = 'create';
                id = '';
                refreshUsers();
            } else {
                errorMessage = response.error.message;
            }
        }
    }

    function openUpdatePopup(user_: User) {
        userDto = user_;
        mode = 'update';
        id = user_.id;
        isVisible = true;
    }

    function onSave() {
        if (mode === 'create') {
            addUser(userDto);
        } else {
            updateUser(id, userDto);
        }
    }

    function openPopup() {
        isVisible = true;
    }
</script>

<section>
    <h2>Gestion des utilisateurs</h2>

    {#if isVisible}
        <UserPopup bind:userDto bind:errorMessage bind:isVisible {mode} {onSave} />
    {/if}

    <p>{errorMessage ? errorMessage : null}</p>

    <button onclick={openPopup}>Ajouter</button>

    <div>
        {#if users.length}
            <table>
                <thead>
                    <tr>
                        <th scope="col">Prénom</th>
                        <th scope="col">Nom</th>
                        <th scope="col">Email</th>
                        <th scope="col">Administrateur</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {#each users as user}
                        <tr>
                            <th scope="row">{user.firstName}</th>
                            <th>{user.lastName}</th>
                            <th>{user.email}</th>
                            <th>{user.admin ? 'OUI' : 'NON'}</th>
                            <th>
                                <button onclick={() => openUpdatePopup(user)}>Modifier</button>
                                <button onclick={() => deleteUser(user.id)}>Supprimer</button>
                            </th>
                        </tr>
                    {/each}
                </tbody>
            </table>
        {:else}
            <p>Pas d'utilisateurs</p>
        {/if}
    </div>
</section>
