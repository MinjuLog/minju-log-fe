"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { Client, type IFrame, type IMessage, type StompSubscription } from "@stomp/stompjs";
import Feed from "./Feed";
import { FeedInput } from "./FeedInput";
import type FeedType from "../types/FeedType";
import { getFeedList, getOnlineUserList } from "../api/feed";
import FeedSkeleton from "./FeedSkeleton";
import OnlineUsersPanel, { type OnlineUser } from "./OnlineUserPanel";
import ConnectionStatus from "./ConnectionStatus";

const PAGE_SIZE = 30;
const WS_URL = import.meta.env.VITE_FEED_WS_HOST;
const ROOM_ID = "1";

const TOPIC_FEED = `/topic/room.${ROOM_ID}`;
const TOPIC_REACTION = `/topic/room.${ROOM_ID}/reaction`;
const TOPIC_PRESENCE = `/topic/room.${ROOM_ID}/connect`;

type ReactionEvent = {
    actorId: number;
    pressedByMe: boolean;
    feedId: number;
    key: string;
    count: number;
    emojiType?: "DEFAULT" | "CUSTOM" | null;
    objectKey?: string | null;
    emoji?: string | null;
};

function uniqByName(users: OnlineUser[]): OnlineUser[] {
    const seen = new Set<string>();
    const out: OnlineUser[] = [];
    for (const u of users) {
        if (seen.has(u.name)) continue;
        seen.add(u.name);
        out.push(u);
    }
    return out;
}

function sortMeFirst(users: OnlineUser[]): OnlineUser[] {
    const me = users.find(u => u.role === "me");
    const others = users.filter(u => u.role !== "me");
    return me ? [me, ...others] : others;
}

export default function Feeds() {
    const clientRef = useRef<Client | null>(null);
    const subsRef = useRef<StompSubscription[]>([]);

    const [connected, setConnected] = useState(false);
    const [feeds, setFeeds] = useState<FeedType[]>([]);
    const [totalElements, setTotalElements] = useState(0);
    const [onlineUserList, setOnlineUserList] = useState<OnlineUser[]>([]);
    const [myName, setMyName] = useState<string>("unknown");
    const [loading, setLoading] = useState(true);
    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
    const userId = localStorage.getItem("userId") ?? "";

    const client = useMemo(() => {
        return new Client({
            brokerURL: WS_URL,
            reconnectDelay: 2000,
            heartbeatIncoming: 10000,
            heartbeatOutgoing: 10000,
            connectHeaders: { userId },
            debug: (s) => console.log("[stomp]", s),
        });
    }, [userId]);

    // 1) 초기 피드 스냅샷
    useEffect(() => {
        const bootstrap = async () => {
            try {
                setLoading(true);
                const feedList = await getFeedList(Number(userId));
                if (!feedList.ok) {
                    alert(feedList.message);
                    return;
                }
                setFeeds(feedList.result);
                setTotalElements(feedList.result.length);
            } finally {
                setLoading(false);
            }
        };
        void bootstrap();
    }, []);

    // 2) 온라인 유저 스냅샷 (connected + myName 준비되면)
    const refreshOnlineUsers = useCallback(async () => {
        const res = await getOnlineUserList();
        if (!res.ok) {
            alert(res.message);
            return;
        }

        const mapped: OnlineUser[] = res.result.map((name) => ({
            id: name, // key 안정화
            name,
            role: myName === name ? "me" : "user",
            status: "online",
        }));

        setOnlineUserList(sortMeFirst(uniqByName(mapped)));
    }, [myName]);

    useEffect(() => {
        if (!connected) return;
        if (myName === "unknown") return; // myName 세팅 전에 fetch 금지
        void refreshOnlineUsers();
    }, [connected, myName, refreshOnlineUsers]);

    // 3) WS 연결/구독
    useEffect(() => {
        clientRef.current = client;

        const clearSubs = () => {
            subsRef.current.forEach((s) => s.unsubscribe());
            subsRef.current = [];
        };

        const setDisconnected = () => {
            setConnected(false);
            clearSubs();
        };

        client.onConnect = (frame: IFrame) => {
            const username = frame.headers["user-name"];
            if (username) setMyName(username);

            clearSubs();

            // 피드 구독
            subsRef.current.push(
                client.subscribe(TOPIC_FEED, (msg: IMessage) => {
                    const payload = JSON.parse(msg.body);
                    setFeeds((prev) => {
                        const next = [payload, ...prev];
                        setTotalElements(next.length);
                        return next;
                    });
                })
            );

            // 감정표현 구독
            subsRef.current.push(
                client.subscribe(TOPIC_REACTION, (msg: IMessage) => {
                    const ev: ReactionEvent = JSON.parse(msg.body);
                    if (ev.actorId === Number(userId)) return;

                    setFeeds((prev: FeedType[]) =>
                        prev.map((feed) => {
                            if (feed.id !== ev.feedId) return feed;

                            const exists = feed.reactions.some((r) => r.reactionKey === ev.key);

                            const nextReactions = exists
                                ? ev.count === 0
                                    // ✅ count가 0이면 제거
                                    ? feed.reactions.filter((r) => r.reactionKey !== ev.key)
                                    // ✅ 아니면 서버 값으로 갱신
                                    : feed.reactions.map((r) =>
                                        r.reactionKey === ev.key
                                            ? {
                                                ...r,
                                                count: ev.count,
                                                // 다른 유저 이벤트 → 내 isPressed는 유지
                                                emojiType: ev.emojiType ?? r.emojiType,
                                                objectKey: ev.objectKey ?? r.objectKey,
                                                emoji: ev.emoji ?? r.emoji,
                                            }
                                            : r
                                    )
                                : ev.count > 0
                                    // ✅ 새 reaction인데 count > 0일 때만 추가
                                    ? [
                                        ...feed.reactions,
                                        {
                                            reactionKey: ev.key,
                                            count: ev.count,
                                            pressedByMe: false,
                                            emojiType: ev.emojiType ?? null,
                                            objectKey: ev.objectKey ?? null,
                                            emoji: ev.emoji ?? null,
                                        },
                                    ]
                                    : feed.reactions; // count === 0이면 아무 것도 안 함

                            return { ...feed, reactions: nextReactions };
                        })
                    );

                    console.log(feeds)
                })
            );

            // 접속/해제 구독 (delta)
            subsRef.current.push(
                client.subscribe(TOPIC_PRESENCE, (msg: IMessage) => {
                    const { type, userId: name } = JSON.parse(msg.body) as { type: "JOIN" | "LEAVE"; userId: string };

                    setOnlineUserList((prev) => {
                        if (type === "JOIN") {
                            const next: OnlineUser[] = uniqByName([
                                ...prev,
                                {
                                    id: name,
                                    name,
                                    role: myName === name ? "me" : "user",
                                    status: "online",
                                },
                            ]);
                            return sortMeFirst(next);
                        }

                        if (type === "LEAVE") {
                            const next = prev.filter((u) => u.name !== name);
                            return sortMeFirst(next);
                        }

                        return prev;
                    });
                })
            );

            setConnected(true);
        };

        client.onDisconnect = setDisconnected;
        client.onWebSocketClose = setDisconnected;

        client.onStompError = (frame) => {
            setDisconnected();
            console.error("STOMP error:", frame.headers["message"], frame.body);
        };

        client.onWebSocketError = (e) => {
            setDisconnected();
            console.error("WebSocket error:", e);
        };

        client.activate();

        return () => {
            setDisconnected();
            void client.deactivate();
        };
    }, [client, userId, myName]);

    const canLoadMore = visibleCount < totalElements;
    const handleLoadMore = () => {
        setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, totalElements));
    };

    if (loading) return <FeedSkeleton count={6} />;

    return (
        <div className="flex-1">
            <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">전체 {totalElements}</h1>
                    <p className="mt-1 text-sm text-gray-500">실시간 피드와 좋아요 업데이트를 수신합니다.</p>
                </div>
                <ConnectionStatus connected={connected} />
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                <div className="lg:col-span-8 space-y-4">
                    <FeedInput client={clientRef} connected={connected} />

                    {feeds.slice(0, visibleCount).map((message) => (
                        <Feed
                            key={message.id}
                            feed={message}
                            setFeeds={setFeeds}
                            client={clientRef}
                        />
                    ))}

                    {totalElements === 0 && !loading && (
                        <div className="text-center text-gray-500 text-sm py-8 border border-dashed border-gray-200 rounded-lg">
                            아직 등록된 피드가 없습니다.
                        </div>
                    )}

                    {canLoadMore && (
                        <div className="flex justify-center mt-6">
                            <button
                                type="button"
                                onClick={handleLoadMore}
                                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400"
                            >
                                더 불러오기 <span className="text-gray-400">({visibleCount}/{totalElements})</span>
                            </button>
                        </div>
                    )}
                </div>

                <div className="lg:col-span-4">
                    <div className="sticky top-6 space-y-4">
                        <OnlineUsersPanel onlineUserList={onlineUserList} connected={connected} />
                    </div>
                </div>
            </div>
        </div>
    );
}