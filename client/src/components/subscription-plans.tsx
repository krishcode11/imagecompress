import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Zap, Crown, Sparkles, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { subscriptionPlans } from "../../../shared/plans";
import { useAuth } from "@/hooks/useAuth";

interface SubscriptionPlansProps {
  billingCycle?: 'monthly' | 'yearly';
}

export function SubscriptionPlans({ billingCycle = 'monthly' }: SubscriptionPlansProps) {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const { user, isAuthenticated, isLoading, signIn } = useAuth();

  // Filter plans based on billing cycle
  const filteredPlans = subscriptionPlans.filter(plan => {
    if (billingCycle === 'monthly') {
      return plan.intervalType === 'MONTH' && plan.price > 0;
    } else {
      return plan.intervalType === 'YEAR' && plan.price > 0;
    }
  });

  // Sort plans by price ascending
  const paidPlans = filteredPlans.sort((a, b) => a.price - b.price);
  const mostPopularPlanId = paidPlans.length >= 3 ? paidPlans[1]?.id : paidPlans[0]?.id;

  const formatPrice = (price: number, currency: string) => {
    if (currency === "USD") return `$${(price / 100).toFixed(2)}`;
    if (currency === "INR") return `₹${(price / 100).toFixed(0)}`;
    return `${currency} ${(price / 100).toFixed(2)}`;
  };

  const getIntervalLabel = (plan: typeof subscriptionPlans[0]) => {
    if (plan.intervalType === "YEAR") return "/year";
    return "/month";
  };

  const getPlanIcon = (planId: string) => {
    if (planId.includes("basic")) return <Zap className="w-5 h-5" />;
    if (planId.includes("pro")) return <Crown className="w-5 h-5" />;
    return <Sparkles className="w-5 h-5" />;
  };

  const BMC_MEMBERSHIP_URL = "https://buymeacoffee.com/omniradhanexus/membership";

  // Map planId to duration (ms)
  const PLAN_DURATIONS: Record<string, number> = {
    basic: 15 * 60 * 1000, // 15 minutes
    pro: 30 * 24 * 60 * 60 * 1000, // 30 days
    business: 365 * 24 * 60 * 60 * 1000, // 1 year
  };

  const handleGetStarted = (plan: typeof subscriptionPlans[0]) => {
    // Open BMC in popup with plan param
    const planParam = plan.id.toLowerCase();
    const url = `${BMC_MEMBERSHIP_URL}?plan=${planParam}`;
    const popup = window.open(url, "bmcPopup", "width=500,height=700");
    if (!popup) {
      // Popup blocked, fallback to new tab
      window.open(url, "_blank");
      return;
    }
    // Poll for popup close
    const poll = setInterval(() => {
      if (popup.closed) {
        clearInterval(poll);
        // On close, redirect to /verify and store plan in localStorage
        localStorage.setItem("pendingPlan", planParam);
        window.location.href = "/verify";
      }
    }, 500);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {paidPlans.map((plan) => (
        <Card
              key={plan.id}
              className={cn(
            "relative flex flex-col border-2 border-transparent hover:border-blue-600 transition-all duration-200 shadow-lg",
            plan.id === mostPopularPlanId && "border-blue-600 bg-blue-50/40"
                )}
              >
          <CardHeader className="flex flex-row items-center gap-3 pb-2">
            <div className="flex items-center gap-2">
                        {getPlanIcon(plan.id)}
              <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
                      </div>
            {plan.id === mostPopularPlanId && (
              <Badge className="ml-auto bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 px-3 py-1 text-xs">
                Most Popular
                          </Badge>
                        )}
          </CardHeader>
          <CardContent className="flex-1 flex flex-col gap-4">
            <CardDescription className="mb-2 text-slate-700">
                    {plan.description}
                  </CardDescription>
            <div className="flex items-end gap-2 mb-2">
              <span className="text-3xl font-bold text-slate-900">
                        {formatPrice(plan.price, plan.currency)}
              </span>
              <span className="text-base text-slate-500 font-medium">
                {getIntervalLabel(plan)}
              </span>
                      </div>
            <ul className="mb-4 space-y-2">
                      {plan.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-2 text-slate-700 text-sm">
                  <Check className="w-4 h-4 text-green-500" />
                  {feature}
                        </li>
                      ))}
                    </ul>
                </CardContent>
          <CardFooter>
            {isLoading ? (
              <Button className="w-full" disabled>Loading...</Button>
            ) : isAuthenticated ? (
                  <Button
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-lg py-2 rounded-xl shadow-md hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                onClick={() => handleGetStarted(plan)}
              >
                Get Started <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            ) : (
              <Button
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-lg py-2 rounded-xl shadow-md hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                onClick={signIn}
              >
                Sign in to Subscribe
              </Button>
            )}
                </CardFooter>
              </Card>
      ))}
    </div>
  );
}

// Animated gradient keyframes
// Add this to your global CSS (e.g., index.css or tailwind.css):
// @keyframes gradient-x {
//   0%, 100% { background-position: 0% 50%; }
//   50% { background-position: 100% 50%; }
// }
// .animate-gradient-x {
//   background-size: 200% 200%;
//   animation: gradient-x 4s ease-in-out infinite;
// }