import { NextRequest } from "next/server";
import { jsonNoStore } from "@/lib/jsonNoStore";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const statistics = await prisma.statistic.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return jsonNoStore(statistics);
  } catch (error) {
    console.error("Error fetching statistics:", error);
    return jsonNoStore(
      { error: "Failed to fetch statistics" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const statistic = await prisma.statistic.create({
      data: {
        label: body.label,
        value: body.value,
        icon: body.icon,
        category: body.category,
      },
    });
    return jsonNoStore(statistic, { status: 201 });
  } catch (error) {
    console.error("Error creating statistic:", error);
    return jsonNoStore(
      { error: "Failed to create statistic" },
      { status: 500 }
    );
  }
}
