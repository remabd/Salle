<script lang="ts">
    import { onMount } from 'svelte';
    import AuthController from '../controllers/auth.controller';
    import ReservationController from '../controllers/reservation.controller';
    import type { Reservation } from '../models/reservation.entity';
    import SalleController from '../controllers/salle.controller';
    import UserController from '../controllers/user.controller';
    import { DateUtils } from '../utils/date.utils';

    let userFirstName = $state<string>('');
    let userLastName = $state<string>('');
    let userReservations = $state<Reservation[]>([]);
    const reservationController = new ReservationController();
    const dateUtils = new DateUtils();

    onMount(() => {
        const authController = new AuthController();
        const userController = new UserController();
        const response = authController.getConnexion();

        if (response.success) {
            const resUser = userController.findOneById(response.data.id);
            if (resUser.success) {
                userFirstName = resUser.data.firstName;
                userLastName = resUser.data.lastName;
            }
            const resData = reservationController.findByUserId(response.data.id);
            if (resData.success) {
                const sorted = resData.data.sort(
                    (a, b) =>
                        dateUtils.parseDate(a.date).getTime() -
                        dateUtils.parseDate(b.date).getTime()
                );
                userReservations = sorted;
            }
        }
    });

    function isCancellable(date: string): boolean {
        const today = new Date();
        const [day, month, year] = date.split('-');
        const resDate = new Date(Number(year), Number(month) - 1, Number(day), 0, 0, 0);
        const diff = resDate.getTime() - today.getTime();
        return diff >= 86400000; // 24h : 86 400 000ms
    }

    function annulerReservation(reservation: Reservation) {
        if (
            confirm(
                `Voulez-vous vraiment annuler votre réservation du ${reservation.date} pour la salle ${getSalleName(reservation.salleId)} ?`
            )
        ) {
            const response = reservationController.remove(reservation.id);
            if (response.success) {
                userReservations = userReservations.filter((r) => r.id !== reservation.id);
            } else {
                alert(response.error?.message || 'Erreur');
            }
        }
    }

    function getSalleName(id: string): string {
        const salleController = new SalleController();
        const res = salleController.findOneById(id);
        if (res.success) {
            return res.data.name;
        } else {
            return '';
        }
    }

    function getSalleCreneau(date: string): string {
        const creneau = date.split('-')[3];
        return creneau === 'AM' ? 'Matinée' : 'Après-Midi';
    }
</script>

<h1>Profil de {userFirstName} {userLastName}</h1>

<div>
    <h2>Mes réservations</h2>
    {#if userReservations.length === 0}
        <p>Vous n'avez aucunes réservations en cours.</p>
    {:else}
        <table>
            <thead>
                <tr>
                    <th scope="col">Salle</th>
                    <th scope="col">Date</th>
                    <th scope="col">Créneau</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {#each userReservations as reservation}
                    <tr>
                        <td>{getSalleName(reservation.salleId)}</td>
                        <td>{reservation.date}</td>
                        <td>{getSalleCreneau(reservation.date)}</td>
                        <td>
                            <button
                                class="btn-delete"
                                type="button"
                                onclick={() => annulerReservation(reservation)}
                                disabled={!isCancellable(reservation.date)}
                                title={!isCancellable(reservation.date)
                                    ? "Impossible d'annuler moins de 24h avant"
                                    : 'Annuler'}>Annuler</button
                            >
                        </td>
                    </tr>
                {/each}
            </tbody>
        </table>
    {/if}
</div>

<style>
    @import '../style/table.css';

    button:disabled {
        background-color: #5f5f5f;
        opacity: 0.5;
        cursor: not-allowed;
    }
</style>
