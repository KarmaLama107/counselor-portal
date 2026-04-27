import { prisma } from "@/lib/prisma";
import * as XLSX from "xlsx";

export async function GET() {
  const counselors = await prisma.counselor.findMany({
    orderBy: { id: "desc" },
  });

  const data = counselors.map((c: any) => ({
    Name: c.name,
    Email: c.email,
    Phone: c.phone,
    School: c.school,
    "Last Updated": new Date(c.lastUpdated).toLocaleString(),
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);

  worksheet["!cols"] = [
    { wch: 25 }, // Name
    { wch: 35 }, // Email
    { wch: 18 }, // Phone
    { wch: 35 }, // School
    { wch: 25 }, // Last Updated
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Counselors");

  const buffer = XLSX.write(workbook, {
    type: "buffer",
    bookType: "xlsx",
  });

  return new Response(buffer, {
    status: 200,
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": 'attachment; filename="counselors.xlsx"',
    },
  });
}