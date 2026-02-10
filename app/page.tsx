'use client'

import { useState } from 'react'
import { ResumeBuilder } from '@/components/resume-builder'
import { LandingPage } from '@/components/landing-page'

export default function Home() {
  const [started, setStarted] = useState(false)

  if (!started) {
    return <LandingPage onStart={() => setStarted(true)} />
  }

  return <ResumeBuilder />
}
