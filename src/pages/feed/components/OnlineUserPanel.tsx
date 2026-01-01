import { Users, Crown } from "lucide-react";

export type OnlineUser = {
    id: number | string;
    name: string;
    role?: "me" | "host" | "user";
    status?: "online" | "idle";
};

type Props = {
    connected: boolean;
    onlineUserList: OnlineUser[];
    title?: string;
};

export default function OnlineUsersPanel({
                                             connected,
                                            onlineUserList,
                                             title = "접속자",
                                         }: Props) {

    return (
        <aside className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-700" />
                    <h2 className="text-sm font-semibold text-gray-900">{title}</h2>
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
            {onlineUserList.length}
          </span>
                </div>

                <span
                    className={`text-xs ${
                        connected ? "text-emerald-600" : "text-gray-500"
                    }`}
                >
          {connected ? "실시간" : "오프라인"}
        </span>
            </div>

            <div className="mt-3 border-t border-gray-100 pt-3">
                {onlineUserList.length === 0 ? (
                    <div className="text-sm text-gray-500">
                        아직 표시할 접속자가 없습니다.
                        <div className="mt-1 text-xs text-gray-400">
                            (나중에 WS로 목록을 받아오면 여기 채워집니다)
                        </div>
                    </div>
                ) : (
                    <ul className="space-y-2">
                        {onlineUserList.map((u) => (
                            <li
                                key={u.id}
                                className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2"
                            >
                                <div className="flex items-center gap-2">
                                  <span
                                      className={`h-2 w-2 rounded-full ${
                                          u.status === "idle" ? "bg-amber-400" : "bg-emerald-500"
                                      }`}
                                      aria-hidden
                                  />
                                    <span className="text-sm font-medium text-gray-900">
                                        {u.name}
                                      </span>
                                    {u.role === "me" && (
                                        <span className="rounded bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700">
                                          나
                                        </span>
                                    )}
                                    {u.role === "host" && (
                                        <span className="inline-flex items-center gap-1 rounded bg-purple-50 px-2 py-0.5 text-xs font-semibold text-purple-700">
                                          <Crown className="h-3 w-3" />
                                          호스트
                                        </span>
                                    )}
                                </div>

                                <span className="text-xs text-gray-500">
                                  {u.status === "idle" ? "자리 비움" : "온라인"}
                                </span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </aside>
    );
}