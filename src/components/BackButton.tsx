"use client"

import { ArrowLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"

export const BackButton = () => {
    const navigate = useNavigate()

    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="gap-2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Go back to previous page"
        >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back</span>
        </Button>
    )
}
