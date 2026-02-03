import type FeedType from "../../types/FeedType.ts";

export default interface GetFeedListResponse {
    ok: true;
    result: FeedType[];
}