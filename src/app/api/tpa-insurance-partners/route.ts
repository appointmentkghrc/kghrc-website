import { NextRequest } from "next/server";
import { jsonNoStore } from "@/lib/jsonNoStore";
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
      return jsonNoStore([]);
    }

    const partners = await partnerDelegate.findMany({
      orderBy: [{ createdAt: "asc" }],
    });

    return jsonNoStore(partners);
  } catch (error) {
    console.error("Error fetching TPA/Insurance partners:", error);
    return jsonNoStore(
      { error: "Failed to fetch TPA/Insurance partners" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const partnerDelegate = getTpaInsurancePartnerDelegate();
    if (!partnerDelegate) {
      return jsonNoStore(
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
      return jsonNoStore(
        { error: "Both name and logoUrl are required" },
        { status: 400 }
      );
    }

    const partner = await partnerDelegate.create({
      data: { name, logoUrl },
    });

    return jsonNoStore(partner, { status: 201 });
  } catch (error) {
    console.error("Error creating TPA/Insurance partner:", error);
    return jsonNoStore(
      { error: "Failed to create TPA/Insurance partner" },
      { status: 500 }
    );
  }
}
