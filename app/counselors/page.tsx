import { prisma } from "@/lib/prisma";
import Link from "next/link";

type CounselorsPageProps = {
  searchParams: Promise<{
    school?: string;
  }>;
};

export default async function CounselorsPage({
  searchParams,
}: CounselorsPageProps) {
  const params = await searchParams;
  const schoolQuery = params.school || "";

  const counselors = await prisma.counselor.findMany({
    where: schoolQuery
      ? {
          school: {
            contains: schoolQuery,
          },
        }
      : undefined,
    orderBy: { id: "desc" },
  });

  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-100 to-white">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <header className="mb-8">
          <Link href="/" className="text-sky-600 hover:underline">
            ← Back to Dashboard
          </Link>

          <h1 className="mt-4 text-4xl font-bold text-pink-500">
            Saved counselors
          </h1>

          <p className="mt-2 text-gray-600">
            View, edit, and manage counselor information.
          </p>
          <form method="GET" className="mt-6 flex gap-3">
  <input
    type="text"
    name="school"
    defaultValue={schoolQuery}
    placeholder="Search by school..."
    className="w-full rounded-xl border border-gray-200 px-4 py-2 outline-none focus:border-pink-400"
  />

  <button
    type="submit"
    className="rounded-xl bg-pink-500 px-5 py-2 text-white hover:bg-pink-600"
  >
    Search
  </button>

  <Link
    href="/counselors"
    className="rounded-xl bg-gray-200 px-5 py-2 text-gray-700 hover:bg-gray-300"
  >
    Clear
  </Link>
</form>
        </header>

        {counselors.length === 0 ? (
          <div className="rounded-xl bg-white p-8 text-center shadow">
            No counselors found.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {counselors.map((c: any) => (
              <article
                key={c.id}
                className="rounded-xl bg-white p-4 shadow hover:shadow-md transition"
              >
                <h2 className="text-lg font-semibold text-sky-600">
                  {c.name}
                </h2>

                <p className="text-sm text-gray-500">{c.school}</p>

                <div className="mt-3 text-sm space-y-1">
                  <p>
                    <span className="font-medium">Email:</span> {c.email}
                  </p>

                  <p>
                    <span className="font-medium">Phone:</span> {c.phone}
                  </p>
                </div>

                <Link
                  href={`/edit/${c.id}`}
                  className="mt-4 block rounded-lg bg-sky-400 px-3 py-2 text-center text-sm text-white hover:bg-sky-500"
                >
                  Edit
                </Link>

                <form
                  action={`/api/counselors/delete?id=${c.id}`}
                  method="POST"
                  className="mt-2"
                >
                  <button
                    type="submit"
                    className="w-full rounded-lg bg-pink-400 px-3 py-2 text-sm text-white hover:bg-pink-500"
                  >
                    Delete
                  </button>
                </form>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}