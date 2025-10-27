"use client"

import DiscussionCard from "./DiscussionCard.tsx";
import type DiscussionCardType from "../types/DiscussionCardType.ts";

interface props {
    discussionCards: DiscussionCardType[];
}

export function DiscussionCards({ discussionCards }: props) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {discussionCards.map((card, index) => (
                <DiscussionCard
                    key={index}
                    discussionCard={card}
                />
            ))}
        </div>
    )
}
