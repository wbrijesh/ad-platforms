import MainLayout from "@/layouts/main";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Adset {
  id: string;
  name: string;
}

const NewAdPage = () => {
  const { data: session } = useSession();

  const access_token =
    session && JSON.parse(JSON.stringify(session))?.accessToken;

  const [adsets, setAdsets] = useState<Adset[]>();
  const [selectedAdsetName, setSelectedAdsetName] = useState<string>();
  const [selectedAdset, setSelectedAdset] = useState<Adset>();

  const [pages, setPages] = useState<any[]>([]);

  function getAdsetsFromCampaign() {
    fetch(
      `https://graph.facebook.com/v19.0/${localStorage.getItem(
        "ad_account_id"
      )}/adsets?fields=name&access_token=${access_token}`
    )
      .then((response) => response.json())
      .then((data) => setAdsets(data.data));
  }

  async function fetchFacebookPages() {
    const endpoint = `https://graph.facebook.com/v19.0/me/accounts?fields=name,id,access_token&access_token=${access_token}`;

    try {
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error(`Page fetch failed: ${response.status}`);
      }

      const data = await response.json();
      setPages(data.data);
    } catch (error) {
      console.error("Error fetching pages:", error);
      return [];
    }
  }

  useEffect(() => {
    if (adsets && selectedAdsetName) {
      const adset = adsets.find((adset) => adset.name === selectedAdsetName);
      setSelectedAdset(adset);
    }
  }, [adsets, selectedAdsetName]);

  const [images, setImages] = useState<any>([]);

  const [adName, setAdName] = useState<string>("");
  const [adCreativeName, setAdCreativeName] = useState<string>("");
  const [adCreativePageId, setAdCreativePageId] = useState<string>("");
  const [adCreativeImageHash, setAdCreativeImageHash] = useState<string>("");
  const [adCreativeLink, setAdCreativeLink] = useState<string>("");
  const [adCreativeMessage, setAdCreativeMessage] = useState<string>("");
  const [adStatus, setAdStatus] = useState<string>("PAUSED");

  const adStatusTypes = ["ACTIVE", "PAUSED", "DELETED", "ARCHIVED"];

  //   curl \
  // -F 'name=My Ad' \
  // -F 'adset_id=<AD_SET_ID>' \
  // -F 'creative={
  //   "name": "Sample Creative",
  //   "object_story_spec"={
  //     "page_id": "<PAGE_ID>"
  //     "link_data": {
  //       "image_hash": "<IMAGE_HASH>",
  //       "link": "<URL>",
  //       "message": "try it out"
  //   },
  // }' \
  // -F 'status=PAUSED' \
  // -F 'access_token=<ACCESS_TOKEN>' \

  const [createAdRresponse, setCreateAdResponse] = useState();

  async function fetchAdImages() {
    const endpoint = `https://graph.facebook.com/v19.0/${localStorage.getItem(
      "ad_account_id"
    )}/adimages?fields=hash,name&access_token=${access_token}`;

    try {
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error(`Image fetch failed: ${response.status}`);
      }

      const data = await response.json();
      setImages(data.data);
    } catch (error) {
      console.error("Error fetching images:", error);
      return [];
    }
  }

  function CreateAd(e: any) {
    e.preventDefault();

    fetch(
      `https://graph.facebook.com/v19.0/${localStorage.getItem(
        "ad_account_id"
      )}/ads?fields=name`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: adName,
          adset_id: selectedAdset?.id,
          creative: {
            name: adCreativeName,
            object_story_spec: {
              page_id: adCreativePageId,
              link_data: {
                image_hash: adCreativeImageHash,
                link: adCreativeLink,
                message: adCreativeMessage,
              },
            },
          },
          status: adStatus,
          access_token: access_token,
        }),
      }
    )
      .then((response) => response.json())
      .then((data) => setCreateAdResponse(data));
  }

  return (
    <MainLayout>
      <h1 className="text-xl font-medium mb-4">Create a new Ad for Ad Set</h1>
      <button
        className="mb-4 px-2 py-1 rounded-sm bg-blue-600 text-white hover:bg-blue-700 transition"
        onClick={() => {
          getAdsetsFromCampaign();
          fetchFacebookPages();
          fetchAdImages();
        }}
      >
        Load Ad Sets and Pages and Images
      </button>

      <br />

      {adsets && pages && (
        <form className="mb-4">
          <div className="mb-4">
            <div className="mb-1">
              <label className="text-sm" htmlFor="adset-name">
                Select a Ad Set to create an ad for
              </label>
            </div>
            <Select
              value={selectedAdsetName}
              onValueChange={(value) => setSelectedAdsetName(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a Ad Set" />
              </SelectTrigger>
              <SelectContent>
                {adsets.map((adset) => (
                  <SelectItem
                    key={adset.id}
                    value={adset.name}
                    onClick={() => setSelectedAdset(adset)}
                  >
                    {adset.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="mb-4">
            <div className="mb-1">
              <label className="text-sm" htmlFor="ad-creative-page-id">
                Page
              </label>
            </div>
            <Select
              value={adCreativePageId}
              onValueChange={(value) => setAdCreativePageId(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a Page" />
              </SelectTrigger>
              <SelectContent>
                {pages.map((page) => (
                  <SelectItem key={page.id} value={page.id}>
                    {page.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedAdset && (
            <>
              <div className="mb-4">
                <div className="mb-1">
                  <label className="text-sm" htmlFor="ad-name">
                    Ad Name
                  </label>
                </div>
                <input
                  value={adName}
                  onChange={(e) => setAdName(e.target.value)}
                  type="text"
                  id="ad-name"
                  name="ad-name"
                  className="px-2 py-1 rounded-sm border border-gray-500 transition focus:border-blue-500 focus:outline-none mb-4"
                  required
                />
              </div>

              <div className="mb-4">
                <div className="mb-1">
                  <label className="text-sm" htmlFor="ad-create-name">
                    Ad Creative Name
                  </label>
                </div>
                <input
                  value={adCreativeName}
                  onChange={(e) => setAdCreativeName(e.target.value)}
                  type="text"
                  id="ad-creative-name"
                  name="ad-creative-name"
                  className="px-2 py-1 rounded-sm border border-gray-500 transition focus:border-blue-500 focus:outline-none mb-4"
                  required
                />
              </div>

              <div className="mb-4">
                <div className="mb-1">
                  <label className="text-sm" htmlFor="ad-creative-image-hash">
                    Image
                  </label>
                </div>
                <Select
                  value={adCreativeImageHash}
                  onValueChange={(value) => setAdCreativeImageHash(value)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select an Image" />
                  </SelectTrigger>
                  <SelectContent>
                    {images.map((image: any) => (
                      <SelectItem key={image.hash} value={image.hash}>
                        {image.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="mb-4">
                <div className="mb-1">
                  <label className="text-sm" htmlFor="ad-creative-link">
                    Ad Link
                  </label>
                </div>
                <input
                  value={adCreativeLink}
                  onChange={(e) => setAdCreativeLink(e.target.value)}
                  type="link"
                  id="ad-creative-link"
                  name="ad-creative-link"
                  className="px-2 py-1 rounded-sm border border-gray-500 transition focus:border-blue-500 focus:outline-none mb-4"
                  required
                />
              </div>

              <div className="mb-4">
                <div className="mb-1">
                  <label className="text-sm" htmlFor="ad-creative-message">
                    Ad Message
                  </label>
                </div>
                <input
                  value={adCreativeMessage}
                  onChange={(e) => setAdCreativeMessage(e.target.value)}
                  type="text"
                  id="ad-creative-message"
                  name="ad-creative-message"
                  className="px-2 py-1 rounded-sm border border-gray-500 transition focus:border-blue-500 focus:outline-none mb-4"
                  required
                />
              </div>

              <div className="mb-4">
                <div className="mb-1">
                  <label className="text-sm" htmlFor="ad-status">
                    Status
                  </label>
                </div>
                <Select
                  value={adStatus}
                  onValueChange={(value) => setAdStatus(value)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {adStatusTypes.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          <br />

          {selectedAdset && (
            <button
              onClick={(e) => CreateAd(e)}
              className="px-2 py-1 rounded-sm bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              Create Ad Set
            </button>
          )}

          <>
            {createAdRresponse && (
              <pre className="mb-4">
                <details className="mb-4">
                  <summary>Newly Cerated Ad Set</summary>
                  <pre className="mb-4">
                    {JSON.stringify(createAdRresponse, null, 2)}
                  </pre>
                </details>
              </pre>
            )}
          </>
        </form>
      )}
    </MainLayout>
  );
};

export default NewAdPage;
