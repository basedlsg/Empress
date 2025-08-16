"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { LocalStorage, STORAGE_KEYS } from "@/lib/storage"
import { useToast } from "@/hooks/use-toast"
import { CheckinCharts } from "@/components/checkin-charts"
import { Calendar, TrendingUp, Thermometer, Moon, Heart, CheckCircle, Lightbulb } from "lucide-react"

interface CheckinEntry {
  id: string
  date: string
  week: string
  responses: {
    hotFlashCount: number
    hotFlashSeverity: number
    sleepQuality: number
    mood: number
    adherence: boolean
  }
  notes: string
  timestamp: Date
}

const questions = [
  {
    id: "hotFlashCount",
    type: "slider" as const,
    label: "Hot Flash Frequency",
    description: "How many hot flashes did you experience this week?",
    icon: Thermometer,
    min: 0,
    max: 50,
    step: 1,
    unit: "episodes",
  },
  {
    id: "hotFlashSeverity",
    type: "radio" as const,
    label: "Hot Flash Severity",
    description: "On average, how severe were your hot flashes?",
    icon: Thermometer,
    options: [
      { value: 1, label: "Mild", description: "Barely noticeable" },
      { value: 2, label: "Moderate", description: "Noticeable but manageable" },
      { value: 3, label: "Severe", description: "Disruptive to daily activities" },
      { value: 4, label: "Very Severe", description: "Significantly impacted my day" },
      { value: 5, label: "Extreme", description: "Overwhelming and debilitating" },
    ],
  },
  {
    id: "sleepQuality",
    type: "radio" as const,
    label: "Sleep Quality",
    description: "How would you rate your overall sleep quality this week?",
    icon: Moon,
    options: [
      { value: 1, label: "Very Poor", description: "Frequent wake-ups, restless" },
      { value: 2, label: "Poor", description: "Some disruptions" },
      { value: 3, label: "Fair", description: "Okay but could be better" },
      { value: 4, label: "Good", description: "Mostly restful" },
      { value: 5, label: "Excellent", description: "Deep, restorative sleep" },
    ],
  },
  {
    id: "mood",
    type: "radio" as const,
    label: "Overall Mood",
    description: "How has your mood been this week?",
    icon: Heart,
    options: [
      { value: 1, label: "Very Low", description: "Frequent sadness or irritability" },
      { value: 2, label: "Low", description: "More down days than usual" },
      { value: 3, label: "Neutral", description: "Balanced, neither high nor low" },
      { value: 4, label: "Good", description: "Generally positive" },
      { value: 5, label: "Excellent", description: "Consistently upbeat and stable" },
    ],
  },
  {
    id: "adherence",
    type: "boolean" as const,
    label: "Treatment Adherence",
    description: "Did you follow your wellness routine/treatment plan this week?",
    icon: CheckCircle,
  },
]

const getWeeklyRecap = (responses: CheckinEntry["responses"]) => {
  const wins = []
  const suggestions = []

  if (responses.sleepQuality >= 4) {
    wins.push("Great sleep quality this week!")
  } else if (responses.sleepQuality <= 2) {
    suggestions.push("Try a cool bedroom (65-68°F) and avoid screens before bed")
  }

  if (responses.mood >= 4) {
    wins.push("Positive mood maintained")
  } else if (responses.mood <= 2) {
    suggestions.push("Consider gentle exercise or connecting with friends")
  }

  if (responses.hotFlashCount <= 5) {
    wins.push("Hot flashes were well-managed")
  } else if (responses.hotFlashCount >= 20) {
    suggestions.push("Track triggers like spicy foods, stress, or caffeine")
  }

  if (responses.adherence) {
    wins.push("Excellent adherence to your wellness routine")
  } else {
    suggestions.push("Small consistent steps are better than perfect days")
  }

  return {
    wins: wins.length > 0 ? wins : ["You completed your weekly check-in - that's progress!"],
    suggestion: suggestions[0] || "Keep up the great work with your wellness journey",
  }
}

export function CheckinsInterface() {
  const [entries, setEntries] = useState<CheckinEntry[]>([])
  const [currentResponses, setCurrentResponses] = useState<Partial<CheckinEntry["responses"]>>({})
  const [notes, setNotes] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [hasSubmittedThisWeek, setHasSubmittedThisWeek] = useState(false)
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const { toast } = useToast()

  // Load entries from localStorage on mount
  useEffect(() => {
    const savedEntries = LocalStorage.get<CheckinEntry[]>(STORAGE_KEYS.CHECKINS, [])
    const parsedEntries = savedEntries.map((entry) => ({
      ...entry,
      timestamp: new Date(entry.timestamp),
    }))
    setEntries(parsedEntries)

    // Check if user has already submitted this week
    const currentWeek = getCurrentWeekString()
    const thisWeekEntry = parsedEntries.find((entry) => entry.week === currentWeek)
    setHasSubmittedThisWeek(!!thisWeekEntry)

    if (thisWeekEntry) {
      setCurrentResponses(thisWeekEntry.responses)
      setNotes(thisWeekEntry.notes)
    }
  }, [])

  const getCurrentWeekString = () => {
    const now = new Date()
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()))
    return startOfWeek.toISOString().split("T")[0]
  }

  const handleResponseChange = (questionId: string, value: number | boolean) => {
    setCurrentResponses((prev) => ({
      ...prev,
      [questionId]: value,
    }))

    // Clear validation errors when user starts answering
    setValidationErrors((prev) => prev.filter((error) => !error.includes(questionId)))
  }

  const validateForm = () => {
    const errors: string[] = []
    const requiredFields = ["hotFlashCount", "hotFlashSeverity", "sleepQuality", "mood", "adherence"]

    requiredFields.forEach((field) => {
      if (!(field in currentResponses) || currentResponses[field as keyof typeof currentResponses] === undefined) {
        const question = questions.find((q) => q.id === field)
        errors.push(`Please answer: ${question?.label}`)
      }
    })

    setValidationErrors(errors)
    return errors.length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast({
        title: "Please complete all questions",
        description: "All fields are required to submit your check-in.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const newEntry: CheckinEntry = {
        id: Date.now().toString(),
        date: new Date().toISOString().split("T")[0],
        week: getCurrentWeekString(),
        responses: currentResponses as CheckinEntry["responses"],
        notes: notes.trim(),
        timestamp: new Date(),
      }

      // Update or add entry
      const updatedEntries = hasSubmittedThisWeek
        ? entries.map((entry) => (entry.week === newEntry.week ? newEntry : entry))
        : [...entries, newEntry]

      setEntries(updatedEntries)
      LocalStorage.set(STORAGE_KEYS.CHECKINS, updatedEntries)

      // Save to API
      const response = await fetch("/api/checkins", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newEntry),
      })

      if (response.ok) {
        setHasSubmittedThisWeek(true)
        toast({
          title: hasSubmittedThisWeek ? "Check-in Updated!" : "Check-in Submitted!",
          description: "Your menopause tracking data has been recorded successfully.",
        })
      } else {
        throw new Error("Failed to save check-in")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save your check-in. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setCurrentResponses({})
    setNotes("")
    setHasSubmittedThisWeek(false)
    setValidationErrors([])
  }

  const latestEntry = entries[0]
  const weeklyRecap = latestEntry ? getWeeklyRecap(latestEntry.responses) : null

  return (
    <div className="space-y-8">
      <Tabs defaultValue="checkin" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="checkin" className="flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <span>This Week's Check-in</span>
          </TabsTrigger>
          <TabsTrigger value="trends" className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4" />
            <span>8-Week Trends</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="checkin" className="space-y-6">
          {/* Status Badge */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Weekly Menopause Check-in</h2>
              <p className="text-sm text-muted-foreground">
                Week of {new Date(getCurrentWeekString()).toLocaleDateString()}
              </p>
            </div>
            {hasSubmittedThisWeek && (
              <div className="flex items-center space-x-2">
                <Badge variant="secondary">Completed</Badge>
                <Button variant="outline" size="sm" onClick={resetForm}>
                  Edit Response
                </Button>
              </div>
            )}
          </div>

          {/* Validation Errors */}
          {validationErrors.length > 0 && (
            <Card className="border-destructive">
              <CardContent className="pt-6">
                <div className="text-sm text-destructive">
                  <p className="font-medium mb-2">Please complete the following:</p>
                  <ul className="list-disc list-inside space-y-1">
                    {validationErrors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Questions */}
          <div className="grid gap-6">
            {questions.map((question) => {
              const IconComponent = question.icon
              const hasError = validationErrors.some((error) => error.includes(question.id))

              return (
                <Card key={question.id} className={hasError ? "border-destructive" : ""}>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-lg">
                      <IconComponent className="h-5 w-5 text-primary" />
                      <span>{question.label}</span>
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">{question.description}</p>
                  </CardHeader>
                  <CardContent>
                    {question.type === "slider" && (
                      <div className="space-y-4">
                        <div className="px-2">
                          <Slider
                            value={[(currentResponses[question.id as keyof typeof currentResponses] as number) || 0]}
                            onValueChange={([value]) => handleResponseChange(question.id, value)}
                            max={question.max}
                            min={question.min}
                            step={question.step}
                            className="w-full"
                          />
                        </div>
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>
                            {question.min} {question.unit}
                          </span>
                          <span className="font-medium">
                            {currentResponses[question.id as keyof typeof currentResponses] || 0} {question.unit}
                          </span>
                          <span>
                            {question.max} {question.unit}
                          </span>
                        </div>
                      </div>
                    )}

                    {question.type === "radio" && question.options && (
                      <div className="grid gap-2">
                        {question.options.map((option) => {
                          const isSelected =
                            currentResponses[question.id as keyof typeof currentResponses] === option.value
                          return (
                            <button
                              key={option.value}
                              type="button"
                              onClick={() => handleResponseChange(question.id, option.value)}
                              className={`p-4 rounded-lg border text-left transition-all hover:border-primary ${
                                isSelected ? "border-primary bg-primary/5" : "border-border hover:bg-accent"
                              }`}
                            >
                              <div className="flex items-center space-x-3">
                                <div
                                  className={`w-4 h-4 rounded-full border-2 ${
                                    isSelected ? "border-primary bg-primary" : "border-muted-foreground"
                                  }`}
                                >
                                  {isSelected && <div className="w-2 h-2 bg-white rounded-full m-0.5" />}
                                </div>
                                <div>
                                  <div className="font-medium">{option.label}</div>
                                  <div className="text-sm text-muted-foreground">{option.description}</div>
                                </div>
                              </div>
                            </button>
                          )
                        })}
                      </div>
                    )}

                    {question.type === "boolean" && (
                      <div className="grid grid-cols-2 gap-4">
                        {[
                          { value: true, label: "Yes", description: "I followed my routine" },
                          { value: false, label: "No", description: "I missed some days" },
                        ].map((option) => {
                          const isSelected =
                            currentResponses[question.id as keyof typeof currentResponses] === option.value
                          return (
                            <button
                              key={option.value.toString()}
                              type="button"
                              onClick={() => handleResponseChange(question.id, option.value)}
                              className={`p-4 rounded-lg border text-center transition-all hover:border-primary ${
                                isSelected
                                  ? "border-primary bg-primary text-primary-foreground"
                                  : "border-border hover:bg-accent"
                              }`}
                            >
                              <div className="font-medium">{option.label}</div>
                              <div className="text-xs mt-1 opacity-80">{option.description}</div>
                            </button>
                          )
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Notes Section */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Notes (Optional)</CardTitle>
              <p className="text-sm text-muted-foreground">
                Share any specific triggers, wins, or observations from this week.
              </p>
            </CardHeader>
            <CardContent>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g., 'Hot flashes were worse after coffee' or 'Yoga helped with sleep'"
                className="min-h-[100px]"
              />
            </CardContent>
          </Card>

          {/* Submit Button */}
          <Button onClick={handleSubmit} disabled={isLoading} size="lg" className="w-full">
            {isLoading ? "Saving..." : hasSubmittedThisWeek ? "Update Check-in" : "Submit Check-in"}
          </Button>

          {/* Weekly Recap */}
          {weeklyRecap && hasSubmittedThisWeek && (
            <Card className="bg-gradient-to-r from-primary/5 to-secondary/5">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Lightbulb className="h-5 w-5 text-primary" />
                  <span>This Week's Recap</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-green-700 mb-2">🎉 Wins:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {weeklyRecap.wins.map((win, index) => (
                      <li key={index}>{win}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-blue-700 mb-2">💡 Micro-action for next week:</h4>
                  <p className="text-sm">{weeklyRecap.suggestion}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="trends">
          <CheckinCharts entries={entries} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
