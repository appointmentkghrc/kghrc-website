"use client";

import { apiFetch } from "@/lib/apiFetch";
import { useEffect, useState } from "react";
import Link from "next/link";
import { blogDisplayIso } from "@/lib/blogDisplayDate";

interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  image?: string;
  status: string;
  archived: boolean;
  publishedDate?: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function RecentBlogsSection() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentBlogs = async () => {
      try {
        setLoading(true);
        const response = await apiFetch("/api/blogs");
        if (!response.ok) throw new Error("Failed to fetch blogs");
        const data: Blog[] = await response.json();

        const publishedBlogs = data
          .filter((blog) => blog.status === "published" && !blog.archived)
          .sort(
            (a, b) =>
              new Date(blogDisplayIso(b)).getTime() -
              new Date(blogDisplayIso(a)).getTime()
          )
          .slice(0, 3);

        setBlogs(publishedBlogs);
      } catch (error) {
        console.error("Error fetching recent blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentBlogs();
  }, []);

  if (loading || blogs.length === 0) {
    return null;
  }

  return (
    <section className="bg-white py-20">
      <div className="max-w-6xl mx-auto px-6 md:px-10 lg:px-0">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-semibold mb-4">Recent Blogs</h2>
          <p className="max-w-2xl mx-auto text-gray-500">
            Stay informed with the latest health insights, hospital updates, and
            expert guidance from our medical team.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <article
              key={blog.id}
              className="bg-white shadow-md rounded-lg overflow-hidden group"
            >
              {blog.image && (
                <div className="overflow-hidden">
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-60 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
              )}

              <div className="p-6">
                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                  <span className="uppercase text-primary font-semibold">
                    {blog.author}
                  </span>
                  <span>
                    {new Date(blogDisplayIso(blog)).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>

                <h3 className="text-lg font-semibold mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                  <Link href={`/blog/${blog.slug}`}>{blog.title}</Link>
                </h3>

                <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                  {blog.excerpt}
                </p>

                <Link
                  href={`/blog/${blog.slug}`}
                  className="text-sm font-semibold text-secondary hover:underline"
                >
                  READ MORE
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

