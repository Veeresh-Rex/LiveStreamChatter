export interface Comment {
    id: number;
    user: string;
    text: string;
    timestamp: string;
    color: string;
}

export const getAvatarColor = (name: string) => {
    const colors = ["bg-red-500", "bg-blue-500", "bg-green-500", "bg-yellow-500", "bg-pink-500", "bg-purple-500", "bg-indigo-500"];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
}

export interface JoinRequest {
    userName: string;
}

export interface JoinResponse {
    userName: string;
    userId: string;
    token: string;
}

export interface BackendComment {
    UserName: string;
    Message: string;
    Timestamp: string;
}
