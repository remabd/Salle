export class DateUtils {
    parseDate(dateToString: string) {
        const [d, m, y, c] = dateToString.split('-');
        const cValue = c === 'AM' ? 0 : 1;
        return new Date(parseInt(y), parseInt(m) - 1, parseInt(d), cValue * 12);
    }

    stringifyDate(date: Date): string {
        const [d, m, y, c] = [
            date.getDate(),
            date.getMonth() > 8 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1).toString(),
            date.getFullYear(),
            date.getHours() > 12 ? 'PM' : 'AM',
        ];
        return `${d}-${m}-${y}-${c}`;
    }
}
