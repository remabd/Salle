<script lang="ts">
    import { onMount } from 'svelte';
    import SalleController from '../controllers/salle.controller';
    import UserController from '../controllers/user.controller';
    import type { Reservation, ReservationDto } from '../models/reservation.entity';
    import type { Salle } from '../models/salle.entity';
    import type { User } from '../models/user.entity';
    import DatePicker from './DatePicker.svelte';
    import ReservationController from '../controllers/reservation.controller';

    interface Props {
        reservationDto: ReservationDto;
        errorMessage: string;
        mode: 'create' | 'update';
        isVisible: boolean;
        onSave: () => void;
    }
    const newReservationDto = {
        userId: '',
        salleId: '',
        date: '',
    };

    let {
        reservationDto = $bindable(newReservationDto),
        errorMessage = $bindable(''),
        mode = 'create',
        isVisible = $bindable(true),
        onSave,
    }: Props = $props();

    const userController = new UserController();
    const salleController = new SalleController();
    const reservationController = new ReservationController();

    let salles = $state<Salle[]>([]);
    let users = $state<User[]>([]);

    let disabled = $derived.by(() => {
        const result: string[] = [];
        const res = reservationController.findBySalleId(reservationDto.salleId);
        if (res.success) {
            res.data.forEach((reservation: Reservation) => {
                result.push(reservation.date);
            });
        }
        const res_ = reservationController.findByUserId(reservationDto.userId);
        if (res_.success) {
            res_.data.forEach((reservation: Reservation) => {
                result.push(reservation.date);
            });
        }
        return result;
    });

    onMount(() => {
        const resUsers = userController.find();
        if (resUsers.success) {
            users = resUsers.data;
        }
        const resSalles = salleController.find();
        if (resSalles.success) {
            salles = resSalles.data;
        }
    });

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
            <div>
                <span>Quel utilisateur réserve ?</span>
                <select name="user" bind:value={reservationDto.userId}>
                    {#each users as user}
                        <option value={user.id}>{user.firstName + ' ' + user.lastName}</option>
                    {/each}
                </select>
            </div>
            <div>
                <span>Pour quelle salle ?</span>
                <select name="salle" bind:value={reservationDto.salleId}>
                    {#each salles as salle}
                        <option value={salle.id}>{salle.name}</option>
                    {/each}
                </select>
            </div>
            <DatePicker bind:selected={reservationDto.date} bind:disabled />
            <button type="submit">{mode === 'create' ? 'Ajouter' : 'Modifier'} la réservation</button>
        </form>
    </div>
</div>

<!-- <style>
    select {
        padding: 8px;
        background-color: var(--grey);
        color: var(--slatedark);
        border-radius: var(--borderRadius);
        border: none;
    }
</style> -->
