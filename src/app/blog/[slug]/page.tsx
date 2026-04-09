"use client";

import { apiFetch } from "@/lib/apiFetch";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import Link from "next/link";
import { blogDisplayIso } from "@/lib/blogDisplayDate";
import { blogCardImage, blogHeroSlides } from "@/lib/blogImages";
import BlogImageCarousel from "@/components/BlogImageCarousel";

interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  image: string;
  galleryImages?: string[];
  status: string;
  archived: boolean;
  publishedDate?: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function BlogDetailsPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedBlogs, setRelatedBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    if (slug) {
      fetchBlogBySlug();
    }
  }, [slug]);

  const fetchBlogBySlug = async () => {
    try {
      setLoading(true);
      const response = await apiFetch("/api/blogs");
      if (!response.ok) throw new Error("Failed to fetch blogs");
      const data = await response.json();
      
      const foundBlog = data.find(
        (b: Blog) => b.slug === slug && b.status === "published" && !b.archived
      );
      
      if (foundBlog) {
        setBlog(foundBlog);
        
        // Get related blogs from same category
        const related = data
          .filter(
            (b: Blog) =>
              b.category === foundBlog.category &&
              b.id !== foundBlog.id &&
              b.status === "published" &&
              !b.archived
          )
          .slice(0, 3);
        setRelatedBlogs(related);
      }
    } catch (error) {
      console.error("Error fetching blog:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Blog Not Found</h1>
        <p className="text-gray-600 mb-8">The blog post you're looking for doesn't exist.</p>
        <Link href="/blog">
          <button className="bg-primary text-white px-8 py-3 rounded-full hover:bg-[#00c2c0] transition">
            Back to Blog
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <section className="relative h-[400px] flex items-center justify-center text-white">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url(https://validthemes.net/site-template/medihub/assets/img/banner/4.jpg)",
          }}
        />
        <div className="absolute inset-0 bg-black/60" />

        <div className="relative z-10 text-center">
          <h1 className="text-5xl font-semibold mb-4">Blog Details</h1>
          <div className="bg-black/40 px-6 py-2 rounded-md text-sm">
            <Link href="/" className="hover:text-primary transition-colors">
              HOME
            </Link>{" "}
            ›{" "}
            <Link href="/blog" className="hover:text-primary transition-colors">
              BLOG
            </Link>{" "}
            › <span className="text-white/90">{blog.slug.toUpperCase().replace(/-/g, " ")}</span>
          </div>
        </div>
      </section>

      <section className="bg-[#f7f7f7] py-24">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8">
            <BlogImageCarousel images={blogHeroSlides(blog)} title={blog.title} />

            <div className="text-sm mb-6">
              <span className="text-primary font-semibold mr-4">{blog.author.toUpperCase()}</span>
              <span className="text-gray-500">
                {new Date(blogDisplayIso(blog)).toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                }).toUpperCase()}
              </span>
            </div>

            <h2 className="text-4xl font-semibold mb-6">{blog.title}</h2>

            <div className="prose prose-lg max-w-none text-gray-600 mb-8">
              <ReactMarkdown>{blog.content}</ReactMarkdown>
            </div>

            <div className="flex flex-wrap gap-3 mb-12 pt-6 border-t border-gray-200">
              <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                {blog.category}
              </span>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h4 className="font-semibold mb-4">SEARCH</h4>
              <div className="flex gap-0">
                <input
                  className="flex-1 border border-gray-300 p-3 rounded-l-lg focus:outline-none focus:border-primary"
                  placeholder="Search..."
                />
                <button className="bg-black text-white px-4 py-3 rounded-r-lg hover:bg-gray-800 transition whitespace-nowrap shrink-0">
                  <i className="fas fa-search"></i>
                </button>
              </div>
            </div>

            {relatedBlogs.length > 0 && (
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h4 className="font-semibold mb-4">RELATED POSTS</h4>
                <div className="space-y-4">
                  {relatedBlogs.map((relatedBlog) => (
                    <Link
                      key={relatedBlog.id}
                      href={`/blog/${relatedBlog.slug}`}
                      className="flex gap-3 group cursor-pointer"
                    >
                      {blogCardImage(relatedBlog) && (
                        <img
                          src={blogCardImage(relatedBlog)}
                          alt={relatedBlog.title}
                          className="w-20 h-20 object-cover rounded"
                        />
                      )}
                      <div className="flex-1">
                        <h5 className="text-sm font-medium group-hover:text-primary transition line-clamp-2">
                          {relatedBlog.title}
                        </h5>
                        <div className="text-gray-400 text-xs mt-1">
                          {new Date(blogDisplayIso(relatedBlog)).toLocaleDateString("en-US", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h4 className="font-semibold mb-4">CATEGORIES</h4>
              <Link
                href="/blog"
                className="flex justify-between py-2 hover:text-primary cursor-pointer transition"
              >
                All Posts <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}