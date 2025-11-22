"use client";

import { useEffect, useState } from "react";
import DiscussionCard from "./DiscussionCard";
import { findProposalList } from "../../../api/proposal/proposal";
import discussionCardConverter from "../converter/discussionCardConverter";
import type DiscussionCardType from "../types/DiscussionCardType";

export function DiscussionCards() {
    const [discussionCards, setDiscussionCards] = useState<DiscussionCardType[]>([]);

    useEffect(() => {
        const load = async () => {
            const res = await findProposalList({
                keyword: "",
                status: "COLLECTING",
                sort: "latest",
                pageable: {
                    page: 0,
                    size: 4,
                    sort: ["proposalId,desc"],
                },
            });

            // ErrorResponse | FindProposalListResponse 라고 가정
            if (!res.ok) {
                // TODO: 토스트/알럿 처리
                alert(res.message);
                return;
            }

            const cards = discussionCardConverter(res);
            setDiscussionCards(cards);
        };

        load();
    }, []);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {discussionCards.map((card) => (
                <DiscussionCard key={card.id} discussionCard={card} />
            ))}
        </div>
    );
}