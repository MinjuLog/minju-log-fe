import { Wifi, WifiOff } from "lucide-react";

type Props = {
    connected: boolean;
};

export default function ConnectionStatus({ connected }: Props) {
    return (
        <div
            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm ${
                connected
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-gray-200 bg-gray-50 text-gray-600"
            }`}
            aria-live="polite"
        >
      <span
          className={`relative flex h-2.5 w-2.5 items-center justify-center`}
          aria-hidden
      >
        <span
            className={`absolute inline-flex h-2.5 w-2.5 rounded-full ${
                connected ? "bg-emerald-500" : "bg-gray-400"
            }`}
        />
          {connected && (
              <span className="absolute inline-flex h-2.5 w-2.5 animate-ping rounded-full bg-emerald-400/70" />
          )}
      </span>

            {connected ? (
                <Wifi className="h-4 w-4" />
            ) : (
                <WifiOff className="h-4 w-4" />
            )}

            <span className="font-medium">{connected ? "실시간 연결됨" : "연결 끊김"}</span>
            <span className="text-xs opacity-80">
        {connected ? "업데이트 수신 중" : "재연결 시도 중"}
      </span>
        </div>
    );
}