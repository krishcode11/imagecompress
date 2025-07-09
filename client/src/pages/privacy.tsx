import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileImage, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import AdsterraBanner from "../components/adsterra-banner";
import SocialBarAd from "../components/SocialBarAd";
import PopunderAd from "../components/PopunderAd";

export default function Privacy() {
  return (
    <>
      <PopunderAd />
      <SocialBarAd />
      <AdsterraBanner />
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <FileImage className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">CompressHub</span>
            </div>
            <Link href="/compress">
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Compress
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-gray-600">Last updated: January 6, 2025</p>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Our Privacy Commitment</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p>
                At CompressHub, we are committed to protecting your privacy and ensuring the security of your personal information. 
                This Privacy Policy explains how we collect, use, and safeguard your data when you use our image compression service.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Information We Collect</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <h3 className="text-lg font-semibold mb-3">Personal Information</h3>
              <ul className="list-disc pl-6 mb-4">
                <li>Email address (when you create an account)</li>
                <li>Name and profile information (from your authentication provider)</li>
                <li>Usage statistics and preferences</li>
              </ul>
              
              <h3 className="text-lg font-semibold mb-3">Technical Information</h3>
              <ul className="list-disc pl-6 mb-4">
                <li>Browser type and version</li>
                <li>Operating system</li>
                <li>IP address and location data</li>
                <li>Device information</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>How We Use Your Information</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p>We use your information to:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Provide and improve our image compression services</li>
                <li>Authenticate and secure your account</li>
                <li>Send important service updates and notifications</li>
                <li>Analyze usage patterns to enhance user experience</li>
                <li>Comply with legal obligations</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Image Processing and Storage</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p className="font-semibold text-green-600 mb-3">Your Images Are Processed Locally</p>
              <p>
                CompressHub processes your images entirely within your browser using client-side technology. 
                This means:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Your images are never uploaded to our servers</li>
                <li>All compression happens on your device</li>
                <li>We cannot access or view your images</li>
                <li>Your images are automatically deleted from your device's memory when you close the browser</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data Security</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p>We implement industry-standard security measures including:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>SSL/TLS encryption for all data transmission</li>
                <li>Secure authentication through trusted providers</li>
                <li>Regular security audits and updates</li>
                <li>Limited access to personal data on a need-to-know basis</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Third-Party Services</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p>We may use third-party services for:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Authentication (OAuth providers)</li>
                <li>Analytics and performance monitoring</li>
                <li>Advertising (Google AdSense)</li>
                <li>Database and hosting services</li>
              </ul>
              <p>These services have their own privacy policies and terms of use.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your Rights</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p>You have the right to:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Access your personal data</li>
                <li>Correct inaccurate information</li>
                <li>Delete your account and associated data</li>
                <li>Export your data in a portable format</li>
                <li>Opt out of marketing communications</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Us</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p>
                If you have any questions about this Privacy Policy or wish to exercise your rights, 
                please contact us at:
              </p>
              <p className="mt-3">
                <strong>Email:</strong> privacy@compresshub.com<br />
                <strong>Response Time:</strong> We aim to respond within 48 hours
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
    </>
  );
}