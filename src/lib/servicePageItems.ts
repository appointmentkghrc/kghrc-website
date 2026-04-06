import prisma from "@/lib/prisma";

export async function getActiveServicePageItems() {
  return prisma.servicePageItem.findMany({
    where: { isActive: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });
}

export async function getActiveServicePageItemForDetail(id: string) {
  return prisma.servicePageItem.findFirst({
    where: {
      id,
      isActive: true,
    },
  });
}
