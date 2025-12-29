export function formatKoreanDate(isoString: string): string {
    const date = new Date(isoString);

    const formatter = new Intl.DateTimeFormat("ko-KR", {
        timeZone: "Asia/Seoul",
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
    });

    const parts = formatter.formatToParts(date);
    const map = Object.fromEntries(parts.map(p => [p.type, p.value]));

    return `${map.year}년 ${map.month}월 ${map.day}일 ${map.dayPeriod} ${map.hour.padStart(2, "0")}시 ${map.minute}분 ${map.second}초`;
}