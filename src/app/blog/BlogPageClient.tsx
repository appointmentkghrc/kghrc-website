"use client";

import PageHeroHeader from "@/components/PageHeroHeader";
import { apiFetch } from "@/lib/apiFetch";
import { useEffect, useState } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { blogDisplayIso } from "@/lib/blogDisplayDate";

interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  image: string;
  status: string;
  archived: boolean;
  publishedDate?: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function BlogPageClient({
  heroBackgroundImage,
}: {
  heroBackgroundImage: string;
}) {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await apiFetch("/api/blogs");
      if (!response.ok) throw new Error("Failed to fetch blogs");
      const data = await response.json();

      const publishedBlogs = data
        .filter(
          (blog: Blog) => blog.status === "published" && !blog.archived
        )
        .sort(
          (a: Blog, b: Blog) =>
            new Date(blogDisplayIso(b)).getTime() -
            new Date(blogDisplayIso(a)).getTime()
        );
      setBlogs(publishedBlogs);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <PageHeroHeader
        imageUrl={heroBackgroundImage}
        className="h-[500px]"
        fixedHeightClass="h-[500px]"
        overlayClassName="bg-black/50"
      >
        <div className="text-center">
          <h1 className="text-5xl font-semibold mb-6">Latest Blog</h1>

          <div className="bg-black/40 px-6 py-3 rounded-md text-sm tracking-wide inline-block">
            HOME › BLOG
          </div>
        </div>
      </PageHeroHeader>

      <section className="relative z-20 bg-white -mt-24 pt-24 pb-32">
        <div className="max-w-[1200px] mx-auto px-6">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-xl">No blogs available yet.</p>
            </div>
          ) : (
            <div className="space-y-16">
              {blogs.map((blog) => (
                <article
                  key={blog.id}
                  className="bg-white rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 p-8"
                >
                  {blog.image && (
                    <div className="mb-8 overflow-hidden rounded-lg group">
                      <img
                        src={blog.image}
                        alt={blog.title}
                        className="w-full h-[400px] object-cover transition-all duration-700 ease-out scale-105 group-hover:scale-110 group-hover:translate-x-4"
                      />
                    </div>
                  )}

                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-primary font-semibold text-sm uppercase">
                      {blog.author}
                    </span>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-500 text-sm">
                      {new Date(blogDisplayIso(blog)).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                    <span className="text-gray-400">•</span>
                    <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-full">
                      {blog.category}
                    </span>
                  </div>

                  <h2 className="text-4xl font-semibold mb-4 hover:text-primary transition-colors">
                    <Link href={`/blog/${blog.slug}`}>{blog.title}</Link>
                  </h2>

                  <div className="text-gray-600 leading-relaxed mb-6 line-clamp-3">
                    {blog.excerpt}
                  </div>

                  <Link href={`/blog/${blog.slug}`}>
                    <button className="bg-secondary text-white px-8 py-3 rounded-full hover:bg-secondary/90 transition-colors">
                      READ MORE
                    </button>
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
