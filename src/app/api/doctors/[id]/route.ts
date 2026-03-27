import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  try {
    const doctor = await prisma.doctor.findUnique({
      where: { id },
    });

    if (!doctor) {
      return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
    }

    return NextResponse.json(doctor);
  } catch (error) {
    console.error("Error fetching doctor:", error);
    return NextResponse.json(
      { error: "Failed to fetch doctor" },
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
    const doctor = await prisma.doctor.update({
      where: { id },
      data: {
        ...(body.name && { name: body.name }),
        ...(body.designation && { designation: body.designation }),
        ...(body.qualification !== undefined && {
          qualification: body.qualification || null,
        }),
        ...(body.experience !== undefined && {
          experience: body.experience || null,
        }),
        ...(body.timings !== undefined && {
          timings: body.timings || null,
        }),
        ...(body.bio !== undefined && {
          bio: body.bio || null,
        }),
        ...(body.appointmentLink !== undefined && {
          appointmentLink: body.appointmentLink || null,
        }),
        ...(body.email !== undefined && { email: body.email || null }),
        ...(body.phone !== undefined && { phone: body.phone || null }),
        ...(body.facebook !== undefined && { facebook: body.facebook || null }),
        ...(body.linkedin !== undefined && { linkedin: body.linkedin || null }),
        ...(body.image !== undefined && { image: body.image || null }),
        ...(body.sortOrder !== undefined && {
          sortOrder: Number.isFinite(Number(body.sortOrder))
            ? Number(body.sortOrder)
            : 0,
        }),
      },
    });
    return NextResponse.json(doctor);
  } catch (error) {
    console.error("Error updating doctor:", error);
    return NextResponse.json(
      { error: "Failed to update doctor" },
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
    await prisma.doctor.delete({
      where: { id },
    });
    return NextResponse.json({ message: "Doctor deleted successfully" });
  } catch (error) {
    console.error("Error deleting doctor:", error);
    return NextResponse.json(
      { error: "Failed to delete doctor" },
      { status: 500 }
    );
  }
}
