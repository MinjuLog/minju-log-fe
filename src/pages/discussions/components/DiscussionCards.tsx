"use client";

import { useEffect, useState } from "react";
import DiscussionCard from "./DiscussionCard";
import { findProposalList } from "../../../api/proposal/proposal";
import discussionCardConverter from "../converter/discussionCardConverter";
import type DiscussionCardType from "../types/DiscussionCardType";

function DiscussionCardSkeleton() {
    return (
        <div
            className="relative overflow-hidden rounded-2xl bg-gray-200/60 p-6 flex flex-col justify-between min-h-[350px] animate-pulse"
        >
            <div>
                <div className="h-4 w-32 bg-gray-300 rounded mb-4" />
                <div className="h-7 w-40 bg-gray-300 rounded mb-2" />
                <div className="h-7 w-24 bg-gray-300 rounded" />
            </div>

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                    <div className="w-4 h-4 bg-gray-300 rounded-full" />
                    <span className="h-4 w-16 bg-gray-300 rounded" />
                </div>

                <div className="flex items-center gap-2 px-4 py-2 bg-gray-300 rounded-lg">
                    <div className="w-4 h-4 bg-gray-200 rounded" />
                    <span className="h-4 w-14 bg-gray-200 rounded" />
                </div>
            </div>
        </div>
    );
}

export function DiscussionCards() {
    const [discussionCards, setDiscussionCards] = useState<DiscussionCardType[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);

                const res = await findProposalList({
                    keyword: "",
                    status: "COLLECTING",
                    sort: "latest",
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
            {loading
                ? Array.from({ length: 4 }).map((_, idx) => (
                    <DiscussionCardSkeleton key={idx} />
                ))
                : discussionCards.map((card) => (
                    <DiscussionCard key={card.id} discussionCard={card} />
                ))}
        </div>
    );
}