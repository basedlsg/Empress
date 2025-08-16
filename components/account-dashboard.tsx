"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge as UIBadge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LocalStorage, STORAGE_KEYS } from "@/lib/storage"
import { Flame, Trophy, Star, Calendar, Target, Award } from "lucide-react"

interface UserStats {
  checkinsCompleted: number
  currentStreak: number
  longestStreak: number
  affirmationsScheduled: boolean
  podMessages: number
  amasAttended: number
  totalPoints: number
  level: number
  badges: string[]
}

interface MenopauseBadge {
  id: string
  name: string
  description: string
  icon: string
  earned: boolean
  earnedDate?: Date
}

const availableBadges: MenopauseBadge[] = [
  {
    id: "7-day-checkin-streak",
    name: "7-Day Check-in Streak",
    description: "Completed weekly check-ins for 7 consecutive weeks",
    icon: "🔥",
    earned: false,
  },
  {
    id: "first-pod-post",
    name: "First Pod Post",
    description: "Made your first post in a menopause support pod",
    icon: "💬",
    earned: false,
  },
  {
    id: "3-amas-attended",
    name: "3 AMAs Attended",
    description: "Attended 3 Ask Me Anything sessions with experts",
    icon: "🎓",
    earned: false,
  },
  {
    id: "affirmation-scheduler",
    name: "Daily Affirmations",
    description: "Set up your daily affirmation schedule",
    icon: "✨",
    earned: false,
  },
  {
    id: "wellness-champion",
    name: "Wellness Champion",
    description: "Reached 500 total points",
    icon: "🏆",
    earned: false,
  },
  {
    id: "community-supporter",
    name: "Community Supporter",
    description: "Made 10 supportive posts in pods",
    icon: "💝",
    earned: false,
  },
]

const mockLeaderboard = [
  { rank: 1, name: "Patricia M.", points: 485, avatar: "/mature-woman-smiling.png" },
  { rank: 2, name: "Jennifer K.", points: 420, avatar: "/professional-woman-diverse.png" },
  { rank: 3, name: "Susan R.", points: 385, avatar: "/confident-woman.png" },
  { rank: 4, name: "You", points: 0, avatar: "/diverse-user-avatars.png" },
  { rank: 5, name: "Maria L.", points: 275, avatar: "/friendly-woman.png" },
]

export function AccountDashboard() {
  const [userStats, setUserStats] = useState<UserStats>({
    checkinsCompleted: 0,
    currentStreak: 0,
    longestStreak: 0,
    affirmationsScheduled: false,
    podMessages: 0,
    amasAttended: 0,
    totalPoints: 0,
    level: 1,
    badges: [],
  })

  const [badges, setBadges] = useState<MenopauseBadge[]>(availableBadges)

  useEffect(() => {
    const checkins = LocalStorage.get(STORAGE_KEYS.CHECKINS, [])
    const affirmations = LocalStorage.get(STORAGE_KEYS.AFFIRMATIONS, null)
    const gamification = LocalStorage.get(STORAGE_KEYS.GAMIFICATION, {
      podMessages: 0,
      amasAttended: 0,
      totalPoints: 0,
    })

    // Calculate points: check-ins (10), pod posts (5), AMA attendance (15)
    const checkinsPoints = checkins.length * 10
    const podPoints = gamification.podMessages * 5
    const amaPoints = gamification.amasAttended * 15
    const totalPoints = checkinsPoints + podPoints + amaPoints

    const stats: UserStats = {
      checkinsCompleted: checkins.length,
      currentStreak: calculateCurrentStreak(checkins),
      longestStreak: calculateLongestStreak(checkins),
      affirmationsScheduled: !!affirmations,
      podMessages: gamification.podMessages || 0,
      amasAttended: gamification.amasAttended || 0,
      totalPoints,
      level: Math.floor(totalPoints / 100) + 1,
      badges: gamification.badges || [],
    }

    setUserStats(stats)

    // Update badges based on achievements
    const updatedBadges = availableBadges.map((badge) => ({
      ...badge,
      earned: checkBadgeEarned(badge.id, stats),
      earnedDate: badge.earned ? new Date() : undefined,
    }))

    setBadges(updatedBadges)

    // Update leaderboard with user's actual points
    mockLeaderboard[3].points = totalPoints
    mockLeaderboard.sort((a, b) => b.points - a.points)
    mockLeaderboard.forEach((user, index) => {
      user.rank = index + 1
    })
  }, [])

  const calculateCurrentStreak = (checkins: any[]) => {
    if (checkins.length === 0) return 0

    // Sort by date and calculate consecutive weeks
    const sortedCheckins = checkins.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    let streak = 0
    const now = new Date()

    for (let i = 0; i < sortedCheckins.length; i++) {
      const checkinDate = new Date(sortedCheckins[i].date)
      const expectedWeek = new Date(now.getTime() - streak * 7 * 24 * 60 * 60 * 1000)
      const weeksDiff = Math.abs(
        Math.floor((expectedWeek.getTime() - checkinDate.getTime()) / (7 * 24 * 60 * 60 * 1000)),
      )

      if (weeksDiff <= 1) {
        streak++
      } else {
        break
      }
    }

    return streak
  }

  const calculateLongestStreak = (checkins: any[]) => {
    if (checkins.length === 0) return 0

    let maxStreak = 0
    let currentStreak = 1

    const sortedCheckins = checkins.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    for (let i = 1; i < sortedCheckins.length; i++) {
      const prevDate = new Date(sortedCheckins[i - 1].date)
      const currDate = new Date(sortedCheckins[i].date)
      const daysDiff = Math.floor((currDate.getTime() - prevDate.getTime()) / (24 * 60 * 60 * 1000))

      if (daysDiff <= 7) {
        currentStreak++
      } else {
        maxStreak = Math.max(maxStreak, currentStreak)
        currentStreak = 1
      }
    }

    return Math.max(maxStreak, currentStreak)
  }

  const checkBadgeEarned = (badgeId: string, stats: UserStats): boolean => {
    switch (badgeId) {
      case "7-day-checkin-streak":
        return stats.currentStreak >= 7
      case "first-pod-post":
        return stats.podMessages >= 1
      case "3-amas-attended":
        return stats.amasAttended >= 3
      case "affirmation-scheduler":
        return stats.affirmationsScheduled
      case "wellness-champion":
        return stats.totalPoints >= 500
      case "community-supporter":
        return stats.podMessages >= 10
      default:
        return false
    }
  }

  const earnedBadges = badges.filter((badge) => badge.earned)
  const nextLevelPoints = userStats.level * 100
  const levelProgress = ((userStats.totalPoints % 100) / 100) * 100

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-2">
              <Flame className="h-5 w-5 text-orange-500" />
              <span className="font-medium">Current Streak</span>
            </div>
            <div className="text-3xl font-bold">{userStats.currentStreak}</div>
            <p className="text-sm text-muted-foreground">weeks</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-2">
              <Calendar className="h-5 w-5 text-primary" />
              <span className="font-medium">Check-ins</span>
            </div>
            <div className="text-3xl font-bold">{userStats.checkinsCompleted}</div>
            <p className="text-sm text-muted-foreground">+{userStats.checkinsCompleted * 10} points</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-2">
              <Star className="h-5 w-5 text-yellow-500" />
              <span className="font-medium">Total Points</span>
            </div>
            <div className="text-3xl font-bold">{userStats.totalPoints}</div>
            <p className="text-sm text-muted-foreground">Level {userStats.level}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-2">
              <Trophy className="h-5 w-5 text-amber-500" />
              <span className="font-medium">Badges</span>
            </div>
            <div className="text-3xl font-bold">{earnedBadges.length}</div>
            <p className="text-sm text-muted-foreground">of {badges.length} earned</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Points Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <div className="text-2xl font-bold text-primary">{userStats.checkinsCompleted * 10}</div>
              <p className="text-sm font-medium">Check-ins</p>
              <p className="text-xs text-muted-foreground">10 points each</p>
            </div>
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <div className="text-2xl font-bold text-primary">{userStats.podMessages * 5}</div>
              <p className="text-sm font-medium">Pod Posts</p>
              <p className="text-xs text-muted-foreground">5 points each</p>
            </div>
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <div className="text-2xl font-bold text-primary">{userStats.amasAttended * 15}</div>
              <p className="text-sm font-medium">AMAs Attended</p>
              <p className="text-xs text-muted-foreground">15 points each</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Level Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-primary" />
            <span>Level Progress</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Level {userStats.level}</span>
              <span className="text-sm text-muted-foreground">
                {userStats.totalPoints} / {nextLevelPoints} points
              </span>
            </div>
            <Progress value={levelProgress} className="h-2" />
            <p className="text-sm text-muted-foreground">
              Complete check-ins, participate in pods, and attend AMAs to level up!
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Badges */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Award className="h-5 w-5 text-primary" />
              <span>Menopause Milestones</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4">
              {badges.map((badge) => (
                <div
                  key={badge.id}
                  className={`p-4 rounded-lg border flex items-center space-x-4 transition-all ${
                    badge.earned ? "bg-primary/5 border-primary/20" : "bg-muted/30 border-border opacity-60"
                  }`}
                >
                  <div className="text-2xl">{badge.icon}</div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm mb-1">{badge.name}</h4>
                    <p className="text-xs text-muted-foreground">{badge.description}</p>
                  </div>
                  {badge.earned ? (
                    <UIBadge variant="secondary" className="text-xs">
                      Earned
                    </UIBadge>
                  ) : (
                    <UIBadge variant="outline" className="text-xs">
                      Locked
                    </UIBadge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Leaderboard */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Trophy className="h-5 w-5 text-primary" />
              <span>Community Leaderboard</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockLeaderboard.map((user) => (
                <div
                  key={user.rank}
                  className={`flex items-center space-x-3 p-3 rounded-lg ${
                    user.name === "You" ? "bg-primary/5 border border-primary/20" : "bg-muted/30"
                  }`}
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                    {user.rank}
                  </div>
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                    <AvatarFallback>
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.points} points</p>
                  </div>
                  {user.name === "You" && <UIBadge variant="secondary">You</UIBadge>}
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-4 text-center">
              Earn points: Check-ins (10), Pod posts (5), AMA attendance (15)
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
