export default function getTimeLeft(dueDate: number[]): string {
    const now = new Date();
    const due = new Date(dueDate[0], dueDate[1] - 1, dueDate[2]);
    console.log(dueDate)
    console.log(now, due);

    const diffMs = due.getTime() - now.getTime();

    if (diffMs <= 0) return "마감";

    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays >= 1) {
        return `${diffDays}일`;
    } else if (diffHours >= 1) {
        return `${diffHours}시간`;
    } else {
        return `${diffMinutes}분`;
    }
}