export const dynamic = "force-dynamic";
export const runtime = "nodejs";
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
      const name =
       row["Counselor Name"] || row.name || row.Name ||"";
      const role =
       row.role || row.Role ||"";
      const email = 
       row["Email Address"] || row.email || row.Email ||"";
      const phone =
       row["Phone Number"] || row.phone || row.Phone || "";
      const school =
       row["School Name"] || row.school || row.School || "Uploaded File";

      if (!name) {
        skipped++;
        continue;
      }

      const existing = await prisma.counselor.findFirst({
        where: { name, school },
      });

      if (existing) {
        await prisma.counselor.update({
          where: { id: existing.id },
          data: {
            role: role || existing.role,
            email: email || existing.email,
            phone: phone || existing.phone,
            source: "upload",
            lastUpdated: new Date(),
          },
        });
        updated++;
      } else {
        await prisma.counselor.create({
          data: {
            name,
            role: role || "Unknown",
            email: email || "Not found",
            phone: phone || "Not found",
            school,
            source: "upload",
          },
        });
        added++;
      }
    }

    return Response.redirect(
      new URL ('/?upload=complete&added=${added}&updated=${updated}&skipped=${skipped}', req.url)
     );
  } catch (error) {
    console.error("COUNSELOR UPLOAD ERROR:", error);

    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      {status: 500}
    );
  }
}