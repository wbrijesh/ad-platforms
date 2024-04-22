import MainLayout from "@/layouts/main";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { Label } from "@/components/ui/label";

export default function NewIamge() {
  const { data: session } = useSession();

  const access_token =
    session && JSON.parse(JSON.stringify(session))?.accessToken;

  const [imageHash, setImageHash] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleImageChange = (event: any) => {
    const file = event.target.files[0];
    uploadFile(file);
  };

  const uploadFile = async (file: any) => {
    setIsLoading(true);
    setError(null);

    try {
      const hash = await uploadImageToFacebook(file, access_token);
      setImageHash(hash);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  async function uploadImageToFacebook(file: any, accessToken: any) {
    // 1. Prepare Form Data
    const formData = new FormData();
    formData.append("image", file);
    formData.append("access_token", accessToken);

    // 2. Determine Upload Endpoint (replace with your ad account setup)
    const uploadEndpoint = `https://graph.facebook.com/v12.0/${localStorage.getItem(
      "ad_account_id"
    )}/adimages`;

    // 3. Fetch API Call
    try {
      const response = await fetch(uploadEndpoint, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Image upload failed: ${response.status}`);
      }

      const data = await response.json();
      return data.images[file.name].hash; // Return the image hash
    } catch (error) {
      console.error("Error uploading image:", error);
      return null; // Or handle the error appropriately
    }
  }

  return (
    <MainLayout>
      <h1 className="text-xl font-medium mb-4">Upload Image for Ad Creative</h1>

      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="picture">Picture</Label>
        <input type="file" onChange={handleImageChange} />
        {isLoading && <p>Uploading image...</p>}
        {imageHash && <p>Image uploaded! Hash: {imageHash}</p>}
        {error && <p>Error: {error}</p>}
      </div>
    </MainLayout>
  );
}
