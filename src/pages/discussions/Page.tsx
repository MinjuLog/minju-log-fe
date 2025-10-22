import {DebateCards} from "./components/DebateCards.tsx";
import {DebateList} from "./components/DebateList.tsx";
import DiscussionHeader from "../../components/DiscussionHeader.tsx";

export default function DiscussionsPage() {
    return (
        <>
            <DiscussionHeader/>
            <DebateCards />
            <DebateList/>
        </>
    )
}
