export default function getTimeLeft(dueDate: string): string {
    const now = new Date();
    const due = new Date(dueDate);

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