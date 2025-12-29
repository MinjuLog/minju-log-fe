export function formatKoreanDate(isoString: string): string {
    const date = new Date(isoString);

    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    const hours24 = date.getHours();
    const period = hours24 < 12 ? "오전" : "오후";
    const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;

    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    const pad = (n: number) => n.toString().padStart(2, "0");

    return `${year}년 ${month}월 ${day}일 ${period} ${pad(hours12)}시 ${pad(minutes)}분 ${pad(seconds)}초`;
}