import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

type DiagnosticServiceDelegate = {
  findUnique: (args: { where: { id: string } }) => Promise<unknown | null>;
  update: (args: {
    where: { id: string };
    data: Record<string, unknown>;
  }) => Promise<unknown>;
  delete: (args: { where: { id: string } }) => Promise<unknown>;
};

const getDiagnosticServiceDelegate = (): DiagnosticServiceDelegate | undefined => {
  const prismaClient = prisma as unknown as Record<string, unknown>;
  return prismaClient.diagnosticService as DiagnosticServiceDelegate | undefined;
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const diagnosticServiceDelegate = getDiagnosticServiceDelegate();

    if (!diagnosticServiceDelegate) {
      return NextResponse.json(
        {
          error:
            "Diagnostic services model is not available. Restart dev server after running prisma generate.",
        },
        { status: 500 }
      );
    }

    const service = await diagnosticServiceDelegate.findUnique({
      where: { id },
    });

    if (!service) {
      return NextResponse.json(
        { error: "Diagnostic service not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(service);
  } catch (error) {
    console.error("Error fetching diagnostic service:", error);
    return NextResponse.json(
      { error: "Failed to fetch diagnostic service" },
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
    const diagnosticServiceDelegate = getDiagnosticServiceDelegate();

    if (!diagnosticServiceDelegate) {
      return NextResponse.json(
        {
          error:
            "Diagnostic services model is not available. Restart dev server after running prisma generate.",
        },
        { status: 500 }
      );
    }

    const service = await diagnosticServiceDelegate.update({
      where: { id },
      data: {
        ...(body.name !== undefined && { name: body.name }),
        ...(body.title !== undefined && { title: body.title }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.details !== undefined && { details: body.details }),
        ...(body.image !== undefined && { image: body.image }),
        ...(body.headerBackgroundImage !== undefined && {
          headerBackgroundImage: body.headerBackgroundImage || null,
        }),
        ...(body.sortOrder !== undefined && { sortOrder: Number(body.sortOrder) }),
        ...(body.isActive !== undefined && { isActive: Boolean(body.isActive) }),
      },
    });
    return NextResponse.json(service);
  } catch (error) {
    console.error("Error updating diagnostic service:", error);
    return NextResponse.json(
      { error: "Failed to update diagnostic service" },
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
    const diagnosticServiceDelegate = getDiagnosticServiceDelegate();

    if (!diagnosticServiceDelegate) {
      return NextResponse.json(
        {
          error:
            "Diagnostic services model is not available. Restart dev server after running prisma generate.",
        },
        { status: 500 }
      );
    }

    await diagnosticServiceDelegate.delete({
      where: { id },
    });
    return NextResponse.json({
      message: "Diagnostic service deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting diagnostic service:", error);
    return NextResponse.json(
      { error: "Failed to delete diagnostic service" },
      { status: 500 }
    );
  }
}
