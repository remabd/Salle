<script lang="ts">
    import { onMount } from 'svelte';
    import AuthController from '../controllers/auth.controller';
    import ReservationController from '../controllers/reservation.controller';
    import type { Reservation } from '../models/reservation.entity';
    import SalleController from '../controllers/salle.controller';

    let userEmail: string = '';
    let userReservations: Reservation[] = [];
    const reservationController = new ReservationController();

    onMount(() => {
        const authController = new AuthController();
        const response = authController.getConnexion();

        if (response.success && response.data) {
            userEmail = response.data.email;
            // Récupérer les reservations de l'user
            const resData = reservationController.findByUserId(response.data.id);
            if (resData.success && resData.data) {
                userReservations = resData.data;
            }
        }
    });

    function isCancellable(date: string): boolean {
        const today = new Date();
        const [year, month, day] = date.split('-');
        const resDate = new Date(Number(year), Number(month) - 1, Number(day), 0, 0, 0);
        const diff = resDate.getTime() - today.getTime();
        return diff >= 86400000; // 24h : 86 400 000ms
    }

    function annulerReservation(reservation: Reservation) {
        if (
            confirm(
                `Voulez-vous vraiment annuler votre réservation du ${reservation.date} pour la salle ${reservation.salleName} ?`
            )
        ) {
            const response = reservationController.remove(reservation.id);
            if (response.success) {
                userReservations = userReservations.filter((r) => r.id !== reservation.id); //Mettre a jour la liste des reservations
            } else {
                alert(response.error?.message || 'Erreur');
            }
        }
    }

    function getSalleName(id: string): string {
        const salleController = new SalleController();
        const res = salleController.findOneById(id);
        console.log(res, id);
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

<h1>Profil de {userEmail}</h1>

<div>
    {#if userReservations.length === 0}
        <p>Vous n'avez aucunes réservations en cours.</p>
    {:else}
        <ul>
            {#each userReservations as reservation}
                <li>
                    {reservation.date} - {getSalleCreneau(reservation.date)} - {getSalleName(
                        reservation.salleId
                    )}
                    <button
                        type="button"
                        onclick={() => annulerReservation(reservation)}
                        disabled={!isCancellable(reservation.date)}
                        title={!isCancellable(reservation.date)
                            ? "Impossible d'annuler moins de 24h avant"
                            : 'Annuler'}>Annuler</button
                    >
                </li>
            {/each}
        </ul>
    {/if}
</div>

<style>
    li {
        display: flex;
        gap: 20px;
        align-items: center;
        margin-bottom: 8px;
    }

    button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
</style>

