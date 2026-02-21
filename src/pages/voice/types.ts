export type VoiceRoom = {
    id: string;
    name: string;
    topic: "자유대화방";
    participants: string[];
};

export type ChatMessage = {
    id: string;
    roomId: number;
    senderId: number;
    senderName: string;
    content: string;
    createdAt: string;
};

export type LivekitTokenResponse = {
    token: string;
    roomName: string;
    identity: string;
    participantName: string;
};

export type VoiceRoomUserResponse = {
    userId: number;
    username: string;
};

export type VoiceRoomApiResponse = {
    id: string;
    title: string;
    active: boolean;
    createdAt: string;
    onlineUsers: VoiceRoomUserResponse[];
};

export type VoiceRoomPresencePayload = {
    type: "JOIN" | "LEAVE";
    channelId: number;
    roomId: number;
    userId: number;
    username: string;
    onlineUsers: VoiceRoomUserResponse[];
};

export type RemoteSpeakerLevel = {
    participantId: string;
    name: string;
    level: number;
};
