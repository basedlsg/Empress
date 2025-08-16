"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { ArrowLeft, Send, Heart, MessageCircle, Users, Calendar, AlertTriangle } from "lucide-react"

interface Message {
  id: string
  author: {
    name: string
    avatar: string
    role?: string
  }
  content: string
  timestamp: Date
  likes: number
  isLiked: boolean
  isUrgent?: boolean
}

interface Pod {
  id: string
  name: string
  description: string
  timezone: string
  memberCount: number
  meetingTime?: string
  moderator: {
    name: string
    avatar: string
  }
}

const podsData: Record<string, Pod> = {
  "night-sweats-pst": {
    id: "night-sweats-pst",
    name: "Night Sweats - PST",
    description: "West Coast support for managing night sweats, sleep disruption, and cooling strategies.",
    timezone: "PST",
    memberCount: 8,
    meetingTime: "Thursdays 8:00 PM PST",
    moderator: {
      name: "Dr. Sarah Chen",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  },
  "sleep-focus-est": {
    id: "sleep-focus-est",
    name: "Sleep Focus - EST",
    description: "East Coast community focused on improving sleep quality during menopause.",
    timezone: "EST",
    memberCount: 12,
    meetingTime: "Tuesdays 7:00 PM EST",
    moderator: {
      name: "Maya Rodriguez",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  },
  "mood-balance-cst": {
    id: "mood-balance-cst",
    name: "Mood Balance - CST",
    description: "Central time zone pod for emotional wellness and mood balance during menopause.",
    timezone: "CST",
    memberCount: 6,
    meetingTime: "Sundays 6:00 PM CST",
    moderator: {
      name: "Emma Thompson",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  },
}

const mockMessagesData: Record<string, Message[]> = {
  "night-sweats-pst": [
    {
      id: "1",
      author: {
        name: "Dr. Sarah Chen",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "Moderator",
      },
      content:
        "Good evening everyone! Let's share what cooling strategies have been working for you this week. I've been trying the bamboo sheets and they're a game changer!",
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
      likes: 6,
      isLiked: true,
    },
    {
      id: "2",
      author: {
        name: "Jennifer M.",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      content:
        "I'm having such a hard time with night sweats - waking up 4-5 times per night soaked. I need urgent help, this is affecting my work and family life. Has anyone found anything that actually works?",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      likes: 8,
      isLiked: false,
      isUrgent: true, // Flagged as urgent due to "urgent help"
    },
    {
      id: "3",
      author: {
        name: "Lisa K.",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      content:
        "Jennifer, I feel you! The cooling mattress pad from Purple has been a lifesaver for me. Also keeping a small fan right by the bed helps. You're not alone in this! 💙",
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
      likes: 5,
      isLiked: true,
    },
  ],
  "sleep-focus-est": [
    {
      id: "1",
      author: {
        name: "Maya Rodriguez",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "Moderator",
      },
      content:
        "Good morning EST pod! How did everyone sleep last night? Let's check in with our bedtime routines and see what's working.",
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      likes: 4,
      isLiked: true,
    },
    {
      id: "2",
      author: {
        name: "Carol D.",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      content:
        "I've been doing the magnesium supplement before bed and it's helping! Also no screens after 9pm has made a difference.",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      likes: 7,
      isLiked: false,
    },
  ],
  "mood-balance-cst": [
    {
      id: "1",
      author: {
        name: "Emma Thompson",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "Moderator",
      },
      content:
        "Sunday check-in time! How are we all feeling emotionally this week? Remember, mood swings are normal and you're not alone.",
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
      likes: 9,
      isLiked: true,
    },
    {
      id: "2",
      author: {
        name: "Rachel S.",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      content:
        "I'm really struggling today. The mood swings are so intense and I snapped at my family again. I feel terrible and need help managing this better.",
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
      likes: 6,
      isLiked: false,
      isUrgent: true, // Flagged as urgent due to "struggling" and "need help"
    },
    {
      id: "3",
      author: {
        name: "Patricia L.",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      content:
        "Rachel, sending you so much love. I've been there. What helps me is taking 5 deep breaths before responding when I feel triggered. Also, B-complex vitamins have helped stabilize my mood. You're doing great! 🤗",
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
      likes: 12,
      isLiked: true,
    },
  ],
}

interface PodDiscussionProps {
  podId: string
}

export function PodDiscussion({ podId }: PodDiscussionProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const pod = podsData[podId]

  useEffect(() => {
    const savedMessages = localStorage.getItem(`pod-messages-${podId}`)
    if (savedMessages) {
      const parsed = JSON.parse(savedMessages)
      setMessages(
        parsed.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        })),
      )
    } else {
      setMessages(mockMessagesData[podId] || [])
    }
  }, [podId])

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(`pod-messages-${podId}`, JSON.stringify(messages))
    }
  }, [messages, podId])

  const handleSendMessage = async () => {
    if (!newMessage.trim() || isLoading) return

    setIsLoading(true)

    const isUrgent = /\b(urgent|help|struggling|crisis|emergency|desperate)\b/i.test(newMessage)

    const message: Message = {
      id: Date.now().toString(),
      author: {
        name: "You",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      content: newMessage.trim(),
      timestamp: new Date(),
      likes: 0,
      isLiked: false,
      isUrgent,
    }

    setMessages((prev) => [...prev, message])
    setNewMessage("")
    setIsLoading(false)
  }

  const handleLikeMessage = (messageId: string) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId
          ? {
              ...msg,
              isLiked: !msg.isLiked,
              likes: msg.isLiked ? msg.likes - 1 : msg.likes + 1,
            }
          : msg,
      ),
    )
  }

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date()
    const diff = now.getTime() - timestamp.getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
  }

  if (!pod) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <h3 className="text-lg font-semibold mb-2">Pod Not Found</h3>
            <p className="text-muted-foreground mb-4">This pod doesn't exist or you don't have access.</p>
            <Button asChild>
              <Link href="/pods">Back to Pods</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-8">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/pods" className="flex items-center space-x-1">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Pods</span>
          </Link>
        </Button>
      </div>

      {/* Pod Info */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-2xl mb-2">{pod.name}</CardTitle>
              <p className="text-muted-foreground mb-4">{pod.description}</p>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{pod.memberCount} members</span>
                </div>
                {pod.meetingTime && (
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{pod.meetingTime}</span>
                  </div>
                )}
                <Badge variant="outline">{pod.timezone}</Badge>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={pod.moderator.avatar || "/placeholder.svg"} alt={pod.moderator.name} />
                <AvatarFallback>
                  {pod.moderator.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="text-sm">
                <p className="font-medium">{pod.moderator.name}</p>
                <p className="text-muted-foreground">Moderator</p>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Messages */}
      <div className="space-y-6 mb-8">
        {messages.map((message, index) => (
          <div key={message.id}>
            <div className="flex items-start space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={message.author.avatar || "/placeholder.svg"} alt={message.author.name} />
                <AvatarFallback>
                  {message.author.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-medium">{message.author.name}</span>
                  {message.author.role && (
                    <Badge variant="secondary" className="text-xs">
                      {message.author.role}
                    </Badge>
                  )}
                  {message.isUrgent && (
                    <Badge variant="destructive" className="text-xs">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      Urgent
                    </Badge>
                  )}
                  <span className="text-xs text-muted-foreground">{formatTimestamp(message.timestamp)}</span>
                </div>

                <div
                  className={`p-4 rounded-lg ${
                    message.isUrgent
                      ? "bg-red-50 border border-red-200 dark:bg-red-950 dark:border-red-800"
                      : "bg-muted/50"
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>
                </div>

                <div className="flex items-center space-x-4 mt-2">
                  <button
                    onClick={() => handleLikeMessage(message.id)}
                    className="flex items-center space-x-1 text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Heart className={`h-4 w-4 ${message.isLiked ? "fill-red-500 text-red-500" : ""}`} />
                    <span>{message.likes}</span>
                  </button>
                  <button className="flex items-center space-x-1 text-sm text-muted-foreground hover:text-primary transition-colors">
                    <MessageCircle className="h-4 w-4" />
                    <span>Reply</span>
                  </button>
                </div>
              </div>
            </div>

            {index < messages.length - 1 && <Separator className="my-6" />}
          </div>
        ))}
      </div>

      {/* Message Input */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder.svg?height=32&width=32" alt="You" />
              <AvatarFallback>You</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-3">
              <Textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Share your experience with the pod..."
                className="min-h-[80px] resize-none"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                    handleSendMessage()
                  }
                }}
              />
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  Press Cmd+Enter to send • Posts with "urgent" or "help" are flagged for priority support
                </p>
                <Button onClick={handleSendMessage} disabled={!newMessage.trim() || isLoading} size="sm">
                  <Send className="h-4 w-4 mr-1" />
                  {isLoading ? "Sending..." : "Send"}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
