'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { FileText, Sparkles, Download, Code, Zap, Shield, Cpu } from 'lucide-react'

interface LandingPageProps {
  onStart: () => void
}

export function LandingPage({ onStart }: LandingPageProps) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div className="min-h-screen cyberpunk-bg text-foreground relative overflow-hidden">
      {/* Animated grid background */}
      <div className="fixed inset-0 grid-pattern opacity-30 pointer-events-none" />
      
      {/* Glassmorphism header */}
      <header className="sticky top-0 z-50 glass-morphism">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <FileText className="w-7 h-7 text-primary floating-3d" />
                <div className="absolute inset-0 blur-xl bg-primary/30 -z-10" />
              </div>
              <h1 className="text-2xl font-bold tracking-wider">
                <span className="neon-text bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                  REXUME
                </span>
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="relative">
        {/* Hero section with parallax */}
        <section className="relative min-h-[80vh] flex items-center overflow-hidden">
          {/* Parallax elements */}
          <div 
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              transform: `translate(${mousePos.x * 0.02}px, ${mousePos.y * 0.02}px)`
            }}
          >
            <div className="absolute top-20 right-[10%] w-64 h-64 rounded-full bg-primary/20 blur-3xl" />
            <div className="absolute bottom-20 left-[10%] w-80 h-80 rounded-full bg-secondary/20 blur-3xl" />
            <div className="absolute top-1/2 right-[30%] w-48 h-48 rounded-full bg-accent/20 blur-3xl" />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-5xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                {/* Left content */}
                <div className="space-y-8">
                  <div className="space-y-4">
                    <div className="inline-block px-4 py-2 rounded-full border border-primary/30 bg-primary/5 backdrop-blur-sm">
                      <p className="text-sm font-medium tracking-wide text-primary uppercase">AI-Powered Resume Builder</p>
                    </div>
                    <h2 className="text-5xl md:text-6xl font-bold tracking-tight leading-tight">
                      Create
                      <span className="neon-text bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent"> ATS-Friendly </span>
                      Resumes
                    </h2>
                    <p className="text-lg text-muted-foreground leading-relaxed tracking-wide">
                      Build professional LaTeX resumes tailored to any job. Powered by advanced AI, optimized for Applicant Tracking Systems. No LaTeX knowledge required.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button 
                      size="lg" 
                      onClick={onStart} 
                      className="text-base button-3d group relative overflow-hidden"
                    >
                      <span className="relative z-10 flex items-center">
                        Get Started
                        <Sparkles className="ml-2 w-4 h-4 group-hover:rotate-12 transition-transform" />
                      </span>
                    </Button>
                    <Button 
                      size="lg" 
                      variant="outline"
                      className="text-base glass-morphism hover:border-primary/50 transition-all bg-transparent"
                    >
                      <Code className="mr-2 w-4 h-4" />
                      View Demo
                    </Button>
                  </div>

                  {/* Stats */}
                  <div className="flex gap-8 pt-4">
                    <div className="space-y-1">
                      <p className="text-3xl font-bold neon-text">100%</p>
                      <p className="text-sm text-muted-foreground uppercase tracking-wider">ATS Compatible</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-3xl font-bold neon-text">AI</p>
                      <p className="text-sm text-muted-foreground uppercase tracking-wider">Powered</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-3xl font-bold neon-text">Free</p>
                      <p className="text-sm text-muted-foreground uppercase tracking-wider">Forever</p>
                    </div>
                  </div>
                </div>

                {/* Right illustration */}
                <div className="relative hidden lg:block">
                  <div 
                    className="parallax-layer"
                    style={{
                      transform: `translate(${mousePos.x * -0.01}px, ${mousePos.y * -0.01}px) rotateY(${mousePos.x * 0.01}deg)`
                    }}
                  >
                    <div className="relative">
                      <div className="absolute inset-0 pulse-glow rounded-2xl" />
                      <div className="card-3d p-8 rounded-2xl space-y-4">
                        <div className="h-4 w-3/4 bg-gradient-to-r from-primary/40 to-transparent rounded" />
                        <div className="h-4 w-full bg-gradient-to-r from-secondary/40 to-transparent rounded" />
                        <div className="h-4 w-5/6 bg-gradient-to-r from-accent/40 to-transparent rounded" />
                        <div className="h-px bg-gradient-to-r from-primary/20 via-secondary/20 to-transparent my-4" />
                        <div className="h-3 w-2/3 bg-gradient-to-r from-primary/30 to-transparent rounded" />
                        <div className="h-3 w-full bg-gradient-to-r from-secondary/30 to-transparent rounded" />
                        <div className="h-3 w-4/5 bg-gradient-to-r from-accent/30 to-transparent rounded" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features section */}
        <section className="py-24 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16 space-y-4">
                <div className="inline-block px-4 py-2 rounded-full border border-secondary/30 bg-secondary/5 backdrop-blur-sm">
                  <p className="text-sm font-medium tracking-wide text-secondary uppercase">Features</p>
                </div>
                <h3 className="text-4xl font-bold tracking-tight">
                  Built for the
                  <span className="neon-text bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent"> Modern </span>
                  Job Market
                </h3>
              </div>

              <div className="grid md:grid-cols-3 gap-6 perspective-container">
                <div className="card-3d p-8 rounded-2xl group cursor-pointer">
                  <div className="relative mb-6">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/30">
                      <Sparkles className="w-7 h-7 text-primary group-hover:scale-110 transition-transform" />
                    </div>
                    <div className="absolute inset-0 blur-2xl bg-primary/20 -z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <h4 className="text-xl font-semibold mb-3 tracking-wide">AI-Powered Content</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    Automatically generate tailored summaries and impactful bullet points for each job using advanced AI technology
                  </p>
                </div>

                <div className="card-3d p-8 rounded-2xl group cursor-pointer">
                  <div className="relative mb-6">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-secondary/20 to-secondary/5 flex items-center justify-center border border-secondary/30">
                      <Shield className="w-7 h-7 text-secondary group-hover:scale-110 transition-transform" />
                    </div>
                    <div className="absolute inset-0 blur-2xl bg-secondary/20 -z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <h4 className="text-xl font-semibold mb-3 tracking-wide">ATS-Optimized</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    Clean, single-column layout designed to pass Applicant Tracking Systems with 100% compatibility
                  </p>
                </div>

                <div className="card-3d p-8 rounded-2xl group cursor-pointer">
                  <div className="relative mb-6">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center border border-accent/30">
                      <Download className="w-7 h-7 text-accent group-hover:scale-110 transition-transform" />
                    </div>
                    <div className="absolute inset-0 blur-2xl bg-accent/20 -z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <h4 className="text-xl font-semibold mb-3 tracking-wide">Multiple Export Formats</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    Download your resume as PDF or get the LaTeX source code to customize further with full control
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How it works section */}
        <section className="py-24 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/5 to-transparent" />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-16 space-y-4">
                <div className="inline-block px-4 py-2 rounded-full border border-accent/30 bg-accent/5 backdrop-blur-sm">
                  <p className="text-sm font-medium tracking-wide text-accent uppercase">Process</p>
                </div>
                <h3 className="text-4xl font-bold tracking-tight">How It Works</h3>
              </div>

              <div className="grid md:grid-cols-4 gap-6">
                {[
                  { num: '01', icon: FileText, title: 'Fill Details', desc: 'Enter your information through our guided multi-step form' },
                  { num: '02', icon: Cpu, title: 'Paste Job', desc: 'Add the job description you\'re applying for' },
                  { num: '03', icon: Zap, title: 'AI Generate', desc: 'AI creates tailored content and LaTeX code' },
                  { num: '04', icon: Download, title: 'Download', desc: 'Get your professional PDF resume instantly' }
                ].map((step, i) => (
                  <div key={i} className="relative group">
                    <div className="glass-morphism p-6 rounded-xl hover:border-primary/50 transition-all">
                      <div className="flex flex-col items-center text-center space-y-4">
                        <div className="relative">
                          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center border border-primary/30">
                            <step.icon className="w-7 h-7 text-primary" />
                          </div>
                          <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                            {step.num}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-semibold tracking-wide uppercase text-sm">{step.title}</h4>
                          <p className="text-xs text-muted-foreground leading-relaxed">{step.desc}</p>
                        </div>
                      </div>
                    </div>
                    {i < 3 && (
                      <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-px bg-gradient-to-r from-primary/50 to-transparent" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA section */}
        <section className="py-24 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent" />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto">
              <div className="card-3d p-12 rounded-3xl text-center space-y-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
                
                <div className="relative z-10 space-y-6">
                  <h3 className="text-4xl md:text-5xl font-bold tracking-tight">
                    Ready to Build Your
                    <span className="neon-text bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"> Perfect </span>
                    Resume?
                  </h3>
                  <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                    Join thousands of professionals who landed their dream jobs with AI-powered resumes
                  </p>
                  <Button 
                    size="lg" 
                    onClick={onStart} 
                    className="text-lg px-8 py-6 button-3d"
                  >
                    Start Building Now
                    <Sparkles className="ml-2 w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/30 glass-morphism mt-24">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center space-y-4">
            <p className="text-sm text-muted-foreground tracking-wider uppercase">
              Built for students, freshers, and professionals seeking their next opportunity
            </p>
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span>Powered by AI</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
