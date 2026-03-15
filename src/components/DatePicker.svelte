<script lang="ts">
    const DAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
    const MONTHS = [
        'January',
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

    type HalfDay = 'AM' | 'PM';

    interface Cell {
        d: number;
        dm: number;
        dy: number;
        otherMonth: boolean;
    }

    let { selected = $bindable(), ...props } = $props();
    let current = $state(new Date(new Date().getFullYear(), new Date().getMonth(), 1));

    const year = $derived(current.getFullYear());
    const month = $derived(current.getMonth());
    const title = $derived(`${MONTHS[month]} ${year}`);
    const cells = $derived(buildCells(year, month));

    function buildCells(y: number, m: number): Cell[] {
        const first = new Date(y, m, 1);
        let startDow = first.getDay();
        startDow = startDow === 0 ? 6 : startDow - 1;

        const daysInMonth = new Date(y, m + 1, 0).getDate();
        const prevMonthDays = new Date(y, m, 0).getDate();
        const total = Math.ceil((startDow + daysInMonth) / 7) * 7;

        return Array.from({ length: total }, (_, i): Cell => {
            if (i < startDow) {
                return {
                    d: prevMonthDays - startDow + i + 1,
                    dm: (m - 1 + 12) % 12,
                    dy: m === 0 ? y - 1 : y,
                    otherMonth: true,
                };
            } else if (i >= startDow + daysInMonth) {
                return {
                    d: i - startDow - daysInMonth + 1,
                    dm: (m + 1) % 12,
                    dy: m === 11 ? y + 1 : y,
                    otherMonth: true,
                };
            } else {
                return {
                    d: i - startDow + 1,
                    dm: m,
                    dy: y,
                    otherMonth: false,
                };
            }
        });
    }

    function key(dy: number, dm: number, d: number, half: HalfDay): string {
        return `${dy}-${String(dm + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}-${half}`;
    }

    function toggle(dy: number, dm: number, d: number, half: HalfDay): void {
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
        {#each DAYS as label}
            <div class="day-label">{label}</div>
        {/each}

        {#each cells as { d, dm, dy, otherMonth }}
            <div class="day-cell" class:other-month={otherMonth}>
                <div class="day-num">{d}</div>
                <div class="halves">
                    {#each ['AM', 'PM'] as HalfDay[] as half}
                        <button
                            class="half"
                            onclick={() => toggle(dy, dm, d, half)}
                            aria-label="{d}/{dm + 1} {half}"
                            class:selected={selected === key(dy, dm, d, half)}
                            aria-pressed={selected === key(dy, dm, d, half)}
                        >
                            <span class="half-label">{half}</span>
                        </button>
                    {/each}
                </div>
            </div>
        {/each}
    </div>

    {#if selected}
        {@const [y, m, d, half] = selected.split('-')}
        <div class="summary">
            <span class="tag">{d}/{m} {half}</span>
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
    .half:hover {
        background: #dbeafe;
    }
    .half.selected {
        background: #1d4ed8;
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
