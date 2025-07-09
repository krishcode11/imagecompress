import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { XCircle, ArrowLeft, RefreshCw, HelpCircle, AlertTriangle, Shield, CreditCard, Globe } from "lucide-react";

export default function PaymentFailed() {
  const { isAuthenticated, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  // Redirect to landing if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setLocation("/");
    }
  }, [isLoading, isAuthenticated, setLocation]);

  // Show loading while checking authentication
  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-red-700 text-lg">Verifying your session...</p>
        </div>
      </div>
    );
  }

  const handleTryAgain = () => {
    setLocation("/subscription");
  };

  const handleGoHome = () => {
    setLocation("/compress");
  };

  const handleContactSupport = () => {
    setLocation("/contact");
  };

  const handleViewHelp = () => {
    setLocation("/help");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-100 relative overflow-hidden">
      <div className="relative z-20 flex items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-4xl shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto mb-6 w-20 h-20 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center shadow-lg">
              <XCircle className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-4xl font-bold text-gray-900 mb-3">
              Payment Failed
            </CardTitle>
            <CardDescription className="text-xl text-gray-600">
              We couldn't process your payment. Don't worry, this happens sometimes.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-8">
            {/* Error Message */}
            <div className="text-center">
              <Badge className="bg-gradient-to-r from-red-500 to-orange-500 text-white border-0 px-4 py-2 text-sm mb-4">
                <AlertTriangle className="w-4 h-4 mr-2" />
                Payment Declined
              </Badge>
              <p className="text-gray-700 text-lg leading-relaxed max-w-2xl mx-auto">
                Your payment couldn't be processed. This could be due to insufficient funds, 
                network issues, or temporary payment system problems. Let's get this sorted out!
              </p>
            </div>

            {/* Common Solutions */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
              <h3 className="font-semibold text-blue-900 flex items-center gap-2 mb-4">
                <HelpCircle className="w-5 h-5 text-blue-500" />
                Common Solutions
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                      <CreditCard className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-blue-900">Check your balance</p>
                      <p className="text-sm text-blue-700">Ensure you have sufficient cryptocurrency balance</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                      <Globe className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-blue-900">Network issues</p>
                      <p className="text-sm text-blue-700">Try again in a few minutes</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                      <Shield className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-blue-900">Security settings</p>
                      <p className="text-sm text-blue-700">Check if your wallet allows the transaction</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                      <RefreshCw className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-blue-900">Try different crypto</p>
                      <p className="text-sm text-blue-700">We accept 2000+ cryptocurrencies</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* What Happens Next */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
              <h3 className="font-semibold text-green-900 mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-500" />
                What Happens Next?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/50 rounded-lg p-4 text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl">1</span>
                  </div>
                  <h4 className="font-medium text-green-900 mb-2">Try Again</h4>
                  <p className="text-sm text-green-700">Attempt the payment again with the same or different method</p>
                </div>
                <div className="bg-white/50 rounded-lg p-4 text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl">2</span>
                  </div>
                  <h4 className="font-medium text-green-900 mb-2">Get Support</h4>
                  <p className="text-sm text-green-700">Contact our support team for immediate assistance</p>
                </div>
                <div className="bg-white/50 rounded-lg p-4 text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl">3</span>
                  </div>
                  <h4 className="font-medium text-green-900 mb-2">Alternative Payment</h4>
                  <p className="text-sm text-green-700">We can arrange alternative payment methods if needed</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={handleTryAgain}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg"
              >
                <RefreshCw className="mr-2 h-5 w-5" />
                Try Again
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={handleContactSupport}
                className="border-2 border-gray-300 hover:bg-gray-50"
              >
                <HelpCircle className="mr-2 h-5 w-5" />
                Contact Support
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={handleGoHome}
                className="border-2 border-gray-300 hover:bg-gray-50"
              >
                <ArrowLeft className="mr-2 h-5 w-5" />
                Back to Compress
              </Button>
            </div>

            {/* Support Information */}
            <div className="mt-12 text-center">
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-2">Need immediate help?</h3>
                <p className="text-gray-600 mb-4">
                  Our support team is available 24/7 to help resolve payment issues quickly.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button variant="outline" size="sm" className="border-gray-300">
                    Live Chat
                  </Button>
                  <Button variant="outline" size="sm" className="border-gray-300">
                    <a href="/help" className="text-blue-600 hover:text-blue-700">
                      Help Center
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" className="border-gray-300">
                    <a href="mailto:support@compresshub.com" className="text-blue-600 hover:text-blue-700">
                      Email Support
                    </a>
                  </Button>
                </div>
                <div className="mt-4 text-sm text-gray-500">
                  <p>Reference ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
                  <p>Time: {new Date().toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Alternative Options */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
              <h3 className="font-semibold text-purple-900 mb-4 text-center">
                Alternative Payment Options
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/50 rounded-lg p-4">
                  <h4 className="font-medium text-purple-900 mb-2">Different Cryptocurrency</h4>
                  <p className="text-sm text-purple-700 mb-3">
                    Try paying with a different cryptocurrency. We accept Bitcoin, Ethereum, 
                    and 2000+ other cryptocurrencies.
                  </p>
                  <Button variant="outline" size="sm" className="border-purple-300 text-purple-700">
                    Try Different Crypto
                  </Button>
                </div>
                <div className="bg-white/50 rounded-lg p-4">
                  <h4 className="font-medium text-purple-900 mb-2">Contact Support</h4>
                  <p className="text-sm text-purple-700 mb-3">
                    Our team can arrange alternative payment methods or help troubleshoot 
                    the issue with your wallet.
                  </p>
                  <Button variant="outline" size="sm" className="border-purple-300 text-purple-700">
                    Get Help
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 