import { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar, Clock, ArrowLeft, Share2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Helmet } from 'react-helmet-async';
import { LandingNav } from '@/components/LandingNav';
import { Footer } from '@/components/Footer';
import adzhubLogo from '@/assets/adzhub-logo-final.png';
import { prepareBlogBodyHtml } from '@/lib/blogContent';
import { cn } from '@/lib/utils';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featured_image: string | null;
  author_name: string | null;
  author_avatar: string | null;
  published_at: string;
  category: string | null;
  tags: string[] | null;
  reading_time: number | null;
  h1_heading: string | null;
  meta_title: string | null;
  meta_description: string | null;
  meta_keywords: string[] | null;
  canonical_url: string | null;
  og_title: string | null;
  og_description: string | null;
  og_image: string | null;
  twitter_title: string | null;
  twitter_description: string | null;
  twitter_image: string | null;
  schema_data: any;
}

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      fetchPost();
    }
  }, [slug]);

  const bodyHtml = useMemo(
    () => (post?.content != null ? prepareBlogBodyHtml(post.content) : ""),
    [post?.content]
  );

  const fetchPost = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .maybeSingle();

      if (error) throw error;
      setPost(data);
    } catch (error) {
      console.error('Error fetching blog post:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Carregando...</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-white">
        <LandingNav />
        <div className="container mx-auto px-6 pt-[83px] py-16 text-center">
          <h1 className="text-3xl font-bold mb-4 text-[#08080C]">Post não encontrado</h1>
          <Button asChild>
            <Link to="/blog">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar para o blog
            </Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  // Generate Schema.org structured data
  const structuredData = post.schema_data || {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.excerpt || post.meta_description,
    "image": post.og_image || post.featured_image,
    "datePublished": post.published_at,
    "author": {
      "@type": "Person",
      "name": post.author_name || "AdzHub Team"
    },
    "publisher": {
      "@type": "Organization",
      "name": "AdzHub",
      "logo": {
        "@type": "ImageObject",
        "url": window.location.origin + adzhubLogo
      }
    }
  };

  const currentUrl = window.location.href;

  return (
    <>
      <Helmet>
        {/* Primary Meta Tags */}
        <title>{post.meta_title || post.title}</title>
        <meta name="title" content={post.meta_title || post.title} />
        <meta name="description" content={post.meta_description || post.excerpt || ''} />
        {post.meta_keywords && post.meta_keywords.length > 0 && (
          <meta name="keywords" content={post.meta_keywords.join(', ')} />
        )}
        <link rel="canonical" href={post.canonical_url || currentUrl} />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="article" />
        <meta property="og:url" content={currentUrl} />
        <meta property="og:title" content={post.og_title || post.meta_title || post.title} />
        <meta property="og:description" content={post.og_description || post.meta_description || post.excerpt || ''} />
        {post.og_image && <meta property="og:image" content={post.og_image} />}
        <meta property="article:published_time" content={post.published_at} />
        {post.author_name && <meta property="article:author" content={post.author_name} />}

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={currentUrl} />
        <meta name="twitter:title" content={post.twitter_title || post.og_title || post.meta_title || post.title} />
        <meta name="twitter:description" content={post.twitter_description || post.og_description || post.meta_description || post.excerpt || ''} />
        {(post.twitter_image || post.og_image) && (
          <meta name="twitter:image" content={post.twitter_image || post.og_image || ''} />
        )}

        {/* Schema.org structured data */}
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      <div className="min-h-screen bg-white">
        <LandingNav />

        {/* Article */}
        <article className="pt-[83px] py-12">
          <div className="container mx-auto px-6 max-w-4xl">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 mb-8 pt-4">
              <Link to="/blog" className="inline-flex items-center gap-1.5 text-sm text-[#37489d] hover:text-[#37489d]/80 transition-colors">
                <ArrowLeft className="h-3.5 w-3.5" />
                Blog
              </Link>
              {post.category && (
                <>
                  <span className="text-[#6B7280] text-sm">/</span>
                  <span className="text-sm text-[#6B7280]">{post.category}</span>
                </>
              )}
            </div>

            {/* Meta Information */}
            <div className="flex items-center gap-3 mb-6 flex-wrap">
              {post.category && (
                <Badge variant="secondary" className="text-sm">{post.category}</Badge>
              )}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <time dateTime={post.published_at}>
                  {format(new Date(post.published_at), "dd 'de' MMMM, yyyy", { locale: ptBR })}
                </time>
              </div>
              {post.reading_time && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{post.reading_time} min de leitura</span>
                </div>
              )}
            </div>

            {/* H1 Heading (SEO Critical) */}
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
              {post.h1_heading || post.title}
            </h1>

            {/* Excerpt */}
            {post.excerpt && (
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                {post.excerpt}
              </p>
            )}

            {/* Author Info */}
            {post.author_name && (
              <div className="flex items-center gap-3 mb-8">
                {post.author_avatar ? (
                  <img 
                    src={post.author_avatar} 
                    alt={post.author_name}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-lg font-semibold text-primary">
                      {post.author_name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div>
                  <p className="font-medium">{post.author_name}</p>
                  <p className="text-sm text-muted-foreground">Autor</p>
                </div>
              </div>
            )}

            <Separator className="mb-8" />

            {/* Featured Image */}
            {post.featured_image && (
              <div className="mb-8 rounded-lg overflow-hidden">
                <img 
                  src={post.featured_image} 
                  alt={post.title}
                  className="w-full h-auto"
                />
              </div>
            )}

            {/* Conteúdo rico: HTML (WordPress/CMS) ou Markdown — estilos via @tailwindcss/typography */}
            {bodyHtml ? (
              <div
                className={cn(
                  "blog-body prose prose-lg max-w-none overflow-x-auto",
                  "text-[#374151] prose-headings:text-[#08080C] prose-headings:font-bold prose-headings:tracking-tight",
                  "prose-h1:text-3xl sm:prose-h1:text-4xl prose-h1:mt-10 prose-h1:mb-5 prose-h1:scroll-mt-28",
                  "prose-h2:text-2xl sm:prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-5 prose-h2:scroll-mt-28 prose-h2:pb-1 prose-h2:border-b prose-h2:border-[#E5E7EB]",
                  "prose-h3:text-xl sm:prose-h3:text-2xl prose-h3:mt-10 prose-h3:mb-4",
                  "prose-h4:text-lg prose-h4:mt-8 prose-h4:mb-3",
                  "prose-h5:text-base prose-h5:mt-6 prose-h5:mb-2",
                  "prose-h6:text-sm prose-h6:uppercase prose-h6:tracking-wide prose-h6:text-[#6B7280] prose-h6:mt-6 prose-h6:mb-2",
                  "prose-p:leading-[1.8] prose-p:my-5",
                  "prose-a:text-[#37489d] prose-a:font-medium prose-a:no-underline hover:prose-a:underline",
                  "prose-strong:text-[#08080C] prose-strong:font-semibold",
                  "prose-ul:my-5 prose-ol:my-5 prose-li:my-1.5 prose-li:marker:text-[#37489d]",
                  "prose-blockquote:border-l-[#37489d] prose-blockquote:border-l-[3px] prose-blockquote:pl-5 prose-blockquote:italic prose-blockquote:text-[#4B5563] prose-blockquote:bg-[#F9FAFB]/80 prose-blockquote:py-1 prose-blockquote:my-6",
                  "prose-hr:border-[#E5E7EB] prose-hr:my-12",
                  "prose-code:text-[#37489d] prose-code:bg-[#F3F4F6] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:text-[0.9em] prose-code:font-medium prose-code:before:content-none prose-code:after:content-none",
                  "prose-pre:bg-[#1a1d2e] prose-pre:text-zinc-100 prose-pre:rounded-xl prose-pre:shadow-inner prose-pre:border prose-pre:border-[#37489d]/20",
                  "prose-img:rounded-xl prose-img:shadow-md prose-img:my-8 prose-img:border prose-img:border-[#E5E7EB]",
                  "prose-figure:my-8 prose-figcaption:text-center prose-figcaption:text-sm prose-figcaption:text-[#6B7280] prose-figcaption:mt-2",
                  "prose-table:w-full prose-table:text-sm prose-table:my-8",
                  "prose-thead:border-b prose-thead:border-[#E5E7EB]",
                  "prose-th:bg-[#F9FAFB] prose-th:text-left prose-th:font-semibold prose-th:text-[#08080C] prose-th:p-3 prose-th:border prose-th:border-[#E5E7EB]",
                  "prose-td:p-3 prose-td:border prose-td:border-[#E5E7EB] prose-tr:border-[#E5E7EB]",
                  "prose-dl:my-5 prose-dt:font-semibold prose-dt:text-[#08080C] prose-dd:ml-4 prose-dd:text-[#4B5563]"
                )}
                dangerouslySetInnerHTML={{ __html: bodyHtml }}
              />
            ) : (
              <p className="text-muted-foreground">Sem conteúdo para exibir.</p>
            )}

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-12 pt-8 border-t border-border">
                <h3 className="text-sm font-semibold mb-3">Tags:</h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="outline">{tag}</Badge>
                  ))}
                </div>
              </div>
            )}
            {/* Back to blog */}
            <div className="mt-12 pt-8 border-t border-[#08080C]/10">
              <Link to="/blog" className="inline-flex items-center gap-2 text-[#37489d] font-medium hover:text-[#37489d]/80 transition-colors">
                <ArrowLeft className="h-4 w-4" />
                Voltar para o blog
              </Link>
            </div>
          </div>
        </article>

        <Footer />
      </div>
    </>
  );
}
