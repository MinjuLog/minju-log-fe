"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { Client, type IFrame, type IMessage, type StompSubscription } from "@stomp/stompjs";
import type FeedType from "../types/FeedType";
import { getFeedList, getOnlineUserList } from "../api/feed";
import FeedSkeleton from "./FeedSkeleton";
import { type OnlineUser } from "./OnlineUserPanel";
import { getWorkspaceInfo } from "../api/workspace.ts";
import FeedList from "./FeedList";
import FeedPageHeader from "./FeedPageHeader";
import FeedSidebar from "./FeedSidebar";
import { normalizeFeed } from "../utils/feedNormalizer";

const PAGE_SIZE = 30;
const WS_URL = import.meta.env.VITE_FEED_WS_HOST;
const workspace_ID = "1";

const TOPIC_FEED = `/topic/workspace.${workspace_ID}`;
const TOPIC_REACTION = `/topic/workspace.${workspace_ID}/reaction`;
const TOPIC_PRESENCE = `/topic/workspace.${workspace_ID}/connect`;
const TOPIC_DELETE = `/topic/workspace.${workspace_ID}/delete`;

type ReactionEvent = {
    actorId: number;
    pressedByMe: boolean;
    feedId: number;
    emojiKey?: string | null;
    key?: string | null;
    emojiCount?: number | null;
    count?: number | null;
    emojiType?: "DEFAULT" | "CUSTOM" | null;
    objectKey?: string | null;
    unicode?: string | null;
};

type DeleteEvent = {
    feedId: number;
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
    const [likeCount, setLikeCount] = useState(0);
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
                const normalized = feedList.result.map(normalizeFeed);
                setFeeds(normalized);
                setTotalElements(normalized.length);

                const res = await getWorkspaceInfo(1);
                if (!res.ok) {
                    alert(res.message);
                    return;
                }
                setLikeCount(res.result.likeCount);

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
                        const next = [normalizeFeed(payload), ...prev];
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
                    const eventEmojiKey = ev.emojiKey ?? ev.key;
                    if (!eventEmojiKey) return;
                    const eventEmojiCount = ev.emojiCount ?? ev.count ?? 0;

                    setFeeds((prev: FeedType[]) =>
                        prev.map((feed) => {
                            if (feed.id !== ev.feedId) return feed;

                            const exists = feed.reactions.some((r) => r.emojiKey === eventEmojiKey);

                            const nextReactions = exists
                                ? eventEmojiCount === 0
                                    ? feed.reactions.filter((r) => r.emojiKey !== eventEmojiKey)
                                    // ✅ 아니면 서버 값으로 갱신
                                    : feed.reactions.map((r) =>
                                        r.emojiKey === eventEmojiKey
                                            ? {
                                                ...r,
                                                emojiCount: eventEmojiCount,
                                                // 다른 유저 이벤트 → 내 isPressed는 유지
                                                emojiType: ev.emojiType ?? r.emojiType,
                                                objectKey: ev.objectKey ?? r.objectKey,
                                                unicode: ev.unicode ?? r.unicode,
                                            }
                                            : r
                                    )
                                : eventEmojiCount > 0
                                    ? [
                                        ...feed.reactions,
                                        {
                                            emojiKey: eventEmojiKey,
                                            emojiCount: eventEmojiCount,
                                            pressedByMe: false,
                                            emojiType: ev.emojiType ?? "DEFAULT",
                                            objectKey: ev.objectKey ?? null,
                                            unicode: ev.unicode ?? null,
                                        },
                                    ]
                                    : feed.reactions; // count === 0이면 아무 것도 안 함

                            return { ...feed, reactions: nextReactions };
                        })
                    );
                })
            );

            // 접속/해제 구독 (delta)
            // 삭제 구독
            subsRef.current.push(
                client.subscribe(TOPIC_DELETE, (msg: IMessage) => {
                    const ev: DeleteEvent = JSON.parse(msg.body);
                    setFeeds((prev) => {
                        const next = prev.filter((f) => f.id !== ev.feedId);
                        setTotalElements(next.length);
                        return next;
                    });
                })
            );

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

    const handleLoadMore = () => {
        setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, totalElements));
    };

    if (loading) return <FeedSkeleton count={6} />;

    return (
        <div className="flex-1">
            <FeedPageHeader totalElements={totalElements} connected={connected} />

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                <FeedList
                    feeds={feeds}
                    setFeeds={setFeeds}
                    clientRef={clientRef}
                    connected={connected}
                    visibleCount={visibleCount}
                    totalElements={totalElements}
                    onLoadMore={handleLoadMore}
                />

                <FeedSidebar
                    onlineUserList={onlineUserList}
                    connected={connected}
                    likeCount={likeCount}
                    setLikeCount={setLikeCount}
                    clientRef={clientRef}
                />
            </div>
        </div>
    );
}
