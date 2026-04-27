import { prisma } from "@/lib/prisma";

type EditPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditPage({ params }: EditPageProps) {
  const { id } = await params;

  const counselor = await prisma.counselor.findUnique({
    where: { id: Number(id) },
  });

  if (!counselor) {
    return <div className="p-10">Counselor not found.</div>;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-100 via-white to-pink-100 px-6 py-10">
      <div className="mx-auto max-w-2xl rounded-2xl border border-pink-200 bg-white p-8 shadow-md">
        <h1 className="mb-6 text-3xl font-bold text-pink-500">
          Edit Counselor
        </h1>

        <form
          action={`/api/counselors/update?id=${counselor.id}`}
          method="POST"
          className="grid gap-4"
        >
          <input
            type="text"
            name="name"
            defaultValue={counselor.name}
            required
            className="rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-pink-300"
          />

          <input
            type="email"
            name="email"
            defaultValue={counselor.email}
            required
            className="rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-pink-300"
          />

          <input
            type="text"
            name="phone"
            defaultValue={counselor.phone}
            required
            className="rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-pink-300"
          />

          <input
            type="text"
            name="school"
            defaultValue={counselor.school}
            required
            className="rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-pink-300"
          />

          <button
            type="submit"
            className="rounded-xl bg-pink-400 px-6 py-3 font-semibold text-white hover:bg-pink-500"
          >
            Update Counselor
          </button>
        </form>
      </div>
    </main>
  );
}