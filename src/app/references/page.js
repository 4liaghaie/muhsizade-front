import ReferencesList from "@/components/ReferencesList";
import Image from "next/image";

async function getReferencesData() {
  const res = await fetch("http://localhost:1337/api/references?populate=*");
  if (!res.ok) {
    throw new Error("Failed to fetch references");
  }
  return res.json();
}

export default async function References() {
  const data = await getReferencesData();
  const references = data.data;

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">References</h1>
      <ReferencesList references={references} />
    </main>
  );
}
