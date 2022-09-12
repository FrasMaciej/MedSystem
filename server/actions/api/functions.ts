export function addMinutes(date: Date, minutes: number) {
    const result = new Date(date);
    result.setMinutes(date.getMinutes() + minutes);
    return result;
}