import { Button } from './ui/button'
import { Avatar, AvatarFallback } from './ui/avatar'
import { Moon, Sun } from 'lucide-react'
import { getAvatarColor } from '../lib/data'

interface NavbarProps {
    username: string
    darkMode: boolean
    setDarkMode: (mode: boolean) => void
}

export function Navbar({ username, darkMode, setDarkMode }: NavbarProps) {
    return (
        <header className="border-b bg-card/50 backdrop-blur sticky top-0 z-50">
            <div className="flex items-center justify-between px-4 h-16">
                <div className="flex items-center gap-4">

                    <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
                        <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center text-white">
                            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M10 16.5l6-4.5-6-4.5v9zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" /></svg>
                        </div>
                        <span>StreamLive</span>
                    </div>
                </div>

                <div className="flex items-center gap-2 md:gap-4">
                    <Button variant="ghost" size="icon" onClick={() => setDarkMode(!darkMode)} className="rounded-full">
                        {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                    </Button>
                    <div className="flex items-center gap-2 pl-2 border-l border-border/50">
                        <span className="text-sm font-medium hidden md:block">{username}</span>
                        <Avatar className="h-8 w-8 ring-2 ring-primary/20">
                            <AvatarFallback className={getAvatarColor(username)}>{username[0]?.toUpperCase()}</AvatarFallback>
                        </Avatar>
                    </div>
                </div>
            </div>
        </header>
    )
}
