"use client"

import { useToast } from "@/components/ui/use-toast"

export type ToastVariant = "default" | "destructive" | "success" | "warning" | "info"

interface ToastOptions {
    title?: string
    description: string
    duration?: number
}

export const useAppToast = () => {
    const { toast } = useToast()

    return {
        // Success messages - rewarding and contextual
        success: (options: ToastOptions) => {
            toast({
                title: options.title || "Success!",
                description: options.description,
                variant: "default",
            })
        },

        // Error messages - specific and actionable
        error: (options: ToastOptions) => {
            toast({
                title: options.title || "Something went wrong",
                description: options.description,
                variant: "destructive",
            })
        },

        // Warning messages - explain the risk
        warning: (options: ToastOptions) => {
            toast({
                title: options.title || "Warning",
                description: options.description,
                variant: "default",
            })
        },

        // Info messages - helpful guidance
        info: (options: ToastOptions) => {
            toast({
                title: options.title || "Info",
                description: options.description,
                variant: "default",
            })
        },

        // Specific action messages
        noteSaved: () => {
            toast({
                title: "Note saved!",
                description: "Your note has been saved successfully.",
                variant: "default",
            })
        },

        noteDeleted: () => {
            toast({
                title: "Note deleted",
                description: "Your note has been permanently removed.",
                variant: "default",
            })
        },

        profileUpdated: () => {
            toast({
                title: "Profile updated!",
                description: "Your profile changes have been saved.",
                variant: "default",
            })
        },

        settingChanged: (settingName: string) => {
            toast({
                title: "Setting updated",
                description: `${settingName} has been updated successfully.`,
                variant: "default",
            })
        },

        loginFailed: (reason: string) => {
            toast({
                title: "Login failed",
                description: reason || "Please check your email and password and try again.",
                variant: "destructive",
            })
        },

        signupFailed: (reason: string) => {
            toast({
                title: "Signup failed",
                description: reason || "Please check your information and try again.",
                variant: "destructive",
            })
        },

        networkError: () => {
            toast({
                title: "Connection lost",
                description: "Please check your internet connection and try again.",
                variant: "destructive",
            })
        },

        validationError: (fieldName: string, reason: string) => {
            toast({
                title: `Invalid ${fieldName}`,
                description: reason,
                variant: "destructive",
            })
        },
    }
}
