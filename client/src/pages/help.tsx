import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { FileImage, ArrowLeft, Upload, Settings, Download, Shield, Zap, HelpCircle } from "lucide-react";
import { Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import AdsterraBanner from "../components/adsterra-banner";
import SocialBarAd from "../components/SocialBarAd";
import PopunderAd from "../components/PopunderAd";

export default function Help() {
  const { isAuthenticated } = useAuth();
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
            <Link href={isAuthenticated ? "/compress" : "/"}>
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {isAuthenticated ? "Back to Compress" : "Back to Home"}
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 text-center">
          <HelpCircle className="h-16 w-16 text-blue-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Help Center</h1>
          <p className="text-gray-600">Find answers to common questions and learn how to get the most out of CompressHub</p>
        </div>

        {/* Quick Start Guide */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="h-5 w-5 mr-2 text-blue-600" />
              Quick Start Guide
            </CardTitle>
            <CardDescription>Get started with CompressHub in 3 simple steps</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                  <Upload className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">1. Upload Images</h3>
                <p className="text-sm text-gray-600">Drag and drop your images or click to browse. Supports all major formats up to 10MB per file.</p>
              </div>
              <div className="text-center">
                <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                  <Settings className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">2. Adjust Quality</h3>
                <p className="text-sm text-gray-600">Choose your desired compression level from 10% to 100%. Preview changes in real-time.</p>
              </div>
              <div className="text-center">
                <div className="bg-purple-100 p-4 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                  <Download className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">3. Download Results</h3>
                <p className="text-sm text-gray-600">Download individual files or create a ZIP archive for batch download.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* FAQ Section */}
        <Card>
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="formats">
                <AccordionTrigger>What image formats are supported?</AccordionTrigger>
                <AccordionContent>
                  CompressHub supports all major image formats including JPEG, PNG, GIF, WebP, BMP, SVG, TIFF, and ICO. 
                  The compression algorithm automatically optimizes based on the input format and quality settings.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="file-size">
                <AccordionTrigger>What's the maximum file size limit?</AccordionTrigger>
                <AccordionContent>
                  Each image file can be up to 10MB in size. There's no limit on the number of files you can process 
                  simultaneously, though the browser's memory may be a practical constraint for very large batches.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="security">
                <AccordionTrigger>Are my images secure and private?</AccordionTrigger>
                <AccordionContent>
                  Yes, absolutely! All image processing happens entirely in your browser using client-side technology. 
                  Your images are never uploaded to our servers, and we cannot access or view them. Images are 
                  automatically removed from memory when you close the browser tab.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="quality">
                <AccordionTrigger>How do I choose the right compression quality?</AccordionTrigger>
                <AccordionContent>
                  <ul className="list-disc pl-6 space-y-1">
                    <li><strong>90-100%:</strong> Maximum quality, larger files - ideal for printing</li>
                    <li><strong>80-90%:</strong> High quality, good for professional web use</li>
                    <li><strong>70-80%:</strong> Good quality, web optimized - recommended for most websites</li>
                    <li><strong>50-70%:</strong> Medium quality, smaller files - good for thumbnails</li>
                    <li><strong>10-50%:</strong> Low quality, smallest files - use sparingly</li>
                  </ul>
                  Use the preview feature to see how compression affects your specific images.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="batch">
                <AccordionTrigger>Can I compress multiple images at once?</AccordionTrigger>
                <AccordionContent>
                  Yes! CompressHub features intelligent batch processing with a queue system that processes up to 3 images 
                  simultaneously for optimal performance. You can upload multiple files and compress them all with the same 
                  quality settings, then download them individually or as a ZIP archive.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="algorithms">
                                  <AccordionTrigger>What compression technology does ImageCompressor use?</AccordionTrigger>
                <AccordionContent>
                  We use advanced compression algorithms including:
                  <ul className="list-disc pl-6 space-y-1 mt-2">
                    <li>Bicubic interpolation for high-quality resizing</li>
                    <li>Noise reduction algorithms</li>
                    <li>Progressive JPEG encoding for faster web loading</li>
                    <li>Metadata removal for smaller file sizes</li>
                    <li>Format-specific optimizations</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="browser">
                <AccordionTrigger>Which browsers are supported?</AccordionTrigger>
                <AccordionContent>
                  ImageCompressor works best on modern browsers that support HTML5 Canvas and File APIs:
                  <ul className="list-disc pl-6 space-y-1 mt-2">
                    <li>Chrome 60+</li>
                    <li>Firefox 55+</li>
                    <li>Safari 11+</li>
                    <li>Edge 79+</li>
                  </ul>
                  For the best experience, we recommend using the latest version of your preferred browser.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="mobile">
                <AccordionTrigger>Does CompressHub work on mobile devices?</AccordionTrigger>
                <AccordionContent>
                  Yes, CompressHub is fully responsive and works on mobile devices. However, processing large images 
                  or many files simultaneously may be slower on mobile devices due to hardware limitations. 
                  For best performance, we recommend using a desktop or laptop computer.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="account">
                <AccordionTrigger>Do I need to create an account?</AccordionTrigger>
                <AccordionContent>
                  An account is required to access the full CompressHub experience. Creating an account allows us to:
                  <ul className="list-disc pl-6 space-y-1 mt-2">
                    <li>Save your compression preferences</li>
                    <li>Provide usage statistics</li>
                    <li>Offer personalized recommendations</li>
                    <li>Enable advanced features</li>
                  </ul>
                  Account creation is free and secure through trusted authentication providers.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="issues">
                <AccordionTrigger>What should I do if I encounter issues?</AccordionTrigger>
                <AccordionContent>
                  If you experience any problems:
                  <ol className="list-decimal pl-6 space-y-1 mt-2">
                    <li>Refresh the page and try again</li>
                    <li>Check that your browser is up to date</li>
                    <li>Ensure your images are under 10MB and in a supported format</li>
                    <li>Try clearing your browser cache</li>
                    <li>Contact our support team at support@compresshub.com</li>
                  </ol>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        {/* Contact Support */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2 text-green-600" />
              Need More Help?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Can't find the answer you're looking for? Our support team is here to help!
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="flex-1">
                Email Support
              </Button>
              <Button variant="outline" className="flex-1">
                View Documentation
              </Button>
            </div>
            <p className="text-sm text-gray-500 mt-3 text-center">
              We typically respond within 24 hours
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
    </>
  );
}