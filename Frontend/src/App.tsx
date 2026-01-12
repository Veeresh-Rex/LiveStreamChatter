import { useState, useEffect, useRef } from 'react'
import { JoinScreen } from './components/JoinScreen'
import { Navbar } from './components/Navbar'
import { VideoPlayer } from './components/VideoPlayer'
import { ChatSidebar } from './components/ChatSidebar'
import { type Comment, getAvatarColor, type BackendComment } from './lib/data'
import { joinStream, postComment } from './lib/api'

function App() {
  const [hasJoined, setHasJoined] = useState(false)
  const [username, setUsername] = useState("")
  const [token, setToken] = useState("")
  const [darkMode, setDarkMode] = useState(true)
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const eventSourceRef = useRef<EventSource | null>(null)

  // Toggle Dark Mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  useEffect(() => {
    if (!token) return

    console.log("Connecting to SSE...")
    const es = new EventSource(`/api/sse/stream?tokenQuery=${token}`)

    es.onopen = () => {
      console.log("SSE Connected")
    }

    es.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)

        if (data.Type === "System") {
          console.log("System:", data.Message)
        } else {
          const backendComment = data as BackendComment
          if (backendComment.Message && backendComment.UserName) {
            const newMsg: Comment = {
              id: Date.now() + Math.random(),
              user: backendComment.UserName,
              text: backendComment.Message,
              timestamp: new Date(backendComment.Timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              color: getAvatarColor(backendComment.UserName)
            }
            setComments(prev => [...prev, newMsg])
          }
        }
      } catch (err) {
        console.error("Error parsing SSE message", err)
      }
    }

    es.onerror = (err) => {
      console.error("SSE Error:", err)
      // es.close() // Maybe retry
    }

    eventSourceRef.current = es

    return () => {
      es.close()
    }
  }, [token])

  const handleJoin = async () => {
    if (username.trim()) {
      try {
        const result = await joinStream(username)
        setToken(result.token)
        setHasJoined(true)
      } catch (error) {
        console.error("Failed to join", error)
        alert("Failed to join stream")
      }
    }
  }

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!newComment.trim()) return

    try {
      await postComment(token, newComment)
      setNewComment("")

    } catch (error) {
      console.error("Failed to send message", error)
      alert("Failed to send message")
    }
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

      <div className="relative flex-1 overflow-hidden flex flex-col lg:flex-row">
        <div className="absolute inset-0 lg:static lg:flex-1 bg-black z-0">
          <VideoPlayer />
        </div>

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
