export default function addDaysToToday(periodValue: string): string {
    const today = new Date();

    // "7days" → 7, "14days" → 14 이런 식으로 숫자만 추출
    const days = parseInt(periodValue.replace("days", ""), 10);

    today.setDate(today.getDate() + days);

    // YYYY-MM-DD 포맷으로 변환
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}