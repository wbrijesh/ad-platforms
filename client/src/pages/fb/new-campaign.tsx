import AuthLayout from "@/layouts/main";
import { useSession } from "next-auth/react";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Home() {
  const { data: session } = useSession();

  const [objective, setObjective] = useState<string>("LINK_CLICKS");
  // const [lifetimeBudget, setLifetimeBudget] = useState<number>();
  const [status, setStatus] = useState<string>("PAUSED"); // ACTIVE, PAUSED, DELETED, ARCHIVED
  // const [dailyBudget, setDailyBudget] = useState<number>();
  // const [startTime, setStartTime] = useState<string>();
  // const [endTime, setEndTime] = useState<string>();
  const [newCampaignName, setNewCampaignName] = useState<string>();

  const [createNewCampaignResponse, setCreateNewCampaignResponse] = useState();

  function createNewCampaign(e: any) {
    e.preventDefault();

    const access_token = JSON.parse(JSON.stringify(session))?.accessToken;
    const ad_account_id = localStorage.getItem("ad_account_id");

    fetch(
      `https://graph.facebook.com/v19.0/${ad_account_id}/campaigns?fields=name`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newCampaignName,
          objective: objective,
          status: status,
          special_ad_categories: ["NONE"],
          access_token: access_token,
        }),
      }
    )
      .then((response) => response.json())
      .then((data) => setCreateNewCampaignResponse(data));
  }

  return (
    <AuthLayout>
      <h1 className="text-xl font-medium mb-4">Create a new campaign</h1>

      {session && (
        <>
          {createNewCampaignResponse && (
            <details className="mb-4">
              <summary>Newly Cerated Campaign Details</summary>
              <pre className="mb-4">
                {JSON.stringify(createNewCampaignResponse, null, 2)}
              </pre>
            </details>
          )}

          <form className="mb-4">
            <div className="mb-1">
              <label className="text-sm" htmlFor="campaign-name">
                Campaign Name
              </label>
            </div>
            <input
              value={newCampaignName}
              onChange={(e) => setNewCampaignName(e.target.value)}
              type="text"
              id="campaign-name"
              name="campaign-name"
              className="px-2 py-1 rounded-sm border border-gray-500 transition focus:border-blue-500 focus:outline-none mb-4"
              required
            />
            <div className="mb-4">
              <div className="mb-1">
                <label className="text-sm" htmlFor="campaign-name">
                  Objective
                </label>
              </div>
              <Select
                value={objective}
                onValueChange={(value) => setObjective(value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Objective" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="OUTCOME_APP_PROMOTION">
                    App Promotion
                  </SelectItem>
                  <SelectItem value="OUTCOME_AWARENESS">Awareness</SelectItem>
                  <SelectItem value="OUTCOME_ENGAGEMENT">Engagement</SelectItem>
                  <SelectItem value="OUTCOME_LEADS">Leads</SelectItem>
                  <SelectItem value="OUTCOME_SALES">Sales</SelectItem>
                  <SelectItem value="OUTCOME_TRAFFIC">Traffic</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="mb-4">
              <div className="mb-1">
                <label className="text-sm" htmlFor="campaign-name">
                  Status
                </label>
              </div>
              <Select
                value={status}
                onValueChange={(value) => setStatus(value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="PAUSED">Paused</SelectItem>
                  <SelectItem value="DELETED">Deleted</SelectItem>
                  <SelectItem value="ARCHIVED">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <br />
            <button
              onClick={(e) => createNewCampaign(e)}
              className="px-2 py-1 rounded-sm bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              Create Campaign
            </button>
          </form>
        </>
      )}
    </AuthLayout>
  );
}
