"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function ReferencesList({ references }) {
  const [selectedReference, setSelectedReference] = useState(null);
  const [fetchedImages, setFetchedImages] = useState([]);

  // Helper: Get image URL from the fetched image details.
  const getImageUrl = (imageData) => {
    let url =
      imageData?.image?.formats?.medium?.url || imageData?.image?.url || "";
    if (url && url.startsWith("/")) {
      url = "http://46.235.8.12:1337" + url;
    }
    if (!url) {
      // Fallback placeholder if no URL is found.
      url = "https://via.placeholder.com/300x200?text=No+Image";
    }
    return url;
  };

  // When a reference is selected, fetch details for each image using its documentId.
  useEffect(() => {
    if (selectedReference && selectedReference.images?.length) {
      const fetchImages = async () => {
        try {
          const promises = selectedReference.images.map((img) =>
            fetch(
              `http://46.235.8.12:1337/api/images/${img.documentId}?populate=*`
            ).then((res) => res.json())
          );
          const results = await Promise.all(promises);
          // Each result is expected to have a "data" property with the image details.
          setFetchedImages(results.map((result) => result.data));
        } catch (error) {
          console.error("Error fetching image details:", error);
          setFetchedImages([]);
        }
      };
      fetchImages();
    } else {
      setFetchedImages([]);
    }
  }, [selectedReference]);

  return (
    <>
      {/* Reference List */}
      <div className="grid gap-6">
        {references.map((ref) => {
          // Build the logo URL (for the reference card) from the logo field.
          let logoUrl = ref.logo?.formats?.medium?.url || ref.logo?.url || "";
          if (logoUrl && logoUrl.startsWith("/")) {
            logoUrl = "http://46.235.8.12:1337" + logoUrl;
          }
          return (
            <div
              key={ref.id}
              className="flex items-center space-x-4 border p-4 rounded cursor-pointer hover:shadow-lg"
              onClick={() => setSelectedReference(ref)}
            >
              {logoUrl && (
                <div className="relative w-16 h-16 flex-shrink-0">
                  <Image
                    src={logoUrl}
                    alt={ref.title}
                    fill
                    style={{ objectFit: "contain" }}
                    unoptimized
                  />
                </div>
              )}
              <div>
                <h2 className="text-xl font-semibold">{ref.title}</h2>
                <p className="text-gray-700">{ref.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Overlay Modal for Selected Reference */}
      {selectedReference && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center">
          <div className="bg-white p-6 rounded max-w-3xl w-full relative overflow-y-auto max-h-full">
            <button
              onClick={() => {
                setSelectedReference(null);
                setFetchedImages([]);
              }}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
            >
              <svg
                width="24"
                height="24"
                xmlns="http://www.w3.org/2000/svg"
                fillRule="evenodd"
                clipRule="evenodd"
              >
                <path d="M12 11.293l10.293-10.293.707.707-10.293 10.293 10.293 10.293-.707.707-10.293-10.293-10.293 10.293-.707-.707 10.293-10.293-10.293-10.293.707-.707 10.293 10.293z" />
              </svg>
            </button>
            <h2 className="text-2xl font-bold mb-4">
              {selectedReference.title}
            </h2>
            <p className="mb-4">{selectedReference.description}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fetchedImages.length > 0 ? (
                fetchedImages.map((imgData) => {
                  const imageUrl = getImageUrl(imgData);
                  return (
                    <div key={imgData.id} className="relative w-full h-48">
                      <Image
                        src={imageUrl}
                        alt={
                          imgData.image?.alt ||
                          imgData.image?.Title ||
                          "Reference image"
                        }
                        fill
                        style={{ objectFit: "contain" }}
                        unoptimized
                      />
                    </div>
                  );
                })
              ) : (
                <p>No images available</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
