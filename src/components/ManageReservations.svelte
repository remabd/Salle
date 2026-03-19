<script lang="ts">
    import { onMount } from 'svelte';
    import UserController from '../controllers/user.controller';
    import type { CreateUserDto, UpdateUserDto, User } from '../models/user.entity';
    import UserPopup from './UserPopup.svelte';
    import ValidationGuard from '../guards/validation.guard';
    import ReservationController from '../controllers/reservation.controller';
    import type { CreateReservationDto, Reservation } from '../models/reservation.entity';
    import SalleController from '../controllers/salle.controller';

    const reservationController = new ReservationController();
    const salleController = new SalleController();
    const userController = new UserController();
    const validationGuard = new ValidationGuard();

    let reservations = $state<Reservation[]>([]);
    let errorMessage = $state<string>('');
    let isVisible = $state<boolean>(false);

    let mode = $state<'create' | 'update'>('create');
    let reservationDto = $state<CreateReservationDto>({
        salleId: '',
        userId: '',
        date: '',
    });
    let id = $state<string>('');

    onMount(() => refreshReservations());

    function refreshReservations() {
        const response = reservationController.find();
        if (response.success) {
            reservations = response.data;
        }
    }

    function CreateReservation(id: string) {
        const response = reservationController.remove(id);
        if (response.success) {
            errorMessage = 'Réservation supprimée';
            refreshReservations();
        } else {
            errorMessage = response.error.message;
        }
    }

    function addReservation(reservation: CreateReservationDto) {
        if (!validationGuard.validateReservationDto(reservation)) {
            errorMessage = 'Erreur de saisie';
        } else {
            const response = reservationController.save(reservation);
            if (response.success) {
                errorMessage = 'Réservation enregistrée';
                isVisible = false;
                reservationDto = {
                    salleId: '',
                    userId: '',
                    date: '',
                };
                mode = 'create';
                id = '';
                refreshReservations();
            } else {
                errorMessage = response.error.message;
            }
        }
    }

    function updateUser(id: string, reservation: CreateReservationDto) {
        if (!validationGuard.validateReservationDto(reservation)) {
            errorMessage = 'Erreur de saisie';
        } else {
            const response = reservationController.update(id, reservation);
            if (response.success) {
                errorMessage = 'Réservation modifiée';
                isVisible = false;
                reservationDto = {
                    salleId: '',
                    userId: '',
                    date: '',
                };
                mode = 'create';
                id = '';
                refreshReservations();
            } else {
                errorMessage = response.error.message;
            }
        }
    }

    function openUpdatePopup(reservations_: Reservation) {
        reservationDto = reservations_;
        mode = 'update';
        id = reservations_.id;
        isVisible = true;
    }

    function onSave() {
        if (mode === 'create') {
            addReservation(reservationDto);
        } else {
            updateUser(id, reservationDto);
        }
    }

    function openPopup() {
        isVisible = true;
    }

    function findSalleById(id: string) {
        const response = salleController.findOneById(id);
        if (response.success) {
            return response.data.name;
        } else {
            return '';
        }
    }

    function findUserById(id: string) {
        const response = userController.findOneById(id);
        if (response.success) {
            return response.data.firstName + ' ' + response.data.lastName;
        } else {
            return '';
        }
    }
</script>

<section>
    <h2>Gestion des réservations</h2>

    {#if isVisible}
        <!-- < bind:reservationDto={reservationDto} bind:errorMessage bind:isVisible {mode} {onSave} /> -->
    {/if}

    <p>{errorMessage ? errorMessage : null}</p>

    <button onclick={openPopup}>Ajouter</button>

    <div>
        {#if reservations.length}
            <table>
                <thead>
                    <tr>
                        <th scope="col">Utilisateur</th>
                        <th scope="col">Salle</th>
                        <th scope="col">Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {#each reservations as res}
                        <tr>
                            <th scope="row">{findUserById(res.userId)}</th>
                            <th>{findSalleById(res.salleId)}</th>
                            <th>{res.date}</th>
                            <th>
                                <button onclick={() => openUpdatePopup(res)}>Modifier</button>
                                <button onclick={() => CreateReservation(res.id)}>Supprimer</button>
                            </th>
                        </tr>
                    {/each}
                </tbody>
            </table>
        {:else}
            <p>Pas de réservations</p>
        {/if}
    </div>
</section>
