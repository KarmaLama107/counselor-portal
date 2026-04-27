"use client";

export default function SchoolUploadForm() {
  async function handleUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const res = await fetch("/api/schools/upload", {
      method: "POST",
      body: formData,
    });

    const result = await res.json();

    alert(
      `Upload Complete:\nAdded: ${result.added}\nUpdated: ${result.updated}\nSkipped: ${result.skipped}`
    );

    window.location.reload();
  }

  return (
    <form
      onSubmit={handleUpload}
      encType="multipart/form-data"
      className="flex items-center gap-4"
    >
      <input
        type="file"
        name="file"
        accept=".csv,.xlsx"
        className="rounded border p-2"
        required
      />

      <button
        type="submit"
        className="rounded-xl bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
      >
        Upload Schools
      </button>
    </form>
  );
}