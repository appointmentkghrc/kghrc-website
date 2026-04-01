import { NextRequest } from "next/server";
import { jsonNoStore } from "@/lib/jsonNoStore";
import prisma from "@/lib/prisma";
import { isValidServicePageIcon } from "@/lib/servicePageIcons";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const body = await request.json();
    const data: {
      icon?: string;
      heading?: string;
      description?: string;
      link?: string;
      sortOrder?: number;
      isActive?: boolean;
    } = {};

    if (body.icon !== undefined) {
      const icon = typeof body.icon === "string" ? body.icon.trim() : "";
      if (!isValidServicePageIcon(icon)) {
        return jsonNoStore({ error: "Invalid icon" }, { status: 400 });
      }
      data.icon = icon;
    }
    if (body.heading !== undefined) {
      data.heading =
        typeof body.heading === "string" ? body.heading.trim() : "";
    }
    if (body.description !== undefined) {
      data.description =
        typeof body.description === "string" ? body.description.trim() : "";
    }
    if (body.link !== undefined) {
      data.link = typeof body.link === "string" ? body.link.trim() : "";
    }
    if (body.sortOrder !== undefined) {
      const n = body.sortOrder;
      data.sortOrder =
        typeof n === "number" && Number.isFinite(n) ? Math.floor(n) : 0;
    }
    if (body.isActive !== undefined) {
      data.isActive = Boolean(body.isActive);
    }

    const item = await prisma.servicePageItem.update({
      where: { id },
      data,
    });
    return jsonNoStore(item);
  } catch (error) {
    console.error("Error updating service page item:", error);
    return jsonNoStore(
      { error: "Failed to update service page item" },
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
    await prisma.servicePageItem.delete({
      where: { id },
    });
    return jsonNoStore({ message: "Deleted successfully" });
  } catch (error) {
    console.error("Error deleting service page item:", error);
    return jsonNoStore(
      { error: "Failed to delete service page item" },
      { status: 500 }
    );
  }
}
