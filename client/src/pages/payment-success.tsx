import { useEffect, useState } from "react";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Sparkles, Star, Zap } from "lucide-react";
import { subscriptionPlans } from "../../../shared/plans";
import { useAuth } from "@/hooks/useAuth";

const ACCESS_DURATION_MINUTES = 15;

function getPlanById(planId: string) {
  return subscriptionPlans.find((p) => p.id === planId);
}

function getRemainingSeconds(startTime: number) {
  const now = Date.now();
  const elapsed = Math.floor((now - startTime) / 1000);
  return Math.max(0, ACCESS_DURATION_MINUTES * 60 - elapsed);
}

export default function PaymentSuccess() {
  const [, setLocation] = useLocation();
  const [showConfetti, setShowConfetti] = useState(true);
  const [remaining, setRemaining] = useState(0);
  const [plan, setPlan] = useState<any>(null);
  const { user } = useAuth();

  // On mount: store plan info and start time in localStorage
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const planId = urlParams.get("plan");
    if (!planId) {
      setLocation("/subscription");
      return;
    }
    const planObj = getPlanById(planId);
    if (!planObj) {
      setLocation("/subscription");
      return;
    }
    setPlan(planObj);
    // Store in localStorage
    const now = Date.now();
    localStorage.setItem("activePlan", JSON.stringify({ planId, startTime: now }));
    setRemaining(ACCESS_DURATION_MINUTES * 60);
    // Record in backend
    if (user) {
      user.getIdToken().then((token: string) => {
        fetch("/api/subscription/record", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({
            planId,
            startTime: now,
            endTime: now + ACCESS_DURATION_MINUTES * 60 * 1000,
          }),
        });
      });
    }
  }, [setLocation, user]);

  // Timer logic
  useEffect(() => {
    const interval = setInterval(() => {
      const data = localStorage.getItem("activePlan");
      if (!data) {
        setRemaining(0);
        return;
      }
      const { startTime } = JSON.parse(data);
      const rem = getRemainingSeconds(startTime);
      setRemaining(rem);
      if (rem <= 0) {
        localStorage.removeItem("activePlan");
        clearInterval(interval);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Auto-hide confetti after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (!plan) {
    return null;
  }

  // Format timer
  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  const timerDisplay = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-100 relative overflow-hidden">
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-10">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1 + Math.random() * 2}s`,
              }}
            >
              {['🎉', '✨', '🥳', '🎊', '💫', '⭐'][Math.floor(Math.random() * 6)]}
            </div>
          ))}
        </div>
      )}

      <div className="relative z-20 flex items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-2xl shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto mb-6 w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-4xl font-bold text-gray-900 mb-3">
              Payment Successful! 🎉
            </CardTitle>
            <CardDescription className="text-xl text-gray-600">
              Your {plan.name} plan is now active.<br />
              <span className="font-semibold text-green-700">Access expires in:</span>
              <span className="ml-2 text-2xl font-mono text-green-800">{timerDisplay}</span>
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-8">
            {/* Success Message */}
            <div className="text-center">
              <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 px-4 py-2 text-sm mb-4">
                <Zap className="w-4 h-4 mr-2" />
                {plan.name} Active
              </Badge>
              <p className="text-gray-700 text-lg leading-relaxed max-w-2xl mx-auto">
                You now have access to all premium features for 15 minutes. Enjoy!
              </p>
            </div>

            {/* Plan Details */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                <h3 className="font-semibold text-blue-900 flex items-center gap-2 mb-4">
                  <Star className="w-5 h-5 text-yellow-500" />
                Plan Details
                </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="bg-white/50 rounded-lg p-3">
                    <p className="text-blue-600 font-medium">Plan</p>
                    <p className="font-semibold text-blue-900 capitalize">
                    {plan.name}
                    </p>
                  </div>
                  <div className="bg-white/50 rounded-lg p-3">
                  <p className="text-blue-600 font-medium">Expires In</p>
                  <p className="font-semibold text-green-600">{timerDisplay}</p>
                </div>
              </div>
            </div>

            {/* What's Next */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
              <h3 className="font-semibold text-purple-900 mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-500" />
                What's Next?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  {plan.features.slice(0, 3).map((feature: string, i: number) => (
                    <div key={i} className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                      <span className="text-purple-800">{feature}</span>
                    </div>
                  ))}
                </div>
                <div className="space-y-3">
                  {plan.features.slice(3).map((feature: string, i: number) => (
                    <div key={i} className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                      <span className="text-purple-800">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-4 mt-8">
              <Button onClick={() => setLocation("/compress")}>Start Compressing</Button>
              <Button variant="outline" onClick={() => setLocation("/subscription")}>View Plans</Button>
              <Link href="/compress">
                <Button variant="outline">Back to Compress</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 