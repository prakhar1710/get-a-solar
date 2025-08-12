
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarIcon, MessageSquare, BookOpen } from 'lucide-react';
import SubscribeDialog from '@/components/blog/SubscribeDialog';

// Mock blog data
const blogPosts = [
  {
    id: '1',
    title: 'Understanding Solar Panel Efficiency Ratings',
    excerpt: 'Learn how to interpret efficiency ratings when choosing solar panels for your installation.',
    author: 'Aditya Sharma',
    date: '2025-04-15',
    category: 'Education',
    readTime: '5 min read',
    comments: 8
  },
  {
    id: '2',
    title: 'Government Subsidies for Solar in 2025',
    excerpt: 'A comprehensive guide to the latest government incentives available for residential and commercial solar installations.',
    author: 'Priya Patel',
    date: '2025-04-28',
    category: 'Policy',
    readTime: '8 min read',
    comments: 12
  },
  {
    id: '3',
    title: 'Comparing Monocrystalline vs. Polycrystalline Panels',
    excerpt: 'Which type of solar panel is best for your needs? We break down the pros and cons of each technology.',
    author: 'Raj Malhotra',
    date: '2025-04-22',
    category: 'Technology',
    readTime: '6 min read',
    comments: 5
  },
  {
    id: '4',
    title: 'Best Practices for Solar Panel Maintenance',
    excerpt: 'Keep your solar system running at peak efficiency with these maintenance tips and tricks.',
    author: 'Meera Kapoor',
    date: '2025-04-10',
    category: 'Maintenance',
    readTime: '4 min read',
    comments: 3
  },
  {
    id: '5',
    title: 'Solar Battery Storage Solutions Compared',
    excerpt: 'An in-depth look at the top battery storage options to pair with your solar installation.',
    author: 'Vikram Singh',
    date: '2025-04-05',
    category: 'Technology',
    readTime: '7 min read',
    comments: 9
  }
];

const BlogPage = () => {
  const [isSubscribeDialogOpen, setIsSubscribeDialogOpen] = useState(false);

  return (
    <MainLayout>
      <div className="container py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Solar Blog</h1>
            <p className="text-muted-foreground mt-1">Stay updated with the latest in solar technology and industry news</p>
          </div>
          <Button 
            className="bg-sbs-purple hover:bg-sbs-purple-dark text-white"
            onClick={() => setIsSubscribeDialogOpen(true)}
          >
            <BookOpen className="mr-2 h-4 w-4" />
            Subscribe
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.map((post) => (
            <Card key={post.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <Badge variant="outline" className="mb-2">{post.category}</Badge>
                  <div className="text-xs text-muted-foreground flex items-center">
                    <CalendarIcon className="h-3 w-3 mr-1" />
                    {post.date}
                  </div>
                </div>
                <CardTitle className="text-xl">{post.title}</CardTitle>
                <CardDescription className="text-sm line-clamp-3">{post.excerpt}</CardDescription>
              </CardHeader>
              <CardContent className="pb-3">
                <p className="text-sm text-muted-foreground">{post.readTime} • By {post.author}</p>
              </CardContent>
              <CardFooter className="flex justify-between pt-2">
                <Button variant="outline" size="sm" className="text-sbs-purple hover:text-sbs-purple-dark hover:bg-sbs-purple/10">
                  Read More
                </Button>
                <div className="flex items-center text-muted-foreground text-sm">
                  <MessageSquare className="h-4 w-4 mr-1" />
                  {post.comments}
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="flex justify-center mt-12">
          <Button variant="outline" className="mr-2">Previous</Button>
          <Button variant="outline">Next</Button>
        </div>
      </div>

      <SubscribeDialog
        open={isSubscribeDialogOpen}
        onOpenChange={setIsSubscribeDialogOpen}
      />
    </MainLayout>
  );
};

export default BlogPage;
