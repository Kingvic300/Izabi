import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog"
import { useAppToast } from "@/hooks/useAppToast"
import apiClient from "@/lib/apiClient"
import { Lock, Mail, KeyRound, Loader2, ArrowRight } from "lucide-react"

const ChangePassword = () => {
    const appToast = useAppToast()
    const [step, setStep] = useState<1 | 2>(1)
    const [email, setEmail] = useState("")
    const [otp, setOtp] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false)

    /*
     * How: Initiates the password recovery process by requesting an OTP from the backend to the user's email.
     * Why: Verifies that the user owns the email address before allowing password modification.
     */
    const sendOtp = async () => {
        if (!email) {
            appToast.error({ title: "Email Required", description: "Please enter your email address." })
            return
        }
        setLoading(true)
        try {
            await apiClient.post(`/users/send-reset-otp`, { email })

            appToast.success({
                title: "Code Sent",
                description: "Check your inbox for the verification code.",
            })
            setStep(2)
        } catch (err) {
           // handled by interceptor or generic
           console.error(err)
        } finally {
            setLoading(false)
        }
    }

    /*
     * How: Validates the OTP and new password, then sends a request to update the user's password.
     * Why: securely finalizes the password change process ensuring only authorized users can reset credentials.
     */
    const resetPassword = async () => {
        if (!otp || !newPassword) {
            appToast.error({ title: "Missing Fields", description: "Please fill in all fields." })
            return
        }
        setLoading(true)
        try {
            await apiClient.post(`/users/reset-password`, { email, otp, newPassword })

            appToast.success({
                title: "Security Updated",
                description: "Your password has been changed successfully.",
            })
            setOpen(false)
            setStep(1)
            setEmail("")
            setOtp("")
            setNewPassword("")
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="rounded-xl border-primary/20 text-primary hover:bg-primary/10 hover:text-primary h-10 px-6 font-bold">
                    <Lock className="w-4 h-4 mr-2" />
                    Reset Access
                </Button>
            </DialogTrigger>
            <DialogContent className="glass border-foreground/10 rounded-2xl sm:max-w-md">
                <DialogHeader className="space-y-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-2">
                        <KeyRound size={24} />
                    </div>
                    <DialogTitle className="text-2xl font-bold tracking-tight">
                        {step === 1 ? "Verify Identity" : "Set New Password"}
                    </DialogTitle>
                    <DialogDescription className="text-base">
                        {step === 1 
                            ? "We'll send a secure verification code to your email." 
                            : "Enter the code you received and choose a strong password."
                        }
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 pt-4">
                    {step === 1 && (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-xs uppercase font-bold tracking-widest opacity-60">Your Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40" size={18} />
                                    <Input
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="scholar@example.com"
                                        className="pl-12 h-14 rounded-xl bg-card/5 border-foreground/10 focus:border-primary/50"
                                    />
                                </div>
                            </div>
                            <Button 
                                onClick={sendOtp} 
                                disabled={loading} 
                                className="w-full h-14 rounded-xl font-bold bg-primary hover:bg-primary-glow shadow-glow text-lg"
                            >
                                {loading ? <Loader2 className="animate-spin" /> : (
                                    <>
                                        Send Code <ArrowRight size={18} className="ml-2" />
                                    </>
                                )}
                            </Button>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="otp" className="text-xs uppercase font-bold tracking-widest opacity-60">Verification Code</Label>
                                <Input
                                    id="otp"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    placeholder="000000"
                                    className="h-14 rounded-xl bg-card/5 border-foreground/10 font-mono text-center text-lg tracking-widest"
                                    maxLength={6}
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <Label htmlFor="newPass" className="text-xs uppercase font-bold tracking-widest opacity-60">New Password</Label>
                                <Input
                                    id="newPass"
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="h-14 rounded-xl bg-card/5 border-foreground/10"
                                />
                            </div>

                            <Button 
                                onClick={resetPassword} 
                                disabled={loading} 
                                className="w-full h-14 rounded-xl font-bold bg-primary hover:bg-primary-glow shadow-glow text-lg"
                            >
                                {loading ? <Loader2 className="animate-spin" /> : "Confirm Update"}
                            </Button>
                            
                            <button 
                                onClick={() => setStep(1)} 
                                className="w-full text-center text-sm font-bold opacity-40 hover:opacity-100 mt-2"
                            >
                                Back to Email
                            </button>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default ChangePassword
