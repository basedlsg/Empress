"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { TrendingUp, TrendingDown, Minus, Calendar } from "lucide-react"

interface CheckinEntry {
  id: string
  date: string
  week: string
  responses: {
    mood: number
    energy: number
    sleep: number
    stress: number
    satisfaction: number
  }
  notes: string
  timestamp: Date
}

interface CheckinChartsProps {
  entries: CheckinEntry[]
}

const metricConfig = {
  mood: { label: "Mood", color: "#f97316", icon: "😊" },
  energy: { label: "Energy", color: "#eab308", icon: "⚡" },
  sleep: { label: "Sleep", color: "#8b5cf6", icon: "🌙" },
  stress: { label: "Stress", color: "#ef4444", icon: "🧠", inverted: true },
  satisfaction: { label: "Life Satisfaction", color: "#22c55e", icon: "❤️" },
}

export function CheckinCharts({ entries }: CheckinChartsProps) {
  if (entries.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Check-ins Yet</h3>
          <p className="text-muted-foreground text-center">
            Complete your first weekly check-in to start tracking your wellness trends.
          </p>
        </CardContent>
      </Card>
    )
  }

  // Sort entries by date and prepare chart data
  const sortedEntries = [...entries].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  const chartData = sortedEntries.map((entry) => ({
    date: new Date(entry.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    fullDate: entry.date,
    ...entry.responses,
  }))

  // Calculate trends for each metric
  const calculateTrend = (metric: keyof CheckinEntry["responses"]) => {
    if (sortedEntries.length < 2) return "stable"

    const recent = sortedEntries.slice(-3).map((entry) => entry.responses[metric])
    const older = sortedEntries.slice(-6, -3).map((entry) => entry.responses[metric])

    if (older.length === 0) return "stable"

    const recentAvg = recent.reduce((sum, val) => sum + val, 0) / recent.length
    const olderAvg = older.reduce((sum, val) => sum + val, 0) / older.length

    const diff = recentAvg - olderAvg
    const threshold = 0.3

    if (diff > threshold) return "improving"
    if (diff < -threshold) return "declining"
    return "stable"
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "improving":
        return <TrendingUp className="h-4 w-4 text-green-500" />
      case "declining":
        return <TrendingDown className="h-4 w-4 text-red-500" />
      default:
        return <Minus className="h-4 w-4 text-gray-500" />
    }
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "improving":
        return "bg-green-100 text-green-800 border-green-200"
      case "declining":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getLatestScore = (metric: keyof CheckinEntry["responses"]) => {
    return sortedEntries[sortedEntries.length - 1]?.responses[metric] || 0
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {Object.entries(metricConfig).map(([key, config]) => {
          const metric = key as keyof CheckinEntry["responses"]
          const trend = calculateTrend(metric)
          const latestScore = getLatestScore(metric)

          return (
            <Card key={key}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{config.icon}</span>
                  {getTrendIcon(trend)}
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">{config.label}</p>
                  <p className="text-2xl font-bold">{latestScore}/5</p>
                  <Badge variant="outline" className={`text-xs ${getTrendColor(trend)}`}>
                    {trend === "improving" ? "Improving" : trend === "declining" ? "Declining" : "Stable"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Trends Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Wellness Trends Over Time</CardTitle>
          <p className="text-sm text-muted-foreground">
            Track your progress across different wellness dimensions. Higher scores are better (except for stress).
          </p>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" className="text-xs" />
                <YAxis domain={[1, 5]} className="text-xs" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                {Object.entries(metricConfig).map(([key, config]) => (
                  <Line
                    key={key}
                    type="monotone"
                    dataKey={key}
                    stroke={config.color}
                    strokeWidth={2}
                    dot={{ fill: config.color, strokeWidth: 2, r: 4 }}
                    name={config.label}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Recent Entries Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Check-ins</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sortedEntries
              .slice(-5)
              .reverse()
              .map((entry) => (
                <div key={entry.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">
                      Week of {new Date(entry.date).toLocaleDateString("en-US", { month: "long", day: "numeric" })}
                    </h4>
                    <Badge variant="outline">{entry.date}</Badge>
                  </div>
                  <div className="grid grid-cols-5 gap-2 mb-3">
                    {Object.entries(metricConfig).map(([key, config]) => {
                      const score = entry.responses[key as keyof CheckinEntry["responses"]]
                      return (
                        <div key={key} className="text-center">
                          <div className="text-xs text-muted-foreground">{config.label}</div>
                          <div className="text-lg font-semibold">{score}/5</div>
                        </div>
                      )
                    })}
                  </div>
                  {entry.notes && (
                    <div className="text-sm text-muted-foreground bg-muted/50 rounded p-2">
                      <strong>Notes:</strong> {entry.notes}
                    </div>
                  )}
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
