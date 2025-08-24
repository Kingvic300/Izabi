import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { User, Lock, Camera, Save, Edit, KeyRound } from "lucide-react";
import ChangePassword from "@/pages/ChangePassword.tsx";
import { BASE_URL } from "@/contants/contants.ts";

const DashboardProfile = () => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: "John",
    lastName: "Doe",
    email: localStorage.getItem("userEmail") || "john.doe@example.com",
    phoneNumber: "",
    institution: "",
    major: "",
    location: "",
    profilePicturePath: "",
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const savedProfile = localStorage.getItem("userProfile");
        let profile = savedProfile ? JSON.parse(savedProfile) : {};

        // Always set email from localStorage
        const storedEmail = localStorage.getItem("userEmail");
        if (storedEmail) profile.email = storedEmail;

        setProfileData({ ...profileData, ...profile });

        const userId = localStorage.getItem("userId");
        if (!userId) return;

        const response = await fetch(`${BASE_URL}/users/${userId}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (response.ok) {
          const data = await response.json();
          if (storedEmail) data.email = storedEmail; // Ensure email is correct
          setProfileData({ ...profileData, ...data });
          localStorage.setItem("userProfile", JSON.stringify({ ...profileData, ...data }));
        }
      } catch (error) {
        console.error("Error loading profile:", error);
      }
    };

    loadProfile();
  }, []);

  const handleInputChange = (field: string, value: string) => {
    const updatedData = { ...profileData, [field]: value };
    setProfileData(updatedData);
    localStorage.setItem("userProfile", JSON.stringify(updatedData));
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      // Always include email from localStorage to prevent overwriting
      const updatedProfileData = { ...profileData, email: localStorage.getItem("userEmail") };

      const response = await fetch(`${BASE_URL}/users/update-profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedProfileData),
      });

      if (!response.ok) throw new Error("Failed to update profile");

      const updatedProfile = await response.json();
      // Keep email from localStorage
      updatedProfile.email = localStorage.getItem("userEmail") || updatedProfile.email;

      localStorage.setItem("userProfile", JSON.stringify(updatedProfile));
      setProfileData(updatedProfile);
      setIsEditing(false);

      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Update Failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const updatedData = {
          ...profileData,
          profilePicturePath: e.target?.result as string,
        };
        setProfileData(updatedData);
        localStorage.setItem("userProfile", JSON.stringify(updatedData));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChangePassword = () => {
    toast({
      title: "Redirecting...",
      description: "You are being redirected to the Change Password page.",
    });
    console.log("Navigate to /change-password");
  };

  return (
      <div className="space-y-6 max-w-4xl">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Profile Settings</h1>
          <p className="text-muted-foreground">Manage your account information and preferences</p>
        </div>

        {/* Profile Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-primary" />
                  <span>Personal Information</span>
                </CardTitle>
                <CardDescription>Update your profile details and photo</CardDescription>
              </div>
              <Button variant="secondary" onClick={() => setIsEditing(!isEditing)}>
                <Edit className="h-4 w-4 mr-2" />
                {isEditing ? "Cancel" : "Edit"}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={profileData.profilePicturePath} />
                  <AvatarFallback className="text-2xl">
                    {profileData.firstName?.[0] || "J"}
                    {profileData.lastName?.[0] || "D"}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                    <label className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center cursor-pointer hover:bg-primary/90 transition-colors">
                      <Camera className="h-4 w-4 text-primary-foreground" />
                      <input
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarUpload}
                          className="hidden"
                      />
                    </label>
                )}
              </div>
              <div>
                <h3 className="text-lg font-medium">
                  {profileData.firstName || "John"} {profileData.lastName || "Doe"}
                </h3>
                <p className="text-muted-foreground">{profileData.email}</p>
              </div>
            </div>

            <Separator />

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                    id="firstName"
                    value={profileData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                    id="lastName"
                    value={profileData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                    id="phoneNumber"
                    value={profileData.phoneNumber}
                    onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                    disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="institution">Institution</Label>
                <Input
                    id="institution"
                    value={profileData.institution}
                    onChange={(e) => handleInputChange("institution", e.target.value)}
                    disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="major">Major</Label>
                <Input
                    id="major"
                    value={profileData.major}
                    onChange={(e) => handleInputChange("major", e.target.value)}
                    disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                    id="location"
                    value={profileData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    disabled={!isEditing}
                />
              </div>
            </div>

            {isEditing && (
                <div className="flex justify-end">
                  <Button onClick={handleSaveProfile} disabled={loading}>
                    <Save className="h-4 w-4 mr-2" />
                    {loading ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
            )}
          </CardContent>
        </Card>

        {/* Security Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Lock className="h-5 w-5 text-primary" />
              <span>Account Security</span>
            </CardTitle>
            <CardDescription>Manage your password and security settings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                <KeyRound className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Change Password</p>
                  <p className="text-sm text-muted-foreground">
                    Update your password to keep your account secure
                  </p>
                </div>
              </div>

              <ChangePassword />
            </div>
          </CardContent>
        </Card>
      </div>
  );
};

export default DashboardProfile;
