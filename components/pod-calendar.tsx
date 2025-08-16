"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Clock, Users, Video, Stethoscope } from "lucide-react"

interface PodEvent {
  id: string
  title: string
  podName: string
  date: Date
  duration: string
  type: "meeting" | "ama" | "workshop"
  location: "Virtual"
  attendees: number
  maxAttendees?: number
  moderator: {
    name: string
    avatar: string
    title?: string
  }
  description: string
  timezone: string
}

const mockEvents: PodEvent[] = [
  {
    id: "1",
    title: "Weekly Night Sweats Support",
    podName: "Night Sweats - PST",
    date: new Date(2024, 11, 19, 20, 0), // Dec 19, 2024, 8:00 PM PST
    duration: "60 minutes",
    type: "meeting",
    location: "Virtual",
    attendees: 6,
    maxAttendees: 12,
    moderator: {
      name: "Dr. Sarah Chen",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    description:
      "Weekly support meeting to share cooling strategies, sleep tips, and emotional support for managing night sweats.",
    timezone: "PST",
  },
  {
    id: "2",
    title: "Sleep Quality Workshop",
    podName: "Sleep Focus - EST",
    date: new Date(2024, 11, 17, 19, 0), // Dec 17, 2024, 7:00 PM EST
    duration: "90 minutes",
    type: "workshop",
    location: "Virtual",
    attendees: 10,
    maxAttendees: 15,
    moderator: {
      name: "Maya Rodriguez",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    description: "Interactive workshop on creating the perfect sleep environment and bedtime routines for menopause.",
    timezone: "EST",
  },
  {
    id: "3",
    title: "AMA: Managing Menopause Naturally",
    podName: "All Pods",
    date: new Date(2024, 11, 21, 14, 0), // Dec 21, 2024, 2:00 PM EST
    duration: "75 minutes",
    type: "ama",
    location: "Virtual",
    attendees: 24,
    maxAttendees: 50,
    moderator: {
      name: "Dr. Jennifer Walsh",
      avatar: "/placeholder.svg?height=40&width=40",
      title: "Menopause Specialist",
    },
    description:
      "Ask Me Anything session with menopause specialist Dr. Walsh covering natural remedies, hormone therapy alternatives, and lifestyle approaches.",
    timezone: "EST",
  },
  {
    id: "4",
    title: "Mood Balance Check-in",
    podName: "Mood Balance - CST",
    date: new Date(2024, 11, 22, 18, 0), // Dec 22, 2024, 6:00 PM CST
    duration: "45 minutes",
    type: "meeting",
    location: "Virtual",
    attendees: 5,
    maxAttendees: 10,
    moderator: {
      name: "Emma Thompson",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    description:
      "Weekly emotional wellness check-in with coping strategies for mood swings and anxiety during menopause.",
    timezone: "CST",
  },
  {
    id: "5",
    title: "AMA: Hormone Therapy Options",
    podName: "All Pods",
    date: new Date(2024, 11, 28, 13, 0), // Dec 28, 2024, 1:00 PM EST
    duration: "90 minutes",
    type: "ama",
    location: "Virtual",
    attendees: 18,
    maxAttendees: 50,
    moderator: {
      name: "Dr. Maria Santos",
      avatar: "/placeholder.svg?height=40&width=40",
      title: "Endocrinologist",
    },
    description:
      "Comprehensive Q&A about HRT, bioidentical hormones, risks, benefits, and personalized treatment approaches.",
    timezone: "EST",
  },
]

export function PodCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedEvent, setSelectedEvent] = useState<PodEvent | null>(null)

  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay()

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const getEventsForDate = (date: number) => {
    return mockEvents.filter(
      (event) =>
        event.date.getDate() === date &&
        event.date.getMonth() === currentMonth &&
        event.date.getFullYear() === currentYear,
    )
  }

  const getEventTypeColor = (type: PodEvent["type"]) => {
    switch (type) {
      case "meeting":
        return "bg-primary text-primary-foreground"
      case "ama":
        return "bg-purple-500 text-white"
      case "workshop":
        return "bg-orange-500 text-white"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const upcomingEvents = mockEvents
    .filter((event) => event.date >= new Date())
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 6)

  const upcomingAMAs = mockEvents
    .filter((event) => event.type === "ama" && event.date >= new Date())
    .sort((a, b) => a.date.getTime() - b.date.getTime())

  return (
    <div className="space-y-8">
      {/* Embedded Calendar Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-primary" />
            <span>Pod Events Calendar</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 border-2 border-dashed border-muted-foreground/25 rounded-lg">
            <Calendar className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="text-lg font-medium mb-2">Calendar Integration</h3>
            <p className="text-muted-foreground mb-4">
              Embedded Google Calendar or ICS feed will appear here showing all pod events and AMAs.
            </p>
            <div className="text-sm text-muted-foreground">
              <p>• Sync with your personal calendar</p>
              <p>• Automatic timezone conversion</p>
              <p>• Meeting reminders and links</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upcoming AMAs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Stethoscope className="h-5 w-5 text-purple-500" />
              <span>Upcoming AMAs</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingAMAs.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                <Stethoscope className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No upcoming AMAs scheduled</p>
              </div>
            ) : (
              upcomingAMAs.map((event) => (
                <div
                  key={event.id}
                  className="p-4 border rounded-lg cursor-pointer hover:bg-accent/50 transition-colors"
                  onClick={() => setSelectedEvent(event)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-semibold text-sm">{event.title}</h4>
                    <Badge className="bg-purple-500 text-white">AMA</Badge>
                  </div>

                  <div className="flex items-center space-x-2 mb-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={event.moderator.avatar || "/placeholder.svg"} alt={event.moderator.name} />
                      <AvatarFallback>
                        {event.moderator.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-sm">
                      <span className="font-medium">{event.moderator.name}</span>
                      {event.moderator.title && (
                        <span className="text-muted-foreground">, {event.moderator.title}</span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1 text-xs text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>
                        {event.date.toLocaleDateString()} at{" "}
                        {event.date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} {event.timezone}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="h-3 w-3" />
                      <span>
                        {event.attendees}/{event.maxAttendees} registered
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{event.description}</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* All Upcoming Events */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-primary" />
              <span>All Upcoming Events</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingEvents.map((event) => (
              <div
                key={event.id}
                className="p-3 border rounded-lg cursor-pointer hover:bg-accent/50 transition-colors"
                onClick={() => setSelectedEvent(event)}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-sm">{event.title}</h4>
                  <div className="flex items-center space-x-1">
                    <Badge variant="outline" className="text-xs">
                      {event.podName}
                    </Badge>
                    {event.type === "ama" && <Badge className="bg-purple-500 text-white text-xs">AMA</Badge>}
                    {event.type === "workshop" && <Badge className="bg-orange-500 text-white text-xs">Workshop</Badge>}
                  </div>
                </div>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>
                      {event.date.toLocaleDateString()} at{" "}
                      {event.date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} {event.timezone}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="h-3 w-3" />
                    <span>{event.attendees} attending</span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Event Details Modal */}
      {selectedEvent && (
        <Card className="mt-8">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-xl mb-2">{selectedEvent.title}</CardTitle>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">{selectedEvent.podName}</Badge>
                  {selectedEvent.type === "ama" && <Badge className="bg-purple-500 text-white">AMA</Badge>}
                  {selectedEvent.type === "workshop" && <Badge className="bg-orange-500 text-white">Workshop</Badge>}
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setSelectedEvent(null)}>
                ×
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground">{selectedEvent.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {selectedEvent.date.toLocaleDateString()} at{" "}
                    {selectedEvent.date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}{" "}
                    {selectedEvent.timezone}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedEvent.duration}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Video className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedEvent.location}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {selectedEvent.attendees}
                    {selectedEvent.maxAttendees && ` / ${selectedEvent.maxAttendees}`} registered
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage
                      src={selectedEvent.moderator.avatar || "/placeholder.svg"}
                      alt={selectedEvent.moderator.name}
                    />
                    <AvatarFallback>
                      {selectedEvent.moderator.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <span className="font-medium">{selectedEvent.moderator.name}</span>
                    {selectedEvent.moderator.title && (
                      <span className="text-muted-foreground">, {selectedEvent.moderator.title}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <Button className="flex-1">{selectedEvent.type === "ama" ? "Register for AMA" : "Join Event"}</Button>
              <Button variant="outline">Add to Calendar</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
