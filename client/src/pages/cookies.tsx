import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileImage, Shield, Settings, Info, Clock, Database } from "lucide-react";
import AdsterraBanner from "../components/adsterra-banner";
import SocialBarAd from "../components/SocialBarAd";
import PopunderAd from "../components/PopunderAd";

export default function Cookies() {
  const cookieTypes = [
    {
      name: "Essential Cookies",
      description: "These cookies are necessary for the website to function properly",
      examples: ["Authentication tokens", "Session management", "Security features"],
      duration: "Session or 1 year",
      icon: Shield,
      color: "text-green-600"
    },
    {
      name: "Analytics Cookies",
      description: "Help us understand how visitors interact with our website",
      examples: ["Page views", "User behavior", "Performance metrics"],
      duration: "2 years",
      icon: Database,
      color: "text-blue-600"
    },
    {
      name: "Preference Cookies",
      description: "Remember your settings and preferences for a better experience",
      examples: ["Language settings", "Theme preferences", "Quality settings"],
      duration: "1 year",
      icon: Settings,
      color: "text-purple-600"
    },
    {
      name: "Marketing Cookies",
      description: "Used to deliver relevant advertisements and track campaign performance",
      examples: ["Ad targeting", "Campaign tracking", "Conversion measurement"],
      duration: "90 days",
      icon: Info,
      color: "text-orange-600"
    }
  ];

  return (
    <>
      <PopunderAd />
      <SocialBarAd />
      <AdsterraBanner />
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <FileImage className="h-8 w-8 text-blue-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">CompressHub</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Cookie Policy</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              This Cookie Policy explains how CompressHub uses cookies and similar technologies to recognize you when you visit our website.
            </p>
            <p className="text-sm text-gray-500 mt-4">
              Last updated: January 2025
            </p>
          </div>

          {/* What are Cookies Section */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Info className="h-6 w-6 text-blue-600 mr-2" />
                What are Cookies?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                Cookies are small text files that are placed on your device when you visit a website. They are widely used to make websites work more efficiently and provide information to website owners.
              </p>
              <p className="text-gray-700">
                At CompressHub, we use cookies to enhance your experience, analyze site usage, and provide personalized content. We are committed to being transparent about our use of cookies and giving you control over them.
              </p>
            </CardContent>
          </Card>

          {/* Types of Cookies */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Types of Cookies We Use</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {cookieTypes.map((cookie, index) => {
                const IconComponent = cookie.icon;
                return (
                  <Card key={index} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-center mb-2">
                        <IconComponent className={`h-5 w-5 mr-2 ${cookie.color}`} />
                        <CardTitle className="text-lg">{cookie.name}</CardTitle>
                      </div>
                      <CardDescription>{cookie.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <h4 className="font-medium text-sm text-gray-900 mb-2">Examples:</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {cookie.examples.map((example, idx) => (
                            <li key={idx} className="flex items-start">
                              <span className="text-blue-600 mr-2">•</span>
                              {example}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="h-4 w-4 mr-2" />
                        Duration: {cookie.duration}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* How We Use Cookies */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>How We Use Cookies</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Essential Functions</h3>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li>• Keep you signed in during your session</li>
                    <li>• Remember your compression preferences</li>
                    <li>• Ensure secure file processing</li>
                    <li>• Prevent fraud and abuse</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Improving Your Experience</h3>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li>• Remember your language and region</li>
                    <li>• Provide personalized recommendations</li>
                    <li>• Analyze site performance</li>
                    <li>• Optimize our services</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Third-Party Cookies */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Third-Party Cookies</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                We may use third-party services that place cookies on your device. These services help us:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Analytics Services</h4>
                  <p className="text-sm text-gray-600">
                    Google Analytics to understand how users interact with our website
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Payment Processing</h4>
                  <p className="text-sm text-gray-600">
                    CoinPayments for secure cryptocurrency transactions
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Authentication</h4>
                  <p className="text-sm text-gray-600">
                    Firebase for secure user authentication and management
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Advertising</h4>
                  <p className="text-sm text-gray-600">
                    Google AdSense for relevant advertisements
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Managing Cookies */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Managing Your Cookie Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                You have several options for managing cookies:
              </p>
              <div className="space-y-4">
                <div className="border-l-4 border-blue-600 pl-4">
                  <h4 className="font-semibold text-gray-900">Browser Settings</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Most browsers allow you to control cookies through their settings. You can usually find these in the "Privacy" or "Security" section of your browser's preferences.
                  </p>
                </div>
                <div className="border-l-4 border-green-600 pl-4">
                  <h4 className="font-semibold text-gray-900">Cookie Consent</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    When you first visit our site, you'll see a cookie consent banner where you can choose which types of cookies to accept.
                  </p>
                </div>
                <div className="border-l-4 border-purple-600 pl-4">
                  <h4 className="font-semibold text-gray-900">Opt-Out Links</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    For third-party cookies, you can often opt out directly through the service provider's website.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Important Notes */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-6 w-6 text-orange-600 mr-2" />
                Important Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-800 mb-2">Essential Cookies</h4>
                <p className="text-sm text-yellow-700">
                  Some cookies are essential for the website to function properly. If you disable these cookies, some features may not work correctly.
                </p>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">Updates to This Policy</h4>
                <p className="text-sm text-blue-700">
                  We may update this Cookie Policy from time to time. We will notify you of any changes by posting the new policy on this page.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Us</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                If you have any questions about our use of cookies, please contact us:
              </p>
              <div className="space-y-2 text-sm text-gray-600">
                <p>Email: privacy@compresshub.com</p>
                <p>Address: 123 Tech Street, San Francisco, CA 94105</p>
                <p>Phone: +1 (555) 123-4567</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
} 