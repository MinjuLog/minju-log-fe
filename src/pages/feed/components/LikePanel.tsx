import { useEffect, useMemo, useRef, useState } from "react";
import { incrementLike } from "../api/workspace.ts";

type Props = {
    connected: boolean;
    clientRef: any;
    likeCount: number;
    setLikeCount: (count: number) => void;
    workspaceId?: number;
};

export default function WorkspaceLikePanel({
    connected,
    clientRef,
    likeCount,
    setLikeCount,
    workspaceId = 1,
}: Props) {
    const userId = Number(localStorage.getItem("userId") ?? -1);

    const [optimisticDelta, setOptimisticDelta] = useState(0);
    const [sending, setSending] = useState(false);
    const timerRef = useRef<number | null>(null);
    const inFlightRef = useRef(false);

    const [heartBump, setHeartBump] = useState(false);
    const [countBump, setCountBump] = useState(false);

    useEffect(() => {
        if (!connected) return;
        if (!clientRef.current) return;

        const sub = clientRef.current.subscribe(`/topic/workspace.1/like`, (msg: any) => {
            const payload = JSON.parse(msg.body);
            const nextCount = payload.likeCount ?? payload.count ?? payload;

            if (typeof nextCount === "number" && payload.actorId !== userId) {
                setLikeCount(nextCount);
            }
        });

        return () => {
            try {
                sub?.unsubscribe();
            } catch {}
        };
    }, [connected, clientRef, workspaceId, setLikeCount, userId]);

    useEffect(() => {
        if (optimisticDelta <= 0) return;

        if (timerRef.current) window.clearTimeout(timerRef.current);

        timerRef.current = window.setTimeout(async () => {
            const deltaToSend = optimisticDelta;

            if (inFlightRef.current) return;

            inFlightRef.current = true;
            setSending(true);

            try {
                const res = await incrementLike(workspaceId, deltaToSend, userId);

                if (!res.ok) {
                    alert(res.message);
                    setOptimisticDelta((prev) => prev - deltaToSend);
                    return;
                }

                setLikeCount(res.result.likeCount);
                setOptimisticDelta((prev) => Math.max(0, prev - deltaToSend));
            } finally {
                inFlightRef.current = false;
                setSending(false);
            }
        }, 1000);

        return () => {
            if (timerRef.current) window.clearTimeout(timerRef.current);
        };
    }, [optimisticDelta, userId, workspaceId, setLikeCount]);

    const onClickHeart = () => {
        if (!connected) return;

        setOptimisticDelta((prev) => prev + 1);

        setHeartBump(false);
        requestAnimationFrame(() => setHeartBump(true));
        window.setTimeout(() => setHeartBump(false), 220);
    };

    const displayCount = useMemo(() => likeCount + optimisticDelta, [likeCount, optimisticDelta]);

    useEffect(() => {
        setCountBump(false);
        requestAnimationFrame(() => setCountBump(true));
        window.setTimeout(() => setCountBump(false), 220);
    }, [displayCount]);

    return (
        <div className="flex">
            <button
                type="button"
                onClick={onClickHeart}
                disabled={!connected}
                className={[
                    "flex h-16 w-16 flex-col items-center justify-center rounded-full",
                    "select-none transition active:scale-95",
                    connected ? "bg-red-50 hover:bg-red-100" : "cursor-not-allowed bg-gray-100",
                    sending ? "opacity-80" : "",
                ].join(" ")}
                aria-label="like"
            >
                <span
                    className={[
                        "text-2xl leading-none",
                        connected ? "text-red-500" : "text-gray-400",
                        sending ? "animate-pulse" : "",
                        heartBump ? "animate-heart-float" : "",
                    ].join(" ")}
                >
                    ❤️
                </span>

                <div
                    className={[
                        "mt-1 text-[15px] font-bold leading-none text-gray-900",
                        countBump ? "animate-count-pop" : "",
                    ].join(" ")}
                >
                    {displayCount}
                </div>
            </button>
        </div>
    );
}
