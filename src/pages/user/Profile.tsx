
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/use-toast";

const UserProfile = () => {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Update user name in localStorage
    const users = JSON.parse(localStorage.getItem("mitsUsers") || "[]");
    const updatedUsers = users.map((u: any) => {
      if (u.id === user?.id) {
        return { ...u, name };
      }
      return u;
    });

    localStorage.setItem("mitsUsers", JSON.stringify(updatedUsers));

    // Update current user in localStorage
    const currentUser = JSON.parse(localStorage.getItem("mitsUser") || "{}");
    currentUser.name = name;
    localStorage.setItem("mitsUser", JSON.stringify(currentUser));

    setIsLoading(false);
    toast({
      title: "Profile Updated",
      description: "Your profile has been updated successfully.",
    });
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validation
    if (newPassword !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Password Error",
        description: "New passwords do not match.",
      });
      setIsLoading(false);
      return;
    }

    // Verify current password and update
    const users = JSON.parse(localStorage.getItem("mitsUsers") || "[]");
    const currentUser = users.find((u: any) => u.id === user?.id);

    if (!currentUser || currentUser.password !== currentPassword) {
      toast({
        variant: "destructive",
        title: "Password Error",
        description: "Current password is incorrect.",
      });
      setIsLoading(false);
      return;
    }

    // Update password
    const updatedUsers = users.map((u: any) => {
      if (u.id === user?.id) {
        return { ...u, password: newPassword };
      }
      return u;
    });

    localStorage.setItem("mitsUsers", JSON.stringify(updatedUsers));

    // Clear password fields
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");

    setIsLoading(false);
    toast({
      title: "Password Changed",
      description: "Your password has been updated successfully.",
    });
  };

  if (!user) {
    return <div className="text-center py-16">Loading user profile...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Update your account details</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={user.email}
                  disabled
                  className="bg-gray-100"
                />
                <p className="text-xs text-gray-500">Email cannot be changed</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Account Type</Label>
                <Input
                  id="role"
                  value={user.role === "admin" ? "Administrator" : "Student"}
                  disabled
                  className="bg-gray-100"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Account Status</Label>
                <div className="flex items-center">
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs mr-2 ${
                      user.status === "approved"
                        ? "bg-green-100 text-green-800"
                        : user.status === "rejected"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {user.status}
                  </span>
                  <span className="text-sm text-gray-600">
                    {user.status === "approved"
                      ? "Your account is active"
                      : user.status === "rejected"
                      ? "Your account has been rejected"
                      : "Waiting for admin approval"}
                  </span>
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Updating..." : "Update Profile"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
            <CardDescription>Update your account password</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Updating..." : "Change Password"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserProfile;
