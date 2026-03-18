const WORKSPACE_TOPIC_PREFIX = "/topic/workspace";

export const WORKSPACE_ID = "1";

type WorkspaceTopicSuffix = "reaction" | "connect" | "delete" | "online-users" | "like";

export function getWorkspaceTopic(workspaceId: string | number, suffix?: WorkspaceTopicSuffix) {
    const baseTopic = `${WORKSPACE_TOPIC_PREFIX}.${workspaceId}`;
    return suffix ? `${baseTopic}.${suffix}` : baseTopic;
}
