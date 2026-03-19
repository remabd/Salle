<script lang="ts">
    const JOURS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
    const MOIS = [
        'Janvier',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
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
    }

    let { selected = $bindable(null), disabled = $bindable([]) }: Props = $props();
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
        <button onclick={prevMonth}>‹</button>
        <span>{title}</span>
        <button onclick={nextMonth}>›</button>
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
            <span class="tag">{d}/{m}/{y} {half}</span>
        </div>
    {/if}
</div>

<style>
    .picker {
        max-width: 380px;
        font-family: sans-serif;
        border: 1px solid #ddd;
        border-radius: 12px;
        overflow: hidden;
    }

    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px 16px;
        border-bottom: 1px solid #eee;
        font-weight: 500;
    }

    .header button {
        background: none;
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
        min-height: 52px;
        display: flex;
        flex-direction: column;
    }

    .day-cell.other-month .day-num {
        color: #ccc;
    }

    .day-num {
        font-size: 11px;
        padding: 3px 5px;
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
        background: #dbeafe;
    }

    .half.selected {
        background: #1d4ed8;
    }

    .half.disabled {
        cursor: not-allowed;
        background: #f3f3f3;
    }

    .half.disabled .half-label {
        color: #ccc;
    }

    .half-label {
        position: absolute;
        bottom: 3px;
        left: 0;
        right: 0;
        text-align: center;
        font-size: 9px;
        font-weight: 600;
        color: #888;
        pointer-events: none;
    }

    .half.selected .half-label {
        color: #eff6ff;
    }

    .summary {
        padding: 8px 12px;
        border-top: 1px solid #eee;
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
    }

    .tag {
        background: #eff6ff;
        color: #1d4ed8;
        font-size: 11px;
        padding: 2px 8px;
        border-radius: 6px;
    }
</style>
