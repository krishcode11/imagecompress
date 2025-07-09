import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileImage, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import AdsterraBanner from "../components/adsterra-banner";
import SocialBarAd from "../components/SocialBarAd";
import PopunderAd from "../components/PopunderAd";

export default function Terms() {
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
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-gray-600">Last updated: January 6, 2025</p>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Acceptance of Terms</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p>
                By accessing and using CompressHub ("the Service"), you accept and agree to be bound by the terms 
                and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Description of Service</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p>
                CompressHub is a web-based image compression service that allows users to reduce the file size of images 
                while maintaining quality. The service processes images locally in your browser using advanced algorithms.
              </p>
              <p className="mt-3">
                Our service includes:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Multi-format image compression (JPEG, PNG, GIF, WebP, BMP, SVG, TIFF, ICO)</li>
                <li>Batch processing capabilities</li>
                <li>Quality control and preview features</li>
                <li>Secure client-side processing</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>User Responsibilities</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p>You agree to:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Use the service only for lawful purposes</li>
                <li>Not upload copyrighted material without permission</li>
                <li>Not attempt to harm or disrupt the service</li>
                <li>Not use automated tools to access the service excessively</li>
                <li>Respect the file size limits (10MB per file)</li>
                <li>Not share your account credentials with others</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Prohibited Content</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p>You may not upload or process images containing:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Illegal, harmful, or offensive content</li>
                <li>Copyrighted material without proper authorization</li>
                <li>Personal information of others without consent</li>
                <li>Malicious code or viruses</li>
                <li>Content that violates any applicable laws</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Intellectual Property</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p>
                You retain all rights to your original images. CompressHub does not claim ownership of any content 
                you process through our service. However, you grant us a limited license to process your images 
                to provide the compression service.
              </p>
              <p className="mt-3">
                The CompressHub service, including its software, algorithms, and user interface, is protected by 
                copyright and other intellectual property laws.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Privacy and Data Security</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p>
                Your privacy is important to us. Our image processing occurs entirely in your browser, which means:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Images are never uploaded to our servers</li>
                <li>We cannot access or view your images</li>
                <li>All processing happens locally on your device</li>
                <li>Images are automatically removed from memory when you close the browser</li>
              </ul>
              <p>
                For more details, please review our <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Service Availability</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p>
                While we strive to provide continuous service, we cannot guarantee 100% uptime. The service may be 
                temporarily unavailable due to maintenance, technical issues, or other factors beyond our control.
              </p>
              <p className="mt-3">
                We reserve the right to modify, suspend, or discontinue the service at any time with or without notice.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Limitation of Liability</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p>
                CompressHub is provided "as is" without warranties of any kind. We are not liable for any damages 
                arising from the use of our service, including but not limited to:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Loss of data or images</li>
                <li>Service interruptions</li>
                <li>Indirect or consequential damages</li>
                <li>Loss of business or profits</li>
              </ul>
              <p>
                Our total liability shall not exceed the amount you paid for the service in the past 12 months.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Indemnification</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p>
                You agree to indemnify and hold CompressHub harmless from any claims, damages, or expenses arising 
                from your use of the service, violation of these terms, or infringement of any third-party rights.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Modifications to Terms</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p>
                We may update these Terms of Service from time to time. Changes will be posted on this page with 
                an updated date. Your continued use of the service after changes are posted constitutes acceptance 
                of the new terms.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p>
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <p className="mt-3">
                <strong>Email:</strong> legal@imagecompressor.com<br />
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