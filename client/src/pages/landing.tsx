import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { 
  Image, 
  Zap, 
  Shield, 
  Users, 
  CheckCircle, 
  ArrowRight,
  Download,
  FileImage,
  Gauge
} from "lucide-react";
import AdsterraBanner from "../components/adsterra-banner";
import BannerAd from "../components/BannerAd";
import SocialBarAd from "../components/SocialBarAd";
import PopunderAd from "../components/PopunderAd";
import { Link } from "wouter";

export default function Landing() {
  const { signIn } = useAuth();
  return (
    <>
      <PopunderAd />
      <SocialBarAd />
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <FileImage className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">CompressHub</span>
            </div>
            <Button 
              onClick={signIn}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Get Started Free
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <Badge className="mb-6 bg-blue-100 text-blue-800 border-blue-200">
            <Zap className="w-3 h-3 mr-1" />
            Advanced AI-Powered Compression
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Compress Images
            <span className="text-blue-600"> Without Limits</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Professional image compression with advanced algorithms. Reduce file sizes by up to 90% 
            while maintaining exceptional quality. Perfect for web, mobile, and storage optimization.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={signIn}
              className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-6"
            >
              Start Compressing Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="text-lg px-8 py-6"
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
            >
              See Features
            </Button>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="bg-green-100 p-3 rounded-full mb-3">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900">No File Limits</h3>
              <p className="text-gray-600 text-sm">Process unlimited files up to 10MB each</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-purple-100 p-3 rounded-full mb-3">
                <Gauge className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Lightning Fast</h3>
              <p className="text-gray-600 text-sm">Concurrent processing with smart queuing</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-blue-100 p-3 rounded-full mb-3">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900">100% Secure</h3>
              <p className="text-gray-600 text-sm">Files processed locally, never stored</p>
            </div>
          </div>
        </div>
      </section>

        {/* Banner Ad - Middle Placement */}
        <div className="flex justify-center my-12">
          <BannerAd />
        </div>

      {/* Features Section */}
      <section id="features" className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need for Image Compression
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Professional-grade tools with an intuitive interface designed for everyone
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-2 hover:border-blue-200 transition-colors">
              <CardHeader>
                <Image className="h-10 w-10 text-blue-600 mb-2" />
                <CardTitle>All Image Formats</CardTitle>
                <CardDescription>
                  Support for JPEG, PNG, GIF, WebP, BMP, SVG, TIFF, and ICO formats
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-green-200 transition-colors">
              <CardHeader>
                <Zap className="h-10 w-10 text-green-600 mb-2" />
                <CardTitle>Advanced Algorithms</CardTitle>
                <CardDescription>
                  AI-powered compression with bicubic interpolation and noise reduction
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-purple-200 transition-colors">
              <CardHeader>
                <Gauge className="h-10 w-10 text-purple-600 mb-2" />
                <CardTitle>Batch Processing</CardTitle>
                <CardDescription>
                  Process multiple files simultaneously with intelligent queue management
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-orange-200 transition-colors">
              <CardHeader>
                <Users className="h-10 w-10 text-orange-600 mb-2" />
                <CardTitle>Quality Control</CardTitle>
                <CardDescription>
                  Adjustable compression with real-time preview and quality assessment
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-indigo-200 transition-colors">
              <CardHeader>
                <Download className="h-10 w-10 text-indigo-600 mb-2" />
                <CardTitle>Easy Downloads</CardTitle>
                <CardDescription>
                  Download individual files or create ZIP archives for bulk downloads
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-pink-200 transition-colors">
              <CardHeader>
                <Shield className="h-10 w-10 text-pink-600 mb-2" />
                <CardTitle>Privacy First</CardTitle>
                <CardDescription>
                  All processing happens in your browser. No files uploaded to servers
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Optimize Your Images?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of users who trust CompressHub for their image optimization needs
          </p>
          <Button 
            size="lg" 
            onClick={signIn}
            className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-6"
          >
            Start Free Today
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <FileImage className="h-8 w-8 text-blue-400" />
                <span className="ml-2 text-xl font-bold">CompressHub</span>
              </div>
              <p className="text-gray-400">
                Professional image compression made simple and secure.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white">Features</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">API Access</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/help" className="hover:text-white">Help Center</a></li>
                <li><a href="/contact" className="hover:text-white">Contact Us</a></li>
                <li><a href="/tutorials" className="hover:text-white">Tutorials</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/privacy" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="/terms" className="hover:text-white">Terms of Service</a></li>
                <li><a href="/cookies" className="hover:text-white">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 CompressHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
    </>
  );
}