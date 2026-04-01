import { NextRequest } from "next/server";
import { jsonNoStore } from "@/lib/jsonNoStore";
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
    sections?: string[] | null;
  } | null>;
  upsert: (args: {
    where: { key: string };
    create: { key: string; title: string; bannerImage: string | null; sections?: string[] };
    update: { title?: string; bannerImage?: string | null; sections?: string[] };
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

type GalleryImageCreateInput = {
  imageUrl: string;
  category: string;
  sortOrder: number;
  isActive: boolean;
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
      return jsonNoStore(
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

    const storedSections = Array.isArray(section?.sections) ? section?.sections : [];
    const imageSections = (images as Array<{ category?: string }>).map((item) =>
      item.category?.trim() || "General"
    );

    return jsonNoStore({
      title: section?.title || DEFAULT_GALLERY_TITLE,
      bannerImage:
        (section?.bannerImage && section.bannerImage.trim()) ||
        DEFAULT_GALLERY_BANNER,
      images,
      sections: Array.from(
        new Set(
          [...storedSections, ...imageSections]
        )
      ).filter((value) => typeof value === "string" && value.trim().length > 0),
    });
  } catch (error) {
    console.error("Error fetching gallery settings:", error);
    return jsonNoStore(
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
      return jsonNoStore(
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

    const sections = Array.isArray(body.sections)
      ? (() => {
          const cleanedSections: string[] = body.sections
            .filter((item: unknown): item is string => typeof item === "string")
            .map((item: string) => item.trim())
            .filter((item: string) => item.length > 0);

          return Array.from(new Set<string>(cleanedSections)).sort((a, b) =>
            a.localeCompare(b)
          );
        })()
      : undefined;

    await gallerySectionDelegate.upsert({
      where: { key: GALLERY_SECTION_KEY },
      create: { key: GALLERY_SECTION_KEY, title, bannerImage, ...(sections ? { sections } : {}) },
      update: { title, bannerImage, ...(sections ? { sections } : {}) },
    });

    return jsonNoStore({ title, bannerImage, ...(sections ? { sections } : {}) });
  } catch (error) {
    console.error("Error updating gallery settings:", error);
    return jsonNoStore(
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
      return jsonNoStore(
        {
          error:
            "Gallery model is not available. Restart dev server after running prisma generate.",
        },
        { status: 500 }
      );
    }

    const category =
      typeof body.category === "string" && body.category.trim().length > 0
        ? body.category.trim()
        : "General";
    const baseSortOrder = Number(body.sortOrder ?? 0);
    const isActive = Boolean(body.isActive ?? true);

    const imageUrls: string[] = Array.isArray(body.imageUrls)
      ? body.imageUrls
          .filter((item: unknown): item is string => typeof item === "string")
          .map((item: string) => item.trim())
          .filter((item: string) => item.length > 0)
      : [];

    if (typeof body.imageUrl === "string" && body.imageUrl.trim().length > 0) {
      imageUrls.unshift(body.imageUrl.trim());
    }

    const uniqueImageUrls: string[] = Array.from(new Set(imageUrls));

    if (uniqueImageUrls.length === 0) {
      return jsonNoStore(
        { error: "imageUrl or imageUrls is required" },
        { status: 400 }
      );
    }

    const payloads: GalleryImageCreateInput[] = uniqueImageUrls.map((imageUrl, index) => ({
      imageUrl,
      category,
      sortOrder: baseSortOrder + index,
      isActive,
    }));

    const createdImages = await Promise.all(
      payloads.map((data) => galleryImageDelegate.create({ data }))
    );

    if (createdImages.length === 1) {
      return jsonNoStore(createdImages[0], { status: 201 });
    }

    return jsonNoStore({ createdCount: createdImages.length, images: createdImages }, { status: 201 });
  } catch (error) {
    console.error("Error creating gallery image:", error);
    return jsonNoStore(
      { error: "Failed to create gallery image" },
      { status: 500 }
    );
  }
}
