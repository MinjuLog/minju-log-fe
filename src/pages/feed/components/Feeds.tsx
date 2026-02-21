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
import FeedVoiceDock from "./FeedVoiceDock.tsx";
import FeedChannelDock from "./FeedChannelDock.tsx";
import { fetchVoiceRooms, parseVoiceChannelId } from "../../voice/voiceApi.ts";
import type { VoiceRoom, VoiceRoomPresencePayload, VoiceRoomUserResponse } from "../../voice/types.ts";

const PAGE_SIZE = 30;
const WS_URL = import.meta.env.VITE_FEED_WS_HOST;
const workspace_ID = "1";

const TOPIC_FEED = `/topic/workspace.${workspace_ID}`;
const TOPIC_REACTION = `/topic/workspace.${workspace_ID}/reaction`;
const TOPIC_PRESENCE = `/topic/workspace.${workspace_ID}/connect`;
const TOPIC_DELETE = `/topic/workspace.${workspace_ID}/delete`;
const TOPIC_ONLINE_USERS = `/topic/workspace.${workspace_ID}/online-users`;

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
    const me = users.find((u) => u.role === "me");
    const others = users.filter((u) => u.role !== "me");
    return me ? [me, ...others] : others;
}

function sameLevelMap(a: Record<string, number>, b: Record<string, number>): boolean {
    const aKeys = Object.keys(a);
    const bKeys = Object.keys(b);
    if (aKeys.length !== bKeys.length) return false;
    for (const key of aKeys) {
        if (!(key in b)) return false;
        if (Math.abs((a[key] ?? 0) - (b[key] ?? 0)) > 0.0001) return false;
    }
    return true;
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
    const myNameRef = useRef<string>("unknown");
    const [loading, setLoading] = useState(true);
    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
    const [activeChannel, setActiveChannel] = useState<"feed" | "voice">("feed");
    const [isVoiceChannelExpanded, setIsVoiceChannelExpanded] = useState(false);
    const [voiceRooms, setVoiceRooms] = useState<VoiceRoom[]>([]);
    const [selectedVoiceRoomId, setSelectedVoiceRoomId] = useState<string | null>(null);
    const [isVoiceLeaving, setIsVoiceLeaving] = useState(false);
    const [isVoiceSwitching, setIsVoiceSwitching] = useState(false);
    const [voiceRoomSelectRequestKey, setVoiceRoomSelectRequestKey] = useState(0);
    const [isVoiceRoomLoading, setIsVoiceRoomLoading] = useState(false);
    const [voiceRoomLoadError, setVoiceRoomLoadError] = useState<string | null>(null);
    const [mySpeakerLevel, setMySpeakerLevel] = useState(0);
    const [remoteLevelByName, setRemoteLevelByName] = useState<Record<string, number>>({});
    const [remoteLevelByIdentity, setRemoteLevelByIdentity] = useState<Record<string, number>>({});
    const userId = localStorage.getItem("userId") ?? "";

    const client = useMemo(() => {
        const enableStompDebug = import.meta.env.VITE_STOMP_DEBUG === "true";
        return new Client({
            brokerURL: WS_URL,
            reconnectDelay: 2000,
            heartbeatIncoming: 10000,
            heartbeatOutgoing: 10000,
            connectHeaders: { userId },
            debug: enableStompDebug ? (s) => console.log("[stomp]", s) : () => {},
        });
    }, [userId]);

    const refreshFeeds = useCallback(async () => {
        const feedList = await getFeedList(Number(userId));
        if (!feedList.ok) {
            alert(feedList.message);
            return;
        }
        const normalized = feedList.result.map(normalizeFeed);
        setFeeds(normalized);
        setTotalElements(normalized.length);
    }, [userId]);

    useEffect(() => {
        const bootstrap = async () => {
            try {
                setLoading(true);
                await refreshFeeds();

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
    }, [refreshFeeds]);

    useEffect(() => {
        myNameRef.current = myName;
    }, [myName]);

    const refreshOnlineUsers = useCallback(async () => {
        const res = await getOnlineUserList();
        if (!res.ok) return;

        const mapped: OnlineUser[] = res.result.map((name) => ({
            id: name,
            name,
            role: myNameRef.current === name ? "me" : "user",
            status: "online",
        }));
        setOnlineUserList(sortMeFirst(uniqByName(mapped)));
    }, []);

    useEffect(() => {
        if (!connected) return;
        void refreshOnlineUsers();
    }, [connected, refreshOnlineUsers]);

    const toParticipantLabel = useCallback(
        (user: VoiceRoomUserResponse): string => {
            return myNameRef.current !== "unknown" && user.username === myNameRef.current ? `${user.username}(나)` : user.username;
        },
        [],
    );

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
                                    : feed.reactions.map((r) =>
                                          r.emojiKey === eventEmojiKey
                                              ? {
                                                    ...r,
                                                    emojiCount: eventEmojiCount,
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
                                  : feed.reactions;
                            return { ...feed, reactions: nextReactions };
                        })
                    );
                })
            );

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
                                    role: myNameRef.current === name ? "me" : "user",
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

            subsRef.current.push(
                client.subscribe(TOPIC_ONLINE_USERS, (msg: IMessage) => {
                    const payload = JSON.parse(msg.body) as
                        | string[]
                        | { users?: string[]; result?: string[]; onlineUsers?: string[] };
                    const names = Array.isArray(payload)
                        ? payload
                        : payload.users ?? payload.result ?? payload.onlineUsers ?? [];

                    const mapped: OnlineUser[] = names.map((name) => ({
                        id: name,
                        name,
                        role: myNameRef.current === name ? "me" : "user",
                        status: "online",
                    }));
                    setOnlineUserList(sortMeFirst(uniqByName(mapped)));
                }),
            );

            const voiceChannelId = parseVoiceChannelId();
            if (voiceChannelId !== null) {
                subsRef.current.push(
                    client.subscribe(`/topic/voice.channel.${voiceChannelId}`, (msg: IMessage) => {
                        const payload: VoiceRoomPresencePayload = JSON.parse(msg.body);
                        const roomId = String(payload.roomId);
                        const participants = (payload.onlineUsers ?? []).map((user) => ({
                            userId: user.userId,
                            name: user.username,
                            label: toParticipantLabel(user),
                        }));

                        setVoiceRooms((prev) =>
                            prev.map((room) => (room.id === roomId ? { ...room, participants } : room)),
                        );
                    }),
                );
            }

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
    }, [client, toParticipantLabel, userId]);

    const handleLoadMore = () => {
        setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, totalElements));
    };

    useEffect(() => {
        if (activeChannel !== "feed") return;
        void refreshFeeds();
    }, [activeChannel, refreshFeeds]);

    const refreshVoiceRooms = useCallback(
        async (showLoading = false) => {
            const channelId = parseVoiceChannelId();
            if (channelId === null) {
                setVoiceRoomLoadError("보이스 채널 ID 설정 필요");
                return;
            }

            if (showLoading) {
                setIsVoiceRoomLoading(true);
            }
            setVoiceRoomLoadError(null);
            try {
                const rooms = await fetchVoiceRooms(channelId, userId, toParticipantLabel);
                setVoiceRooms(rooms);
                setSelectedVoiceRoomId((prev) => {
                    if (!prev) return null;
                    return rooms.some((room) => room.id === prev) ? prev : null;
                });
            } catch {
                setVoiceRoomLoadError("음성 채팅방 목록을 불러오지 못했습니다.");
            } finally {
                if (showLoading) {
                    setIsVoiceRoomLoading(false);
                }
            }
        },
        [toParticipantLabel, userId],
    );

    useEffect(() => {
        void refreshVoiceRooms(true);
    }, [refreshVoiceRooms]);

    useEffect(() => {
        if (myName === "unknown") return;
        void refreshVoiceRooms();
    }, [myName, refreshVoiceRooms]);

    const handleSpeakerLevelsChange = useCallback(
        ({
            myLevel,
            remoteLevelByName: levelsByName,
            remoteLevelByIdentity: levelsByIdentity,
        }: {
            myLevel: number;
            remoteLevelByName: Record<string, number>;
            remoteLevelByIdentity: Record<string, number>;
        }) => {
            setMySpeakerLevel((prev) => (Math.abs(prev - myLevel) > 0.0001 ? myLevel : prev));
            setRemoteLevelByName((prev) => (sameLevelMap(prev, levelsByName) ? prev : levelsByName));
            setRemoteLevelByIdentity((prev) => (sameLevelMap(prev, levelsByIdentity) ? prev : levelsByIdentity));
        },
        [],
    );

    if (loading) return <FeedSkeleton count={6} />;

    return (
        <div className="flex-1">
            <FeedPageHeader totalElements={totalElements} connected={connected} />

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
                <FeedChannelDock
                    activeChannel={activeChannel}
                    onSelectFeedChannel={() => setActiveChannel("feed")}
                    isVoiceChannelExpanded={isVoiceChannelExpanded}
                    onToggleVoiceChannel={() => setIsVoiceChannelExpanded((prev) => !prev)}
                    voiceRooms={voiceRooms}
                    isVoiceRoomLoading={isVoiceRoomLoading}
                    voiceRoomLoadError={voiceRoomLoadError}
                    selectedVoiceRoomId={selectedVoiceRoomId}
                    isVoiceLeaving={isVoiceLeaving}
                    isVoiceSwitching={isVoiceSwitching}
                    mySpeakerLevel={mySpeakerLevel}
                    remoteLevelByName={remoteLevelByName}
                    remoteLevelByIdentity={remoteLevelByIdentity}
                    onSelectVoiceRoom={(roomId) => {
                        setSelectedVoiceRoomId(roomId);
                        setVoiceRoomSelectRequestKey((prev) => prev + 1);
                        setActiveChannel("voice");
                    }}
                />

                {activeChannel === "feed" && (
                    <FeedList
                        feeds={feeds}
                        setFeeds={setFeeds}
                        connected={connected}
                        onFeedCreated={refreshFeeds}
                        visibleCount={visibleCount}
                        totalElements={totalElements}
                        onLoadMore={handleLoadMore}
                    />
                )}

                <FeedVoiceDock
                    className={activeChannel === "voice" ? "xl:col-span-7" : "hidden xl:col-span-7"}
                    preselectedRoomId={selectedVoiceRoomId}
                    preselectedRoomRequestKey={voiceRoomSelectRequestKey}
                    onSpeakerLevelsChange={handleSpeakerLevelsChange}
                    onVoiceLeavingChange={setIsVoiceLeaving}
                    onVoiceSwitchingChange={setIsVoiceSwitching}
                    wsClientRef={clientRef}
                    wsConnected={connected}
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
