import { NextRequest } from "next/server";
import { jsonNoStore } from "@/lib/jsonNoStore";
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
      return jsonNoStore(
        { error: "Statistic not found" },
        { status: 404 }
      );
    }

    return jsonNoStore(statistic);
  } catch (error) {
    console.error("Error fetching statistic:", error);
    return jsonNoStore(
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
    return jsonNoStore(statistic);
  } catch (error) {
    console.error("Error updating statistic:", error);
    return jsonNoStore(
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
    return jsonNoStore({ message: "Statistic deleted successfully" });
  } catch (error) {
    console.error("Error deleting statistic:", error);
    return jsonNoStore(
      { error: "Failed to delete statistic" },
      { status: 500 }
    );
  }
}
