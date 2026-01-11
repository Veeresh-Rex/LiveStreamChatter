import { useState, useEffect } from 'react'
import { JoinScreen } from './components/JoinScreen'
import { Navbar } from './components/Navbar'
import { VideoPlayer } from './components/VideoPlayer'
import { ChatSidebar } from './components/ChatSidebar'
import { MOCK_COMMENTS, type Comment } from './lib/data'

function App() {
  const [hasJoined, setHasJoined] = useState(false)
  const [username, setUsername] = useState("")
  const [darkMode, setDarkMode] = useState(true) // Default to dark mode for that premium feel
  const [comments, setComments] = useState<Comment[]>(MOCK_COMMENTS)
  const [newComment, setNewComment] = useState("")

  // Toggle Dark Mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  const handleJoin = () => {
    if (username.trim()) {
      setHasJoined(true)
    }
  }

  const handleSendMessage = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!newComment.trim()) return

    const comment: Comment = {
      id: Date.now(),
      user: username,
      text: newComment,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      color: "bg-purple-500" // Current user color
    }

    setComments([...comments, comment])
    setNewComment("")
  }

  if (!hasJoined) {
    return (
      <JoinScreen
        username={username}
        setUsername={setUsername}
        handleJoin={handleJoin}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />
    )
  }

  return (
    <div className="h-screen bg-background text-foreground flex flex-col overflow-hidden">
      <Navbar username={username} darkMode={darkMode} setDarkMode={setDarkMode} />

      {/* Main Content */}
      <div className="relative flex-1 overflow-hidden flex flex-col lg:flex-row">
        {/* Video Layer */}
        <div className="absolute inset-0 lg:static lg:flex-1 bg-black z-0">
          <VideoPlayer />
        </div>

        {/* Chat Layer */}
        <div className="absolute inset-x-0 bottom-0 z-10 lg:static lg:z-auto lg:w-[350px] pointer-events-none lg:pointer-events-auto h-full flex flex-col justify-end lg:block">
          <ChatSidebar
            comments={comments}
            username={username}
            newComment={newComment}
            setNewComment={setNewComment}
            handleSendMessage={handleSendMessage}
          />
        </div>
      </div>
    </div>
  )
}

export default App
