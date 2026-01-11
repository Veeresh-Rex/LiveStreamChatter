export interface Comment {
    id: number;
    user: string;
    text: string;
    timestamp: string;
    color: string;
}

export const MOCK_COMMENTS: Comment[] = [
    { id: 1, user: "Alice", text: "Hello everyone! 👋", timestamp: "10:00 AM", color: "bg-red-500" },
    { id: 2, user: "Bob", text: "Can't wait for this stream!", timestamp: "10:01 AM", color: "bg-blue-500" },
    { id: 3, user: "Charlie", text: "Is the audio okay?", timestamp: "10:02 AM", color: "bg-green-500" },
]

export const getAvatarColor = (name: string) => {
    // fast hash for color
    const colors = ["bg-red-500", "bg-blue-500", "bg-green-500", "bg-yellow-500", "bg-pink-500", "bg-purple-500", "bg-indigo-500"];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
}
