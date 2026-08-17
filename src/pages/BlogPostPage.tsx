import React from 'react';
import { useParams } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { SEOHead } from '@/components/common/SEOHead';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarIcon, ArrowLeft, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { blogArticles } from '@/data/blogArticles';

const BlogPostPage = () => {
  const { id } = useParams();
  const article = blogArticles.find(post => post.id === id);

  if (!article) {
    return (
      <MainLayout>
        <SEOHead
          title="Article Not Found"
          description="The blog article you're looking for could not be found on Get A Solar."
          canonicalUrl="/blog"
        />
        <div className="container py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Article Not Found</h1>
            <Link to="/blog">
              <Button variant="outline">Back to Blog</Button>
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    image: ["https://www.getasolar.in/hero-banner.png"],
    author: { "@type": "Person", name: article.author },
    datePublished: article.date,
    dateModified: article.date,
    articleSection: article.category,
    publisher: {
      "@type": "Organization",
      name: "Get A Solar",
      logo: {
        "@type": "ImageObject",
        url: "https://www.getasolar.in/hero-banner.png",
      },
    },
    mainEntityOfPage: `https://www.getasolar.in/blog/${article.id}`,
  };

  return (
    <MainLayout>
      <SEOHead
        title={article.title}
        description={article.excerpt}
        keywords={`${article.category}, solar, ${article.title}`}
        canonicalUrl={`/blog/${article.id}`}
        ogType="article"
        jsonLd={articleJsonLd}
      />
      <div className="container py-8 max-w-4xl mx-auto">
        <Link to="/blog">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Button>
        </Link>

        <article>
          <Card className="overflow-hidden">
            <CardHeader className="space-y-4">
              <div className="flex flex-wrap gap-2 items-center justify-between">
                <Badge variant="outline">{article.category}</Badge>
                <div className="text-sm text-muted-foreground flex items-center">
                  <CalendarIcon className="h-4 w-4 mr-1" />
                  {article.date}
                </div>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold leading-tight">
                {article.title}
              </h1>
              
              <p className="text-lg text-muted-foreground leading-relaxed">
                {article.excerpt}
              </p>
              
              <div className="flex items-center space-x-4 pt-4 border-t">
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">{article.author}</span>
                </div>
                <span className="text-muted-foreground">•</span>
                <span className="text-muted-foreground">{article.readTime}</span>
              </div>
            </CardHeader>
            
            <CardContent className="prose prose-lg max-w-none">
              <div 
                className="space-y-6 [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:mt-8 [&>h2]:mb-4 [&>h3]:text-xl [&>h3]:font-semibold [&>h3]:mt-6 [&>h3]:mb-3 [&>h4]:text-lg [&>h4]:font-medium [&>h4]:mt-4 [&>h4]:mb-2 [&>p]:mb-4 [&>p]:leading-relaxed [&>ul]:mb-4 [&>ul]:pl-6 [&>ol]:mb-4 [&>ol]:pl-6 [&>li]:mb-2 [&>strong]:font-semibold [&>table]:w-full [&>table]:border-collapse [&>table]:my-6 [&>th]:border [&>th]:p-2 [&>th]:bg-muted [&>th]:font-semibold [&>td]:border [&>td]:p-2"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />
            </CardContent>
          </Card>
        </article>
      </div>
    </MainLayout>
  );
};

export default BlogPostPage;