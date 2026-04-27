import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function POST(request: Request) {
  const formData = await request.formData();

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const school = formData.get("school") as string;

  await prisma.counselor.create({
    data: {
      name,
      role: "Unknown",
      email: email || "Not Found",
      phone: phone || "Not found",
      school,
      source: "manual",
    },
  });

  redirect("/");
}