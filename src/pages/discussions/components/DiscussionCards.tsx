"use client";

import { useEffect, useState } from "react";
import DiscussionCard from "./DiscussionCard";
import { findProposalList } from "../../../api/proposal/proposal";
import discussionCardConverter from "../converter/discussionCardConverter";
import type DiscussionCardType from "../types/DiscussionCardType";
import DiscussionCardSkeleton from "./DiscussionCardSkeleton.tsx";

export function DiscussionCards({ isLocLoading }: { isLocLoading: boolean }) {
    const [discussionCards, setDiscussionCards] = useState<DiscussionCardType[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);

                const res = await findProposalList({
                    keyword: "",
                    status: "COLLECTING",
                    sort: "popular",
                    page: 0,
                    size: 4,
                });

                if (!res.ok) {
                    alert(res.message);
                    return;
                }

                const cards = discussionCardConverter(res);
                setDiscussionCards(cards);
            } finally {
                setLoading(false);
            }
        };

        load();
    }, []);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {(isLocLoading || loading)
                ? Array.from({ length: 4 }).map((_, idx) => (
                    <DiscussionCardSkeleton key={idx} />
                ))
                : discussionCards.map((card) => (
                    <DiscussionCard key={card.id} discussionCard={card} />
                ))}
        </div>
    );
}