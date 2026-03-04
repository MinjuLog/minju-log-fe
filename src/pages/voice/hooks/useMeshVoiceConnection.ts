import type { Client, IMessage, StompSubscription } from "@stomp/stompjs";
import { useEffect, useRef, useState, type RefObject } from "react";
import type { RemoteSpeakerLevel } from "../types.ts";

type UseMeshVoiceConnectionParams = {
    participantName: string;
    getUserId: () => string;
    callVoiceRoomPresence: (roomId: string, type: "join" | "leave", userId: string) => Promise<void>;
    wsClientRef: { current: Client | null };
    wsConnected: boolean;
};

type UseMeshVoiceConnectionResult = {
    audioContainerRef: RefObject<HTMLDivElement | null>;
    joinedRoomId: string | null;
    isConnecting: boolean;
    connectionError: string | null;
    isMicEnabled: boolean;
    isSpeakerEnabled: boolean;
    micStatusMessage: string | null;
    micDeviceLabel: string;
    micDevices: { id: string; label: string }[];
    selectedMicDeviceId: string | null;
    speakerDevices: { id: string; label: string }[];
    selectedSpeakerDeviceId: string | null;
    speakerDeviceLabel: string;
    mySpeakerLevel: number;
    remoteSpeakerLevels: RemoteSpeakerLevel[];
    joinRoom: (roomId: string) => Promise<void>;
    leaveRoom: () => Promise<void>;
    toggleMicrophone: () => Promise<void>;
    selectMicrophoneDevice: (deviceId: string) => Promise<void>;
    selectSpeakerDevice: (deviceId: string) => Promise<void>;
    toggleSpeaker: () => void;
};

type MeshSignalType = "HELLO" | "OFFER" | "ANSWER" | "ICE" | "LEAVE";

type MeshSignalMessage = {
    roomId: string;
    fromUserId: string;
    fromName?: string;
    toUserId?: string | null;
    type: MeshSignalType;
    sdp?: RTCSessionDescriptionInit;
    candidate?: RTCIceCandidateInit;
};

const SIGNAL_TOPIC_TEMPLATE = (import.meta.env.VITE_VOICE_SIGNAL_TOPIC_TEMPLATE as string | undefined) ?? "/topic/voice.room.{roomId}.signal";
const SIGNAL_SEND_ENDPOINT = (import.meta.env.VITE_VOICE_SIGNAL_SEND_ENDPOINT as string | undefined) ?? "/app/voice/rooms/{roomId}/signal";
const STUN_SERVERS = (import.meta.env.VITE_MESH_ICE_SERVERS as string | undefined) ?? "stun:stun.l.google.com:19302,stun:stun1.l.google.com:19302";

function normalizeAudioLevel(level: number): number {
    return Math.max(0, Math.min(1, level));
}

function resolveTemplate(template: string, roomId: string): string {
    return template.includes("{roomId}") ? template.replace("{roomId}", roomId) : template;
}

function makeIceServers(): RTCIceServer[] {
    return STUN_SERVERS.split(",")
        .map((url) => url.trim())
        .filter(Boolean)
        .map((urls) => ({ urls }));
}

export default function useMeshVoiceConnection({
    participantName,
    getUserId,
    callVoiceRoomPresence,
    wsClientRef,
    wsConnected,
}: UseMeshVoiceConnectionParams): UseMeshVoiceConnectionResult {
    const [joinedRoomId, setJoinedRoomId] = useState<string | null>(null);
    const [isConnecting, setIsConnecting] = useState(false);
    const [connectionError, setConnectionError] = useState<string | null>(null);
    const [isMicEnabled, setIsMicEnabled] = useState(false);
    const [isSpeakerEnabled, setIsSpeakerEnabled] = useState(true);
    const [micStatusMessage, setMicStatusMessage] = useState<string | null>(null);
    const [micDeviceLabel, setMicDeviceLabel] = useState("기본 마이크");
    const [micDevices, setMicDevices] = useState<{ id: string; label: string }[]>([]);
    const [selectedMicDeviceId, setSelectedMicDeviceId] = useState<string | null>(null);
    const [speakerDevices, setSpeakerDevices] = useState<{ id: string; label: string }[]>([]);
    const [selectedSpeakerDeviceId, setSelectedSpeakerDeviceId] = useState<string | null>(null);
    const [speakerDeviceLabel, setSpeakerDeviceLabel] = useState("기본 스피커");
    const [mySpeakerLevel, setMySpeakerLevel] = useState(0);
    const [remoteSpeakerLevels, setRemoteSpeakerLevels] = useState<RemoteSpeakerLevel[]>([]);

    const audioContainerRef = useRef<HTMLDivElement | null>(null);
    const joinedRoomIdRef = useRef<string | null>(null);
    const localStreamRef = useRef<MediaStream | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const levelTimerRef = useRef<number | null>(null);
    const signalSubRef = useRef<StompSubscription | null>(null);
    const selectedSpeakerDeviceIdRef = useRef<string | null>(null);
    const isSpeakerEnabledRef = useRef(isSpeakerEnabled);

    const peerConnByUserIdRef = useRef<Map<string, RTCPeerConnection>>(new Map());
    const peerNameByUserIdRef = useRef<Map<string, string>>(new Map());
    const remoteAudioByUserIdRef = useRef<Map<string, HTMLAudioElement>>(new Map());

    const stopMyLevelSync = () => {
        if (levelTimerRef.current !== null) {
            window.clearInterval(levelTimerRef.current);
            levelTimerRef.current = null;
        }
        setMySpeakerLevel(0);
    };

    const syncRemoteSpeakerRows = () => {
        const rows: RemoteSpeakerLevel[] = Array.from(peerNameByUserIdRef.current.entries()).map(([participantId, name]) => ({
            participantId,
            name: name || participantId,
            level: 0,
        }));
        setRemoteSpeakerLevels(rows);
    };

    const closeMicPipeline = async () => {
        stopMyLevelSync();
        localStreamRef.current?.getTracks().forEach((track) => track.stop());
        localStreamRef.current = null;

        if (audioContextRef.current) {
            await audioContextRef.current.close().catch(() => {});
            audioContextRef.current = null;
        }
        analyserRef.current = null;
    };

    const applySinkIdToElement = async (element: HTMLAudioElement, deviceId: string | null) => {
        const sinkAwareElement = element as HTMLAudioElement & { setSinkId?: (id: string) => Promise<void> };
        if (!sinkAwareElement.setSinkId) return;
        const sinkId = !deviceId || deviceId === "default" ? "" : deviceId;
        await sinkAwareElement.setSinkId(sinkId);
    };

    const applySpeakerStateToElements = () => {
        remoteAudioByUserIdRef.current.forEach((el) => {
            el.muted = !isSpeakerEnabledRef.current;
            if (isSpeakerEnabledRef.current) {
                void el.play().catch(() => {});
            } else {
                el.pause();
            }
        });
    };

    const applySinkIdToRemoteTracks = async (deviceId: string | null) => {
        const tasks = Array.from(remoteAudioByUserIdRef.current.values()).map((el) => applySinkIdToElement(el, deviceId).catch(() => {}));
        await Promise.all(tasks);
    };

    const attachRemoteStream = async (remoteUserId: string, stream: MediaStream) => {
        if (!audioContainerRef.current) return;
        const existing = remoteAudioByUserIdRef.current.get(remoteUserId);
        if (existing) {
            existing.srcObject = stream;
            return;
        }

        const element = document.createElement("audio");
        element.autoplay = true;
        element.setAttribute("playsinline", "true");
        element.srcObject = stream;
        element.muted = !isSpeakerEnabledRef.current;
        audioContainerRef.current.appendChild(element);
        remoteAudioByUserIdRef.current.set(remoteUserId, element);

        await applySinkIdToElement(element, selectedSpeakerDeviceIdRef.current).catch(() => {});
        if (isSpeakerEnabledRef.current) {
            void element.play().catch(() => {});
        }
    };

    const detachRemoteStream = (remoteUserId: string) => {
        const existing = remoteAudioByUserIdRef.current.get(remoteUserId);
        if (!existing) return;
        existing.pause();
        existing.remove();
        remoteAudioByUserIdRef.current.delete(remoteUserId);
    };

    const disconnectPeer = (remoteUserId: string) => {
        const pc = peerConnByUserIdRef.current.get(remoteUserId);
        if (pc) {
            pc.onicecandidate = null;
            pc.ontrack = null;
            pc.onconnectionstatechange = null;
            pc.close();
            peerConnByUserIdRef.current.delete(remoteUserId);
        }
        peerNameByUserIdRef.current.delete(remoteUserId);
        detachRemoteStream(remoteUserId);
        syncRemoteSpeakerRows();
    };

    const disconnectAllPeers = () => {
        Array.from(peerConnByUserIdRef.current.keys()).forEach((remoteUserId) => disconnectPeer(remoteUserId));
    };

    const publishSignal = (payload: MeshSignalMessage) => {
        const roomId = joinedRoomIdRef.current ?? payload.roomId;
        const endpoint = resolveTemplate(SIGNAL_SEND_ENDPOINT, roomId);
        wsClientRef.current?.publish({
            destination: endpoint,
            body: JSON.stringify(payload),
            headers: { "content-type": "application/json" },
        });
    };

    const createPeerConnection = (remoteUserId: string, remoteName?: string): RTCPeerConnection => {
        const existing = peerConnByUserIdRef.current.get(remoteUserId);
        if (existing) return existing;

        const roomId = joinedRoomIdRef.current;
        if (!roomId) {
            throw new Error("Mesh 연결 방 정보가 없습니다.");
        }

        const myUserId = getUserId();
        const pc = new RTCPeerConnection({
            iceServers: makeIceServers(),
        });
        peerConnByUserIdRef.current.set(remoteUserId, pc);
        if (remoteName) {
            peerNameByUserIdRef.current.set(remoteUserId, remoteName);
        } else if (!peerNameByUserIdRef.current.has(remoteUserId)) {
            peerNameByUserIdRef.current.set(remoteUserId, remoteUserId);
        }
        syncRemoteSpeakerRows();

        localStreamRef.current?.getTracks().forEach((track) => {
            pc.addTrack(track, localStreamRef.current as MediaStream);
        });

        pc.onicecandidate = (event) => {
            if (!event.candidate) return;
            publishSignal({
                roomId,
                fromUserId: myUserId,
                fromName: participantName,
                toUserId: remoteUserId,
                type: "ICE",
                candidate: event.candidate.toJSON(),
            });
        };

        pc.ontrack = (event) => {
            const stream = event.streams[0];
            if (!stream) return;
            void attachRemoteStream(remoteUserId, stream);
        };

        pc.onconnectionstatechange = () => {
            if (pc.connectionState === "failed" || pc.connectionState === "closed" || pc.connectionState === "disconnected") {
                disconnectPeer(remoteUserId);
            }
        };

        return pc;
    };

    const createAndSendOffer = async (remoteUserId: string, remoteName?: string) => {
        const roomId = joinedRoomIdRef.current;
        if (!roomId) return;

        const pc = createPeerConnection(remoteUserId, remoteName);
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        publishSignal({
            roomId,
            fromUserId: getUserId(),
            fromName: participantName,
            toUserId: remoteUserId,
            type: "OFFER",
            sdp: offer,
        });
    };

    const handleSignal = async (message: MeshSignalMessage) => {
        const myUserId = getUserId();
        const roomId = joinedRoomIdRef.current;
        if (!roomId) return;
        if (message.roomId !== roomId) return;
        if (message.fromUserId === myUserId) return;
        if (message.toUserId && message.toUserId !== myUserId) return;

        const remoteUserId = message.fromUserId;
        const remoteName = message.fromName;

        try {
            if (message.type === "HELLO") {
                peerNameByUserIdRef.current.set(remoteUserId, remoteName || remoteUserId);
                syncRemoteSpeakerRows();

                // One-side initiator rule to avoid glare.
                if (myUserId > remoteUserId) {
                    await createAndSendOffer(remoteUserId, remoteName);
                }
                return;
            }

            if (message.type === "LEAVE") {
                disconnectPeer(remoteUserId);
                return;
            }

            const pc = createPeerConnection(remoteUserId, remoteName);

            if (message.type === "OFFER" && message.sdp) {
                await pc.setRemoteDescription(new RTCSessionDescription(message.sdp));
                const answer = await pc.createAnswer();
                await pc.setLocalDescription(answer);
                publishSignal({
                    roomId,
                    fromUserId: myUserId,
                    fromName: participantName,
                    toUserId: remoteUserId,
                    type: "ANSWER",
                    sdp: answer,
                });
                return;
            }

            if (message.type === "ANSWER" && message.sdp) {
                if (pc.signalingState !== "have-local-offer") return;
                await pc.setRemoteDescription(new RTCSessionDescription(message.sdp));
                return;
            }

            if (message.type === "ICE" && message.candidate) {
                await pc.addIceCandidate(new RTCIceCandidate(message.candidate));
            }
        } catch {
            setConnectionError("Mesh 시그널 처리 중 오류가 발생했습니다.");
        }
    };

    const subscribeSignal = (roomId: string) => {
        signalSubRef.current?.unsubscribe();
        signalSubRef.current = null;

        const client = wsClientRef.current;
        if (!client?.connected) return false;

        const topic = resolveTemplate(SIGNAL_TOPIC_TEMPLATE, roomId);
        signalSubRef.current = client.subscribe(topic, (msg: IMessage) => {
            const payload = JSON.parse(msg.body) as MeshSignalMessage;
            void handleSignal(payload);
        });
        return true;
    };

    const startMyLevelSync = () => {
        if (!analyserRef.current) return;
        stopMyLevelSync();
        const analyser = analyserRef.current;
        const data = new Uint8Array(analyser.fftSize);
        levelTimerRef.current = window.setInterval(() => {
            analyser.getByteTimeDomainData(data);
            let sumSquares = 0;
            for (let i = 0; i < data.length; i += 1) {
                const sample = (data[i] - 128) / 128;
                sumSquares += sample * sample;
            }
            const rms = Math.sqrt(sumSquares / data.length);
            setMySpeakerLevel(normalizeAudioLevel(rms * 3.5));
        }, 120);
    };

    const syncDeviceLabels = async () => {
        if (typeof navigator === "undefined" || !navigator.mediaDevices?.enumerateDevices) return;

        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const audioInputs = devices.filter((device) => device.kind === "audioinput");
            const audioOutputs = devices.filter((device) => device.kind === "audiooutput");
            const mappedInputs = audioInputs.map((device, index) => ({
                id: device.deviceId,
                label: device.label || `마이크 ${index + 1}`,
            }));
            const mappedOutputs = audioOutputs.map((device, index) => ({
                id: device.deviceId,
                label: device.label || `스피커 ${index + 1}`,
            }));
            setMicDevices(mappedInputs);
            setSpeakerDevices(mappedOutputs);

            const currentMicId = selectedMicDeviceId ?? audioInputs[0]?.deviceId ?? null;
            const currentSpeakerId = selectedSpeakerDeviceIdRef.current ?? audioOutputs[0]?.deviceId ?? null;
            const currentMic = audioInputs.find((device) => device.deviceId === currentMicId);
            const currentSpeaker = audioOutputs.find((device) => device.deviceId === currentSpeakerId);

            setSelectedMicDeviceId(currentMicId);
            setSelectedSpeakerDeviceId(currentSpeakerId);
            selectedSpeakerDeviceIdRef.current = currentSpeakerId;
            setMicDeviceLabel(currentMic?.label || "기본 마이크");
            setSpeakerDeviceLabel(currentSpeaker?.label || "기본 스피커");
        } catch {
            setMicDevices([]);
            setSpeakerDevices([]);
            setSelectedMicDeviceId(null);
            setSelectedSpeakerDeviceId(null);
            selectedSpeakerDeviceIdRef.current = null;
            setMicDeviceLabel("기본 마이크");
            setSpeakerDeviceLabel("기본 스피커");
        }
    };

    const openMicrophone = async (deviceId?: string) => {
        await closeMicPipeline();
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: deviceId ? { deviceId: { exact: deviceId } } : true,
        });
        localStreamRef.current = stream;

        const audioContext = new AudioContext();
        const source = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 1024;
        source.connect(analyser);
        audioContextRef.current = audioContext;
        analyserRef.current = analyser;
        startMyLevelSync();
    };

    const replaceLocalTracks = async () => {
        const localStream = localStreamRef.current;
        if (!localStream) return;
        const track = localStream.getAudioTracks()[0] ?? null;
        const tasks: Promise<void>[] = [];
        peerConnByUserIdRef.current.forEach((pc) => {
            const sender = pc.getSenders().find((item) => item.track?.kind === "audio");
            if (!sender) {
                if (track) {
                    pc.addTrack(track, localStream);
                }
                return;
            }
            tasks.push(sender.replaceTrack(track));
        });
        await Promise.all(tasks);
    };

    const joinRoom = async (roomId: string) => {
        if (isConnecting) return;
        if (!participantName.trim()) {
            setConnectionError("참가자 이름이 비어 있습니다.");
            return;
        }

        setIsConnecting(true);
        setConnectionError(null);
        setMicStatusMessage(null);

        const userId = getUserId();

        try {
            await callVoiceRoomPresence(roomId, "join", userId);

            try {
                await openMicrophone(selectedMicDeviceId ?? undefined);
            } catch (micError) {
                setIsMicEnabled(false);
                const message =
                    micError instanceof Error
                        ? `마이크를 열 수 없습니다: ${micError.message}`
                        : "마이크를 열 수 없습니다. 권한/장치를 확인해주세요.";
                setMicStatusMessage(message);
            }

            setJoinedRoomId(roomId);
            syncRemoteSpeakerRows();
            if (isMicEnabled) {
                setMicStatusMessage("마이크 전송 중");
            }
            await syncDeviceLabels();

            if (wsConnected && wsClientRef.current?.connected) {
                const subscribed = subscribeSignal(roomId);
                if (subscribed) {
                    publishSignal({
                        roomId,
                        fromUserId: userId,
                        fromName: participantName,
                        type: "HELLO",
                    });
                } else {
                    setConnectionError("시그널 토픽 구독에 실패했습니다.");
                }
            } else {
                setConnectionError("시그널링 연결이 준비되지 않았습니다. (입장 처리만 완료)");
            }
        } catch (error) {
            const message = error instanceof Error ? error.message : "Mesh 연결 준비에 실패했습니다.";
            setConnectionError(message);
            signalSubRef.current?.unsubscribe();
            signalSubRef.current = null;
            await closeMicPipeline();
            disconnectAllPeers();
            setJoinedRoomId(null);
        } finally {
            setIsConnecting(false);
        }
    };

    const leaveRoom = async () => {
        const roomId = joinedRoomIdRef.current;
        if (!roomId) return;

        const userId = getUserId();

        try {
            publishSignal({
                roomId,
                fromUserId: userId,
                fromName: participantName,
                type: "LEAVE",
            });
        } catch {
            // ignore
        }

        try {
            await callVoiceRoomPresence(roomId, "leave", userId);
        } catch {
            setConnectionError("방 나가기 처리에 실패했습니다.");
        }

        signalSubRef.current?.unsubscribe();
        signalSubRef.current = null;
        disconnectAllPeers();
        await closeMicPipeline();
        setJoinedRoomId(null);
        setRemoteSpeakerLevels([]);
        setMicStatusMessage(null);
    };

    const toggleMicrophone = async () => {
        const stream = localStreamRef.current;
        if (!stream) return;

        const nextEnabled = !isMicEnabled;
        stream.getAudioTracks().forEach((track) => {
            track.enabled = nextEnabled;
        });
        setIsMicEnabled(nextEnabled);
        setMicStatusMessage(nextEnabled ? "마이크 전송 중" : "마이크 꺼짐");
        if (!nextEnabled) {
            setMySpeakerLevel(0);
        }
    };

    const selectMicrophoneDevice = async (deviceId: string) => {
        if (!joinedRoomIdRef.current) return;
        try {
            await openMicrophone(deviceId);
            setSelectedMicDeviceId(deviceId);
            await replaceLocalTracks();
            setMicStatusMessage(isMicEnabled ? "마이크 전송 중" : "마이크 꺼짐");
            await syncDeviceLabels();
        } catch (error) {
            const message = error instanceof Error ? `마이크 장치 변경 실패: ${error.message}` : "마이크 장치 변경에 실패했습니다.";
            setMicStatusMessage(message);
        }
    };

    const selectSpeakerDevice = async (deviceId: string) => {
        selectedSpeakerDeviceIdRef.current = deviceId;
        setSelectedSpeakerDeviceId(deviceId);
        await applySinkIdToRemoteTracks(deviceId);
        await syncDeviceLabels();
    };

    const toggleSpeaker = () => {
        const next = !isSpeakerEnabledRef.current;
        isSpeakerEnabledRef.current = next;
        setIsSpeakerEnabled(next);
        applySpeakerStateToElements();
    };

    useEffect(() => {
        joinedRoomIdRef.current = joinedRoomId;
    }, [joinedRoomId]);

    useEffect(() => {
        selectedSpeakerDeviceIdRef.current = selectedSpeakerDeviceId;
    }, [selectedSpeakerDeviceId]);

    useEffect(() => {
        isSpeakerEnabledRef.current = isSpeakerEnabled;
    }, [isSpeakerEnabled]);

    useEffect(() => {
        void syncDeviceLabels();

        const onDeviceChange = () => {
            void syncDeviceLabels();
        };

        navigator.mediaDevices?.addEventListener?.("devicechange", onDeviceChange);

        return () => {
            signalSubRef.current?.unsubscribe();
            signalSubRef.current = null;
            disconnectAllPeers();
            void closeMicPipeline();
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
        micDevices,
        selectedMicDeviceId,
        speakerDevices,
        selectedSpeakerDeviceId,
        speakerDeviceLabel,
        mySpeakerLevel,
        remoteSpeakerLevels,
        joinRoom,
        leaveRoom,
        toggleMicrophone,
        selectMicrophoneDevice,
        selectSpeakerDevice,
        toggleSpeaker,
    };
}
