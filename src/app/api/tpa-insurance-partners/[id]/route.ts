import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

type TpaInsurancePartnerDelegate = {
  delete: (args: { where: { id: string } }) => Promise<unknown>;
};

const getTpaInsurancePartnerDelegate = (): TpaInsurancePartnerDelegate | undefined => {
  const prismaClient = prisma as unknown as Record<string, unknown>;
  return prismaClient.tpaInsurancePartner as TpaInsurancePartnerDelegate | undefined;
};

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

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

    await partnerDelegate.delete({ where: { id } });

    return NextResponse.json({ message: "Partner removed successfully" });
  } catch (error) {
    console.error("Error deleting TPA/Insurance partner:", error);
    return NextResponse.json(
      { error: "Failed to delete TPA/Insurance partner" },
      { status: 500 }
    );
  }
}
