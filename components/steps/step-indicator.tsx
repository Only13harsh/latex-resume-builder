'use client'

import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Step {
  id: number
  title: string
}

interface StepIndicatorProps {
  steps: Step[]
  currentStep: number
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between relative">
        {steps.map((step, index) => {
          const isCompleted = currentStep > index
          const isCurrent = currentStep === index
          const isUpcoming = currentStep < index

          return (
            <div key={step.id} className="flex-1 relative">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-colors',
                    isCompleted && 'bg-primary text-primary-foreground',
                    isCurrent && 'bg-primary text-primary-foreground ring-4 ring-primary/20',
                    isUpcoming && 'bg-muted text-muted-foreground'
                  )}
                >
                  {isCompleted ? <Check className="w-5 h-5" /> : index + 1}
                </div>
                <div className="mt-2 text-xs text-center hidden sm:block">
                  <span className={cn(
                    'font-medium',
                    isCurrent && 'text-foreground',
                    !isCurrent && 'text-muted-foreground'
                  )}>
                    {step.title}
                  </span>
                </div>
              </div>

              {index < steps.length - 1 && (
                <div
                  className={cn(
                    'absolute top-5 left-[50%] w-full h-0.5 -z-10',
                    isCompleted ? 'bg-primary' : 'bg-muted'
                  )}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
