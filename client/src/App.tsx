import { useEffect } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Compress from "@/pages/compress";
import Landing from "@/pages/landing";
import Privacy from "@/pages/privacy";
import Terms from "@/pages/terms";
import Help from "@/pages/help";
import Subscription from "@/pages/subscription";
import Pricing from "@/pages/pricing";
import Contact from "@/pages/contact";
import Tutorials from "@/pages/tutorials";
import Cookies from "@/pages/cookies";
import PaymentSuccess from "@/pages/payment-success";
import PaymentFailed from "@/pages/payment-failed";
import NotFound from "@/pages/not-found";
import Profile from "@/pages/profile";
import Settings from "@/pages/settings";
import Verify from "@/pages/verify";

const Router = () => {
  const [location, setLocation] = useLocation();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    document.body.className = location === '/' ? 'home-page' : '';
  }, [location]);

  // Redirect to /compress after login if at root
  useEffect(() => {
    if (user && location === '/') {
      setLocation('/compress');
    }
  }, [user, location, setLocation]);

  if (isLoading) {
    return <div>Loading...</div>; // Or a spinner
  }

  return (
    <Switch>
      {/* Public Routes */}
      <Route path="/" component={Landing} />
      <Route path="/pricing" component={Pricing} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/terms" component={Terms} />
      <Route path="/help" component={Help} />
      <Route path="/contact" component={Contact} />
      <Route path="/tutorials" component={Tutorials} />
      <Route path="/cookies" component={Cookies} />

      {/* Authenticated Routes */}
      <Route path="/compress">
        <ProtectedRoute>
          <Compress />
        </ProtectedRoute>
      </Route>
      <Route path="/subscription">
        <ProtectedRoute>
          <Subscription />
        </ProtectedRoute>
      </Route>
      <Route path="/profile">
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      </Route>
      <Route path="/settings">
        <ProtectedRoute>
          <Settings />
        </ProtectedRoute>
      </Route>
      <Route path="/payment/success">
        <ProtectedRoute>
          <PaymentSuccess />
        </ProtectedRoute>
      </Route>
      <Route path="/payment/failed">
        <ProtectedRoute>
          <PaymentFailed />
        </ProtectedRoute>
      </Route>
      <Route path="/verify">
        <ProtectedRoute>
          <Verify />
        </ProtectedRoute>
      </Route>
      {/* Fallback for not found */}
      <Route component={NotFound} />
    </Switch>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
