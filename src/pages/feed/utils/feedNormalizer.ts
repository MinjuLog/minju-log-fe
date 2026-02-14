import type FeedType from "../types/FeedType";

type RawReaction = Partial<FeedType["reactions"][number]> & {
    reactionKey?: string | null;
    key?: string | null;
    count?: number | null;
};

type RawFeed = Omit<FeedType, "reactions"> & {
    reactions?: RawReaction[] | null;
};

function normalizeReaction(reaction: RawReaction): FeedType["reactions"][number] {
    const emojiKey = reaction.emojiKey ?? reaction.reactionKey ?? reaction.key ?? "";
    const emojiCount = reaction.emojiCount ?? reaction.count ?? 0;

    return {
        emojiKey,
        emojiType: reaction.emojiType ?? "DEFAULT",
        objectKey: reaction.objectKey ?? null,
        unicode: reaction.unicode ?? null,
        emojiCount,
        pressedByMe: reaction.pressedByMe ?? false,
    };
}

export function normalizeFeed(feed: RawFeed): FeedType {
    return {
        ...feed,
        reactions: (feed.reactions ?? []).map(normalizeReaction),
    };
}
