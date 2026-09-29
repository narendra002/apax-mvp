"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { LandingHeader } from '@/components/landing/header'
import { HeroSection } from '@/components/landing/hero-section'
import { TrustSection } from '@/components/landing/trust-section'
import { HowItWorksSection } from '@/components/landing/how-it-works-section'
import { MetalsSection } from '@/components/landing/metals-section'
import { LandingFooter } from '@/components/landing/footer'
import { useAPAXStore } from '@/lib/store'

export default function LandingPage() {
  const router = useRouter()
  const [isAuthReady, setIsAuthReady] = useState(false)
  const authToken = useAPAXStore((state) => state.authToken)

  useEffect(() => {
    setIsAuthReady(true)
  }, [])

  useEffect(() => {
    if (authToken) {
      router.replace('/dashboard')
    }
  }, [authToken, router])

  if (!isAuthReady || authToken) {
    return null
  }

  return (
    <main className="min-h-screen bg-[#0A0A0A]">
      <LandingHeader />
      <HeroSection />
      <HowItWorksSection />
      <MetalsSection />
      <TrustSection />
      <LandingFooter />
    </main>
  )
}
