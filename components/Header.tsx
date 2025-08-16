"use client"
import Link from "next/link"
import type React from "react"

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <Link
    href={href}
    className="px-3 py-2 text-sm uppercase tracking-wideish text-empress-ink/80 hover:text-empress-ink transition-colors"
  >
    {children}
  </Link>
)

export default function Header() {
  return (
    <header className="w-full border-b border-black/[0.06] bg-[var(--bg-alt)]">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex items-center justify-between h-16">
          {/* Left nav */}
          <nav className="hidden md:flex items-center gap-1">
            <NavLink href="/shop">Shop</NavLink>
            <NavLink href="/affirmations">Affirmations</NavLink>
            <NavLink href="/checkins">Check-ins</NavLink>
            <NavLink href="/pods">Pods</NavLink>
            <NavLink href="/doctors">Doctors</NavLink>
          </nav>

          {/* Centered logo */}
          <Link href="/" className="mx-2">
            <div className="font-serif text-2xl font-bold text-empress-grape">Empress</div>
          </Link>

          {/* Right icons */}
          <div className="flex items-center gap-4">
            <Link
              href="/account"
              aria-label="Account"
              className="text-empress-ink/80 hover:text-empress-ink transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </Link>
            <Link
              href="/coach"
              aria-label="Ask Empress"
              className="text-empress-ink/80 hover:text-empress-ink transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </Link>
            <Link
              href="/shop"
              aria-label="Shop"
              className="text-empress-ink/80 hover:text-empress-ink transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
