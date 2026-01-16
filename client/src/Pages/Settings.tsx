import { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { updateProfile, updatePassword } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Settings() {
  const { user, setUser } = useAuthStore();
  const [loading, setLoading] = useState(false);

  // Function to update Bio/Username
  const onUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = {
      username: formData.get("username"),
      bio: formData.get("bio"),
    };

    try {
      const res = await updateProfile(data);
      setUser(res.data); // Update the global "Zustand" store so the Navbar changes too!
      alert("Profile updated successfully!");
    } catch (err) {
      alert("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  // Function to update Password
  const onUpdatePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const oldPassword = formData.get("oldPassword");
    const newPassword = formData.get("newPassword");

    try {
      await updatePassword({ oldPassword, newPassword });
      alert("Password updated!");
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      alert("Incorrect current password.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-black italic mb-6 text-pink-hot">SETTINGS</h1>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8 bg-white/5">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        {/* --- PROFILE TAB --- */}
        <TabsContent value="profile">
          <Card className="bg-ocean-deep border-white/10">
            <CardHeader><CardTitle>Public Vibe</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={onUpdateProfile} className="space-y-4">
                <div>
                  <label className="text-sm text-white/50">Username</label>
                  <Input name="username" defaultValue={user?.username} className="bg-white/5" />
                </div>
                <div>
                  <label className="text-sm text-white/50">Bio</label>
                  <textarea 
                    name="bio" 
                    defaultValue={user?.bio}
                    className="w-full bg-white/5 border border-white/10 rounded-md p-3 h-24 text-sm outline-none focus:ring-1 focus:ring-pink-hot"
                  />
                </div>
                <Button type="submit" disabled={loading} className="w-full bg-pink-hot hover:bg-pink-hot/90 text-white font-bold">
                  {loading ? "Saving..." : "Update Profile"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* --- SECURITY TAB --- */}
        <TabsContent value="security">
          <Card className="bg-ocean-deep border-white/10">
            <CardHeader><CardTitle>Password & Safety</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={onUpdatePassword} className="space-y-4">
                <Input name="oldPassword" type="password" placeholder="Current Password" className="bg-white/5" />
                <Input name="newPassword" type="password" placeholder="New Password" className="bg-white/5" />
                <Button type="submit" className="w-full bg-white text-black font-bold">
                  Change Password
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}