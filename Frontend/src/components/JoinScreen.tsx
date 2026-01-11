import { Button } from './ui/button'
import { Input } from './ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card'
import { Moon, Sun, User } from 'lucide-react'

interface JoinScreenProps {
    username: string
    setUsername: (name: string) => void
    handleJoin: () => void
    darkMode: boolean
    setDarkMode: (mode: boolean) => void
}

export function JoinScreen({ username, setUsername, handleJoin, darkMode, setDarkMode }: JoinScreenProps) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="absolute top-4 right-4">
                <Button variant="ghost" size="icon" onClick={() => setDarkMode(!darkMode)} className="rounded-full">
                    {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </Button>
            </div>
            <Card className="w-full max-w-md shadow-2xl border-none ring-1 ring-border/50 bg-card/95 backdrop-blur">
                <CardHeader className="text-center space-y-2">
                    <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit">
                        <User className="w-8 h-8 text-primary" />
                    </div>
                    <CardTitle className="text-3xl font-bold tracking-tight">Welcome</CardTitle>
                    <CardDescription className="text-lg">Enter your name to join the live stream</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Input
                            placeholder="Your Name (e.g. Alex)"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
                            className="h-12 text-lg"
                            autoFocus
                        />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button className="w-full h-12 text-lg font-semibold shadow-lg hover:shadow-primary/25 transition-all duration-300" onClick={handleJoin} disabled={!username.trim()}>
                        Enter Stream
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}
