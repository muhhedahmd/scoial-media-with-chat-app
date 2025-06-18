"use client"

import { Badge } from "@/components/ui/badge"

import { useState } from "react"
import { User, Lock, Bell, Eye, Globe, Moon, Sun, LogOut, UserX, Smartphone, Mail, Key } from "lucide-react"
import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "@/components/ui/use-toast"

// Mock user data
const mockUser = {
  id: "user123",
  name: "Alex Johnson",
  username: "alexj",
  email: "alex.johnson@example.com",
  avatar: "/placeholder.svg?height=100&width=100",
  phone: "+1 (555) 123-4567",
  bio: "Digital creator and photography enthusiast. Love exploring new places and trying new foods.",
  location: "San Francisco, CA",
  website: "https://alexjohnson.example.com",
  joinDate: "January 2022",
  language: "en",
  theme: "system",
  timezone: "America/Los_Angeles",
}

// Mock settings
const mockSettings = {
  account: {
    twoFactorEnabled: false,
    emailVerified: true,
    loginAlerts: true,
    recoveryEmail: "recovery@example.com",
  },
  privacy: {
    profileVisibility: "public",
    activityStatus: true,
    readReceipts: true,
    whoCanSeeMyPosts: "everyone",
    whoCanTagMe: "followers",
    whoCanMessageMe: "everyone",
    blockList: [
      { id: "u1", name: "Blocked User 1", username: "blocked1", avatar: "/placeholder.svg?height=40&width=40" },
      { id: "u2", name: "Blocked User 2", username: "blocked2", avatar: "/placeholder.svg?height=40&width=40" },
    ],
  },
  notifications: {
    pushEnabled: true,
    emailEnabled: true,
    likes: true,
    comments: true,
    follows: true,
    mentions: true,
    directMessages: true,
    newFollowerPosts: true,
    productUpdates: false,
    marketingEmails: false,
    doNotDisturbFrom: "22:00",
    doNotDisturbTo: "07:00",
  },
  appearance: {
    theme: "system",
    fontSize: "medium",
    reducedMotion: false,
    highContrast: false,
  },
  language: {
    appLanguage: "en",
    contentLanguages: ["en", "es", "fr"],
    translationEnabled: true,
  },
}

export default function SettingsPage() {
  const [user, setUser] = useState(mockUser)
  const [settings, setSettings] = useState(mockSettings)
  const [isLoading, setIsLoading] = useState(false)

  const handleSave = (section) => {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Settings saved",
        description: `Your ${section} settings have been updated successfully.`,
      })
    }, 1000)
  }

  const updateSetting = (category, setting, value) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value,
      },
    }))
  }

  const updateUser = (field, value) => {
    setUser((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const removeBlockedUser = (userId) => {
    setSettings((prev) => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        blockList: prev.privacy.blockList.filter((user) => user.id !== userId),
      },
    }))

    toast({
      title: "User unblocked",
      description: "The user has been removed from your block list.",
    })
  }

  return (
    <div className="container max-w-5xl py-6">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      <Tabs defaultValue="account" className="space-y-6">
        <TabsList className="grid grid-cols-2 md:grid-cols-6 gap-2">
          <TabsTrigger value="account" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="hidden md:inline">Account</span>
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            <span className="hidden md:inline">Privacy</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden md:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            <span className="hidden md:inline">Security</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Moon className="h-4 w-4" />
            <span className="hidden md:inline">Appearance</span>
          </TabsTrigger>
          <TabsTrigger value="language" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            <span className="hidden md:inline">Language</span>
          </TabsTrigger>
        </TabsList>

        {/* Account Settings */}
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>Manage your account details and personal information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex flex-col items-center space-y-2">
                  <Avatar className="h-24 w-24">
                    <img src={user.avatar || "/placeholder.svg"} alt={user.name} />
                  </Avatar>
                  <Button variant="outline" size="sm">
                    Change Avatar
                  </Button>
                </div>

                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" value={user.name} onChange={(e) => updateUser("name", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        value={user.username}
                        onChange={(e) => updateUser("username", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={user.bio}
                      onChange={(e) => updateUser("bio", e.target.value)}
                      className="resize-none"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={user.email}
                        onChange={(e) => updateUser("email", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" value={user.phone} onChange={(e) => updateUser("phone", e.target.value)} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={user.location}
                        onChange={(e) => updateUser("location", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        value={user.website}
                        onChange={(e) => updateUser("website", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Connected Accounts</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline" className="justify-start">
                    <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                    Connect GitHub
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <svg className="h-4 w-4 mr-2" fill="#1DA1F2" viewBox="0 0 24 24">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                    </svg>
                    Connect Twitter
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleSave("account")} disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Privacy Settings */}
        <TabsContent value="privacy">
          <Card>
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
              <CardDescription>Control who can see your content and how your information is used</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Profile Privacy</h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Profile Visibility</Label>
                      <p className="text-sm text-muted-foreground">Choose who can see your profile</p>
                    </div>
                    <Select
                      value={settings.privacy.profileVisibility}
                      onValueChange={(value) => updateSetting("privacy", "profileVisibility", value)}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select visibility" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">Public</SelectItem>
                        <SelectItem value="followers">Followers Only</SelectItem>
                        <SelectItem value="private">Private</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Activity Status</Label>
                      <p className="text-sm text-muted-foreground">Show when you're active on the platform</p>
                    </div>
                    <Switch
                      checked={settings.privacy.activityStatus}
                      onCheckedChange={(checked) => updateSetting("privacy", "activityStatus", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Read Receipts</Label>
                      <p className="text-sm text-muted-foreground">Let others know when you've read their messages</p>
                    </div>
                    <Switch
                      checked={settings.privacy.readReceipts}
                      onCheckedChange={(checked) => updateSetting("privacy", "readReceipts", checked)}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Content Privacy</h3>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Who can see my posts</Label>
                    <RadioGroup
                      value={settings.privacy.whoCanSeeMyPosts}
                      onValueChange={(value) => updateSetting("privacy", "whoCanSeeMyPosts", value)}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="everyone" id="everyone-posts" />
                        <Label htmlFor="everyone-posts">Everyone</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="followers" id="followers-posts" />
                        <Label htmlFor="followers-posts">Followers only</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="close-friends" id="close-friends-posts" />
                        <Label htmlFor="close-friends-posts">Close friends only</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label>Who can tag me</Label>
                    <RadioGroup
                      value={settings.privacy.whoCanTagMe}
                      onValueChange={(value) => updateSetting("privacy", "whoCanTagMe", value)}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="everyone" id="everyone-tags" />
                        <Label htmlFor="everyone-tags">Everyone</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="followers" id="followers-tags" />
                        <Label htmlFor="followers-tags">Followers only</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="nobody" id="nobody-tags" />
                        <Label htmlFor="nobody-tags">Nobody</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label>Who can message me</Label>
                    <RadioGroup
                      value={settings.privacy.whoCanMessageMe}
                      onValueChange={(value) => updateSetting("privacy", "whoCanMessageMe", value)}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="everyone" id="everyone-messages" />
                        <Label htmlFor="everyone-messages">Everyone</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="followers" id="followers-messages" />
                        <Label htmlFor="followers-messages">Followers only</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="nobody" id="nobody-messages" />
                        <Label htmlFor="nobody-messages">Nobody</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Blocked Accounts</h3>
                <p className="text-sm text-muted-foreground">
                  Manage the accounts you've blocked from interacting with you
                </p>

                {settings.privacy.blockList.length > 0 ? (
                  <div className="space-y-2">
                    {settings.privacy.blockList.map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-2 border rounded-md">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <img src={user.avatar || "/placeholder.svg"} alt={user.name} />
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{user.name}</p>
                            <p className="text-xs text-muted-foreground">@{user.username}</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => removeBlockedUser(user.id)}>
                          <UserX className="h-4 w-4 mr-2" />
                          Unblock
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm italic">You haven't blocked any accounts yet.</p>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleSave("privacy")} disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Manage how and when you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Notification Channels</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-4 border rounded-md">
                    <div className="flex items-center gap-3">
                      <Smartphone className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Push Notifications</p>
                        <p className="text-sm text-muted-foreground">Receive notifications on your device</p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.notifications.pushEnabled}
                      onCheckedChange={(checked) => updateSetting("notifications", "pushEnabled", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-md">
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Email Notifications</p>
                        <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.notifications.emailEnabled}
                      onCheckedChange={(checked) => updateSetting("notifications", "emailEnabled", checked)}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Notification Types</h3>
                <p className="text-sm text-muted-foreground">Choose which activities you want to be notified about</p>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="notify-likes">Likes</Label>
                    <Switch
                      id="notify-likes"
                      checked={settings.notifications.likes}
                      onCheckedChange={(checked) => updateSetting("notifications", "likes", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="notify-comments">Comments</Label>
                    <Switch
                      id="notify-comments"
                      checked={settings.notifications.comments}
                      onCheckedChange={(checked) => updateSetting("notifications", "comments", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="notify-follows">New Followers</Label>
                    <Switch
                      id="notify-follows"
                      checked={settings.notifications.follows}
                      onCheckedChange={(checked) => updateSetting("notifications", "follows", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="notify-mentions">Mentions</Label>
                    <Switch
                      id="notify-mentions"
                      checked={settings.notifications.mentions}
                      onCheckedChange={(checked) => updateSetting("notifications", "mentions", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="notify-dms">Direct Messages</Label>
                    <Switch
                      id="notify-dms"
                      checked={settings.notifications.directMessages}
                      onCheckedChange={(checked) => updateSetting("notifications", "directMessages", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="notify-follower-posts">New Posts from Followers</Label>
                    <Switch
                      id="notify-follower-posts"
                      checked={settings.notifications.newFollowerPosts}
                      onCheckedChange={(checked) => updateSetting("notifications", "newFollowerPosts", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="notify-updates">Product Updates</Label>
                    <Switch
                      id="notify-updates"
                      checked={settings.notifications.productUpdates}
                      onCheckedChange={(checked) => updateSetting("notifications", "productUpdates", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="notify-marketing">Marketing Emails</Label>
                    <Switch
                      id="notify-marketing"
                      checked={settings.notifications.marketingEmails}
                      onCheckedChange={(checked) => updateSetting("notifications", "marketingEmails", checked)}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Do Not Disturb</h3>
                <p className="text-sm text-muted-foreground">Set times when you don't want to receive notifications</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dnd-from">From</Label>
                    <Input
                      id="dnd-from"
                      type="time"
                      value={settings.notifications.doNotDisturbFrom}
                      onChange={(e) => updateSetting("notifications", "doNotDisturbFrom", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dnd-to">To</Label>
                    <Input
                      id="dnd-to"
                      type="time"
                      value={settings.notifications.doNotDisturbTo}
                      onChange={(e) => updateSetting("notifications", "doNotDisturbTo", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleSave("notifications")} disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage your account security and login options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Password</h3>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input id="confirm-password" type="password" />
                  </div>

                  <Button variant="secondary">Change Password</Button>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
                    <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                  </div>
                  <Switch
                    checked={settings.account.twoFactorEnabled}
                    onCheckedChange={(checked) => updateSetting("account", "twoFactorEnabled", checked)}
                  />
                </div>

                {settings.account.twoFactorEnabled && (
                  <div className="p-4 border rounded-md bg-muted/30 space-y-4">
                    <p className="text-sm">
                      Two-factor authentication is enabled. You'll be asked for a verification code when logging in from
                      a new device.
                    </p>
                    <Button variant="outline" size="sm">
                      <Key className="h-4 w-4 mr-2" />
                      Manage 2FA Settings
                    </Button>
                  </div>
                )}
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Login Alerts</h3>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Get notified when someone logs into your account from a new device or location
                  </p>
                  <Switch
                    checked={settings.account.loginAlerts}
                    onCheckedChange={(checked) => updateSetting("account", "loginAlerts", checked)}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Recovery Options</h3>

                <div className="space-y-2">
                  <Label htmlFor="recovery-email">Recovery Email</Label>
                  <Input
                    id="recovery-email"
                    type="email"
                    value={settings.account.recoveryEmail}
                    onChange={(e) => updateSetting("account", "recoveryEmail", e.target.value)}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Active Sessions</h3>
                <p className="text-sm text-muted-foreground">Devices that are currently logged into your account</p>

                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 border rounded-md">
                    <div className="flex items-center gap-3">
                      <Smartphone className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">iPhone 13 Pro</p>
                        <p className="text-xs text-muted-foreground">San Francisco, CA • Last active: 2 minutes ago</p>
                      </div>
                    </div>
                    <Badge>Current Device</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-md">
                    <div className="flex items-center gap-3">
                      <Globe className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Chrome on Windows</p>
                        <p className="text-xs text-muted-foreground">New York, NY • Last active: 2 days ago</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      Log Out
                    </Button>
                  </div>
                </div>

                <Button variant="outline">
                  <LogOut className="h-4 w-4 mr-2" />
                  Log Out of All Devices
                </Button>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleSave("security")} disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Appearance Settings */}
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
              <CardDescription>Customize how the app looks and feels</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Theme</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div
                    className={`border rounded-md p-4 cursor-pointer ${settings.appearance.theme === "light" ? "border-primary ring-2 ring-primary/20" : ""}`}
                    onClick={() => updateSetting("appearance", "theme", "light")}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <Sun className="h-5 w-5" />
                      <div
                        className={`h-4 w-4 rounded-full ${settings.appearance.theme === "light" ? "bg-primary" : "border"}`}
                      />
                    </div>
                    <p className="font-medium">Light</p>
                    <p className="text-sm text-muted-foreground">Light background with dark text</p>
                  </div>

                  <div
                    className={`border rounded-md p-4 cursor-pointer ${settings.appearance.theme === "dark" ? "border-primary ring-2 ring-primary/20" : ""}`}
                    onClick={() => updateSetting("appearance", "theme", "dark")}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <Moon className="h-5 w-5" />
                      <div
                        className={`h-4 w-4 rounded-full ${settings.appearance.theme === "dark" ? "bg-primary" : "border"}`}
                      />
                    </div>
                    <p className="font-medium">Dark</p>
                    <p className="text-sm text-muted-foreground">Dark background with light text</p>
                  </div>

                  <div
                    className={`border rounded-md p-4 cursor-pointer ${settings.appearance.theme === "system" ? "border-primary ring-2 ring-primary/20" : ""}`}
                    onClick={() => updateSetting("appearance", "theme", "system")}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex">
                        <Sun className="h-5 w-5" />
                        <Moon className="h-5 w-5 ml-1" />
                      </div>
                      <div
                        className={`h-4 w-4 rounded-full ${settings.appearance.theme === "system" ? "bg-primary" : "border"}`}
                      />
                    </div>
                    <p className="font-medium">System</p>
                    <p className="text-sm text-muted-foreground">Follows your system preferences</p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Text Size</h3>

                <div className="space-y-2">
                  <Label>Font Size</Label>
                  <Select
                    value={settings.appearance.fontSize}
                    onValueChange={(value) => updateSetting("appearance", "fontSize", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select font size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="large">Large</SelectItem>
                      <SelectItem value="x-large">Extra Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Accessibility</h3>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="reduced-motion">Reduced Motion</Label>
                      <p className="text-sm text-muted-foreground">Minimize animations throughout the app</p>
                    </div>
                    <Switch
                      id="reduced-motion"
                      checked={settings.appearance.reducedMotion}
                      onCheckedChange={(checked) => updateSetting("appearance", "reducedMotion", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="high-contrast">High Contrast</Label>
                      <p className="text-sm text-muted-foreground">Increase contrast for better visibility</p>
                    </div>
                    <Switch
                      id="high-contrast"
                      checked={settings.appearance.highContrast}
                      onCheckedChange={(checked) => updateSetting("appearance", "highContrast", checked)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleSave("appearance")} disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Language Settings */}
        <TabsContent value="language">
          <Card>
            <CardHeader>
              <CardTitle>Language & Region</CardTitle>
              <CardDescription>Manage language preferences and regional settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">App Language</h3>

                <div className="space-y-2">
                  <Label htmlFor="app-language">Display Language</Label>
                  <Select
                    value={settings.language.appLanguage}
                    onValueChange={(value) => updateSetting("language", "appLanguage", value)}
                  >
                    <SelectTrigger id="app-language">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="de">Deutsch</SelectItem>
                      <SelectItem value="pt">Português</SelectItem>
                      <SelectItem value="ja">日本語</SelectItem>
                      <SelectItem value="zh">中文</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h3 className="text-lg font-medium">Translation</h3>
                    <p className="text-sm text-muted-foreground">
                      Automatically translate content not in your preferred languages
                    </p>
                  </div>
                  <Switch
                    checked={settings.language.translationEnabled}
                    onCheckedChange={(checked) => updateSetting("language", "translationEnabled", checked)}
                  />
                </div>

                {settings.language.translationEnabled && (
                  <div className="space-y-2 mt-4">
                    <Label>Content Languages</Label>
                    <p className="text-sm text-muted-foreground mb-2">
                      Select languages you understand. Content in these languages won't be translated.
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {settings.language.contentLanguages.map((lang) => (
                        <Badge key={lang} variant="secondary" className="px-3 py-1">
                          {lang === "en" ? "English" : lang === "es" ? "Español" : "Français"}
                          <button
                            className="ml-2 text-muted-foreground hover:text-foreground"
                            onClick={() => {
                              updateSetting(
                                "language",
                                "contentLanguages",
                                settings.language.contentLanguages.filter((l) => l !== lang),
                              )
                            }}
                          >
                            ×
                          </button>
                        </Badge>
                      ))}
                      <Button variant="outline" size="sm" className="h-8">
                        Add Language
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Regional Settings</h3>

                <div className="space-y-2">
                  <Label htmlFor="timezone">Time Zone</Label>
                  <Select defaultValue={user.timezone}>
                    <SelectTrigger id="timezone">
                      <SelectValue placeholder="Select time zone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/Los_Angeles">Pacific Time (US & Canada)</SelectItem>
                      <SelectItem value="America/Denver">Mountain Time (US & Canada)</SelectItem>
                      <SelectItem value="America/Chicago">Central Time (US & Canada)</SelectItem>
                      <SelectItem value="America/New_York">Eastern Time (US & Canada)</SelectItem>
                      <SelectItem value="Europe/London">London</SelectItem>
                      <SelectItem value="Europe/Paris">Paris</SelectItem>
                      <SelectItem value="Asia/Tokyo">Tokyo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date-format">Date Format</Label>
                  <Select defaultValue="MM/DD/YYYY">
                    <SelectTrigger id="date-format">
                      <SelectValue placeholder="Select date format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time-format">Time Format</Label>
                  <Select defaultValue="12h">
                    <SelectTrigger id="time-format">
                      <SelectValue placeholder="Select time format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="12h">12-hour (AM/PM)</SelectItem>
                      <SelectItem value="24h">24-hour</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleSave("language")} disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
