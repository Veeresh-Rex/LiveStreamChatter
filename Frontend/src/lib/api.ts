import type { JoinResponse, JoinRequest } from "./data";

export const joinStream = async (username: string): Promise<JoinResponse> => {
    const response = await fetch("/api/LiveComment/join", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ userName: username } as JoinRequest),
    });

    if (!response.ok) {
        throw new Error("Failed to join stream");
    }

    return response.json();
};

export const postComment = async (token: string, message: string): Promise<void> => {
    const response = await fetch("/api/LiveComment", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-Token-Id": token,
        },
        body: JSON.stringify({ message }),
    });

    if (!response.ok) {
        throw new Error("Failed to post comment");
    }
};
