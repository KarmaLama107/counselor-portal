export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function POST(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");

  const formData = await req.formData();

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const school = formData.get("school") as string;

  if (id) {
    await prisma.counselor.update({
      where: { id: Number(id) },
      data: {
        name,
        email,
        phone,
        school,
      },
    });
  }

  redirect("/");
}