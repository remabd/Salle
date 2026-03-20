<script lang="ts">
    import { onMount } from 'svelte';
    import UserController from '../controllers/user.controller';
    import ValidationGuard from '../guards/validation.guard';
    import ReservationController from '../controllers/reservation.controller';
    import type { ReservationDto, Reservation } from '../models/reservation.entity';
    import SalleController from '../controllers/salle.controller';
    import ReservationPopup from './ReservationPopup.svelte';

    const reservationController = new ReservationController();
    const salleController = new SalleController();
    const userController = new UserController();
    const validationGuard = new ValidationGuard();

    let reservations = $state<Reservation[]>([]);
    let errorMessage = $state<string>('');
    let isVisible = $state<boolean>(false);

    let mode = $state<'create' | 'update'>('create');
    let reservationDto = $state<ReservationDto>({
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

    function cancelReservation(id: string) {
        const response = reservationController.remove(id);
        if (response.success) {
            errorMessage = 'Réservation supprimée';
            refreshReservations();
        } else {
            errorMessage = response.error.message;
        }
    }

    function addReservation(reservation: ReservationDto) {
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

    function updateReservation(id: string, reservation: ReservationDto) {
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
            updateReservation(id, reservationDto);
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
    <div>
        <h2>Gestion des réservations</h2>
        {#if isVisible}
            <ReservationPopup bind:reservationDto bind:errorMessage bind:isVisible {mode} {onSave} />
        {/if}
        <p class="errorMessage">{errorMessage ? errorMessage : null}</p>
        <button class="btn-add" onclick={openPopup}>Ajouter une réservation</button>
    </div>

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
                            <td>{findUserById(res.userId)}</td>
                            <td>{findSalleById(res.salleId)}</td>
                            <td>{res.date}</td>
                            <td>
                                <button class="btn-edit" onclick={() => openUpdatePopup(res)}>Modifier</button>
                                <button class="btn-delete" onclick={() => cancelReservation(res.id)}>Supprimer</button>
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        {:else}
            <p>Pas de réservations</p>
        {/if}
    </div>
</section>

<style>
    div:first-child {
        display: flex;
        flex-direction: column;
        gap: 8px;
        padding: 20px 0;
    }
</style>
