import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  try {
    const statistic = await prisma.statistic.findUnique({
      where: { id },
    });

    if (!statistic) {
      return NextResponse.json(
        { error: "Statistic not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(statistic);
  } catch (error) {
    console.error("Error fetching statistic:", error);
    return NextResponse.json(
      { error: "Failed to fetch statistic" },
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
    const statistic = await prisma.statistic.update({
      where: { id },
      data: {
        ...(body.label && { label: body.label }),
        ...(body.value && { value: body.value }),
        ...(body.icon && { icon: body.icon }),
        ...(body.category && { category: body.category }),
      },
    });
    return NextResponse.json(statistic);
  } catch (error) {
    console.error("Error updating statistic:", error);
    return NextResponse.json(
      { error: "Failed to update statistic" },
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
    await prisma.statistic.delete({
      where: { id },
    });
    return NextResponse.json({ message: "Statistic deleted successfully" });
  } catch (error) {
    console.error("Error deleting statistic:", error);
    return NextResponse.json(
      { error: "Failed to delete statistic" },
      { status: 500 }
    );
  }
}
