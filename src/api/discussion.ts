export const createDiscussionVote = (discussionSequence: number, type: "pros" | "cons"): void => {
    //const userId = localStorage.getItem("userId");
    localStorage.setItem(`discussions/${discussionSequence}/vote`, type);
}

export const getDiscussionVote = (discussionSequence: number): "pros" | "cons" | "none" => {
    const vote = localStorage.getItem(`discussions/${discussionSequence}/vote`);
    if (vote === "pros" || vote === "cons") return vote;
    return "none";
};

// export const createDiscussionSupport = (discussionSequence: number, content: string) => {
//     localStorage.setItem(`discussions/${discussionSequence}`, content);
// }
