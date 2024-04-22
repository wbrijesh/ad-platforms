import MainLayout from "@/layouts/main";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

const ListImages = () => {
  const { data: session } = useSession();
  const access_token =
    session && JSON.parse(JSON.stringify(session))?.accessToken;

  async function fetchAdImages() {
    const endpoint = `https://graph.facebook.com/v12.0/${localStorage.getItem(
      "ad_account_id"
    )}/adimages?fields=hash,name&access_token=${access_token}`;

    try {
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error(`Image fetch failed: ${response.status}`);
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error("Error fetching images:", error);
      return [];
    }
  }

  const [images, setImages] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchImages = async () => {
      setIsLoading(true);
      try {
        const fetchedImages = await fetchAdImages();
        setImages(fetchedImages);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchImages();
  }, []);

  return (
    <MainLayout>
      <h1 className="text-xl font-medium mb-4">Available Images</h1>

      {isLoading && <p>Loading images...</p>}
      {error && <p>Error: {error}</p>}

      {!isLoading && !error && (
        <ul>
          {images.map((image: any) => (
            <li key={image.hash}>
              <strong>Name:</strong> {image.name} <br />
              <strong>Hash:</strong> {image.hash}
            </li>
          ))}
        </ul>
      )}
    </MainLayout>
  );
};

export default ListImages;
