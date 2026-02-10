import type React from "react";
import OnlineUsersPanel, { type OnlineUser } from "./OnlineUserPanel";
import WorkspaceLikePanel from "./LikePanel";

type Props = {
    onlineUserList: OnlineUser[];
    connected: boolean;
    likeCount: number;
    setLikeCount: React.Dispatch<React.SetStateAction<number>>;
    clientRef: React.MutableRefObject<any>;
};

export default function FeedSidebar({
    onlineUserList,
    connected,
    likeCount,
    setLikeCount,
    clientRef,
}: Props) {
    return (
        <div className="lg:col-span-4">
            <div className="sticky top-6 space-y-4">
                <OnlineUsersPanel onlineUserList={onlineUserList} connected={connected} />
                <WorkspaceLikePanel
                    connected={connected}
                    clientRef={clientRef}
                    likeCount={likeCount}
                    setLikeCount={setLikeCount}
                />
            </div>
        </div>
    );
}
