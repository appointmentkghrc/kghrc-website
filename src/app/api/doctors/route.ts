import { NextRequest } from "next/server";
import { jsonNoStore } from "@/lib/jsonNoStore";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const doctors = await prisma.doctor.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });
    return jsonNoStore(doctors);
  } catch (error) {
    console.error("Error fetching doctors:", error);
    return jsonNoStore(
      { error: "Failed to fetch doctors" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const doctor = await prisma.doctor.create({
      data: {
        name: body.name,
        designation: body.designation,
        qualification: body.qualification || null,
        experience: body.experience || null,
        timings: body.timings || null,
        bio: body.bio || null,
        appointmentLink: body.appointmentLink || null,
        email: body.email || null,
        phone: body.phone || null,
        facebook: body.facebook || null,
        linkedin: body.linkedin || null,
        image: body.image || null,
        sortOrder: Number.isFinite(Number(body.sortOrder))
          ? Number(body.sortOrder)
          : 0,
      },
    });
    return jsonNoStore(doctor, { status: 201 });
  } catch (error) {
    console.error("Error creating doctor:", error);
    return jsonNoStore(
      { error: "Failed to create doctor" },
      { status: 500 }
    );
  }
}
