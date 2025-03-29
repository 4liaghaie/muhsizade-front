import ReferencesList from "@/components/ReferencesList";
import Image from "next/image";

async function getReferencesData() {
  const res = await fetch(
    "https://api.muhsinzade.com/api/references?populate=*",
    { cache: "no-store" } // Disable caching to always get fresh data
  );
  if (!res.ok) {
    throw new Error("Failed to fetch references");
  }
  return res.json();
}

export default async function References() {
  const data = await getReferencesData();
  const references = data.data;

  return (
    // Add bg-black and text-white to force dark mode on the entire page.
    <main className="text-white container mx-auto px-4 py-8 min-h-screen">
      <ReferencesList references={references} />
    </main>
  );
}
