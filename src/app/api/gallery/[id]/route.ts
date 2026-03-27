import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

type GalleryImageDelegate = {
  update: (args: {
    where: { id: string };
    data: Record<string, unknown>;
  }) => Promise<unknown>;
  delete: (args: { where: { id: string } }) => Promise<unknown>;
};

const getGalleryImageDelegate = (): GalleryImageDelegate | undefined => {
  const prismaClient = prisma as unknown as Record<string, unknown>;
  return prismaClient.galleryImage as GalleryImageDelegate | undefined;
};

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const body = await request.json();
    const galleryImageDelegate = getGalleryImageDelegate();

    if (!galleryImageDelegate) {
      return NextResponse.json(
        {
          error:
            "Gallery model is not available. Restart dev server after running prisma generate.",
        },
        { status: 500 }
      );
    }

    const image = await galleryImageDelegate.update({
      where: { id },
      data: {
        ...(body.imageUrl !== undefined && { imageUrl: body.imageUrl }),
        ...(body.category !== undefined && { category: body.category }),
        ...(body.sortOrder !== undefined && { sortOrder: Number(body.sortOrder) }),
        ...(body.isActive !== undefined && { isActive: Boolean(body.isActive) }),
      },
    });

    return NextResponse.json(image);
  } catch (error) {
    console.error("Error updating gallery image:", error);
    return NextResponse.json(
      { error: "Failed to update gallery image" },
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
    const galleryImageDelegate = getGalleryImageDelegate();

    if (!galleryImageDelegate) {
      return NextResponse.json(
        {
          error:
            "Gallery model is not available. Restart dev server after running prisma generate.",
        },
        { status: 500 }
      );
    }

    await galleryImageDelegate.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Gallery image deleted successfully" });
  } catch (error) {
    console.error("Error deleting gallery image:", error);
    return NextResponse.json(
      { error: "Failed to delete gallery image" },
      { status: 500 }
    );
  }
}
