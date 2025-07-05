"use client"

import { useState } from "react"
import ScrollTriggerZoom from "@/components/ui/scroll-trigger-zoom"
import HeroSection from "@/components/sections/hero-section"
import LaptopVisual from "@/components/ui/laptop-visual"
import ProjectsSection from "@/components/sections/projects-section"
import ArticlesSection from "@/components/sections/articles-section"
import ContactSection from "@/components/sections/contact-section"
import Footer from "@/components/layout/footer"

export default function IntroZoomSection() {
  const [showMainContent, setShowMainContent] = useState(false)

  const handleZoomComplete = () => {
    setShowMainContent(true)
  }

  return (
    <>
      {/* ScrollTrigger Zoom Effect */}
      {!showMainContent && (
        <div className="fixed inset-0 z-50">
          <ScrollTriggerZoom onComplete={handleZoomComplete} />
        </div>
      )}

      {/* Main Portfolio Content */}
      <div className={`transition-opacity duration-1000 ${showMainContent ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <HeroSection />
        <LaptopVisual />
        <ProjectsSection />
        <ArticlesSection />
        <ContactSection />
        <Footer />
      </div>
    </>
  )
}