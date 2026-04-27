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

    for (const row of data as any[]) {
      const name = row.name || row.Name;
      const role = row.role || row.Role;
      const email = row.email || row.Email;
      const phone = row.phone || row.Phone;
      const school = row.school || row.School || "Uploaded File";

      if (!name) continue;

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
      }
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error(error);
    return new Response("Upload failed", { status: 500 });
  }
}