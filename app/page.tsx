import { prisma } from "@/lib/prisma";
import SchoolUploadForm from "@/components/SchoolUploadForm";

type HomeProps = {
  searchParams: Promise<{
    school?: string;
    upload?: string;
    added?: string;
    updated?: string;
    skipped?: string;
  }>;
};

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  const schoolQuery = params.school || "";

  const uploadMessage =
  params?.upload === "complete"
  ? `Upload complete: Added ${params.added}, Updated ${params.updated}, Skipped ${params.skipped}`
  :null;

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
    const schools = await prisma.school.findMany ({
      orderBy: { id: "desc"},
    });

  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-100 via-white to-pink-100 text-gray-800">
      {uploadMessage && (
        <div className="mb-4 rounded-x1 bg-green-100 p-4 text-center text-green-700">
          {uploadMessage}
        </div>
      )}
      <div className="mx-auto max-w-6xl px-6 py-10">

        <header className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-sky-600">
            Counselor Dashboard
          </h1>
          <p className="mt-2 text-gray-600">
            Save and manage counselor information from high school websites.
          </p>
          <div className="mt-4 flex gap-4 justify-center">
            <a 
            href="/schools"
            className="rounded-x1 bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
              View Schools
            </a>
            <a
            href="/counselors"
            className="rounded-x1 bg-pink-500 px-4 py-2 text-white hover:bg-pink-600"
            >
              View Counselors
            </a>
          </div>
        </header>

        <div className="grid gap-8 lg:grid-cols-3">

          {/* SEARCH */}
          <section className="rounded-2xl bg-white p-6 shadow-md border border-sky-200">
            <h2 className="mb-4 text-xl font-semibold text-sky-600">
              Search by School
            </h2>

            <form method="GET" className="flex flex-col gap-3">
              <input
                type="text"
                name="school"
                placeholder="Enter school name"
                defaultValue={schoolQuery}
                className="rounded-xl border border-sky-200 px-4 py-3 outline-none focus:border-pink-300"
              />

              <button
                type="submit"
                className="rounded-xl bg-sky-400 py-3 font-medium text-white hover:bg-sky-500"
              >
                Search
              </button>
            </form>

            {schoolQuery && (
              <div className="mt-4 text-sm">
                <p>
                  Showing results for{" "}
                  <span className="font-semibold">{schoolQuery}</span>
                </p>
                <a href="/" className="text-pink-500 hover:underline">
                  Clear Search
                </a>
              </div>
            )}
          </section>

          {/* ADD COUNSELOR */}
          <section className="rounded-2xl bg-white p-6 shadow-md border border-pink-200 lg:col-span-2">
            <h2 className="mb-4 text-xl font-semibold text-pink-500">
              Add Counselor
            </h2>

            <form
              action="/api/counselors"
              method="POST"
              className="grid gap-4 md:grid-cols-2"
            >
              <input
                type="text"
                name="name"
                placeholder="Counselor Name"
                required
                className="rounded-xl border border-gray-200 px-4 py-3 focus:border-pink-300 outline-none"
              />

              <input
                type="email"
                name="email"
                placeholder="Email Address"
            
                className="rounded-xl border border-gray-200 px-4 py-3 focus:border-pink-300 outline-none"
              />

              <input
                type="text"
                name="phone"
                placeholder="Phone Number"
              
                className="rounded-xl border border-gray-200 px-4 py-3 focus:border-pink-300 outline-none"
              />

              <input
                type="text"
                name="school"
                placeholder="School Name"
                required
                className="rounded-xl border border-gray-200 px-4 py-3 focus:border-pink-300 outline-none"
              />

              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="rounded-xl bg-pink-400 px-6 py-3 font-semibold text-white hover:bg-pink-500"
                >
                  Save Counselor
                </button>
              </div>
            </form>
          </section>
        </div>
      
<div className="mb-8 rounded-2xl bg-white p-6 shadow">
  <h2 className="mb-4 text-xl font-semibold text-gray-700">
    Upload Counselor File
  </h2>

  <form
    action="/api/counselors/upload"
    method="POST"
    encType="multipart/form-data"
    className="flex items-center gap-4"
  >
    <input
      type="file"
      name="file"
      accept=".csv,.xlsx"
      className="rounded border p-2"
    />

    <button
      type="submit"
      className="rounded-xl bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
    >
      Upload File
    </button>
  </form>
</div>
<div className="mb-6">
  <a
    href="/api/counselors/download"
    className="inline-block rounded-xl bg-pink-400 px-4 py-2 font-medium text-white hover:bg-pink-500"
  >
    Download Counselors
  </a>
</div>
<div className="mb-8 rounded-2xl bg-white p-6 shadow">
  <h2 className="mb-4 text-xl font-semibold text-gray-700">
    Upload School List
  </h2>
  <SchoolUploadForm/>

</div>
<section className="mt-10">
  <h2 className="mb-5 text-2xl font-semibold text-gray-700">
    Saved Schools
  </h2>

  {schools.length === 0 ? (
    <div className="rounded-2xl bg-white p-6 text-center shadow">
      No schools uploaded yet.
    </div>
  ) : (
    <div className="grid gap-4 md:grid-cols-2">
      {schools.map((school: any) => (
        <div key={school.id} className="rounded-2xl bg-white p-6 shadow">
          <h3 className="text-xl font-semibold text-gray-800">{school.name}</h3>

          <p className="mt-2 text-sm text-gray-600">
            Status: {school.status}
          </p>

          <a
            href={school.website}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block rounded-xl bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            Open Website
          </a>
        </div>
      ))}
    </div>
  )}
</section>
        
      </div>
    </main>
  );
}
