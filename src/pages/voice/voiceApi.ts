import axios from "axios";
import { api } from "../feed/api/api.ts";
import type { ChatMessage, LivekitTokenResponse, VoiceRoom, VoiceRoomApiResponse, VoiceRoomUserResponse } from "./types.ts";

const LIVEKIT_TOKEN_ENDPOINT =
    (import.meta.env.VITE_LIVEKIT_TOKEN_ENDPOINT as string | undefined) ?? "/api/voice/livekit/token";
const VOICE_ROOM_JOIN_ENDPOINT =
    (import.meta.env.VITE_VOICE_ROOM_JOIN_ENDPOINT as string | undefined) ?? "/api/voice/rooms/{roomId}/join";
const VOICE_ROOM_LEAVE_ENDPOINT =
    (import.meta.env.VITE_VOICE_ROOM_LEAVE_ENDPOINT as string | undefined) ?? "/api/voice/rooms/{roomId}/leave";

export const LIVEKIT_URL = import.meta.env.VITE_LIVEKIT_URL as string | undefined;
export const FEED_WS_URL = import.meta.env.VITE_FEED_WS_HOST as string | undefined;
export const VOICE_CHANNEL_ID = import.meta.env.VITE_VOICE_CHANNEL_ID as string | 1;

function buildRoomEndpoint(template: string, roomId: string): string {
    return template.includes("{roomId}") ? template.replace("{roomId}", roomId) : template;
}

function resolveEndpointUrl(endpoint: string): string {
    if (endpoint.startsWith("http")) return endpoint;

    const baseURL = api.defaults.baseURL;
    if (typeof window === "undefined") return endpoint;
    if (!baseURL) return new URL(endpoint, window.location.origin).toString();

    const isAbsoluteBase = /^https?:\/\//i.test(baseURL);
    if (isAbsoluteBase) {
        return new URL(endpoint, baseURL).toString();
    }

    const normalizedBase = baseURL.startsWith("/") ? baseURL : `/${baseURL}`;
    const joinedPath = `${normalizedBase.replace(/\/$/, "")}/${endpoint.replace(/^\//, "")}`;
    return new URL(joinedPath, window.location.origin).toString();
}

export function parseVoiceChannelId(): number | null {
    const parsedChannelId = Number(VOICE_CHANNEL_ID);
    if (!VOICE_CHANNEL_ID || Number.isNaN(parsedChannelId) || !Number.isInteger(parsedChannelId)) {
        return null;
    }
    return parsedChannelId;
}

export function mapVoiceRooms(
    roomList: VoiceRoomApiResponse[],
    toParticipantLabel: (user: VoiceRoomUserResponse) => string,
): VoiceRoom[] {
    return roomList.map((room) => ({
        id: String(room.id),
        name: room.title,
        topic: "자유대화방",
        participants: (room.onlineUsers ?? []).map(toParticipantLabel),
    }));
}

export async function fetchVoiceRooms(
    channelId: number,
    userId: string,
    toParticipantLabel: (user: VoiceRoomUserResponse) => string,
): Promise<VoiceRoom[]> {
    const res = await api.get(`/api/voice/channels/${channelId}/rooms`, {
        headers: {
            "X-User-Id": userId,
        },
    });

    const payload = res.data?.result ?? res.data;
    const roomList: VoiceRoomApiResponse[] = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.rooms)
          ? payload.rooms
          : [];

    return mapVoiceRooms(roomList, toParticipantLabel);
}

export async function fetchRoomMessages(roomId: string): Promise<ChatMessage[]> {
    const res = await api.get(`/api/voice/rooms/${roomId}/messages`);
    const data = res.data as { result?: ChatMessage[] } | ChatMessage[];
    const payload = Array.isArray(data) ? data : data.result ?? [];
    return Array.isArray(payload) ? payload : [];
}

export async function sendRoomMessage(roomId: string, content: string, userId: string): Promise<ChatMessage> {
    const res = await api.post(
        `/api/voice/rooms/${roomId}/messages`,
        { content },
        {
            headers: {
                "X-User-Id": userId,
            },
        },
    );

    const data = res.data as { result?: ChatMessage } | ChatMessage;
    if (data && typeof data === "object" && "result" in data && data.result) {
        return data.result;
    }
    return data as ChatMessage;
}

export async function callVoiceRoomPresence(
    roomId: string,
    type: "join" | "leave",
    userId: string,
): Promise<void> {
    const endpointTemplate = type === "join" ? VOICE_ROOM_JOIN_ENDPOINT : VOICE_ROOM_LEAVE_ENDPOINT;
    const endpoint = buildRoomEndpoint(endpointTemplate, roomId);

    if (endpoint.startsWith("http")) {
        await axios.post(endpoint, null, {
            headers: {
                "X-User-Id": userId,
            },
        });
        return;
    }

    await api.post(endpoint, null, {
        headers: {
            "X-User-Id": userId,
        },
    });
}

export function callVoiceRoomLeaveOnPageExit(roomId: string, userId: string): void {
    const endpoint = buildRoomEndpoint(VOICE_ROOM_LEAVE_ENDPOINT, roomId);
    const url = resolveEndpointUrl(endpoint);

    // Keepalive request is designed for page unload/refresh timing.
    void fetch(url, {
        method: "POST",
        headers: {
            "X-User-Id": userId,
        },
        keepalive: true,
        credentials: "include",
    }).catch(() => {
        // Ignore exit-time failures; browser may still cancel late-stage requests.
    });
}

export async function fetchLivekitToken(roomName: string, participantName: string, userId: string): Promise<string> {
    const payload = { roomName, participantName };
    const headers = {
        "X-User-Id": userId,
    };

    const request = LIVEKIT_TOKEN_ENDPOINT.startsWith("http")
        ? axios.post<LivekitTokenResponse>(LIVEKIT_TOKEN_ENDPOINT, payload, { headers })
        : api.post<LivekitTokenResponse>(LIVEKIT_TOKEN_ENDPOINT, payload, { headers });

    const res = await request;
    return res.data.token;
}
