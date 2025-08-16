"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LocalStorage, STORAGE_KEYS } from "@/lib/storage"
import { useToast } from "@/hooks/use-toast"
import { Clock, Calendar, Sparkles, Sun, Moon } from "lucide-react"

interface AffirmationSettings {
  amTime: string
  pmTime: string
  tone: "calm-coach" | "confident-queen"
}

const defaultSettings: AffirmationSettings = {
  amTime: "08:00",
  pmTime: "20:00",
  tone: "calm-coach",
}

const menopauseAffirmations = {
  sleep: [
    {
      affirmation: "My body knows how to rest and restore itself naturally.",
      microAction: "Take 3 deep breaths before bed",
    },
    {
      affirmation: "I create a peaceful sanctuary for quality sleep.",
      microAction: "Dim lights 30 minutes before bedtime",
    },
    {
      affirmation: "Each night, I release the day and welcome rest.",
      microAction: "Write down one thing you're grateful for",
    },
  ],
  heat: [
    {
      affirmation: "I flow with my body's changes with grace and patience.",
      microAction: "Keep a cooling spray nearby",
    },
    {
      affirmation: "Hot flashes are temporary; my strength is permanent.",
      microAction: "Practice box breathing for 2 minutes",
    },
    {
      affirmation: "I honor my body's wisdom during this transition.",
      microAction: "Dress in breathable layers today",
    },
  ],
  mood: [
    {
      affirmation: "I am allowed to feel all emotions without judgment.",
      microAction: "Name one emotion you're feeling right now",
    },
    {
      affirmation: "My emotional wisdom deepens with each passing day.",
      microAction: "Take a 5-minute mindful walk",
    },
    {
      affirmation: "I choose compassion for myself in every moment.",
      microAction: "Place hand on heart and breathe deeply",
    },
  ],
  energy: [
    {
      affirmation: "I honor my energy levels and adjust accordingly.",
      microAction: "Schedule one restful activity today",
    },
    {
      affirmation: "My vitality comes from within and grows stronger daily.",
      microAction: "Drink a glass of water mindfully",
    },
  ],
  confidence: [
    {
      affirmation: "This life stage brings wisdom, power, and freedom.",
      microAction: "Stand tall and smile at yourself in the mirror",
    },
    {
      affirmation: "I embrace my evolving self with pride and joy.",
      microAction: "Compliment yourself on one thing today",
    },
  ],
  body: [
    {
      affirmation: "My body has carried me through so much; I honor it.",
      microAction: "Stretch gently for 2 minutes",
    },
    {
      affirmation: "I nourish my body with love and healthy choices.",
      microAction: "Eat one colorful fruit or vegetable",
    },
  ],
}

const toneOptions = {
  "calm-coach": "Calm Coach",
  "confident-queen": "Confident Queen",
}

export function AffirmationsScheduler() {
  const [settings, setSettings] = useState<AffirmationSettings>(defaultSettings)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = LocalStorage.get<AffirmationSettings>(STORAGE_KEYS.AFFIRMATIONS, defaultSettings)
    setSettings(savedSettings)
  }, [])

  const handleSaveSettings = async () => {
    setIsLoading(true)

    try {
      // Save to localStorage
      LocalStorage.set(STORAGE_KEYS.AFFIRMATIONS, settings)

      // TODO: Send to API for actual scheduling
      const response = await fetch("/api/affirmations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings),
      })

      if (response.ok) {
        toast({
          title: "Schedule Saved!",
          description: "Your daily affirmations are ready to support you.",
        })
      } else {
        throw new Error("Failed to save settings")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getNext7DaysPreview = () => {
    const days = []
    const today = new Date()
    const allAffirmations = Object.values(menopauseAffirmations).flat()

    for (let i = 0; i < 7; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)

      const daySchedule = []

      // Morning affirmation
      const morningAffirmation = allAffirmations[Math.floor(Math.random() * allAffirmations.length)]
      daySchedule.push({
        time: settings.amTime,
        period: "Morning",
        icon: Sun,
        ...morningAffirmation,
      })

      // Evening affirmation
      const eveningAffirmation = allAffirmations[Math.floor(Math.random() * allAffirmations.length)]
      daySchedule.push({
        time: settings.pmTime,
        period: "Evening",
        icon: Moon,
        ...eveningAffirmation,
      })

      days.push({
        date,
        schedule: daySchedule,
      })
    }

    return days
  }

  const preview = getNext7DaysPreview()

  return (
    <div className="space-y-8">
      {/* Settings Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-primary" />
            <span>Daily Schedule</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* AM Time Picker */}
            <div className="space-y-3">
              <Label className="text-base font-medium flex items-center space-x-2">
                <Sun className="h-4 w-4 text-amber-500" />
                <span>Morning Time</span>
              </Label>
              <Select
                value={settings.amTime}
                onValueChange={(value) => setSettings((prev) => ({ ...prev, amTime: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 6 }, (_, i) => {
                    const hour = i + 6 // 6 AM to 11 AM
                    const time = `${hour.toString().padStart(2, "0")}:00`
                    const displayTime = `${hour}:00 AM`
                    return (
                      <SelectItem key={time} value={time}>
                        {displayTime}
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>

            {/* PM Time Picker */}
            <div className="space-y-3">
              <Label className="text-base font-medium flex items-center space-x-2">
                <Moon className="h-4 w-4 text-purple-500" />
                <span>Evening Time</span>
              </Label>
              <Select
                value={settings.pmTime}
                onValueChange={(value) => setSettings((prev) => ({ ...prev, pmTime: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 6 }, (_, i) => {
                    const hour = i + 18 // 6 PM to 11 PM
                    const time = `${hour.toString().padStart(2, "0")}:00`
                    const displayTime = `${hour - 12}:00 PM`
                    return (
                      <SelectItem key={time} value={time}>
                        {displayTime}
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-base font-medium">Tone & Style</Label>
            <Select
              value={settings.tone}
              onValueChange={(value: "calm-coach" | "confident-queen") =>
                setSettings((prev) => ({ ...prev, tone: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(toneOptions).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              {settings.tone === "calm-coach"
                ? "Gentle, nurturing guidance for your menopause journey"
                : "Empowering, bold affirmations to embrace your power"}
            </p>
          </div>

          <Button onClick={handleSaveSettings} disabled={isLoading} className="w-full">
            {isLoading ? "Saving..." : "Save Schedule"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-primary" />
            <span>Next 7 Days Preview</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {preview.map((day, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium">
                    {day.date.toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "short",
                      day: "numeric",
                    })}
                  </h3>
                  {index === 0 && (
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">Today</span>
                  )}
                </div>

                <div className="space-y-4">
                  {day.schedule.map((item, itemIndex) => {
                    const IconComponent = item.icon
                    return (
                      <div key={itemIndex} className="space-y-2">
                        <div className="flex items-center space-x-2 text-sm">
                          <IconComponent className="h-4 w-4" />
                          <span className="font-medium">{item.period}</span>
                          <span className="text-muted-foreground">
                            {new Date(`2000-01-01T${item.time}`).toLocaleTimeString("en-US", {
                              hour: "numeric",
                              minute: "2-digit",
                              hour12: true,
                            })}
                          </span>
                        </div>
                        <div className="ml-6 space-y-1">
                          <p className="text-sm font-medium italic text-primary">"{item.affirmation}"</p>
                          <p className="text-xs text-muted-foreground flex items-center space-x-1">
                            <Sparkles className="h-3 w-3" />
                            <span>{item.microAction}</span>
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
