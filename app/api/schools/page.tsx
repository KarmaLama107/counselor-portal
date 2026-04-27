import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function SchoolsPage() {
  const schools = await prisma.school.findMany({
    orderBy: { id: "desc" },
  });

  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-100 via-white to-pink-100 text-gray-800">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <header className="mb-8">
          <Link href="/" className="text-sky-600 hover:underline">
            ← Back to Dashboard
          </Link>

          <h1 className="mt-4 text-4xl font-bold text-sky-600">
            Saved Schools
          </h1>

          <p className="mt-2 text-gray-600">
            Open school websites and use the extension to collect counselor data.
          </p>
        </header>

        {schools.length === 0 ? (
          <div className="rounded-2xl bg-white p-8 text-center shadow">
            No schools uploaded yet.
          </div>
        ) : (
          <div className="grid gap-3 grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            {schools.map((school: any) => (
              <article
                key={school.id}
                className="rounded-xl bg-white p-4 shadow-sm border border-gray-200 hover:shadow-md transition"
              >
                <h3 className="text-sm font-semibold text-gray-800">
                  {school.name}
                </h3>

                <p className="mt-1 text-xs text-gray-500">
                  Status: {school.status}
                </p>

                <a
                  href={school.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-block rounded-lg bg-blue-500 px-3 py-1 text-xs text-white hover:bg-blue-600"
                >
                  Open
                </a>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}