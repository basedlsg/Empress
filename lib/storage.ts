// Local storage utilities for demo persistence
export class LocalStorage {
  static get<T>(key: string, defaultValue: T): T {
    if (typeof window === "undefined") return defaultValue

    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch {
      return defaultValue
    }
  }

  static set<T>(key: string, value: T): void {
    if (typeof window === "undefined") return

    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.warn("Failed to save to localStorage:", error)
    }
  }

  static remove(key: string): void {
    if (typeof window === "undefined") return
    window.localStorage.removeItem(key)
  }

  static clear(): void {
    if (typeof window === "undefined") return
    window.localStorage.clear()
  }
}

// Storage keys for different features
export const STORAGE_KEYS = {
  AFFIRMATIONS: "empress_affirmations",
  CHECKINS: "empress_checkins",
  USER_PROFILE: "empress_user_profile",
  CHAT_HISTORY: "empress_chat_history",
  GAMIFICATION: "empress_gamification",
} as const
