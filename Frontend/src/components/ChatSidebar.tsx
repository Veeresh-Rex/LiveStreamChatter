import { useRef, useEffect } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Avatar, AvatarFallback } from './ui/avatar'
import { Send } from 'lucide-react'
import { getAvatarColor, type Comment } from '../lib/data'

interface ChatSidebarProps {
    comments: Comment[]
    username: string
    newComment: string
    setNewComment: (comment: string) => void
    handleSendMessage: (e?: React.FormEvent) => void
}

export function ChatSidebar({ comments, username, newComment, setNewComment, handleSendMessage }: ChatSidebarProps) {
    const chatEndRef = useRef<HTMLDivElement>(null)

    // Scroll to bottom of chat
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [comments])

    return (
        <div className="w-full flex flex-col lg:h-full lg:bg-card overflow-hidden">
            {/* Desktop Header - Hidden on Mobile */}
            <div className="hidden lg:flex p-3 border-b items-center justify-between shadow-sm z-10 bg-card">
                <span className="font-semibold text-sm">Top Chat</span>
            </div>

            {/* Chat Messages - Overlay gradient on mobile, flex scrolling on desktop */}
            <div className="overflow-y-auto px-4 pb-2 space-y-3 scroll-smooth lg:flex-1 lg:space-y-4 lg:p-4 pointer-events-auto h-[160px] lg:h-0 lg:min-h-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent lg:bg-none [mask-image:linear-gradient(to_bottom,transparent,black_20%)] lg:[mask-image:none]">
                {comments.map((comment) => (
                    <div key={comment.id} className="flex gap-2 lg:gap-3 text-sm group animate-in slide-in-from-bottom-2 duration-300 fade-in-50">
                        <Avatar className="h-6 w-6 lg:h-8 lg:w-8 mt-0.5 shrink-0 border border-white/20 lg:border-transparent">
                            <AvatarFallback className={`${comment.color} text-white text-[10px] lg:text-xs`}>{comment.user[0]?.toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col gap-0.5 min-w-0">
                            <div className="flex items-baseline gap-2">
                                <span className={`font-semibold text-xs text-white/90 lg:text-foreground ${comment.user === username ? 'lg:text-primary' : ''} shadow-black drop-shadow-md lg:drop-shadow-none`}>
                                    {comment.user}
                                </span>
                                <span className="text-[10px] text-white/60 lg:text-muted-foreground/50 shadow-black drop-shadow-md lg:drop-shadow-none">
                                    {comment.timestamp}
                                </span>
                            </div>
                            <p className="text-white lg:text-foreground text-sm leading-snug break-words shadow-black drop-shadow-md lg:drop-shadow-none">
                                {comment.text}
                            </p>
                        </div>
                    </div>
                ))}
                <div ref={chatEndRef} />
            </div>

            {/* Chat Input */}
            <div className="p-3 lg:p-4 border-t-0 lg:border-t bg-black/80 lg:bg-card mt-auto space-y-3 pointer-events-auto backdrop-blur-sm lg:backdrop-blur-none">
                <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8 shrink-0 border border-white/20 lg:border-transparent hidden lg:block">
                        <AvatarFallback className={getAvatarColor(username)}>{username[0]?.toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="relative w-full">
                        <p className="text-xs text-muted-foreground font-medium mb-1.5 hidden lg:block">{username}</p>
                        <form onSubmit={handleSendMessage} className="relative flex gap-2">
                            <Input
                                placeholder="Chat..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                className="h-10 rounded-full bg-white/10 lg:bg-muted/50 border-transparent text-white lg:text-foreground placeholder:text-white/50 lg:placeholder:text-muted-foreground focus:bg-black/50 lg:focus:bg-background transition-all flex-1"
                            />
                            <Button
                                type="submit"
                                size="icon"
                                className="h-10 w-10 rounded-full shrink-0"
                                variant="secondary"
                                disabled={!newComment.trim()}
                            >
                                <Send className="w-4 h-4" />
                            </Button>
                        </form>
                    </div>
                </div>
                <div className="text-[10px] text-center text-muted-foreground hidden xl:block">
                    Remember to guard your privacy and abide by our community guidelines.
                </div>
            </div>
        </div>
    )
}
