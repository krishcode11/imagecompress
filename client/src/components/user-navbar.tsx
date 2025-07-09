import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { FileImage, LogOut, User, Settings, HelpCircle, Crown, Star } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useSubscriptionQuery } from "@/hooks/useSubscriptionQuery";
import { Link, useLocation } from "wouter";
import { User as FirebaseUser } from "firebase/auth";

export function UserNavbar() {
  const { user, isAuthenticated, signIn, signOut } = useAuth() as {
    user: FirebaseUser | null;
    isAuthenticated: boolean;
    signIn: () => Promise<void>;
    signOut: () => Promise<void>;
  };
  
  const { data: subscriptionStatus } = useSubscriptionQuery();
  const [, setLocation] = useLocation();

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

  const getUserDisplayName = () => {
    if (!user) return "User";
    if (user.displayName) {
      return user.displayName;
    }
    if (user.email) {
      return user.email;
    }
    return "User";
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setLocation("/"); // Redirect to landing page on sign out
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  if (!isAuthenticated) {
    return (
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/compress" className="flex items-center focus:outline-none" aria-label="Go to compress page">
              <FileImage className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">CompressHub</span>
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link href="/help">
                <Button variant="ghost" size="sm">
                  <HelpCircle className="h-4 w-4 mr-2" />
                  Help
                </Button>
              </Link>
              
              <Button onClick={signIn} variant="default">
                <User className="h-4 w-4 mr-2" />
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/compress" className="flex items-center focus:outline-none" aria-label="Go to compress page">
            <FileImage className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">CompressHub</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Subscription Status */}
            {subscriptionStatus?.subscription?.status === 'ACTIVE' ? (
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <Crown className="h-3 w-3 mr-1" />
                Premium
              </Badge>
            ) : (
              <Link href="/subscription">
                <Button variant="outline" size="sm" className="border-primary text-primary hover:bg-primary hover:text-white">
                  <Star className="h-4 w-4 mr-2" />
                  Upgrade
                </Button>
              </Link>
            )}
            
            <Link href="/help">
              <Button variant="ghost" size="sm">
                <HelpCircle className="h-4 w-4 mr-2" />
                Help
              </Button>
            </Link>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user?.photoURL || undefined} alt={getUserDisplayName()} />
                    <AvatarFallback className="bg-blue-600 text-white">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{getUserDisplayName()}</p>
                    {user?.email && (
                      <p className="w-[200px] truncate text-sm text-muted-foreground">
                        {user.email}
                      </p>
                    )}
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/subscription" className="flex items-center">
                    <Crown className="mr-2 h-4 w-4" />
                    <span>Subscription</span>
                    {subscriptionStatus?.subscription?.status === 'ACTIVE' && (
                      <Badge variant="outline" className="ml-auto text-xs">Premium</Badge>
                    )}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="flex items-center">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={handleSignOut}
                  className="text-red-600 focus:text-red-600"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}