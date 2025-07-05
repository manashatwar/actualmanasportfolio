"use client"

import { useEffect, useRef } from "react"

interface ScrollTriggerZoomProps {
  onComplete?: () => void
}

export default function ScrollTriggerZoom({ onComplete }: ScrollTriggerZoomProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let gsap: any
    let ScrollTrigger: any

    const initGSAP = async () => {
      try {
        // Dynamic import to ensure proper loading
        const gsapModule = await import("gsap")
        const scrollTriggerModule = await import("gsap/ScrollTrigger")
        
        gsap = gsapModule.gsap
        ScrollTrigger = scrollTriggerModule.ScrollTrigger
        
        // Register the plugin
        gsap.registerPlugin(ScrollTrigger)

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: "top top",
            end: "+=150%",
            pin: true,
            scrub: true,
            onComplete: () => {
              if (onComplete) {
                onComplete()
              }
            }
          }
        })

        timeline
          .to(imageRef.current, {
            scale: 2,
            z: 350,
            transformOrigin: "center center",
            ease: "power1.inOut"
          })
          .to(
            heroRef.current,
            {
              scale: 1.1,
              transformOrigin: "center center",
              ease: "power1.inOut"
            },
            "<"
          )
      } catch (error) {
        console.error("Failed to initialize GSAP:", error)
      }
    }

    if (typeof window !== "undefined") {
      initGSAP()
    }

    return () => {
      if (ScrollTrigger) {
        ScrollTrigger.getAll().forEach((trigger: any) => trigger.kill())
      }
    }
  }, [onComplete])

  return (
    <div ref={wrapperRef} className="wrapper relative w-full z-10">
      <div className="content relative w-full z-10 overflow-x-hidden">
        {/* Hero Section with Background */}
        <section 
          ref={heroRef}
          className="section hero w-full h-screen bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1589848315097-ba7b903cc1cc?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')"
          }}
        >
          {/* Overlay Content */}
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <div className="text-center text-white z-20">
              <h1 className="text-4xl sm:text-6xl lg:text-8xl font-bold mb-4 sm:mb-6">
                Let's Explore
              </h1>
              <p className="text-lg sm:text-xl lg:text-2xl opacity-90 max-w-2xl mx-auto px-4">
                The Future of Blockchain Technology
              </p>
            </div>
          </div>
        </section>

        {/* Additional sections for scroll effect */}
        <section className="section w-full h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900"></section>
        <section className="section w-full h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-900"></section>
      </div>

      {/* Image Container */}
      <div className="image-container absolute top-0 left-0 right-0 w-full h-screen z-20 overflow-hidden">
        <img
          ref={imageRef}
          src="https://assets-global.website-files.com/63ec206c5542613e2e5aa784/643312a6bc4ac122fc4e3afa_main%20home.webp"
          alt="Blockchain Technology"
          className="w-full h-full object-cover object-center"
          style={{ perspective: "500px" }}
        />
      </div>
    </div>
  )
}