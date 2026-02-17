import { useEffect, useState } from "react";
import { Wifi, WifiOff } from "lucide-react";
import { api } from "../api/api";

type Props = {
    connected: boolean;
};

type DeployColor = "green" | "blue";

const CONNECTED_THEME: Record<
    DeployColor,
    { container: string; dot: string; ping: string }
> = {
    green: {
        container: "border-emerald-200 bg-emerald-50 text-emerald-700",
        dot: "bg-emerald-500",
        ping: "bg-emerald-400/70",
    },
    blue: {
        container: "border-blue-200 bg-blue-50 text-blue-700",
        dot: "bg-blue-500",
        ping: "bg-blue-400/70",
    },
};

const DISCONNECTED_THEME = {
    container: "border-gray-200 bg-gray-50 text-gray-600",
    dot: "bg-gray-400",
};

export default function ConnectionStatus({ connected }: Props) {
    const [deployColor, setDeployColor] = useState<DeployColor>("green");

    useEffect(() => {
        const loadDeployColor = async () => {
            try {
                const res = await api.get("/api/deploy-color");
                const value =
                    typeof res.data === "string"
                        ? res.data
                        : res.data?.color ?? res.data?.deployColor;
                if (value === "green" || value === "blue") {
                    setDeployColor(value);
                }
            } catch (error) {
                console.error("deploy color fetch failed", error);
            }
        };

        void loadDeployColor();
    }, []);

    const connectedTheme = CONNECTED_THEME[deployColor];

    return (
        <div
            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm ${
                connected
                    ? connectedTheme.container
                    : DISCONNECTED_THEME.container
            }`}
            aria-live="polite"
        >
      <span
          className={`relative flex h-2.5 w-2.5 items-center justify-center`}
          aria-hidden
      >
        <span
            className={`absolute inline-flex h-2.5 w-2.5 rounded-full ${
                connected ? connectedTheme.dot : DISCONNECTED_THEME.dot
            }`}
        />
          {connected && (
              <span
                  className={`absolute inline-flex h-2.5 w-2.5 animate-ping rounded-full ${connectedTheme.ping}`}
              />
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
