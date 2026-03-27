import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const GALLERY_SECTION_KEY = "latest_gallery";
const DEFAULT_GALLERY_TITLE = "Latest Gallery";
const DEFAULT_GALLERY_BANNER =
  "https://validthemes.net/site-template/medihub/assets/img/banner/5.jpg";

type GallerySectionDelegate = {
  findUnique: (args: { where: { key: string } }) => Promise<{
    key: string;
    title: string;
    bannerImage: string | null;
  } | null>;
  upsert: (args: {
    where: { key: string };
    create: { key: string; title: string; bannerImage: string | null };
    update: { title?: string; bannerImage?: string | null };
  }) => Promise<unknown>;
};

type GalleryImageDelegate = {
  findMany: (args: {
    where: Record<string, unknown>;
    orderBy: Array<Record<string, "asc" | "desc">>;
  }) => Promise<unknown[]>;
  create: (args: {
    data: {
      imageUrl: string;
      category: string;
      sortOrder: number;
      isActive: boolean;
    };
  }) => Promise<unknown>;
};

const getGallerySectionDelegate = (): GallerySectionDelegate | undefined => {
  const prismaClient = prisma as unknown as Record<string, unknown>;
  return prismaClient.gallerySection as GallerySectionDelegate | undefined;
};

const getGalleryImageDelegate = (): GalleryImageDelegate | undefined => {
  const prismaClient = prisma as unknown as Record<string, unknown>;
  return prismaClient.galleryImage as GalleryImageDelegate | undefined;
};

export async function GET(request: NextRequest) {
  try {
    const includeInactive =
      request.nextUrl.searchParams.get("includeInactive") === "true";
    const gallerySectionDelegate = getGallerySectionDelegate();
    const galleryImageDelegate = getGalleryImageDelegate();

    if (!gallerySectionDelegate || !galleryImageDelegate) {
      return NextResponse.json(
        {
          title: DEFAULT_GALLERY_TITLE,
          bannerImage: DEFAULT_GALLERY_BANNER,
          images: [],
        },
        { status: 200 }
      );
    }

    const [section, images] = await Promise.all([
      gallerySectionDelegate.findUnique({
        where: { key: GALLERY_SECTION_KEY },
      }),
      galleryImageDelegate.findMany({
        where: includeInactive ? {} : { isActive: true },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      }),
    ]);

    return NextResponse.json({
      title: section?.title || DEFAULT_GALLERY_TITLE,
      bannerImage:
        (section?.bannerImage && section.bannerImage.trim()) ||
        DEFAULT_GALLERY_BANNER,
      images,
      sections: Array.from(
        new Set(
          (images as Array<{ category?: string }>).map((item) =>
            item.category?.trim() || "General"
          )
        )
      ),
    });
  } catch (error) {
    console.error("Error fetching gallery settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch gallery settings" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const gallerySectionDelegate = getGallerySectionDelegate();

    if (!gallerySectionDelegate) {
      return NextResponse.json(
        {
          error:
            "Gallery model is not available. Restart dev server after running prisma generate.",
        },
        { status: 500 }
      );
    }

    const title =
      typeof body.title === "string" && body.title.trim().length > 0
        ? body.title.trim()
        : DEFAULT_GALLERY_TITLE;

    const bannerImage =
      typeof body.bannerImage === "string" && body.bannerImage.trim().length > 0
        ? body.bannerImage.trim()
        : DEFAULT_GALLERY_BANNER;

    await gallerySectionDelegate.upsert({
      where: { key: GALLERY_SECTION_KEY },
      create: { key: GALLERY_SECTION_KEY, title, bannerImage },
      update: { title, bannerImage },
    });

    return NextResponse.json({ title, bannerImage });
  } catch (error) {
    console.error("Error updating gallery settings:", error);
    return NextResponse.json(
      { error: "Failed to update gallery settings" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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

    if (typeof body.imageUrl !== "string" || body.imageUrl.trim().length === 0) {
      return NextResponse.json({ error: "imageUrl is required" }, { status: 400 });
    }

    const image = await galleryImageDelegate.create({
      data: {
        imageUrl: body.imageUrl.trim(),
        category:
          typeof body.category === "string" && body.category.trim().length > 0
            ? body.category.trim()
            : "General",
        sortOrder: Number(body.sortOrder ?? 0),
        isActive: body.isActive ?? true,
      },
    });

    return NextResponse.json(image, { status: 201 });
  } catch (error) {
    console.error("Error creating gallery image:", error);
    return NextResponse.json(
      { error: "Failed to create gallery image" },
      { status: 500 }
    );
  }
}
