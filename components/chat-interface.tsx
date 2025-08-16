"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { LocalStorage, STORAGE_KEYS } from "@/lib/storage"
import { Bot, User, Lightbulb } from "lucide-react"

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
}

interface ChatContext {
  symptomFocus?: string
  stage?: string
}

const QUICK_CHIPS = ["Hot flashes", "Sleep issues", "Mood changes", "Weight gain", "Brain fog", "Joint pain"]

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [context, setContext] = useState<ChatContext>({})
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Load chat history from localStorage on mount
  useEffect(() => {
    const savedMessages = LocalStorage.get<Message[]>(STORAGE_KEYS.CHAT_HISTORY, [])
    setMessages(savedMessages.map((msg) => ({ ...msg, timestamp: new Date(msg.timestamp) })))
  }, [])

  // Save messages to localStorage whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      LocalStorage.set(STORAGE_KEYS.CHAT_HISTORY, messages)
    }
  }, [messages])

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  // Welcome message on first visit
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: Message = {
        id: "welcome",
        content:
          "Hello! I'm Empress Sense, your menopause concierge. I'm here to provide education and support for your menopause journey. I can help with symptoms, lifestyle tips, and general guidance - though I'm not a replacement for medical advice. What would you like to know about today?",
        role: "assistant",
        timestamp: new Date(),
      }
      setMessages([welcomeMessage])
    }
  }, [messages.length])

  const handleSubmit = async (question: string) => {
    if (!question.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: question.trim(),
      role: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/askEmpress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: question.trim(),
          context: {
            symptomFocus: context.symptomFocus,
            stage: context.stage,
          },
        }),
      })

      const data = await response.json()

      if (response.ok) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: data.answer,
          role: "assistant",
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, assistantMessage])
      } else {
        throw new Error(data.error || "Failed to get response")
      }
    } catch (error) {
      setError("I'm having trouble responding right now. Please try again in a moment.")
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm sorry, I'm having trouble responding right now. Please try again in a moment.",
        role: "assistant",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
      textareaRef.current?.focus()
    }
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSubmit(input)
  }

  const handleChipClick = (chip: string) => {
    setContext((prev) => ({ ...prev, symptomFocus: chip }))
    handleSubmit(`Tell me about ${chip.toLowerCase()} during menopause`)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(input)
    }
  }

  const clearChat = () => {
    setMessages([])
    setContext({})
    LocalStorage.remove(STORAGE_KEYS.CHAT_HISTORY)
  }

  // Get tip of the day from affirmations or default
  const getTipOfTheDay = () => {
    const affirmations = LocalStorage.get("affirmations_schedule", null)
    if (affirmations?.enabled) {
      const tips = [
        "Stay hydrated - it helps with hot flashes and overall energy",
        "Deep breathing can help manage sudden mood changes",
        "Regular sleep schedule supports hormone balance",
        "Gentle movement like walking can ease joint stiffness",
      ]
      return tips[Math.floor(Math.random() * tips.length)]
    }
    return "Remember: menopause is a natural transition, not a medical condition to fix."
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
      {/* Main Chat Area */}
      <div className="lg:col-span-3">
        <div className="flex flex-col h-[600px] border rounded-lg">
          {/* Chat Header */}
          <div className="flex items-center justify-between p-4 border-b bg-muted/30">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full empress-gradient flex items-center justify-center">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div>
                <span className="font-semibold">Empress Sense</span>
                <p className="text-xs text-muted-foreground">Menopause Concierge</p>
              </div>
            </div>
            {messages.length > 1 && (
              <Button variant="outline" size="sm" onClick={clearChat}>
                Clear Chat
              </Button>
            )}
          </div>

          {/* Quick Action Chips */}
          <div className="p-4 border-b bg-muted/10">
            <p className="text-sm font-medium mb-2">Quick topics:</p>
            <div className="flex flex-wrap gap-2">
              {QUICK_CHIPS.map((chip) => (
                <Badge
                  key={chip}
                  variant="secondary"
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                  onClick={() => handleChipClick(chip)}
                >
                  {chip}
                </Badge>
              ))}
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start space-x-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {message.role === "assistant" && (
                    <div className="h-8 w-8 rounded-full empress-gradient flex items-center justify-center flex-shrink-0">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                  )}
                  <Card
                    className={`max-w-[80%] ${
                      message.role === "user" ? "bg-primary text-primary-foreground ml-auto" : "bg-card"
                    }`}
                  >
                    <CardContent className="p-3">
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                      <p
                        className={`text-xs mt-2 ${
                          message.role === "user" ? "text-primary-foreground/70" : "text-muted-foreground"
                        }`}
                      >
                        {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </CardContent>
                  </Card>
                  {message.role === "user" && (
                    <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                      <User className="h-4 w-4" />
                    </div>
                  )}
                </div>
              ))}

              {/* Typing Indicator */}
              {isLoading && (
                <div className="flex items-start space-x-3">
                  <div className="h-8 w-8 rounded-full empress-gradient flex items-center justify-center">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <Card>
                    <CardContent className="p-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                        <div
                          className="w-2 h-2 bg-primary rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        />
                        <div
                          className="w-2 h-2 bg-primary rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Error State */}
              {error && (
                <div className="flex items-start space-x-3">
                  <div className="h-8 w-8 rounded-full bg-destructive flex items-center justify-center">
                    <Bot className="h-4 w-4 text-destructive-foreground" />
                  </div>
                  <Card className="border-destructive">
                    <CardContent className="p-3">
                      <p className="text-sm text-destructive">{error}</p>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Sticky Composer */}
          <div className="p-4 border-t bg-background sticky bottom-0">
            <form onSubmit={handleFormSubmit} className="space-y-2">
              <div className="flex space-x-2">
                <Textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about menopause symptoms, lifestyle tips, or general guidance..."
                  disabled={isLoading}
                  className="flex-1 min-h-[44px] max-h-32 resize-none"
                  rows={1}
                />
                <Button type="submit" disabled={isLoading || !input.trim()} size="lg">
                  Ask
                </Button>
              </div>
            </form>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Empress Sense provides educational support, not medical diagnosis. Consult healthcare providers for
              medical concerns.
            </p>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Lightbulb className="h-4 w-4" />
              <span>Tip of the Day</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">{getTipOfTheDay()}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
