export type VoiceRoom = {
    id: string;
    name: string;
    topic: "자유대화방";
    participants: VoiceParticipant[];
};

export type VoiceParticipant = {
    userId: number;
    name: string;
    label: string;
};

export type ChatMessage = {
    id: string;
    roomId: number;
    senderId: number;
    senderName: string;
    content: string;
    createdAt: string;
};

export type HybridTransport = {
    effectiveMode: "mesh" | "sfu";
    configuredMode?: string;
    participantCount?: number;
    switchToSfuAt?: number;
    switchToMeshAt?: number;
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
    hybridTransport?: HybridTransport;
};

export type VoiceRoomPresencePayload = {
    type: "JOIN" | "LEAVE";
    channelId: number;
    roomId: number;
    userId: number;
    username: string;
    onlineUsers: VoiceRoomUserResponse[];
    hybridTransport?: HybridTransport;
};

export type RemoteSpeakerLevel = {
    participantId: string;
    name: string;
    level: number;
};

