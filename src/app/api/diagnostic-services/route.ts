import { NextRequest } from "next/server";
import { jsonNoStore } from "@/lib/jsonNoStore";
import prisma from "@/lib/prisma";

type DiagnosticServiceDelegate = {
  findMany: (args: {
    where: Record<string, unknown>;
    orderBy: Array<Record<string, "asc" | "desc">>;
  }) => Promise<unknown[]>;
  create: (args: {
    data: {
      name: string;
      title: string;
      description: string;
      details: string;
      image: string;
      headerBackgroundImage?: string | null;
      sortOrder: number;
      isActive: boolean;
    };
  }) => Promise<unknown>;
};

const getDiagnosticServiceDelegate = (): DiagnosticServiceDelegate | undefined => {
  const prismaClient = prisma as unknown as Record<string, unknown>;
  return prismaClient.diagnosticService as DiagnosticServiceDelegate | undefined;
};

export async function GET(request: NextRequest) {
  try {
    const includeInactive =
      request.nextUrl.searchParams.get("includeInactive") === "true";
    const diagnosticServiceDelegate = getDiagnosticServiceDelegate();

    if (!diagnosticServiceDelegate) {
      return jsonNoStore([]);
    }

    const services = await diagnosticServiceDelegate.findMany({
      where: includeInactive ? {} : { isActive: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });
    return jsonNoStore(services);
  } catch (error) {
    console.error("Error fetching diagnostic services:", error);
    return jsonNoStore(
      { error: "Failed to fetch diagnostic services" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const diagnosticServiceDelegate = getDiagnosticServiceDelegate();

    if (!diagnosticServiceDelegate) {
      return jsonNoStore(
        {
          error:
            "Diagnostic services model is not available. Restart dev server after running prisma generate.",
        },
        { status: 500 }
      );
    }

    const service = await diagnosticServiceDelegate.create({
      data: {
        name: body.name,
        title: body.title,
        description: body.description,
        details: body.details,
        image: body.image,
        headerBackgroundImage: body.headerBackgroundImage || null,
        sortOrder: Number(body.sortOrder ?? 0),
        isActive: body.isActive ?? true,
      },
    });
    return jsonNoStore(service, { status: 201 });
  } catch (error) {
    console.error("Error creating diagnostic service:", error);
    return jsonNoStore(
      { error: "Failed to create diagnostic service" },
      { status: 500 }
    );
  }
}
