import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { UserNavbar } from "@/components/user-navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Settings as SettingsIcon, Bell, Shield, Palette, Download, ArrowLeft, Save } from "lucide-react";
import { Link } from "wouter";
import AdsterraBanner from "../components/adsterra-banner";
import SocialBarAd from "../components/SocialBarAd";
import PopunderAd from "../components/PopunderAd";

export default function Settings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    notifications: true,
    emailUpdates: false,
    darkMode: false,
    autoDownload: true,
    compressionQuality: "80",
    defaultFormat: "jpeg",
    showTutorials: true,
  });

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveSettings = async () => {
    try {
      // In a real app, you'd save these to the backend
      localStorage.setItem('userSettings', JSON.stringify(settings));
      toast({
        title: "Settings Saved",
        description: "Your settings have been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <PopunderAd />
      <SocialBarAd />
      <AdsterraBanner />
      <div className="min-h-screen bg-slate-50">
        <UserNavbar />

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <Link href="/compress">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Compress
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
            <p className="text-slate-600 mt-2">Customize your experience and manage your preferences</p>
          </div>

          <div className="grid gap-8">
            {/* Notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notifications
                </CardTitle>
                <CardDescription>
                  Manage how you receive notifications and updates
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Push Notifications</Label>
                    <p className="text-sm text-slate-600">
                      Receive notifications about compression progress and updates
                    </p>
                  </div>
                  <Switch
                    checked={settings.notifications}
                    onCheckedChange={(checked) => handleSettingChange('notifications', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Email Updates</Label>
                    <p className="text-sm text-slate-600">
                      Receive email notifications about new features and updates
                    </p>
                  </div>
                  <Switch
                    checked={settings.emailUpdates}
                    onCheckedChange={(checked) => handleSettingChange('emailUpdates', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Appearance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Appearance
                </CardTitle>
                <CardDescription>
                  Customize the look and feel of the application
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Dark Mode</Label>
                    <p className="text-sm text-slate-600">
                      Switch between light and dark themes
                    </p>
                  </div>
                  <Switch
                    checked={settings.darkMode}
                    onCheckedChange={(checked) => handleSettingChange('darkMode', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Compression Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <SettingsIcon className="w-5 h-5" />
                  Compression Settings
                </CardTitle>
                <CardDescription>
                  Configure default compression preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Default Quality</Label>
                  <Select
                    value={settings.compressionQuality}
                    onValueChange={(value) => handleSettingChange('compressionQuality', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="60">Low (60%) - Smaller files</SelectItem>
                      <SelectItem value="80">Medium (80%) - Balanced</SelectItem>
                      <SelectItem value="90">High (90%) - Better quality</SelectItem>
                      <SelectItem value="95">Very High (95%) - Best quality</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-slate-600">
                    Default compression quality for new uploads
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Default Format</Label>
                  <Select
                    value={settings.defaultFormat}
                    onValueChange={(value) => handleSettingChange('defaultFormat', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="jpeg">JPEG - Best for photos</SelectItem>
                      <SelectItem value="png">PNG - Best for graphics</SelectItem>
                      <SelectItem value="webp">WebP - Modern format</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-slate-600">
                    Default output format for compressed images
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Auto Download</Label>
                    <p className="text-sm text-slate-600">
                      Automatically download files after compression
                    </p>
                  </div>
                  <Switch
                    checked={settings.autoDownload}
                    onCheckedChange={(checked) => handleSettingChange('autoDownload', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Help & Tutorials */}
            <Card>
              <CardHeader>
                <CardTitle>Help & Tutorials</CardTitle>
                <CardDescription>
                  Manage help content and tutorial preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Show Tutorials</Label>
                    <p className="text-sm text-slate-600">
                      Display helpful tips and tutorials
                    </p>
                  </div>
                  <Switch
                    checked={settings.showTutorials}
                    onCheckedChange={(checked) => handleSettingChange('showTutorials', checked)}
                  />
                </div>

                <div className="flex gap-2">
                  <Link href="/help">
                    <Button variant="outline">
                      Help Center
                    </Button>
                  </Link>
                  <Link href="/tutorials">
                    <Button variant="outline">
                      View Tutorials
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Security */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Security
                </CardTitle>
                <CardDescription>
                  Manage your account security settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <Shield className="w-4 h-4 text-slate-500" />
                    <div>
                      <p className="font-medium">Two-Factor Authentication</p>
                      <p className="text-sm text-slate-600">Add an extra layer of security</p>
                    </div>
                  </div>
                  <Badge variant="outline">Available</Badge>
                </div>

                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <Shield className="w-4 h-4 text-slate-500" />
                    <div>
                      <p className="font-medium">Login History</p>
                      <p className="text-sm text-slate-600">View recent login activity</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end">
              <Button onClick={handleSaveSettings} className="px-8">
                <Save className="w-4 h-4 mr-2" />
                Save Settings
              </Button>
            </div>
          </div>
        </main>
      </div>
    </>
  );
} 