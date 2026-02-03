import { useEffect, useMemo, useRef, useState } from "react";
import { incrementLike } from "../api/workspace.ts";

type Props = {
    connected: boolean;
    clientRef: any;
    likeCount: number; // 서버에서 들고 있는 값
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

    // 내가 아직 서버 확정 못 받은(=optimistic) 누적치
    const [optimisticDelta, setOptimisticDelta] = useState(0);

    const [sending, setSending] = useState(false);
    const timerRef = useRef<number | null>(null);
    const inFlightRef = useRef(false);

    const [heartBump, setHeartBump] = useState(false);
    const [countBump, setCountBump] = useState(false);

    // 서버 브로드캐스트 구독: 타인 이벤트만 반영
    useEffect(() => {
        if (!connected) return;
        if (!clientRef.current) return;

        const sub = clientRef.current.subscribe(`/topic/room.1/like`, (msg: any) => {
            const payload = JSON.parse(msg.body);
            const nextCount = payload.likeCount ?? payload.count ?? payload;

            // 타인 이벤트만 적용
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

    // optimisticDelta가 늘어나면 1초 디바운스로 PATCH
    useEffect(() => {
        if (optimisticDelta <= 0) return;

        if (timerRef.current) window.clearTimeout(timerRef.current);

        timerRef.current = window.setTimeout(async () => {
            // 이번에 보낼 delta를 스냅샷
            const deltaToSend = optimisticDelta;

            // 이미 전송중이면 다음 턴으로 미룸
            if (inFlightRef.current) return;

            inFlightRef.current = true;
            setSending(true);

            try {
                const res = await incrementLike(workspaceId, deltaToSend, userId);

                if (!res.ok) {
                    alert(res.message);
                    // 실패하면 optimistic을 되돌림 (사용자가 눌렀던 만큼 취소)
                    setOptimisticDelta((prev) => prev - deltaToSend);
                    return;
                }

                // ✅ 내 요청 확정 응답: 서버 권위값 갱신
                setLikeCount(res.result.likeCount);

                // ✅ 방금 보낸 만큼 optimistic에서 제거
                setOptimisticDelta((prev) => Math.max(0, prev - deltaToSend));

                // (선택) 다른 유저들 갱신을 위해 서버가 broadcast 하는 게 정석.
                // 지금처럼 클라이언트가 /topic에 publish 하는 건 서버 설정에서 막힐 수 있음.
                // 가능하면 서버에서 broadcast 하도록 바꾸는 걸 권장.
                clientRef.current.publish({
                    destination: "/topic/room.1/like",
                    headers: { "content-type": "application/json" },
                    body: JSON.stringify({ actorId: userId, likeCount: res.result.likeCount }),
                });
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

        // ✅ 클릭 즉시 optimistic 반영
        setOptimisticDelta((prev) => prev + 1);

        setHeartBump(false);
        requestAnimationFrame(() => setHeartBump(true));
        window.setTimeout(() => setHeartBump(false), 220);
    };

    // ✅ 화면 표시값 = 서버 권위값 + optimistic
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
