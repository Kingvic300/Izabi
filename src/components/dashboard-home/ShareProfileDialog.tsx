'use client';

import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, QrCode, Link2, Twitter, Facebook, Linkedin, Mail, Check } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAppToast } from '@/hooks/useAppToast';
import { cn } from '@/lib/utils';
import QRCode from 'react-qr-code'; // You'll need to install: npm install react-qr-code

interface ShareProfileDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    profileData: {
        userId: string;
        firstName?: string;
        lastName?: string;
        email?: string;
        profilePicturePath?: string;
        institution?: string;
        bio?: string;
        totalPoints?: number;
        studyStreak?: number;
        rank?: {
            xp?: number;
            streak?: number;
        };
        achievements?: Array<{
            id: string;
            name: string;
            icon?: string;
        }>;
    };
    shareUrl?: string;
    shareText?: string;
}

export const ShareProfileDialog = ({
    open,
    onOpenChange,
    profileData,
    shareUrl: customShareUrl,
    shareText: customShareText,
}: ShareProfileDialogProps) => {
    const [activeTab, setActiveTab] = useState('link');
    const [copied, setCopied] = useState(false);
    const toast = useAppToast();

    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://izabi.halixe.com';
    const profileUrl = customShareUrl || `${baseUrl}/profile/${profileData.userId}`;
    
    const defaultShareText = `Check out ${profileData.firstName || 'my'} profile on Izabi! 🚀\n\n` +
        `${profileData.firstName || 'Scholar'} ${profileData.lastName || ''}\n` +
        `${profileData.institution ? `📚 ${profileData.institution}\n` : ''}` +
        `🏆 ${profileData.totalPoints || 0} XP • 🔥 ${profileData.studyStreak || 0} day streak\n\n` +
        `View profile: ${profileUrl}`;

    const shareText = customShareText || defaultShareText;

    const handleCopyLink = async () => {
        if (!navigator.clipboard?.writeText) {
            toast.info({
                title: 'Copy unavailable',
                description: 'Your browser does not support copy.',
            });
            return;
        }

        try {
            await navigator.clipboard.writeText(profileUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
            toast.success({
                title: 'Link copied',
                description: 'Profile link copied to clipboard.',
            });
        } catch (error) {
            toast.apiError(error, 'Copy failed');
        }
    };

    const handleCopyShareText = async () => {
        if (!navigator.clipboard?.writeText) {
            toast.info({
                title: 'Copy unavailable',
                description: 'Your browser does not support copy.',
            });
            return;
        }

        try {
            await navigator.clipboard.writeText(shareText);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
            toast.success({
                title: 'Copied',
                description: 'Share text copied to clipboard.',
            });
        } catch (error) {
            toast.apiError(error, 'Copy failed');
        }
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `${profileData.firstName || 'Scholar'}'s Profile | Izabi`,
                    text: shareText,
                    url: profileUrl,
                });
            } catch (error: any) {
                if (error?.name !== 'AbortError') {
                    // Fallback to showing the dialog with copy options
                    setActiveTab('link');
                }
            }
        } else {
            // Fallback to copy
            setActiveTab('link');
        }
    };

    const handleSocialShare = (platform: string) => {
        const encodedUrl = encodeURIComponent(profileUrl);
        const encodedText = encodeURIComponent(shareText);
        
        let shareLink = '';
        switch (platform) {
            case 'twitter':
                shareLink = `https://twitter.com/intent/tweet?text=${encodedText}`;
                break;
            case 'facebook':
                shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
                break;
            case 'linkedin':
                shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
                break;
            case 'email':
                shareLink = `mailto:?subject=${encodedText.split('\n')[0]}&body=${encodedText}`;
                break;
        }
        
        if (shareLink) {
            window.open(shareLink, '_blank', 'noopener,noreferrer');
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        Share Profile
                        <Badge variant="outline" className="ml-2 text-[10px] font-bold uppercase tracking-widest">
                            {profileData.firstName || 'Scholar'}
                        </Badge>
                    </DialogTitle>
                    <DialogDescription>
                        Share your Izabi profile with friends or on social media.
                    </DialogDescription>
                </DialogHeader>

                {/* Profile Preview Card */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/5 via-transparent to-primary/5 border border-primary/10 mb-2">
                    <div className="flex items-center gap-4">
                        <Avatar className="w-16 h-16 border-2 border-primary/20">
                            <AvatarImage 
                                src={profileData.profilePicturePath || 
                                    `https://api.dicebear.com/7.x/notionists/svg?seed=${profileData.email || profileData.userId}`} 
                            />
                            <AvatarFallback className="bg-primary/20 text-primary font-bold text-xl">
                                {(profileData.firstName || 'U')[0]}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-lg truncate">
                                {profileData.firstName || 'Scholar'} {profileData.lastName || ''}
                            </h3>
                            {profileData.institution && (
                                <p className="text-xs text-muted-foreground truncate">
                                    {profileData.institution}
                                </p>
                            )}
                            <div className="flex items-center gap-3 mt-1">
                                <div className="flex items-center gap-1 text-xs">
                                    <span className="font-bold text-primary">{profileData.totalPoints || 0}</span>
                                    <span className="text-muted-foreground">XP</span>
                                </div>
                                <div className="flex items-center gap-1 text-xs">
                                    <span className="font-bold text-orange-500">{profileData.studyStreak || 0}</span>
                                    <span className="text-muted-foreground">streak</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid grid-cols-3 mb-4">
                        <TabsTrigger value="link" className="text-xs gap-1">
                            <Link2 size={14} />
                            Link
                        </TabsTrigger>
                        <TabsTrigger value="qr" className="text-xs gap-1">
                            <QrCode size={14} />
                            QR Code
                        </TabsTrigger>
                        <TabsTrigger value="social" className="text-xs gap-1">
                            <Twitter size={14} />
                            Social
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="link" className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                                Profile Link
                            </label>
                            <div className="flex items-center gap-2">
                                <code className="flex-1 p-3 rounded-xl bg-muted/50 text-xs font-mono truncate border border-foreground/5">
                                    {profileUrl}
                                </code>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={handleCopyLink}
                                    className="shrink-0 h-11 w-11 rounded-xl"
                                >
                                    {copied ? <Check size={18} /> : <Copy size={18} />}
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                                Share Text
                            </label>
                            <Textarea
                                readOnly
                                value={shareText}
                                className="min-h-[120px] text-sm"
                            />
                            <Button
                                variant="outline"
                                onClick={handleCopyShareText}
                                className="w-full gap-2"
                            >
                                {copied ? <Check size={16} /> : <Copy size={16} />}
                                Copy Share Text
                            </Button>
                        </div>
                    </TabsContent>

                    <TabsContent value="qr" className="space-y-4">
                        <div className="flex flex-col items-center justify-center p-4">
                            <div className="p-4 bg-white rounded-2xl shadow-lg mb-4">
                                <QRCode
                                    value={profileUrl}
                                    size={200}
                                    style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
                                    viewBox={`0 0 256 256`}
                                />
                            </div>
                            <p className="text-xs text-center text-muted-foreground mb-3">
                                Scan this QR code to view {profileData.firstName || 'this user'}'s profile
                            </p>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    // Download QR code functionality
                                    const canvas = document.querySelector('canvas');
                                    if (canvas) {
                                        const link = document.createElement('a');
                                        link.download = `izabi-profile-${profileData.userId}.png`;
                                        link.href = canvas.toDataURL();
                                        link.click();
                                    }
                                }}
                                className="gap-2"
                            >
                                <QrCode size={16} />
                                Download QR Code
                            </Button>
                        </div>
                    </TabsContent>

                    <TabsContent value="social" className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                            <Button
                                variant="outline"
                                className="h-auto py-4 flex flex-col items-center gap-2 hover:bg-[#1DA1F2]/10 hover:border-[#1DA1F2]/30 transition-all"
                                onClick={() => handleSocialShare('twitter')}
                            >
                                <Twitter size={24} className="text-[#1DA1F2]" />
                                <span className="text-xs font-bold">Twitter</span>
                            </Button>
                            
                            <Button
                                variant="outline"
                                className="h-auto py-4 flex flex-col items-center gap-2 hover:bg-[#4267B2]/10 hover:border-[#4267B2]/30 transition-all"
                                onClick={() => handleSocialShare('facebook')}
                            >
                                <Facebook size={24} className="text-[#4267B2]" />
                                <span className="text-xs font-bold">Facebook</span>
                            </Button>
                            
                            <Button
                                variant="outline"
                                className="h-auto py-4 flex flex-col items-center gap-2 hover:bg-[#0077B5]/10 hover:border-[#0077B5]/30 transition-all"
                                onClick={() => handleSocialShare('linkedin')}
                            >
                                <Linkedin size={24} className="text-[#0077B5]" />
                                <span className="text-xs font-bold">LinkedIn</span>
                            </Button>
                            
                            <Button
                                variant="outline"
                                className="h-auto py-4 flex flex-col items-center gap-2 hover:bg-primary/10 hover:border-primary/30 transition-all"
                                onClick={() => handleSocialShare('email')}
                            >
                                <Mail size={24} className="text-primary" />
                                <span className="text-xs font-bold">Email</span>
                            </Button>
                        </div>

                        <div className="p-3 rounded-xl bg-muted/30 border border-foreground/5">
                            <p className="text-xs text-muted-foreground text-center">
                                Sharing via social media will open a new window.
                            </p>
                        </div>
                    </TabsContent>
                </Tabs>

                <DialogFooter className="flex-col sm:flex-row gap-2">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        className="w-full sm:w-auto"
                    >
                        Close
                    </Button>
                    <Button
                        onClick={handleShare}
                        className="w-full sm:w-auto gap-2"
                    >
                        <Copy size={16} />
                        Share Profile
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};