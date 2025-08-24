import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import {BASE_URL} from "@/contants/contants.ts";

const ChangePassword = () => {
    const { toast } = useToast();
    const [step, setStep] = useState<1 | 2>(1);
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const sendOtp = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${BASE_URL}/users/send-reset-otp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            if (!res.ok) throw new Error("Failed to send OTP");

            toast({
                title: "OTP Sent",
                description: "Check your email for the verification code.",
            });
            setStep(2);
        } catch (err) {
            toast({
                title: "Error",
                description: "Could not send OTP. Please try again.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const resetPassword = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${BASE_URL}/users/reset-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp, newPassword }),
            });

            if (!res.ok) throw new Error("Failed to reset password");

            toast({
                title: "Password Reset",
                description: "Your password has been updated successfully.",
            });
            setOpen(false);
            setStep(1);
            setEmail("");
            setOtp("");
            setNewPassword("");
        } catch (err) {
            toast({
                title: "Error",
                description: "Failed to reset password. Try again.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Button variant="secondary" onClick={() => setOpen(true)}>
                Change Password
            </Button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {step === 1 ? "Reset Password - Step 1" : "Reset Password - Step 2"}
                        </DialogTitle>
                    </DialogHeader>

                    {step === 1 && (
                        <div className="space-y-4">
                            <Label>Email</Label>
                            <Input
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                            />
                            <Button onClick={sendOtp} disabled={loading}>
                                {loading ? "Sending..." : "Send OTP"}
                            </Button>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-4">
                            <Label>OTP</Label>
                            <Input
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                placeholder="Enter OTP"
                            />

                            <Label>New Password</Label>
                            <Input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Enter new password"
                            />

                            <Button onClick={resetPassword} disabled={loading}>
                                {loading ? "Resetting..." : "Reset Password"}
                            </Button>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
};

export default ChangePassword;
