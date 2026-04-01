import { NextRequest } from "next/server";
import { jsonNoStore } from "@/lib/jsonNoStore";
import prisma from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  try {
    const testimonial = await prisma.testimonial.findUnique({
      where: { id },
    });

    if (!testimonial) {
      return jsonNoStore(
        { error: "Testimonial not found" },
        { status: 404 }
      );
    }

    return jsonNoStore(testimonial);
  } catch (error) {
    console.error("Error fetching testimonial:", error);
    return jsonNoStore(
      { error: "Failed to fetch testimonial" },
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
    const testimonial = await prisma.testimonial.update({
      where: { id },
      data: {
        ...(body.name && { name: body.name }),
        ...(body.designation && { designation: body.designation }),
        ...(body.content && { content: body.content }),
        ...(body.rating !== undefined && { rating: body.rating }),
        ...(body.image !== undefined && { image: body.image || null }),
      },
    });
    return jsonNoStore(testimonial);
  } catch (error) {
    console.error("Error updating testimonial:", error);
    return jsonNoStore(
      { error: "Failed to update testimonial" },
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
    await prisma.testimonial.delete({
      where: { id },
    });
    return jsonNoStore({ message: "Testimonial deleted successfully" });
  } catch (error) {
    console.error("Error deleting testimonial:", error);
    return jsonNoStore(
      { error: "Failed to delete testimonial" },
      { status: 500 }
    );
  }
}
