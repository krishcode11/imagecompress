import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { FileImage, Play, BookOpen, Download, Settings, Zap, Shield, Users } from "lucide-react";
import AdsterraBanner from "../components/adsterra-banner";
import SocialBarAd from "../components/SocialBarAd";
import PopunderAd from "../components/PopunderAd";

export default function Tutorials() {
  const { signIn } = useAuth();
  const tutorials = [
    {
      id: 1,
      title: "Getting Started with CompressHub",
      description: "Learn the basics of uploading and compressing your first images",
      duration: "5 min read",
      difficulty: "Beginner",
      icon: Play,
      content: [
        "How to upload images",
        "Understanding quality settings",
        "Downloading compressed files",
        "Batch processing tips"
      ]
    },
    {
      id: 2,
      title: "Advanced Compression Techniques",
      description: "Master advanced settings for optimal file size and quality balance",
      duration: "8 min read",
      difficulty: "Intermediate",
      icon: Settings,
      content: [
        "Quality vs file size optimization",
        "Format-specific compression",
        "Custom quality presets",
        "Batch processing strategies"
      ]
    },
    {
      id: 3,
      title: "WebP vs JPEG: Choosing the Right Format",
      description: "Understand when to use different image formats for web optimization",
      duration: "6 min read",
      difficulty: "Intermediate",
      icon: BookOpen,
      content: [
        "WebP advantages and limitations",
        "JPEG optimization techniques",
        "Browser compatibility considerations",
        "Format conversion best practices"
      ]
    },
    {
      id: 4,
      title: "Batch Processing for Large Projects",
      description: "Efficiently handle multiple images with our batch processing features",
      duration: "7 min read",
      difficulty: "Advanced",
      icon: Zap,
      content: [
        "Setting up batch workflows",
        "Quality consistency across files",
        "Organizing large image sets",
        "Automation tips and tricks"
      ]
    },
    {
      id: 5,
      title: "Privacy and Security Best Practices",
      description: "Learn how to keep your images secure during compression",
      duration: "4 min read",
      difficulty: "Beginner",
      icon: Shield,
      content: [
        "Local processing benefits",
        "Data privacy protection",
        "Secure file handling",
        "Best practices for sensitive images"
      ]
    },
    {
      id: 6,
      title: "Team Collaboration Features",
      description: "Maximize productivity with team-based image compression workflows",
      duration: "6 min read",
      difficulty: "Intermediate",
      icon: Users,
      content: [
        "Shared quality presets",
        "Team workflow optimization",
        "Consistency across projects",
        "Collaboration best practices"
      ]
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Tutorials & Guides</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Master image compression with our comprehensive tutorials. From beginner basics to advanced techniques, 
              learn everything you need to optimize your images effectively.
            </p>
          </div>

          {/* Featured Tutorial */}
          <div className="mb-12">
            <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
              <CardHeader>
                <div className="flex items-center space-x-2 mb-2">
                  <Play className="h-5 w-5" />
                  <span className="text-sm font-medium">Featured Tutorial</span>
                </div>
                <CardTitle className="text-2xl">Getting Started with CompressHub</CardTitle>
                <CardDescription className="text-blue-100">
                  Perfect for beginners! Learn how to compress your first images in just 5 minutes.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm">
                    <span>5 min read</span>
                    <span>•</span>
                    <span>Beginner</span>
                  </div>
                  <Button variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
                    Start Learning
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tutorial Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tutorials.map((tutorial) => {
              const IconComponent = tutorial.icon;
              return (
                <Card key={tutorial.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <IconComponent className="h-6 w-6 text-blue-600" />
                      <span className="text-xs font-medium px-2 py-1 bg-gray-100 text-gray-600 rounded">
                        {tutorial.difficulty}
                      </span>
                    </div>
                    <CardTitle className="text-lg">{tutorial.title}</CardTitle>
                    <CardDescription>{tutorial.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center text-sm text-gray-600">
                        <BookOpen className="h-4 w-4 mr-2" />
                        {tutorial.duration}
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm text-gray-900">What you'll learn:</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {tutorial.content.slice(0, 3).map((item, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-blue-600 mr-2">•</span>
                              {item}
                            </li>
                          ))}
                          {tutorial.content.length > 3 && (
                            <li className="text-blue-600 text-sm">
                              +{tutorial.content.length - 3} more topics
                            </li>
                          )}
                        </ul>
                      </div>
                      
                      <Button variant="outline" className="w-full mt-4">
                        Read Tutorial
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Quick Tips Section */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Quick Tips</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="text-center">
                <CardContent className="pt-6">
                  <Download className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Drag & Drop</h3>
                  <p className="text-sm text-gray-600">
                    Simply drag your images onto the upload area for instant processing
                  </p>
                </CardContent>
              </Card>
              
              <Card className="text-center">
                <CardContent className="pt-6">
                  <Settings className="h-8 w-8 text-green-600 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Quality Control</h3>
                  <p className="text-sm text-gray-600">
                    Adjust quality settings to find the perfect balance of size and quality
                  </p>
                </CardContent>
              </Card>
              
              <Card className="text-center">
                <CardContent className="pt-6">
                  <Zap className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Batch Process</h3>
                  <p className="text-sm text-gray-600">
                    Process multiple images simultaneously to save time
                  </p>
                </CardContent>
              </Card>
              
              <Card className="text-center">
                <CardContent className="pt-6">
                  <Shield className="h-8 w-8 text-orange-600 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Privacy First</h3>
                  <p className="text-sm text-gray-600">
                    All processing happens locally - your files never leave your device
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-16 text-center">
            <Card className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
              <CardContent className="pt-8 pb-8">
                <h2 className="text-2xl font-bold mb-4">Ready to Start Compressing?</h2>
                <p className="text-green-100 mb-6 max-w-2xl mx-auto">
                  Put these tutorials into practice with our powerful image compression tool.
                </p>
                <Button 
                  size="lg" 
                  variant="secondary" 
                  className="bg-white text-green-600 hover:bg-gray-100"
                  onClick={signIn}
                >
                  Start Compressing Now
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
} 