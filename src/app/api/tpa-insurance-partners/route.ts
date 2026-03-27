import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

type TpaInsurancePartnerDelegate = {
  findMany: (args: { orderBy: Array<Record<string, "asc" | "desc">> }) => Promise<unknown[]>;
  create: (args: { data: { name: string; logoUrl: string } }) => Promise<unknown>;
};

const getTpaInsurancePartnerDelegate = (): TpaInsurancePartnerDelegate | undefined => {
  const prismaClient = prisma as unknown as Record<string, unknown>;
  return prismaClient.tpaInsurancePartner as TpaInsurancePartnerDelegate | undefined;
};

export async function GET() {
  try {
    const partnerDelegate = getTpaInsurancePartnerDelegate();
    if (!partnerDelegate) {
      return NextResponse.json([]);
    }

    const partners = await partnerDelegate.findMany({
      orderBy: [{ createdAt: "asc" }],
    });

    return NextResponse.json(partners);
  } catch (error) {
    console.error("Error fetching TPA/Insurance partners:", error);
    return NextResponse.json(
      { error: "Failed to fetch TPA/Insurance partners" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const partnerDelegate = getTpaInsurancePartnerDelegate();
    if (!partnerDelegate) {
      return NextResponse.json(
        {
          error:
            "TPA/Insurance partner model is not available. Restart dev server after running prisma generate.",
        },
        { status: 500 }
      );
    }

    const body = await request.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const logoUrl = typeof body.logoUrl === "string" ? body.logoUrl.trim() : "";

    if (!name || !logoUrl) {
      return NextResponse.json(
        { error: "Both name and logoUrl are required" },
        { status: 400 }
      );
    }

    const partner = await partnerDelegate.create({
      data: { name, logoUrl },
    });

    return NextResponse.json(partner, { status: 201 });
  } catch (error) {
    console.error("Error creating TPA/Insurance partner:", error);
    return NextResponse.json(
      { error: "Failed to create TPA/Insurance partner" },
      { status: 500 }
    );
  }
}
