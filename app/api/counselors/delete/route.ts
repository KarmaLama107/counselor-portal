import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function POST(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");

  if (id) {
    await prisma.counselor.delete({
      where: { id: Number(id) },
    });
  }

  redirect("/");
}