
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { SEOHead } from '@/components/common/SEOHead';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarIcon, MessageSquare, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import SubscribeDialog from '@/components/blog/SubscribeDialog';
import { blogArticles } from '@/data/blogArticles';

const BlogPage = () => {
  const [isSubscribeDialogOpen, setIsSubscribeDialogOpen] = useState(false);

  return (
    <MainLayout>
      <SEOHead 
        title="Solar Energy Blog & News"
        description="Stay updated with the latest solar technology trends, government policies, subsidies, and installation guides. Expert insights on solar energy in India."
        keywords="solar blog, solar news, solar technology, solar subsidies, solar installation guide, renewable energy news"
      />
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
          {blogArticles.map((post) => (
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
                <Link to={`/blog/${post.id}`} aria-label={`Read full article: ${post.title}`}>
                  <Button variant="outline" size="sm" className="text-sbs-purple hover:text-sbs-purple-dark hover:bg-sbs-purple/10">
                    Read full article
                  </Button>
                </Link>
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
