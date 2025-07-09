import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import SocialBarAd from "../components/SocialBarAd";
import PopunderAd from "../components/PopunderAd";

export default function NotFound() {
  return (
    <>
      <PopunderAd />
      <SocialBarAd />
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <h1 className="text-2xl font-bold text-gray-900">404 Page Not Found</h1>
          </div>

          <p className="mt-4 text-sm text-gray-600">
            Did you forget to add the page to the router?
          </p>
            <div className="mt-8 flex justify-center">
              <Link href="/compress">
                <Button variant="outline">Back to Compress</Button>
              </Link>
            </div>
        </CardContent>
      </Card>
    </div>
    </>
  );
}
