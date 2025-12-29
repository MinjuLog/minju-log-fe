"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Client, type IMessage } from "@stomp/stompjs";
import Feed from "./Feed";
import { FeedInput } from "./FeedInput";
import type FeedType from "../types/FeedType.ts";
import {getFeedList} from "../api/feed.ts";


const PAGE_SIZE = 30;
const WS_URL = import.meta.env.VITE_WS_HOST

export default function Feeds() {
    const SUB_DEST = "/topic/room.1";
    const SEND_DEST = "/app/feed";

    const clientRef = useRef<Client | null>(null);

    const [connected, setConnected] = useState(false);
    const [feeds, setFeeds] = useState<FeedType[]>([]);
    const [totalElements, setTotalElements] = useState(0);

    const [loading, setLoading] = useState(true);
    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
    const [page, setPage] = useState(0);

    const client = useMemo(() => {
        return new Client({
            brokerURL: WS_URL,
            reconnectDelay: 2000,
            heartbeatIncoming: 10000,
            heartbeatOutgoing: 10000,
            connectHeaders: {
                userId: localStorage.getItem("userId") ?? ''
            },
            debug: (s) => console.log("[stomp]", s),
        });
    }, []);

    useEffect(() => {
        const bootstrap = async () => {
            const feedList = await getFeedList();

            if (!feedList.ok) {
                alert(feedList.message);
                return;
            }
            setTotalElements(feedList.result.length);
            setFeeds(feedList.result);
        }
        void bootstrap();
    }, []);

    useEffect(() => {
        clientRef.current = client;

        client.onConnect = () => {
            setConnected(true);

            // 구독
            client.subscribe(SUB_DEST, (frame: IMessage) => {
                setFeeds((prev) => {
                    const next = [
                        JSON.parse(frame.body),
                    ...prev];
                    setTotalElements(next.length); // next 기준이라 항상 정확
                    return next;
                });
            });

            // 연결 확인용(서버 echo가 있으면 바로 하나 들어와야 함)
            // client.publish({ destination: SEND_DEST, body: "ping" });
        };

        client.onDisconnect = () => setConnected(false);
        client.onWebSocketClose = () => setConnected(false);

        client.onStompError = (frame) => {
            setConnected(false);
            console.error("STOMP error:", frame.headers["message"], frame.body);
        };

        client.onWebSocketError = (e) => {
            setConnected(false);
            console.error("WebSocket error:", e);
        };

        client.activate();

        return () => {
            client.deactivate(); // 충분
        };
    }, [client]);

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                // TODO: page 기반으로 기존 HTTP 피드 로딩을 붙일 거면 여기서 fetch
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [page]);

    const canLoadMore = visibleCount < totalElements;

    const handleLoadMore = () => {
        setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, totalElements));
        setPage((p) => p + 1);
    };

    if (loading) {
        return <div>loading...</div>;
    }

    return (
        <div className="flex-1">
            <div className="mb-6">
                <h1 className="mb-4 text-2xl font-bold text-gray-900">
                    전체 {totalElements} {connected ? "(연결됨)" : "(끊김)"}
                </h1>
            </div>

            <div className="space-y-4">
                <FeedInput
                    client={clientRef}
                    sendDest={SEND_DEST}
                    connected={connected}
                />

                {feeds.slice(0, visibleCount).map((message: FeedType) => (
                    <Feed key={message.id} feed={message} />
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
        </div>
    );
}