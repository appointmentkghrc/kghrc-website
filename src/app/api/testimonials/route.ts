import { NextRequest } from "next/server";
import { jsonNoStore } from "@/lib/jsonNoStore";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const testimonials = await prisma.testimonial.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return jsonNoStore(testimonials);
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return jsonNoStore(
      { error: "Failed to fetch testimonials" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const testimonial = await prisma.testimonial.create({
      data: {
        name: body.name,
        designation: body.designation,
        content: body.content,
        rating: body.rating || 5,
        image: body.image || null,
      },
    });
    return jsonNoStore(testimonial, { status: 201 });
  } catch (error) {
    console.error("Error creating testimonial:", error);
    return jsonNoStore(
      { error: "Failed to create testimonial" },
      { status: 500 }
    );
  }
}
