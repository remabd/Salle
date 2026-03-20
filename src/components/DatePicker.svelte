<script lang="ts">
    const JOURS = ['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di'];
    const MOIS = [
        'Janvier',
        'Février',
        'Mars',
        'Avril',
        'Mai',
        'Juin',
        'Juillet',
        'Août',
        'Septembre',
        'Octobre',
        'Novembre',
        'Décembre',
    ];

    type Creneau = 'AM' | 'PM';

    interface Cellule {
        jours: number;
        mois: number;
        annee: number;
        autreMois: boolean;
    }

    interface Props {
        selected?: string | null;
        disabled?: string[];
        showSalleMessage?: boolean;
    }

    let { selected = $bindable(), disabled = $bindable([]), showSalleMessage = false }: Props = $props();
    let current = $state(new Date(new Date().getFullYear(), new Date().getMonth(), 1));

    const year = $derived(current.getFullYear());
    const month = $derived(current.getMonth());
    const title = $derived(`${MOIS[month]} ${year}`);
    const cells = $derived(buildCells(year, month));

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    function buildCells(y: number, m: number): Cellule[] {
        const first = new Date(y, m, 1);
        let startDow = first.getDay();
        startDow = startDow === 0 ? 6 : startDow - 1;

        const daysInMonth = new Date(y, m + 1, 0).getDate();
        const prevMonthDays = new Date(y, m, 0).getDate();
        const total = Math.ceil((startDow + daysInMonth) / 7) * 7;

        return Array.from({ length: total }, (_, i): Cellule => {
            if (i < startDow) {
                return {
                    jours: prevMonthDays - startDow + i + 1,
                    mois: (m - 1 + 12) % 12,
                    annee: m === 0 ? y - 1 : y,
                    autreMois: true,
                };
            } else if (i >= startDow + daysInMonth) {
                return {
                    jours: i - startDow - daysInMonth + 1,
                    mois: (m + 1) % 12,
                    annee: m === 11 ? y + 1 : y,
                    autreMois: true,
                };
            } else {
                return {
                    jours: i - startDow + 1,
                    mois: m,
                    annee: y,
                    autreMois: false,
                };
            }
        });
    }

    function key(dy: number, dm: number, d: number, half: Creneau): string {
        return `${String(d).padStart(2, '0')}-${String(dm + 1).padStart(2, '0')}-${dy}-${half}`;
    }

    function isPast(dy: number, dm: number, d: number): boolean {
        const date = new Date(dy, dm, d);
        date.setHours(0, 0, 0, 0);
        return date < today;
    }

    function isUnavailable(dy: number, dm: number, d: number, half: Creneau): boolean {
        return disabled.includes(key(dy, dm, d, half));
    }

    function isDisabled(dy: number, dm: number, d: number, half: Creneau): boolean {
        return isPast(dy, dm, d) || isUnavailable(dy, dm, d, half);
    }

    function toggle(dy: number, dm: number, d: number, half: Creneau): void {
        if (isDisabled(dy, dm, d, half)) return;
        const k = key(dy, dm, d, half);
        selected = selected === k ? null : k;
    }

    function prevMonth(): void {
        current = new Date(year, month - 1, 1);
    }

    function nextMonth(): void {
        current = new Date(year, month + 1, 1);
    }
</script>

<div class="picker">
    <div class="header">
        <button type="button" onclick={prevMonth}>‹</button>
        <span>{title}</span>
        <button type="button" onclick={nextMonth}>›</button>
    </div>

    <div class="grid">
        {#each JOURS as label}
            <div class="day-label">{label}</div>
        {/each}

        {#each cells as { jours: d, mois: dm, annee: dy, autreMois: otherMonth }}
            <div class="day-cell" class:other-month={otherMonth}>
                <div class="day-num">{d}</div>
                <div class="halves">
                    {#each ['AM', 'PM'] as Creneau[] as half}
                        {@const disabled = isDisabled(dy, dm, d, half)}
                        <button
                            type="button"
                            class="half"
                            onclick={() => toggle(dy, dm, d, half)}
                            aria-label="{d}/{dm + 1} {half}"
                            class:selected={selected === key(dy, dm, d, half)}
                            class:disabled
                            aria-pressed={selected === key(dy, dm, d, half)}
                            aria-disabled={disabled}
                            {disabled}
                        >
                            <span class="half-label">{half}</span>
                        </button>
                    {/each}
                </div>
            </div>
        {/each}
    </div>

    {#if selected}
        {@const [d, m, y, half] = selected.split('-')}
        <div class="summary">
            <p>Vous réservez pour le : </p>
            <span class="tag">{d}/{m}/{y} {half}</span>
            {#if showSalleMessage}
                <p id="choose-salle">Veuillez à présent choisir une salle.</p>
            {/if}
        </div>
    {/if}
</div>

<style>
    .picker {
        background-color: white;
        border: 1px solid #ddd;
        border-radius: var(--borderRadius);
        overflow: hidden;
    }

    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px 16px;
        border-bottom: 1px solid #eee;
        font-weight: 500;
        color: var(--slatedark);
    }

    .header button {
        border: 1px solid #ddd;
        border-radius: 6px;
        padding: 2px 10px;
        cursor: pointer;
        font-size: 18px;
    }

    .grid {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
    }

    .day-label {
        text-align: center;
        font-size: 11px;
        color: #888;
        padding: 8px 4px 4px;
    }

    .day-cell {
        border: 0.5px solid #eee;
        min-height: 64px;
        display: flex;
        flex-direction: column;
    }

    .day-cell.other-month .day-num {
        color: #ccc;
    }

    .day-num {
        font-size: 12px;
        color: var(--slatedark);
        text-align: start;
        padding-left: 8px;
    }

    .halves {
        display: flex;
        flex: 1;
    }

    .half {
        flex: 1;
        border: none;
        background: none;
        cursor: pointer;
        position: relative;
        padding: 0;
        border-right: 0.5px solid #eee;
        transition: background 0.1s;
    }

    .half:last-child {
        border-right: none;
    }

    .half:hover:not(.disabled) {
        background: var(--green);
    }

    .half.selected {
        background: var(--darkgreen)
    }

    .half.disabled {
        cursor: not-allowed;
        background: #eee;
    }

    .half.disabled .half-label {
        color: var(--grey);
    }

    .half-label {
        position: absolute;
        bottom: 5;
        left: 0;
        right: 0;
        text-align: center;
        font-size: 9px;
        font-weight: 600;
        color: var(--slatedark);
        pointer-events: none;
    }

    .half.selected .half-label {
        color: var(--green);
    }

    .summary {
        padding: 8px 12px;
        border-top: 1px solid #eee;
        display: flex;
        flex-wrap: wrap;
        gap: 4px;

        p {
            color: var(--slatedark);
            align-self: center;
        }
    }

    .tag {
        background: var(--darkgreen);
        color: white;
        font-size: 14px;
        padding: 8px 12px;
        border-radius: var(--borderRadius);
    }

    #choose-salle {
        color: var(--green);
        font-size: 14px;
    }
</style>
