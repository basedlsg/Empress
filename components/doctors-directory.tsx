"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Bell, Clock, Star, Heart, Stethoscope } from "lucide-react"

const specialties = [
  {
    id: "obgyn",
    name: "OB-GYN",
    fullName: "Obstetrics & Gynecology",
    count: 18,
    description: "Specialists in women's reproductive health and menopause management",
    covers: [
      "Hormone replacement therapy (HRT)",
      "Menopause symptom management",
      "Reproductive health transitions",
      "Preventive gynecological care",
    ],
  },
  {
    id: "nurse-practitioner",
    name: "Nurse Practitioner",
    fullName: "Women's Health Nurse Practitioner",
    count: 24,
    description: "Advanced practice nurses specializing in women's health across the lifespan",
    covers: [
      "Primary menopause care",
      "Hormone therapy management",
      "Wellness counseling",
      "Preventive health screenings",
    ],
  },
  {
    id: "registered-dietitian",
    name: "Registered Dietitian",
    fullName: "Registered Dietitian Nutritionist",
    count: 15,
    description: "Nutrition experts focused on menopause-related dietary needs",
    covers: [
      "Menopause nutrition planning",
      "Bone health optimization",
      "Weight management strategies",
      "Heart-healthy meal planning",
    ],
  },
  {
    id: "pelvic-floor-pt",
    name: "Pelvic Floor PT",
    fullName: "Pelvic Floor Physical Therapist",
    count: 12,
    description: "Physical therapists specializing in pelvic floor dysfunction",
    covers: [
      "Pelvic floor strengthening",
      "Incontinence management",
      "Core stability training",
      "Pain management techniques",
    ],
  },
  {
    id: "cbt-therapist",
    name: "CBT-I Therapist",
    fullName: "Cognitive Behavioral Therapy for Insomnia Specialist",
    count: 9,
    description: "Mental health professionals specializing in sleep disorders",
    covers: [
      "Menopause-related sleep issues",
      "Cognitive behavioral therapy",
      "Sleep hygiene education",
      "Stress management techniques",
    ],
  },
]

export function DoctorsDirectory() {
  const [email, setEmail] = useState("")
  const [selectedProfile, setSelectedProfile] = useState<(typeof specialties)[0] | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleNotifyMe = async () => {
    if (!email) {
      alert("Please enter your email address first")
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch("/api/email-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          source: "doctors-directory",
          interest: "healthcare-providers",
        }),
      })

      if (response.ok) {
        // Store to localStorage as backup
        const existingEmails = JSON.parse(localStorage.getItem("empress-emails") || "[]")
        if (!existingEmails.includes(email)) {
          existingEmails.push(email)
          localStorage.setItem("empress-emails", JSON.stringify(existingEmails))
        }

        alert("Thanks! We'll notify you when healthcare providers are available in your area.")
        setEmail("")
      } else {
        throw new Error("Failed to subscribe")
      }
    } catch (error) {
      alert("Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const openProfile = (specialty: (typeof specialties)[0]) => {
    setSelectedProfile(specialty)
  }

  return (
    <div className="space-y-8">
      {/* Coming Soon Banner */}
      <Card className="border-primary/20 bg-gradient-to-r from-purple-50 to-orange-50">
        <CardContent className="p-8 text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-orange-500 flex items-center justify-center mb-4">
            <Stethoscope className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Menopause Healthcare Directory</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            We're building a curated network of healthcare providers who specialize in menopause care and understand
            your unique journey. Get notified when we launch.
          </p>

          {/* Email Signup */}
          <div className="max-w-md mx-auto">
            <div className="flex space-x-2 mb-4">
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1"
                onKeyDown={(e) => e.key === "Enter" && handleNotifyMe()}
              />
              <Button onClick={handleNotifyMe} disabled={!email || isSubmitting}>
                <Bell className="h-4 w-4 mr-2" />
                {isSubmitting ? "Saving..." : "Notify Me"}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              We'll only notify you about menopause specialists in your area. No spam, ever.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Specialties Grid */}
      <div>
        <h3 className="text-xl font-semibold mb-6">Menopause Healthcare Specialties</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {specialties.map((specialty) => (
            <Card
              key={specialty.id}
              className="cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1 group"
              onClick={() => openProfile(specialty)}
            >
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-purple-100 to-orange-100 flex items-center justify-center mb-3 group-hover:from-purple-200 group-hover:to-orange-200 transition-colors">
                    <span className="text-2xl">{getSpecialtyIcon(specialty.id)}</span>
                  </div>
                  <h4 className="font-semibold text-lg mb-1">{specialty.name}</h4>
                  <p className="text-sm text-muted-foreground mb-3">{specialty.description}</p>
                  <Badge variant="secondary" className="mb-4">
                    {specialty.count} providers planned
                  </Badge>
                </div>
                <Button
                  variant="outline"
                  className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors bg-transparent"
                >
                  View Profile Preview
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Profile Modal */}
      <Dialog open={!!selectedProfile} onOpenChange={() => setSelectedProfile(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-100 to-orange-100 flex items-center justify-center">
                <span className="text-xl">{selectedProfile && getSpecialtyIcon(selectedProfile.id)}</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold">{selectedProfile?.fullName}</h3>
                <p className="text-sm text-muted-foreground">{selectedProfile?.name} Specialists</p>
              </div>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Photo Placeholder */}
            <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-r from-purple-200 to-orange-200 flex items-center justify-center">
              <span className="text-4xl">{selectedProfile && getSpecialtyIcon(selectedProfile.id)}</span>
            </div>

            {/* Description */}
            <div className="text-center">
              <p className="text-muted-foreground">{selectedProfile?.description}</p>
            </div>

            {/* What They Cover */}
            <div>
              <h4 className="font-semibold mb-3">What Our {selectedProfile?.name} Specialists Cover:</h4>
              <ul className="space-y-2">
                {selectedProfile?.covers.map((item, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Coming Soon Notice */}
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
              <p className="text-sm text-orange-800 font-medium">
                🚧 Provider profiles coming soon! We're carefully vetting specialists who understand menopause care.
              </p>
            </div>

            {/* CTA */}
            <div className="text-center pt-4 border-t">
              <p className="text-sm text-muted-foreground mb-3">
                Want to be notified when {selectedProfile?.name} specialists are available?
              </p>
              <Button onClick={() => setSelectedProfile(null)} className="w-full">
                Get Notified When Available
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Features Preview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-primary" />
              <span>Menopause Expertise</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              All providers are specifically trained in menopause care and understand the unique challenges you face.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Heart className="h-5 w-5 text-primary" />
              <span>Compassionate Care</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Find healthcare providers who listen, understand, and provide personalized menopause support.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-primary" />
              <span>Easy Access</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Book appointments with menopause specialists who prioritize your time and health journey.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function getSpecialtyIcon(specialtyId: string): string {
  const icons: Record<string, string> = {
    obgyn: "🩺",
    "nurse-practitioner": "👩‍⚕️",
    "registered-dietitian": "🥗",
    "pelvic-floor-pt": "🧘‍♀️",
    "cbt-therapist": "🧠",
  }
  return icons[specialtyId] || "👩‍⚕️"
}
