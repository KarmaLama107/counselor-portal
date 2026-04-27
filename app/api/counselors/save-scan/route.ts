export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const counselors = body.counselors as Array<{
      name: string;
      role: string;
    }>;

    const pageTitle = body.pageTitle as string;
    const school = pageTitle || "Unknown School";

    if (!Array.isArray(counselors) || counselors.length === 0) {
      return new Response("No counselors to save", { status: 400 });
    }

    for (const counselor of counselors) {
      if (!counselor.name || counselor.name === "Unknown Name") continue;

      const existingCounselor = await prisma.counselor.findFirst({
        where: {
          name: counselor.name,
          school,
        },
      });

      if (existingCounselor) {
        await prisma.counselor.update({
          where: {
            id: existingCounselor.id,
          },
          data: {
            role: counselor.role || "Unknown",
            source: "extension",
          },
        });
      } else {
        await prisma.counselor.create({
          data: {
            name: counselor.name || "Unknown",
            role: counselor.role || "Unknown",
            email: "Not found",
            phone: "Not found",
            school,
            source: "extension",
          },
        });
      }
    }

    await prisma.school.updateMany({
      where: {
        name: school,
      },
      data: {
        status: "completed",
        lastScanned: new Date(),
      },
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error("Save scan error:", error);
    return new Response("Failed to save scan", { status: 500 });
  }
}