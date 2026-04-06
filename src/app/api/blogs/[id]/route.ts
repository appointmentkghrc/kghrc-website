import { NextRequest } from "next/server";
import { jsonNoStore } from "@/lib/jsonNoStore";
import prisma from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  try {
    const blog = await prisma.blog.findUnique({
      where: { id },
    });

    if (!blog) {
      return jsonNoStore({ error: "Blog not found" }, { status: 404 });
    }

    return jsonNoStore(blog);
  } catch (error) {
    console.error("Error fetching blog:", error);
    return jsonNoStore(
      { error: "Failed to fetch blog" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  try {
    const body = await request.json();
    const blog = await prisma.blog.update({
      where: { id },
      data: {
        ...(body.title && { title: body.title }),
        ...(body.slug && { slug: body.slug }),
        ...(body.excerpt && { excerpt: body.excerpt }),
        ...(body.content && { content: body.content }),
        ...(body.author && { author: body.author }),
        ...(body.category && { category: body.category }),
        ...(body.image !== undefined && { image: body.image }),
        ...(body.galleryImages !== undefined && {
          galleryImages: Array.isArray(body.galleryImages) ? body.galleryImages : [],
        }),
        ...(body.status && { status: body.status }),
        ...(body.archived !== undefined && { archived: body.archived }),
        ...(body.publishedDate !== undefined && {
          publishedDate:
            body.publishedDate === null || body.publishedDate === ""
              ? null
              : new Date(body.publishedDate),
        }),
      },
    });
    return jsonNoStore(blog);
  } catch (error) {
    console.error("Error updating blog:", error);
    return jsonNoStore(
      { error: "Failed to update blog" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  try {
    await prisma.blog.delete({
      where: { id },
    });
    return jsonNoStore({ message: "Blog deleted successfully" });
  } catch (error) {
    console.error("Error deleting blog:", error);
    return jsonNoStore(
      { error: "Failed to delete blog" },
      { status: 500 }
    );
  }
}
