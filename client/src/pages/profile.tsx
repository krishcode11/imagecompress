import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { UserNavbar } from "@/components/user-navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { User, Mail, Calendar, Shield, Save, ArrowLeft, Crown } from "lucide-react";
import { Link } from "wouter";
import AdsterraBanner from "../components/adsterra-banner";
import SocialBarAd from "../components/SocialBarAd";
import PopunderAd from "../components/PopunderAd";

export default function Profile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.displayName?.split(' ')[0] || '',
    lastName: user?.displayName?.split(' ').slice(1).join(' ') || '',
    email: user?.email || '',
  });
  const [subscription, setSubscription] = useState<any>(null);
  const [loadingSub, setLoadingSub] = useState(true);

  useEffect(() => {
    async function fetchSubscription() {
      setLoadingSub(true);
      try {
        if (!formData.email) {
          setSubscription(null);
          setLoadingSub(false);
          return;
        }
        const res = await fetch(`/api/subscription/status?email=${encodeURIComponent(formData.email)}`);
        const data = await res.json();
        setSubscription(data.subscription);
      } catch {
        setSubscription(null);
      } finally {
        setLoadingSub(false);
      }
    }
    fetchSubscription();
  }, [formData.email]);

  const getUserInitials = () => {
    if (!user) return "U";
    if (user.displayName) {
      const names = user.displayName.split(' ');
      if (names.length >= 2) {
        return `${names[0][0]}${names[1][0]}`;
      }
      return names[0][0];
    }
    if (user.email) {
      return user.email[0].toUpperCase();
    }
    return "U";
  };

  const handleSave = async () => {
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include',
      });

      if (response.ok) {
        toast({
          title: "Profile Updated",
          description: "Your profile has been updated successfully.",
        });
        setIsEditing(false);
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update profile. Please try again.",
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
            <h1 className="text-3xl font-bold text-slate-900">Profile Settings</h1>
            <p className="text-slate-600 mt-2">Manage your account information and preferences</p>
          </div>

          <div className="grid gap-8">
            {/* Profile Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Profile Information
                </CardTitle>
                <CardDescription>
                  Update your personal information and account details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar Section */}
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={user?.photoURL || undefined} alt={user?.displayName || 'User'} />
                    <AvatarFallback className="bg-blue-600 text-white text-xl">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-lg">{user?.displayName || 'User'}</h3>
                    <p className="text-slate-600">{user?.email}</p>
                    <Badge variant="secondary" className="mt-1">
                      <Shield className="w-3 h-3 mr-1" />
                      Verified Account
                    </Badge>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid gap-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                        disabled={!isEditing}
                        placeholder="Enter your first name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                        disabled={!isEditing}
                        placeholder="Enter your last name"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      disabled={!isEditing}
                      placeholder="Enter your email address"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  {isEditing ? (
                    <>
                      <Button onClick={handleSave}>
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </Button>
                      <Button variant="outline" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button onClick={() => setIsEditing(true)}>
                      Edit Profile
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Account Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Account Information
                </CardTitle>
                <CardDescription>
                  Your account details and security information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-slate-500" />
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-sm text-slate-600">{user?.email}</p>
                    </div>
                  </div>
                  <Badge variant="secondary">Verified</Badge>
                </div>
                
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-slate-500" />
                    <div>
                      <p className="font-medium">Member Since</p>
                      <p className="text-sm text-slate-600">
                        {user?.metadata?.creationTime 
                          ? new Date(user.metadata.creationTime).toLocaleDateString()
                          : 'Recently'
                        }
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <Shield className="w-4 h-4 text-slate-500" />
                    <div>
                      <p className="font-medium">Authentication</p>
                      <p className="text-sm text-slate-600">Google OAuth</p>
                    </div>
                  </div>
                  <Badge variant="outline">Secure</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Subscription Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="w-5 h-5 text-yellow-500" />
                  Subscription
                </CardTitle>
                <CardDescription>
                  Your current subscription status and plan details
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loadingSub ? (
                  <p className="text-slate-500">Loading subscription...</p>
                ) : subscription && subscription.status === 'ACTIVE' ? (
                  <>
                    <div className="mb-2">Status: <Badge className="bg-green-600 text-white">Active</Badge></div>
                    <div className="mb-2">Plan: <span className="font-semibold">{subscription.planId}</span></div>
                    <div className="mb-2">Expires: <span className="font-semibold">{new Date(subscription.currentPeriodEnd).toLocaleString()}</span></div>
                    <ul className="list-disc ml-6 text-slate-700 mt-2">
                      <li>Access to all premium features</li>
                      <li>Priority support</li>
                    </ul>
                  </>
                ) : subscription && subscription.status === 'EXPIRED' ? (
                  <>
                    <div className="mb-2">Status: <Badge className="bg-gray-400 text-white">Expired</Badge></div>
                    <div className="mb-2">Plan: <span className="font-semibold">{subscription.planId}</span></div>
                    <div className="mb-2">Expired on: <span className="font-semibold">{new Date(subscription.currentPeriodEnd).toLocaleString()}</span></div>
                    <div className="mb-2 text-slate-600">Your subscription has expired. Please renew to regain premium access.</div>
                    <Link href="/subscription">
                      <Button variant="outline">Renew Subscription</Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <div className="mb-2">Status: <Badge className="bg-blue-500 text-white">Free-tier</Badge></div>
                    <div className="mb-2 text-slate-600">You are currently using the free version. Upgrade to unlock premium features!</div>
                    <Link href="/subscription">
                      <Button variant="outline">View Plans</Button>
                    </Link>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </>
  );
} 