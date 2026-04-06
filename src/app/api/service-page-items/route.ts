import { NextRequest } from "next/server";
import { jsonNoStore } from "@/lib/jsonNoStore";
import prisma from "@/lib/prisma";
import { isValidServicePageIcon } from "@/lib/servicePageIcons";

export async function GET() {
  try {
    const items = await prisma.servicePageItem.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });
    return jsonNoStore(items);
  } catch (error) {
    console.error("Error fetching service page items:", error);
    return jsonNoStore(
      { error: "Failed to fetch service page items" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const icon = typeof body.icon === "string" ? body.icon.trim() : "";
    if (!isValidServicePageIcon(icon)) {
      return jsonNoStore({ error: "Invalid icon" }, { status: 400 });
    }
    const heading = typeof body.heading === "string" ? body.heading.trim() : "";
    const description =
      typeof body.description === "string" ? body.description.trim() : "";
    const link = typeof body.link === "string" ? body.link.trim() : "";
    const detailPageContent =
      typeof body.detailPageContent === "string"
        ? body.detailPageContent.trim()
        : "";
    const detailPageImage =
      typeof body.detailPageImage === "string" && body.detailPageImage.trim()
        ? body.detailPageImage.trim()
        : null;
    const detailPageHeaderImage =
      typeof body.detailPageHeaderImage === "string" &&
      body.detailPageHeaderImage.trim()
        ? body.detailPageHeaderImage.trim()
        : null;
    if (!heading || !description) {
      return jsonNoStore(
        { error: "Heading and description are required" },
        { status: 400 }
      );
    }
    if (!detailPageContent && !link) {
      return jsonNoStore(
        {
          error:
            "Either add a link, or fill the detail page content so the card opens a custom page",
        },
        { status: 400 }
      );
    }
    const sortOrder =
      typeof body.sortOrder === "number" && Number.isFinite(body.sortOrder)
        ? Math.floor(body.sortOrder)
        : 0;
    const isActive =
      typeof body.isActive === "boolean" ? body.isActive : true;

    const item = await prisma.servicePageItem.create({
      data: {
        icon,
        heading,
        description,
        link: link || "",
        detailPageContent,
        detailPageImage,
        detailPageHeaderImage,
        sortOrder,
        isActive,
      },
    });
    return jsonNoStore(item, { status: 201 });
  } catch (error) {
    console.error("Error creating service page item:", error);
    return jsonNoStore(
      { error: "Failed to create service page item" },
      { status: 500 }
    );
  }
}
