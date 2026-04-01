"use client";

import { apiFetch } from "@/lib/apiFetch";
import { useState, useMemo, useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import MarkdownGuide from "./MarkdownGuide";
import { UploadButton } from "@/lib/uploadthing";
import { optimizeImagesForUpload } from "@/lib/imageUploadOptimization";
import {
  blogDisplayIso,
  dateInputToIso,
  isoToDateInput,
  todayDateInputValue,
} from "@/lib/blogDisplayDate";
import { DEFAULT_SITE_CONTACT_SETTINGS } from "@/lib/siteSettings";
import "easymde/dist/easymde.min.css";

interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  image: string;
  status: "published" | "draft";
  archived: boolean;
  publishedDate?: string | null;
  createdAt: string;
  updatedAt: string;
}

const SimpleMDE = dynamic(() => import("react-simplemde-editor"), { ssr: false });

export default function BlogsManager() {
  const router = useRouter();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "published" | "draft" | "archived">("all");
  const [showPreview, setShowPreview] = useState(false);
  const [previewBlog, setPreviewBlog] = useState<Blog | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [blogPageHeroImage, setBlogPageHeroImage] = useState(
    DEFAULT_SITE_CONTACT_SETTINGS.blogPageHeroImage
  );
  const [savingBlogHero, setSavingBlogHero] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    author: "",
    category: "",
    image: "",
    status: "draft" as "published" | "draft",
    publishedDate: todayDateInputValue(),
  });

  const slugify = (value: string) =>
    value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

  useEffect(() => {
    fetchBlogs();
    const loadBlogHero = async () => {
      try {
        const res = await apiFetch("/api/site-settings");
        if (!res.ok) return;
        const data = await res.json();
        if (typeof data.blogPageHeroImage === "string" && data.blogPageHeroImage.trim()) {
          setBlogPageHeroImage(data.blogPageHeroImage.trim());
        }
      } catch (e) {
        console.error("Error loading blog page hero:", e);
      }
    };
    loadBlogHero();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await apiFetch("/api/blogs");
      if (!response.ok) throw new Error("Failed to fetch blogs");
      const data = await response.json();
      setBlogs(data);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      alert("Failed to load blogs");
    } finally {
      setLoading(false);
    }
  };

  const editorOptions = useMemo(() => {
    return {
      spellChecker: false,
      placeholder: "Write your blog content in markdown...",
      status: false,
      toolbar: [
        "bold",
        "italic",
        "heading",
        "|" as const,
        "quote",
        "unordered-list",
        "ordered-list",
        "|" as const,
        "link",
        "image",
        "|" as const,
        "preview",
        "side-by-side",
        "fullscreen",
        "|" as const,
        "guide",
      ] as const,
    };
  }, []);

  const handleAdd = () => {
    setEditingBlog(null);
    setFormData({
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      author: "",
      category: "",
      image: "",
      status: "draft",
      publishedDate: todayDateInputValue(),
    });
    setIsModalOpen(true);
  };

  const handleEdit = (blog: Blog) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title,
      slug: blog.slug,
      excerpt: blog.excerpt,
      content: blog.content,
      author: blog.author,
      category: blog.category,
      image: blog.image,
      status: blog.status,
      publishedDate: isoToDateInput(
        blog.publishedDate ?? blog.createdAt
      ),
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog? This action cannot be undone.")) {
      return;
    }
    
    try {
      const response = await apiFetch(`/api/blogs/${id}`, {
        method: "DELETE",
      });
      
      if (!response.ok) throw new Error("Failed to delete blog");
      
      setBlogs(blogs.filter((b) => b.id !== id));
      router.refresh();
      alert("Blog deleted successfully!");
    } catch (error) {
      console.error("Error deleting blog:", error);
      alert("Failed to delete blog");
    }
  };

  const handleArchive = async (id: string) => {
    const blog = blogs.find((b) => b.id === id);
    if (!blog) return;

    try {
      const response = await apiFetch(`/api/blogs/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ archived: !blog.archived }),
      });

      if (!response.ok) throw new Error("Failed to archive blog");
      
      const updatedBlog = await response.json();
      setBlogs(blogs.map((b) => (b.id === id ? updatedBlog : b)));
      router.refresh();
    } catch (error) {
      console.error("Error archiving blog:", error);
      alert("Failed to archive blog");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingBlog) {
        const response = await apiFetch(`/api/blogs/${editingBlog.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            publishedDate: dateInputToIso(formData.publishedDate),
          }),
        });

        if (!response.ok) throw new Error("Failed to update blog");
        
        const updatedBlog = await response.json();
        setBlogs(blogs.map((b) => (b.id === editingBlog.id ? updatedBlog : b)));
        router.refresh();
        alert("Blog updated successfully!");
      } else {
        const response = await apiFetch("/api/blogs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            publishedDate: dateInputToIso(formData.publishedDate),
          }),
        });

        if (!response.ok) throw new Error("Failed to create blog");
        
        const newBlog = await response.json();
        setBlogs([newBlog, ...blogs]);
        router.refresh();
        alert("Blog created successfully!");
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving blog:", error);
      alert("Failed to save blog");
    } finally {
      setSubmitting(false);
    }
  };

  const handleImageUpload = (res: any) => {
    if (res && res[0]) {
      setFormData({ ...formData, image: res[0].url });
    }
  };

  const handleSaveBlogHero = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSavingBlogHero(true);
      const res = await apiFetch("/api/site-settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blogPageHeroImage }),
      });
      if (!res.ok) throw new Error("Failed to save");
      const data = await res.json();
      if (typeof data.blogPageHeroImage === "string") {
        setBlogPageHeroImage(data.blogPageHeroImage);
      }
      router.refresh();
      alert("Blog listing page hero image saved!");
    } catch (err) {
      console.error(err);
      alert("Failed to save blog page hero image");
    } finally {
      setSavingBlogHero(false);
    }
  };

  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = 
      filterStatus === "all" || 
      (filterStatus === "archived" && blog.archived) ||
      (filterStatus !== "archived" && !blog.archived && blog.status === filterStatus);
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <form
        onSubmit={handleSaveBlogHero}
        className="bg-white rounded-lg shadow-md p-5 space-y-3 border border-gray-100"
      >
        <h3 className="text-lg font-semibold text-gray-800">Blog listing page hero</h3>
        <p className="text-sm text-gray-600">
          Header background on the public <code className="text-xs bg-gray-100 px-1 rounded">/blog</code> page.
        </p>
        <input
          type="text"
          value={blogPageHeroImage}
          onChange={(e) => setBlogPageHeroImage(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Image URL"
        />
        <div>
          <span className="block text-sm text-gray-600 mb-1">Or upload</span>
          <UploadButton
            className="ut-primary-upload"
            endpoint="heroSectionImage"
            onBeforeUploadBegin={(files) =>
              optimizeImagesForUpload(files, { maxDimension: 2200, quality: 0.82 })
            }
            onClientUploadComplete={(res) => {
              if (res?.[0]?.url) setBlogPageHeroImage(res[0].url);
            }}
            onUploadError={(error: Error) => alert(`Upload Error: ${error.message}`)}
          />
        </div>
        <div className="h-36 rounded-lg overflow-hidden border border-gray-200">
          <img src={blogPageHeroImage} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="flex justify-between gap-2">
          <button
            type="button"
            onClick={() =>
              setBlogPageHeroImage(DEFAULT_SITE_CONTACT_SETTINGS.blogPageHeroImage)
            }
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
          >
            Reset to default
          </button>
          <button
            type="submit"
            disabled={savingBlogHero}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {savingBlogHero ? "Saving..." : "Save hero image"}
          </button>
        </div>
      </form>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Blogs Management</h2>
        <button
          onClick={handleAdd}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <i className="fas fa-plus"></i>
          Add Blog
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4 flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search blogs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as "all" | "published" | "draft" | "archived")}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredBlogs.map((blog) => (
          <div key={blog.id} className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow ${blog.archived ? 'opacity-60' : ''}`}>
            <div className="h-48 bg-gray-200 flex items-center justify-center relative">
              {blog.image ? (
                <img src={blog.image} alt={blog.title} className="w-full h-full object-cover" />
              ) : (
                <i className="fas fa-image text-gray-400 text-4xl"></i>
              )}
              {blog.archived && (
                <div className="absolute top-2 right-2 bg-gray-900 text-white px-3 py-1 rounded-full text-xs font-medium">
                  <i className="fas fa-archive mr-1"></i>ARCHIVED
                </div>
              )}
            </div>
            <div className="p-6">
              <div className="flex items-center gap-2 mb-3">
                {!blog.archived && (
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    blog.status === "published"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}>
                    {blog.status}
                  </span>
                )}
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                  {blog.category}
                </span>
              </div>
              <h3 className="font-semibold text-gray-800 text-xl mb-2 line-clamp-2">{blog.title}</h3>
              <div className="text-gray-600 text-sm mb-4 line-clamp-2">
                <ReactMarkdown>{blog.excerpt}</ReactMarkdown>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span><i className="fas fa-user mr-2"></i>{blog.author}</span>
                <span><i className="fas fa-calendar mr-2"></i>{new Date(blogDisplayIso(blog)).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
                <button
                  onClick={() => setPreviewBlog(blog)}
                  className="px-4 py-2 text-secondary hover:bg-secondary/10 rounded-lg transition-colors"
                  title="Preview"
                >
                  <i className="fas fa-eye mr-2"></i>Preview
                </button>
                {!blog.archived && (
                  <button
                    onClick={() => handleEdit(blog)}
                    className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <i className="fas fa-edit mr-2"></i>Edit
                  </button>
                )}
                <button
                  onClick={() => handleArchive(blog.id)}
                  className={`px-4 py-2 ${blog.archived ? 'text-orange-600 hover:bg-orange-50' : 'text-gray-600 hover:bg-gray-50'} rounded-lg transition-colors`}
                  title={blog.archived ? "Unarchive" : "Archive"}
                >
                  <i className={`fas fa-${blog.archived ? 'folder-open' : 'archive'} mr-2`}></i>
                  {blog.archived ? 'Unarchive' : 'Archive'}
                </button>
                <button
                  onClick={() => handleDelete(blog.id)}
                  className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete"
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
        </>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-800">
                {editingBlog ? "Edit Blog" : "Add New Blog"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => {
                      const title = e.target.value;
                      setFormData((prev) => ({
                        ...prev,
                        title,
                        slug: prev.slug || slugify(title),
                      }));
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Slug</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        slug: slugify(e.target.value),
                      }))
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Excerpt</label>
                <textarea
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                ></textarea>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-4">
                    <label className="block text-sm font-medium text-gray-700">Content (Markdown)</label>
                    <MarkdownGuide />
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPreview(!showPreview)}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    <i className={`fas fa-${showPreview ? 'edit' : 'eye'} mr-1`}></i>
                    {showPreview ? 'Edit' : 'Preview'}
                  </button>
                </div>
                {showPreview ? (
                  <div className="w-full min-h-[300px] px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 prose prose-sm max-w-none overflow-auto">
                    <ReactMarkdown>{formData.content || "*No content yet*"}</ReactMarkdown>
                  </div>
                ) : (
                  <SimpleMDE
                    value={formData.content}
                    onChange={(value) => setFormData({ ...formData, content: value })}
                    options={editorOptions}
                  />
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Post date
                </label>
                <input
                  type="date"
                  value={formData.publishedDate}
                  onChange={(e) =>
                    setFormData({ ...formData, publishedDate: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Shown on the blog; order in lists uses this date.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Author</label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Upload Image</label>
                <UploadButton
                  className="ut-primary-upload"
                  endpoint="blogImage"
                  onClientUploadComplete={handleImageUpload}
                  onUploadError={(error: Error) => {
                    alert(`Upload Error: ${error.message}`);
                  }}
                />
                {formData.image && (
                  <div className="mt-2 h-32 bg-gray-100 rounded-lg overflow-hidden">
                    <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as "published" | "draft" })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? "Saving..." : editingBlog ? "Update" : "Add"} Blog
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {previewBlog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center z-10">
              <h3 className="text-xl font-semibold text-gray-800">Blog Preview</h3>
              <button
                onClick={() => setPreviewBlog(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>
            
            <div className="bg-[#f7f7f7] p-8">
              <div className="max-w-4xl mx-auto">
                <div className="overflow-hidden rounded-lg mb-8">
                  {previewBlog.image ? (
                    <img
                      src={previewBlog.image}
                      alt={previewBlog.title}
                      className="w-full h-96 object-cover"
                    />
                  ) : (
                    <div className="w-full h-96 bg-gray-200 flex items-center justify-center">
                      <i className="fas fa-image text-gray-400 text-6xl"></i>
                    </div>
                  )}
                </div>

                <div className="bg-white rounded-lg shadow-md p-8">
                  <div className="text-sm mb-6">
                    <span className="text-primary font-semibold mr-4">{previewBlog.author.toUpperCase()}</span>
                    <span className="text-gray-500">{new Date(blogDisplayIso(previewBlog)).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()}</span>
                  </div>

                  <h2 className="text-4xl font-semibold mb-6 text-gray-800">
                    {previewBlog.title}
                  </h2>

                  <div className="prose prose-lg max-w-none text-gray-600 mb-8">
                    <ReactMarkdown>{previewBlog.content}</ReactMarkdown>
                  </div>

                  <div className="flex flex-wrap gap-3 pt-6 border-t border-gray-200">
                    <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                      {previewBlog.category}
                    </span>
                    <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                      previewBlog.status === "published"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}>
                      {previewBlog.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
