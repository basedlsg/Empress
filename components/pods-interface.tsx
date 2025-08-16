"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { Users, MessageCircle, Calendar, Clock, AlertTriangle } from "lucide-react"

interface Pod {
  id: string
  name: string
  description: string
  timezone: string
  memberCount: number
  maxMembers: number
  isJoined: boolean
  lastActivity: string
  meetingTime?: string
  tags: string[]
  moderator: {
    name: string
    avatar: string
  }
  recentMessages: number
  urgentPosts: number
}

const mockPods: Pod[] = [
  {
    id: "night-sweats-pst",
    name: "Night Sweats - PST",
    description:
      "West Coast support for managing night sweats, sleep disruption, and cooling strategies. Share what works!",
    timezone: "PST",
    memberCount: 8,
    maxMembers: 12,
    isJoined: false,
    lastActivity: "2 hours ago",
    meetingTime: "Thursdays 8:00 PM PST",
    tags: ["night sweats", "sleep", "cooling", "west coast"],
    moderator: {
      name: "Dr. Sarah Chen",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    recentMessages: 5,
    urgentPosts: 1,
  },
  {
    id: "sleep-focus-est",
    name: "Sleep Focus - EST",
    description:
      "East Coast community focused on improving sleep quality during menopause. Tips, routines, and support.",
    timezone: "EST",
    memberCount: 12,
    maxMembers: 15,
    isJoined: true,
    lastActivity: "1 hour ago",
    meetingTime: "Tuesdays 7:00 PM EST",
    tags: ["sleep quality", "insomnia", "bedtime routine", "east coast"],
    moderator: {
      name: "Maya Rodriguez",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    recentMessages: 8,
    urgentPosts: 0,
  },
  {
    id: "mood-balance-cst",
    name: "Mood Balance - CST",
    description: "Central time zone pod for emotional wellness, mood swings, and finding balance during menopause.",
    timezone: "CST",
    memberCount: 6,
    maxMembers: 10,
    isJoined: true,
    lastActivity: "30 minutes ago",
    meetingTime: "Sundays 6:00 PM CST",
    tags: ["mood swings", "emotional health", "balance", "central time"],
    moderator: {
      name: "Emma Thompson",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    recentMessages: 3,
    urgentPosts: 2,
  },
]

export function PodsInterface() {
  const [pods, setPods] = useState<Pod[]>(mockPods)
  const [activeTab, setActiveTab] = useState("discover")

  useEffect(() => {
    const savedMemberships = localStorage.getItem("pod-memberships")
    if (savedMemberships) {
      const memberships = JSON.parse(savedMemberships)
      setPods((prev) =>
        prev.map((pod) => ({
          ...pod,
          isJoined: memberships[pod.id] || false,
        })),
      )
    }
  }, [])

  const myPods = pods.filter((pod) => pod.isJoined)

  const handleJoinPod = (podId: string) => {
    setPods((prev) => {
      const updated = prev.map((pod) => (pod.id === podId ? { ...pod, isJoined: !pod.isJoined } : pod))

      const memberships = updated.reduce(
        (acc, pod) => {
          acc[pod.id] = pod.isJoined
          return acc
        },
        {} as Record<string, boolean>,
      )
      localStorage.setItem("pod-memberships", JSON.stringify(memberships))

      return updated
    })
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="discover">All Pods</TabsTrigger>
          <TabsTrigger value="my-pods">My Pods ({myPods.length})</TabsTrigger>
          <TabsTrigger value="calendar">
            <Calendar className="h-4 w-4 mr-2" />
            Calendar
          </TabsTrigger>
        </TabsList>

        <TabsContent value="discover" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pods.map((pod) => (
              <PodCard key={pod.id} pod={pod} onJoin={handleJoinPod} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="my-pods" className="space-y-6">
          {myPods.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Users className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Pods Yet</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Join a menopause support pod to connect with women in your timezone.
                </p>
                <Button onClick={() => setActiveTab("discover")}>Browse Pods</Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myPods.map((pod) => (
                <PodCard key={pod.id} pod={pod} onJoin={handleJoinPod} showActivity />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="calendar">
          <Link href="/pods/calendar">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  <span>Pod Calendar & AMAs</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  View upcoming pod meetings, AMAs with menopause experts, and community events.
                </p>
                <Button>View Full Calendar</Button>
              </CardContent>
            </Card>
          </Link>
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface PodCardProps {
  pod: Pod
  onJoin: (podId: string) => void
  showActivity?: boolean
}

function PodCard({ pod, onJoin, showActivity = false }: PodCardProps) {
  return (
    <Card className="group cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg mb-1 flex items-center space-x-2">
              <span>{pod.name}</span>
              {pod.urgentPosts > 0 && (
                <Badge variant="destructive" className="text-xs">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  {pod.urgentPosts} urgent
                </Badge>
              )}
            </CardTitle>
            <Badge variant="outline" className="text-xs">
              {pod.timezone}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground leading-relaxed">{pod.description}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {pod.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        {/* Pod Stats */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>
                {pod.memberCount}/{pod.maxMembers}
              </span>
            </div>
            {showActivity && pod.recentMessages > 0 && (
              <div className="flex items-center space-x-1">
                <MessageCircle className="h-4 w-4 text-primary" />
                <span className="text-primary font-medium">{pod.recentMessages} new</span>
              </div>
            )}
          </div>
          <span className="text-muted-foreground">{pod.lastActivity}</span>
        </div>

        {/* Meeting Info */}
        {pod.meetingTime && (
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{pod.meetingTime}</span>
          </div>
        )}

        {/* Moderator */}
        <div className="flex items-center space-x-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={pod.moderator.avatar || "/placeholder.svg"} alt={pod.moderator.name} />
            <AvatarFallback>
              {pod.moderator.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm text-muted-foreground">Moderated by {pod.moderator.name}</span>
        </div>

        {/* Actions */}
        <div className="flex space-x-2 pt-2">
          {pod.isJoined ? (
            <>
              <Button asChild size="sm" className="flex-1">
                <Link href={`/pods/${pod.id}`}>
                  <MessageCircle className="h-4 w-4 mr-1" />
                  View Discussions
                </Link>
              </Button>
              <Button variant="outline" size="sm" onClick={() => onJoin(pod.id)}>
                Leave
              </Button>
            </>
          ) : (
            <Button
              onClick={() => onJoin(pod.id)}
              size="sm"
              className="flex-1"
              disabled={pod.memberCount >= pod.maxMembers}
            >
              {pod.memberCount >= pod.maxMembers ? "Full" : "Join Pod"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
