import { prisma } from "@/lib/prisma";
import Link from "next/link";

type SchoolsPageProps = {
  searchParams: Promise<{
    q?: string;
  }>;
};

export default async function SchoolsPage({ searchParams }: SchoolsPageProps) {
  const params = await searchParams;
  const q = params.q || "";

  const schools = await prisma.school.findMany({
    where: q
      ? {
          name: {
            contains: q,
          },
        }
      : undefined,
    orderBy: { id: "desc" },
  });

  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-100 to-white">
      <div className="mx-auto max-w-6xl px-6 py-10">

        {/* Header */}
        <header className="mb-8">
          <Link href="/" className="text-sky-600 hover:underline">
            ← Back to Dashboard
          </Link>

          <h1 className="mt-4 text-4xl font-bold text-sky-600">
            Saved Schools
          </h1>

          <p className="mt-2 text-gray-600">
            Open school websites and collect counselor data
          </p>
          <form method="GET" className="mt-6 flex gap-3">
  <input
    type="text"
    name="q"
    defaultValue={q}
    placeholder="Search school name..."
    className="w-full rounded-xl border border-gray-200 px-4 py-2 outline-none focus:border-sky-400"
  />

  <button
    type="submit"
    className="rounded-xl bg-blue-500 px-5 py-2 text-white hover:bg-blue-600"
  >
    Search
  </button>

  <Link
    href="/schools"
    className="rounded-xl bg-gray-200 px-5 py-2 text-gray-700 hover:bg-gray-300"
  >
    Clear
  </Link>
</form>
        </header>

        {/* Empty State */}
        {schools.length === 0 ? (
          <div className="rounded-xl bg-white p-8 text-center shadow">
            No schools found.
          </div>
        ) : (
          /* Grid */
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {schools.map((school) => (
              <div
                key={school.id}
                className="rounded-xl bg-white p-4 shadow hover:shadow-md transition"
              >
                <h2 className="text-lg font-semibold">
                  {school.name}
                </h2>

                <p className="text-sm text-gray-500">
                  Status: {school.status}
                </p>

                <a
                  href={school.website}
                  target="_blank"
                  className="mt-3 inline-block rounded-lg bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600"
                >
                  Open Website
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}