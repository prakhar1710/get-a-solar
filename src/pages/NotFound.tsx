
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <MainLayout>
      <div className="min-h-[calc(100vh-300px)] flex items-center justify-center py-16">
        <div className="text-center space-y-6">
          <div className="flex justify-center items-center">
            <span className="text-7xl font-bold text-sbs-purple">4</span>
            <div className="mx-2 relative">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-sbs-orange to-sbs-purple-dark animate-pulse-slow"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full border-4 border-background"></div>
            </div>
            <span className="text-7xl font-bold text-sbs-purple">4</span>
          </div>
          
          <div className="space-y-3">
            <h1 className="text-2xl font-bold">Page Not Found</h1>
            <p className="text-muted-foreground max-w-md mx-auto">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <Link to="/">Return Home</Link>
            </Button>
            <Button variant="outline">
              <Link to="/customer">Customer Dashboard</Link>
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default NotFound;
