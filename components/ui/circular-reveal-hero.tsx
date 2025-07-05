"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

interface CircularRevealHeroProps {
  onRevealComplete?: () => void
  children: React.ReactNode
}

export default function CircularRevealHero({ onRevealComplete, children }: CircularRevealHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isRevealed, setIsRevealed] = useState(false)
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })

  // Transform scroll progress to reveal radius
  const revealRadius = useTransform(
    scrollYProgress,
    [0, 0.8],
    ["15%", "150%"],
    {
      ease: [0.25, 0.1, 0.25, 1] // Custom cubic-bezier for smooth easing
    }
  )

  // Transform for subtle background scale
  const backgroundScale = useTransform(
    scrollYProgress,
    [0, 1],
    [1.1, 1],
    {
      ease: [0.25, 0.1, 0.25, 1]
    }
  )

  // Transform for content opacity during reveal
  const contentOpacity = useTransform(
    scrollYProgress,
    [0, 0.3, 0.8],
    [0.7, 0.9, 1]
  )

  // Monitor scroll progress to trigger completion
  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      if (latest >= 0.8 && !isRevealed) {
        setIsRevealed(true)
        if (onRevealComplete) {
          onRevealComplete()
        }
      }
    })

    return () => unsubscribe()
  }, [scrollYProgress, isRevealed, onRevealComplete])

  return (
    <div ref={containerRef} className="relative">
      {/* Reveal Container */}
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Mask Layer */}
        <motion.div
          className="absolute inset-0 bg-slate-950"
          style={{
            clipPath: `circle(${revealRadius.get()} at center)`,
          }}
        >
          {/* Hero Content with Background */}
          <motion.div 
            className="relative w-full h-full"
            style={{ 
              scale: backgroundScale,
              opacity: contentOpacity
            }}
          >
            {children}
          </motion.div>
        </motion.div>

        {/* Animated Clip Path Mask */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(circle at center, transparent ${revealRadius.get()}, rgba(15, 23, 42, 0.95) ${revealRadius.get()})`,
          }}
        />

        {/* Subtle Ring Effect */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(circle at center, transparent calc(${revealRadius.get()} - 2px), rgba(248, 250, 252, 0.1) calc(${revealRadius.get()} - 1px), rgba(248, 250, 252, 0.05) calc(${revealRadius.get()} + 1px), transparent calc(${revealRadius.get()} + 2px))`,
          }}
        />
      </div>

      {/* Spacer for scroll height */}
      <div className="h-[200vh]" />
    </div>
  )
}