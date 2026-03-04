import { useEffect, useMemo, useRef, useState } from "react";
import type { Client } from "@stomp/stompjs";
import useMeshVoiceConnection from "./useMeshVoiceConnection.ts";
import useSfuVoiceConnection from "./useSfuVoiceConnection.ts";

type UseHybridVoiceConnectionParams = {
    livekitUrl: string | undefined;
    participantName: string;
    getUserId: () => string;
    fetchLivekitToken: (roomName: string, participantName: string, userId: string) => Promise<string>;
    callVoiceRoomPresence: (roomId: string, type: "join" | "leave", userId: string) => Promise<void>;
    wsClientRef: { current: Client | null };
    wsConnected: boolean;
    initialMode?: "mesh" | "sfu";
};

type UseHybridVoiceConnectionResult = ReturnType<typeof useSfuVoiceConnection> & {
    mode: "mesh" | "sfu";
    switchMode: (mode: "mesh" | "sfu", roomIdHint?: string | null) => Promise<void>;
};

export default function useHybridVoiceConnection({
    livekitUrl,
    participantName,
    getUserId,
    fetchLivekitToken,
    callVoiceRoomPresence,
    wsClientRef,
    wsConnected,
    initialMode = "sfu",
}: UseHybridVoiceConnectionParams): UseHybridVoiceConnectionResult {
    const sfu = useSfuVoiceConnection({
        livekitUrl,
        participantName,
        getUserId,
        fetchLivekitToken,
        callVoiceRoomPresence,
    });
    const mesh = useMeshVoiceConnection({
        participantName,
        getUserId,
        callVoiceRoomPresence,
        wsClientRef,
        wsConnected,
    });

    const [mode, setMode] = useState<"mesh" | "sfu">(initialMode);
    const modeRef = useRef<"mesh" | "sfu">(initialMode);
    const switchingRef = useRef(false);

    const getConnection = (connectionMode: "mesh" | "sfu") => (connectionMode === "mesh" ? mesh : sfu);

    const switchMode = async (nextMode: "mesh" | "sfu", roomIdHint: string | null = null) => {
        if (switchingRef.current) return;
        if (nextMode === modeRef.current) return;

        switchingRef.current = true;
        const previousMode = modeRef.current;
        const previousConnection = getConnection(previousMode);
        const roomToRejoin = roomIdHint ?? previousConnection.joinedRoomId;

        try {
            if (previousConnection.joinedRoomId) {
                await previousConnection.leaveRoom();
            }

            modeRef.current = nextMode;
            setMode(nextMode);

            if (roomToRejoin) {
                await getConnection(nextMode).joinRoom(roomToRejoin);
            }
        } catch (error) {
            modeRef.current = previousMode;
            setMode(previousMode);
            throw error;
        } finally {
            switchingRef.current = false;
        }
    };

    useEffect(() => {
        modeRef.current = mode;
    }, [mode]);

    const activeConnection = useMemo(() => getConnection(mode), [mesh, mode, sfu]);

    return {
        ...activeConnection,
        mode,
        switchMode,
    };
}
