const TAILWIND_COLORS = [
    "red",
    "amber",
    "yellow",
    "green",
    "blue",
    "pink",
];

export function getRandomColors() {
    const color = TAILWIND_COLORS[Math.floor(Math.random() * TAILWIND_COLORS.length)];

    return {
        bgColor: `bg-${color}-50`,
        textColor: `text-${color}-700`,
        titleColor: "text-gray-900", // 고정 또는 textColor로 해도 됨
    };
}