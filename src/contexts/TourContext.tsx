"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from "react"
import { useLocation } from "react-router-dom"

export type TourStep = {
    targetId: string 
    title: string
    content: string
    position?: "top" | "bottom" | "left" | "right" | "center"
    page?: string 
}

type TourContextType = {
    startTour: () => void
    endTour: () => void
    nextStep: () => void
    prevStep: () => void
    isActive: boolean
    currentStepIndex: number
    currentStep: TourStep | null
    totalSteps: number
}

const TourContext = createContext<TourContextType | undefined>(undefined)

export const TOUR_STEPS: TourStep[] = [
    {
        targetId: "center-modal",
        title: "Welcome to Izabi",
        content: "Izabi turns your chaotic notes into clear, interactive study plans. Master your material faster with AI-powered quizzes and summaries.",
        position: "center"
    },
    {
        targetId: "brain-drop-section",
        title: "Start Your Day",
        content: "Answer the Daily Brain Drop. It is the quickest way to test yourself and earn instant XP.",
        position: "bottom"
    },
    {
        targetId: "intent-card-upload",
        title: "Upload Your Materials",
        content: "Tap here to upload your class notes or textbooks. We'll instantly generate summaries and quizzes from them.",
        position: "top"
    },
    {
        targetId: "study-modes-grid",
        title: "Transform Your Notes",
        content: "This is your active lab. Once uploaded, select a mode to turn your documents into summaries, quizzes, or flashcards.",
        position: "top"
    },
    {
        targetId: "floating-ai-trigger",
        title: "Your AI Tutor",
        content: "Stuck on a concept? Chat with Izabi AI here. It knows your uploaded documents and can answer specific questions.",
        position: "right"
    },
    {
        targetId: "nav-item-notes",
        title: "Note Library",
        content: "All your uploaded documents are stored here safely. Access them anytime to review or generate new materials.",
        position: "right"
    },
    {
        targetId: "nav-item-exam-center",
        title: "Exam Center",
        content: "Prepare for the real thing. Practice with past questions and timed mock exams.",
        position: "right"
    },
    {
        targetId: "nav-item-learning-progress",
        title: "Track Progress",
        content: "See how much you've learned. Track your mastery over time and identify areas for improvement.",
        position: "right"
    },
    {
        targetId: "nav-item-history",
        title: "Activity History",
        content: "Need to find something you did yesterday? Your entire learning timeline is saved here.",
        position: "right"
    },
    {
        targetId: "streak-pet-container",
        title: "Track Consistency",
        content: "Meet your study companion. It evolves as you maintain your daily learning streak. Keep it happy!",
        position: "top"
    }
]

export function TourProvider({ children }: { children: React.ReactNode }) {
    const [isActive, setIsActive] = useState(false)
    const [currentStepIndex, setCurrentStepIndex] = useState(0)
    const location = useLocation()

    // Auto-start for new users - DISABLED
    /*
    useEffect(() => {
        const hasSeenTour = localStorage.getItem("hasSeenTour_v1")
        // Only start if on dashboard and haven't seen tour
        if (!hasSeenTour && location.pathname === "/dashboard") {
            // Small delay to ensure elements are mounted
            setTimeout(() => {
                setIsActive(true)
            }, 1000)
        }
    }, [location.pathname])
    */

    const startTour = useCallback(() => {
        localStorage.removeItem("hasSeenTour_v1")
        setCurrentStepIndex(0)
        setIsActive(true)
    }, [])

    const endTour = useCallback(() => {
        setIsActive(false)
        setCurrentStepIndex(0)
        localStorage.setItem("hasSeenTour_v1", "true")
    }, [])

    const nextStep = useCallback(() => {
        if (currentStepIndex < TOUR_STEPS.length - 1) {
            setCurrentStepIndex(prev => prev + 1)
        } else {
            endTour()
        }
    }, [currentStepIndex, endTour])

    const prevStep = useCallback(() => {
        if (currentStepIndex > 0) {
            setCurrentStepIndex(prev => prev - 1)
        }
    }, [currentStepIndex])

    const value = {
        startTour,
        endTour,
        nextStep,
        prevStep,
        isActive,
        currentStepIndex,
        currentStep: TOUR_STEPS[currentStepIndex],
        totalSteps: TOUR_STEPS.length
    }

    return (
        <TourContext.Provider value={value}>
            {children}
        </TourContext.Provider>
    )
}

export const useTour = () => {
    const context = useContext(TourContext)
    if (context === undefined) {
        throw new Error("useTour must be used within a TourProvider")
    }
    return context
}
