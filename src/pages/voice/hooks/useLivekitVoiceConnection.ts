import axios from "axios";
import { Room, RoomEvent, Track } from "livekit-client";
import { useEffect, useRef, useState, type RefObject } from "react";
import type { RemoteSpeakerLevel } from "../types.ts";

type UseLivekitVoiceConnectionParams = {
    livekitUrl: string | undefined;
    participantName: string;
    getUserId: () => string;
    fetchLivekitToken: (roomName: string, participantName: string, userId: string) => Promise<string>;
    callVoiceRoomPresence: (roomId: string, type: "join" | "leave", userId: string) => Promise<void>;
};

type UseLivekitVoiceConnectionResult = {
    audioContainerRef: RefObject<HTMLDivElement | null>;
    joinedRoomId: string | null;
    isConnecting: boolean;
    connectionError: string | null;
    isMicEnabled: boolean;
    isSpeakerEnabled: boolean;
    micStatusMessage: string | null;
    micDeviceLabel: string;
    speakerDeviceLabel: string;
    mySpeakerLevel: number;
    remoteSpeakerLevels: RemoteSpeakerLevel[];
    joinRoom: (roomId: string) => Promise<void>;
    leaveRoom: () => Promise<void>;
    toggleMicrophone: () => Promise<void>;
    toggleSpeaker: () => void;
};

function normalizeAudioLevel(level: number): number {
    return Math.max(0, Math.min(1, level));
}

function applySpeakerState(targetRoom: Room, enabled: boolean) {
    targetRoom.remoteParticipants.forEach((participant) => {
        participant.trackPublications.forEach((publication) => {
            if (publication.kind === Track.Kind.Audio) {
                publication.setSubscribed(enabled);
            }
        });
    });
}

export default function useLivekitVoiceConnection({
    livekitUrl,
    participantName,
    getUserId,
    fetchLivekitToken,
    callVoiceRoomPresence,
}: UseLivekitVoiceConnectionParams): UseLivekitVoiceConnectionResult {
    const [joinedRoomId, setJoinedRoomId] = useState<string | null>(null);
    const [isConnecting, setIsConnecting] = useState(false);
    const [connectionError, setConnectionError] = useState<string | null>(null);
    const [isMicEnabled, setIsMicEnabled] = useState(true);
    const [isSpeakerEnabled, setIsSpeakerEnabled] = useState(true);
    const [micStatusMessage, setMicStatusMessage] = useState<string | null>(null);
    const [micDeviceLabel, setMicDeviceLabel] = useState("기본 마이크");
    const [speakerDeviceLabel, setSpeakerDeviceLabel] = useState("기본 스피커");
    const [mySpeakerLevel, setMySpeakerLevel] = useState(0);
    const [remoteSpeakerLevels, setRemoteSpeakerLevels] = useState<RemoteSpeakerLevel[]>([]);

    const livekitRoomRef = useRef<Room | null>(null);
    const speakerEnabledRef = useRef(isSpeakerEnabled);
    const suppressDisconnectLeaveRef = useRef(false);
    const activeSpeakerLevelMapRef = useRef<Map<string, number>>(new Map());
    const audioContainerRef = useRef<HTMLDivElement | null>(null);
    const remoteAudioElementsRef = useRef<Map<string, HTMLMediaElement[]>>(new Map());
    const joinedRoomIdRef = useRef<string | null>(joinedRoomId);
    const myLevelIntervalRef = useRef<number | null>(null);

    useEffect(() => {
        speakerEnabledRef.current = isSpeakerEnabled;
    }, [isSpeakerEnabled]);

    useEffect(() => {
        joinedRoomIdRef.current = joinedRoomId;
    }, [joinedRoomId]);

    const clearAllRemoteAudioTracks = () => {
        remoteAudioElementsRef.current.forEach((elements) => {
            elements.forEach((element) => {
                element.pause();
                element.remove();
            });
        });
        remoteAudioElementsRef.current.clear();
    };

    const clearRemoteSpeakerLevels = () => {
        activeSpeakerLevelMapRef.current.clear();
        setRemoteSpeakerLevels([]);
    };

    const stopMyLevelSync = () => {
        if (myLevelIntervalRef.current !== null) {
            window.clearInterval(myLevelIntervalRef.current);
            myLevelIntervalRef.current = null;
        }
        setMySpeakerLevel(0);
    };

    const startMyLevelSync = (room: Room) => {
        stopMyLevelSync();
        myLevelIntervalRef.current = window.setInterval(() => {
            setMySpeakerLevel(normalizeAudioLevel(room.localParticipant.audioLevel ?? 0));
        }, 120);
    };

    const syncRemoteSpeakerLevels = (targetRoom: Room) => {
        const levels = Array.from(targetRoom.remoteParticipants.values()).map((participant) => {
            const name = participant.name?.trim() ? participant.name : participant.identity;
            const level = activeSpeakerLevelMapRef.current.get(participant.identity) ?? 0;
            return {
                participantId: participant.identity,
                name,
                level: normalizeAudioLevel(level),
            };
        });
        setRemoteSpeakerLevels(levels);
    };

    const syncDeviceLabels = async (room?: Room | null) => {
        if (typeof navigator === "undefined" || !navigator.mediaDevices?.enumerateDevices) return;

        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const audioInputs = devices.filter((device) => device.kind === "audioinput");
            const audioOutputs = devices.filter((device) => device.kind === "audiooutput");

            let micName = "기본 마이크";
            let micDeviceId: string | undefined;

            if (room) {
                for (const publication of room.localParticipant.trackPublications.values()) {
                    if (publication.source !== Track.Source.Microphone) continue;
                    const localTrack = publication.track as { mediaStreamTrack?: MediaStreamTrack } | undefined;
                    micDeviceId = localTrack?.mediaStreamTrack?.getSettings?.().deviceId;
                    break;
                }
            }

            if (micDeviceId) {
                const match = audioInputs.find((device) => device.deviceId === micDeviceId);
                if (match?.label) {
                    micName = match.label;
                }
            }

            if (micName === "기본 마이크") {
                const labeledInput = audioInputs.find((device) => Boolean(device.label));
                micName = labeledInput?.label ?? audioInputs[0]?.label ?? "기본 마이크";
            }

            let speakerName = "기본 스피커";
            const preferredOutput = audioOutputs.find((device) => device.deviceId === "default" && Boolean(device.label));
            if (preferredOutput?.label) {
                speakerName = preferredOutput.label;
            } else {
                const labeledOutput = audioOutputs.find((device) => Boolean(device.label));
                speakerName = labeledOutput?.label ?? audioOutputs[0]?.label ?? "기본 스피커";
            }

            setMicDeviceLabel(micName);
            setSpeakerDeviceLabel(speakerName);
        } catch {
            setMicDeviceLabel("기본 마이크");
            setSpeakerDeviceLabel("기본 스피커");
        }
    };

    const attachRemoteAudioTrack = (trackKey: string, track: Track) => {
        if (track.kind !== Track.Kind.Audio) return;
        if (!audioContainerRef.current) return;

        const audioTrack = track as Track & { attach: () => HTMLMediaElement };
        const element = audioTrack.attach();
        element.autoplay = true;
        element.muted = false;
        element.setAttribute("playsinline", "true");
        audioContainerRef.current.appendChild(element);

        const existingElements = remoteAudioElementsRef.current.get(trackKey) ?? [];
        remoteAudioElementsRef.current.set(trackKey, [...existingElements, element]);

        if (speakerEnabledRef.current) {
            void element.play().catch(() => {
                // Autoplay may fail without user gesture; a later interaction will resume it.
            });
        }
    };

    const detachRemoteAudioTrack = (trackKey: string, track?: Track) => {
        const existingElements = remoteAudioElementsRef.current.get(trackKey) ?? [];
        if (existingElements.length === 0) return;

        if (track) {
            const audioTrack = track as Track & { detach: () => HTMLMediaElement[] };
            audioTrack.detach();
        }

        existingElements.forEach((element) => {
            element.pause();
            element.remove();
        });
        remoteAudioElementsRef.current.delete(trackKey);
    };

    const teardownLivekitRoom = (room: Room) => {
        if (livekitRoomRef.current === room) {
            livekitRoomRef.current = null;
        }
        stopMyLevelSync();
        clearAllRemoteAudioTracks();
        clearRemoteSpeakerLevels();
    };

    const bindLivekitEvents = (room: Room, roomId: string, userId: string) => {
        room.on(RoomEvent.Disconnected, () => {
            const shouldCallLeaveApi = !suppressDisconnectLeaveRef.current;
            suppressDisconnectLeaveRef.current = false;

            if (shouldCallLeaveApi) {
                void callVoiceRoomPresence(roomId, "leave", userId).catch(() => {
                    setConnectionError("연결이 끊겨 방 나가기 처리에 실패했습니다.");
                });
            }

            setJoinedRoomId((current) => (current === roomId ? null : current));
            setMicStatusMessage(null);
            teardownLivekitRoom(room);
        });

        room.on(RoomEvent.TrackPublished, (publication) => {
            if (!speakerEnabledRef.current && publication.kind === Track.Kind.Audio) {
                publication.setSubscribed(false);
            }
        });

        room.on(RoomEvent.TrackSubscribed, (track, publication) => {
            const trackKey = publication.trackSid ?? track.sid;
            attachRemoteAudioTrack(trackKey, track);
        });

        room.on(RoomEvent.TrackUnsubscribed, (track, publication) => {
            const trackKey = publication.trackSid ?? track.sid;
            detachRemoteAudioTrack(trackKey, track);
        });

        room.on(RoomEvent.ActiveSpeakersChanged, (speakers) => {
            const nextMap = new Map<string, number>();
            speakers.forEach((participant) => {
                if (participant.identity === room.localParticipant.identity) return;
                nextMap.set(participant.identity, participant.audioLevel ?? 0);
            });
            activeSpeakerLevelMapRef.current = nextMap;
            syncRemoteSpeakerLevels(room);
        });

        room.on(RoomEvent.ParticipantConnected, () => {
            syncRemoteSpeakerLevels(room);
        });

        room.on(RoomEvent.ParticipantDisconnected, (participant) => {
            activeSpeakerLevelMapRef.current.delete(participant.identity);
            syncRemoteSpeakerLevels(room);
        });
    };

    const joinRoom = async (nextRoomId: string) => {
        if (isConnecting) return;
        if (!livekitUrl) {
            const message = "VITE_LIVEKIT_URL 환경변수를 설정해주세요.";
            setConnectionError(message);
            alert(message);
            return;
        }
        if (joinedRoomIdRef.current === nextRoomId && livekitRoomRef.current) return;

        setIsConnecting(true);
        setConnectionError(null);
        setMicStatusMessage(null);

        const userId = getUserId();
        const previousRoom = livekitRoomRef.current;
        const previousJoinedRoomId = joinedRoomIdRef.current;
        let connectedRoom: Room | null = null;

        try {
            const token = await fetchLivekitToken(nextRoomId, participantName, userId);

            if (previousRoom && previousJoinedRoomId && previousJoinedRoomId !== nextRoomId) {
                suppressDisconnectLeaveRef.current = true;
                previousRoom.disconnect();
                await callVoiceRoomPresence(previousJoinedRoomId, "leave", userId);
                setJoinedRoomId(null);
                teardownLivekitRoom(previousRoom);
            } else if (previousRoom) {
                previousRoom.disconnect();
                teardownLivekitRoom(previousRoom);
            }

            connectedRoom = new Room();
            await connectedRoom.connect(livekitUrl, token);
            applySpeakerState(connectedRoom, speakerEnabledRef.current);
            startMyLevelSync(connectedRoom);
            await syncDeviceLabels(connectedRoom);

            try {
                await connectedRoom.localParticipant.setMicrophoneEnabled(isMicEnabled);
                setMicStatusMessage(isMicEnabled ? "마이크 전송 중" : "마이크 꺼짐");
            } catch (micError) {
                const message =
                    micError instanceof Error
                        ? `마이크를 켤 수 없습니다: ${micError.message}`
                        : "마이크를 켤 수 없습니다. 권한/장치를 확인해주세요.";
                setMicStatusMessage(message);
                setIsMicEnabled(false);
            }

            bindLivekitEvents(connectedRoom, nextRoomId, userId);
            await callVoiceRoomPresence(nextRoomId, "join", userId);

            livekitRoomRef.current = connectedRoom;
            setJoinedRoomId(nextRoomId);
            syncRemoteSpeakerLevels(connectedRoom);
        } catch (error) {
            connectedRoom?.disconnect();
            const message = axios.isAxiosError(error)
                ? error.response?.data?.message ?? "LiveKit 연결 또는 음성방 참여 처리에 실패했습니다."
                : error instanceof Error
                  ? error.message
                  : "LiveKit 연결 또는 음성방 참여 처리에 실패했습니다.";
            setConnectionError(message);
            alert(message);
        } finally {
            setIsConnecting(false);
        }
    };

    const leaveRoom = async () => {
        const currentRoomId = joinedRoomIdRef.current;
        if (!currentRoomId) return;

        const userId = getUserId();
        const currentRoom = livekitRoomRef.current;

        try {
            await callVoiceRoomPresence(currentRoomId, "leave", userId);
        } catch (error) {
            const message = axios.isAxiosError(error)
                ? error.response?.data?.message ?? "방 나가기 처리에 실패했습니다."
                : "방 나가기 처리에 실패했습니다.";
            setConnectionError(message);
        }

        suppressDisconnectLeaveRef.current = true;
        currentRoom?.disconnect();
        if (currentRoom) {
            teardownLivekitRoom(currentRoom);
        } else {
            clearAllRemoteAudioTracks();
            clearRemoteSpeakerLevels();
        }
        setJoinedRoomId(null);
        setMicStatusMessage(null);
    };

    const toggleMicrophone = async () => {
        const room = livekitRoomRef.current;
        if (!room || !joinedRoomIdRef.current) return;

        const nextMicEnabled = !isMicEnabled;
        try {
            await room.localParticipant.setMicrophoneEnabled(nextMicEnabled);
            setIsMicEnabled(nextMicEnabled);
            setMicStatusMessage(nextMicEnabled ? "마이크 전송 중" : "마이크 꺼짐");
            if (!nextMicEnabled) {
                setMySpeakerLevel(0);
            }
            await syncDeviceLabels(room);
        } catch (error) {
            const message =
                error instanceof Error
                    ? `마이크 설정 실패: ${error.message}`
                    : "마이크 설정에 실패했습니다. 권한/장치를 확인해주세요.";
            setMicStatusMessage(message);
            setIsMicEnabled(false);
        }
    };

    const toggleSpeaker = () => {
        const nextSpeakerEnabled = !speakerEnabledRef.current;
        setIsSpeakerEnabled(nextSpeakerEnabled);
        speakerEnabledRef.current = nextSpeakerEnabled;

        const room = livekitRoomRef.current;
        if (room) {
            applySpeakerState(room, nextSpeakerEnabled);
        }
    };

    useEffect(() => {
        void syncDeviceLabels(null);

        const onDeviceChange = () => {
            void syncDeviceLabels(livekitRoomRef.current);
        };

        navigator.mediaDevices?.addEventListener?.("devicechange", onDeviceChange);

        return () => {
            const room = livekitRoomRef.current;
            suppressDisconnectLeaveRef.current = true;
            room?.disconnect();
            remoteAudioElementsRef.current.forEach((elements) => {
                elements.forEach((element) => {
                    element.pause();
                    element.remove();
                });
            });
            remoteAudioElementsRef.current.clear();
            activeSpeakerLevelMapRef.current.clear();
            if (myLevelIntervalRef.current !== null) {
                window.clearInterval(myLevelIntervalRef.current);
                myLevelIntervalRef.current = null;
            }
            navigator.mediaDevices?.removeEventListener?.("devicechange", onDeviceChange);
        };
    }, []);

    return {
        audioContainerRef,
        joinedRoomId,
        isConnecting,
        connectionError,
        isMicEnabled,
        isSpeakerEnabled,
        micStatusMessage,
        micDeviceLabel,
        speakerDeviceLabel,
        mySpeakerLevel,
        remoteSpeakerLevels,
        joinRoom,
        leaveRoom,
        toggleMicrophone,
        toggleSpeaker,
    };
}
