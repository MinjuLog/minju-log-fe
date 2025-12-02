export default function formatDate(arr: number[]) {

    if (!arr) {
        return '알 수 없음'
    }

    const [year, month, day] = arr;

    const yy = String(year).slice(-2);
    const MM = String(month).padStart(2, "0");
    const dd = String(day).padStart(2, "0");
    // const HH = String(hour).padStart(2, "0");
    // const mm = String(minute).padStart(2, "0");

    return `${yy}.${MM}.${dd}`;
}