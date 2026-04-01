import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

function displayTime(b: {
  publishedDate: Date | null;
  createdAt: Date;
}) {
  return (b.publishedDate ?? b.createdAt).getTime();
}

export async function GET() {
  try {
    const blogs = await prisma.blog.findMany();
    blogs.sort((a, b) => displayTime(b) - displayTime(a));
    return NextResponse.json(blogs);
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json(
      { error: "Failed to fetch blogs" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const publishedDate =
      body.publishedDate != null && body.publishedDate !== ""
        ? new Date(body.publishedDate)
        : new Date();

    const blog = await prisma.blog.create({
      data: {
        title: body.title,
        slug: body.slug,
        excerpt: body.excerpt,
        content: body.content,
        author: body.author,
        category: body.category,
        image: body.image,
        status: body.status || "draft",
        archived: false,
        publishedDate,
      },
    });
    return NextResponse.json(blog, { status: 201 });
  } catch (error) {
    console.error("Error creating blog:", error);
    return NextResponse.json(
      { error: "Failed to create blog" },
      { status: 500 }
    );
  }
}
