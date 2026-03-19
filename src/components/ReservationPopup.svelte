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
        const res = reservationController.findBySalleId(reservationDto.salleId);
        if (res.success) {
            const result: string[] = [];
            res.data.forEach((reservation: Reservation) => {
                result.push(reservation.date);
            });
            return result;
        } else {
            return [];
        }
    });

    $inspect(disabled);

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
</script>

<div class="modal">
    <div class="row">
        <h3>Ajouter une salle</h3>
        <button onclick={close}>X</button>
    </div>
    {#if errorMessage}
        <p>{errorMessage}</p>
    {/if}
    <form onsubmit={handleSubmit} class="add-form">
        <div>
            <select name="user" bind:value={reservationDto.userId}>
                {#each users as user}
                    <option value={user.id}>{user.firstName + ' ' + user.lastName}</option>
                {/each}
            </select>
        </div>

        <div>
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
