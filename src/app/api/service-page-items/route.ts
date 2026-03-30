import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { isValidServicePageIcon } from "@/lib/servicePageIcons";

export async function GET() {
  try {
    const items = await prisma.servicePageItem.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });
    return NextResponse.json(items);
  } catch (error) {
    console.error("Error fetching service page items:", error);
    return NextResponse.json(
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
      return NextResponse.json({ error: "Invalid icon" }, { status: 400 });
    }
    const heading = typeof body.heading === "string" ? body.heading.trim() : "";
    const description =
      typeof body.description === "string" ? body.description.trim() : "";
    const link = typeof body.link === "string" ? body.link.trim() : "";
    if (!heading || !description || !link) {
      return NextResponse.json(
        { error: "Heading, description, and link are required" },
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
        link,
        sortOrder,
        isActive,
      },
    });
    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error("Error creating service page item:", error);
    return NextResponse.json(
      { error: "Failed to create service page item" },
      { status: 500 }
    );
  }
}
