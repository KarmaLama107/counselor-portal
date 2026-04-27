export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import * as XLSX from "xlsx";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return new Response("No file uploaded", { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const workbook = XLSX.read(buffer, { type: "buffer" });

    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(sheet);

    let added = 0;
    let updated = 0;
    let skipped = 0;

    for (const row of data as any[]) {
      try {
        const name = String(
          row.name || row.Name || row.school || row.School || ""
        ).trim();

        const website = String(
          row.website || row.Website || row.url || row.URL || ""
        ).trim();

        if (!name || !website) {
          skipped++;
          continue;
        }

        const existingSchool = await prisma.school.findFirst({
          where: { name },
        });

        if (existingSchool) {
          await prisma.school.update({
            where: { id: existingSchool.id },
            data: {
              website,
            },
          });
          updated++;
        } else {
          await prisma.school.create({
            data: {
              name,
              website,
              status: "not-started",
            },
          });
          added++;
        }
      } catch (rowError) {
        console.error("Skipped school row:", row, rowError);
        skipped++;
      }
    }

    return Response.json({
      success: true,
      added,
      updated,
      skipped,
      total: data.length,
    });
  } catch (error) {
    console.error("School upload error:", error);
    return new Response("School upload failed", { status: 500 });
  }
}