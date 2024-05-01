import React, { useEffect, useState } from "react";
import GoogleAuthLayout from "@/layouts/google_auth";
import { GetCookie } from "@/lib/cookies";
import { useForm, SubmitHandler } from "react-hook-form";

interface CampaignData {
  name: string;
  status: string;
  advertising_channel_type: string;
  campaign_budget: BudgetData;

  // Targeting
  network_settings: network_settings_data;

  // Bidding
  bidding_strategy_type: string;
  bidding_strategy_id: number; // For existing strategies
  manualCpc?: ManualCpcData; // If Manual CPC

  // Dates
  start_date: string; // Format: YYYY-MM-DD
  end_date: string;

  // Ad Scheduling (Optional)
  // adSchedule: AdScheduleInfo[];

  // Other Settings
  // frequencyCaps: FrequencyCap[];
  optimization_goal_setting: optimization_goal_setting_data;
}

interface BudgetData {
  name: string;
  amountMicros: number;
  deliveryMethod: string;
  isExplicitlyShared: boolean;
}

interface network_settings_data {
  targetGoogleSearch: boolean;
  targetSearchNetwork: boolean;
  targetContentNetwork: boolean;
  targetPartnerSearchNetwork: boolean;
}

interface ManualCpcData {
  enhancedCpcEnabled?: boolean; // Optional
}

interface AdScheduleInfo {
  dayOfWeek: string; // "MONDAY", "TUESDAY", etc.
  startHour: number; // 24-hour format
  endHour: number;
  startMinute: number; // 0, 15, 30, 45
  endMinute: number;
}

interface FrequencyCap {
  impressions: number;
  timeUnit: string; // "DAY", "WEEK", "MONTH"
  level: string; // "CAMPAIGN", "AD_GROUP", etc.
}

interface optimization_goal_setting_data {
  optimizationGoalTypes: string[]; // Example: ["CALL_CLICKS", "DRIVING_DIRECTIONS"]
}

export default function Home() {
  const [googleAuthSession, setGoogleAuthSession] = useState<any>(null);
  useEffect(() => {
    GetCookie("google-auth-session") &&
      setGoogleAuthSession(
        JSON.parse(GetCookie("google-auth-session") || "{}"),
      );
  }, []);

  const [campaigns, setCampaigns] = useState<any>([]);
  function getPausedCampaigns() {
    fetch(`http://localhost:4000/v1/google/campaigns`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + GetCookie("ad_platforms_token"),
        access_token: googleAuthSession.access_token,
      },
    })
      .then((response) => response.json())
      .then((data) => setCampaigns({ campaigns: data }));
  }

  useEffect(() => {
    googleAuthSession && getPausedCampaigns();
  }, [googleAuthSession]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CampaignData>();

  useEffect(() => {
    const campaignName = watch("name");
    campaignName &&
      setValue("campaign_budget.name", `campaign-${campaignName}-budget`);
    !campaignName && setValue("campaign_budget.name", "");
  }, [watch("name")]);

  const onSubmit: SubmitHandler<CampaignData> = (data) => {
    // fetch(`http://localhost:4000/v1/google/create-campaign`, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: "Bearer " + GetCookie("ad_platforms_token"),
    //     access_token: googleAuthSession.access_token,
    //     customer_id: campaigns.campaigns.data.resourceNames[0],
    //   },
    //   body: JSON.stringify(data),
    // })
    //   .then((response) => response.json())
    //   .then((data) => console.log("create new campaign response:", data));

    campaigns &&
    campaigns.campaigns.data.resourceNames &&
    campaigns.campaigns.data.resourceNames[0]
      ? fetch(
          `https://googleads.googleapis.com/v14/${campaigns.campaigns.data.resourceNames[0]}campaigns:mutate`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${googleAuthSession.access_token}`,
              "developer-token": process.env.GOOGLE_ADS_DEVELOPER_TOKEN || "",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              operations: [
                {
                  name: "My New Campaign",
                  status: "PAUSED",
                  advertisingChannelType: "SEARCH",
                  campaignBudget: {
                    name: "Campaign Budget #1",
                    amountMicros: 50000000, // 50 USD
                    deliveryMethod: "STANDARD",
                  },
                },
              ],
            }),
          },
        )
          .then((response) => {
            if (!response.ok) {
              throw new Error(
                `API Error: ${response.status} ${response.statusText}`,
              );
            }
            return response.json();
          })
          .then((data) => {
            console.log("API Response:", data);
          })
          .catch((error) => {
            console.error("Error:", error);
          })
      : alert("No customer ID found");
  };

  const [allFieldsExist, setAllFieldsExist] = useState<boolean>(false);

  useEffect(() => {
    let missingFields: string[] = [];
    !watch("name") && missingFields.push("Campaign Name");
    !watch("status") && missingFields.push("Status");
    !watch("advertising_channel_type") &&
      missingFields.push("Advertising Channel Type");
    !watch("campaign_budget.name") &&
      missingFields.push("Campaign Budget Name");
    !watch("campaign_budget.amountMicros") &&
      missingFields.push("Campaign Budget Amount");
    !watch("campaign_budget.deliveryMethod") &&
      missingFields.push("Campaign Budget Delivery Method");
    !watch("bidding_strategy_type") &&
      missingFields.push("Bidding Strategy Type");
    !watch("start_date") && missingFields.push("Start Date");
    !watch("end_date") && missingFields.push("End Date");

    missingFields && missingFields.length > 0
      ? console.log("missing fields: ", missingFields)
      : console.log("all fields exist");

    if (missingFields.length == 0) {
      setAllFieldsExist(true);
    } else {
      setAllFieldsExist(false);
    }
  }, [
    watch("name"),
    watch("status"),
    watch("advertising_channel_type"),
    watch("campaign_budget.name"),
    watch("campaign_budget.amountMicros"),
    watch("campaign_budget.deliveryMethod"),
    watch("bidding_strategy_type"),
    watch("start_date"),
    watch("end_date"),
  ]);

  return (
    <GoogleAuthLayout>
      <p>customer id: {campaigns.campaigns.data.resourceNames[0]}</p>
      <details>
        <summary>Create a new campaign</summary>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="block">Campaign Name</label>
            <input
              className="border border-black"
              {...register("name", { required: true })}
            />
          </div>

          <div>
            <label className="block">Status</label>
            <select {...register("status")}>
              <option value="ENABLED">Enabled</option>
              <option value="PAUSED">Paused</option>
              <option value="REMOVED">Removed</option>
            </select>
          </div>

          <div>
            <label className="block">Advertising Channel Type</label>
            <select {...register("advertising_channel_type")}>
              <option value="SEARCH">Search</option>
              <option value="DISPLAY">Display</option>
              <option value="SHOPPING">Shopping</option>
              <option value="VIDEO">Video</option>
            </select>
          </div>

          <div>
            <label className="block">Campaign Budget Name</label>
            <input
              className="border border-black"
              {...register("campaign_budget.name", { required: true })}
            />
            {errors.campaign_budget?.name && (
              <span>This field is required</span>
            )}
          </div>

          <div>
            <label className="block">Campaign Budget Amount</label>
            <input
              className="border border-black"
              {...register("campaign_budget.amountMicros", { required: true })}
            />
          </div>

          <div>
            <label className="block">Campaign Budget Delivery Method</label>
            <select {...register("campaign_budget.deliveryMethod")}>
              <option value="STANDARD">Standard</option>
              <option value="ACCELERATED">Accelerated</option>
            </select>
          </div>

          <div>
            <label className="block">
              Campaign Budget is Explicitly Shared
            </label>
            <input
              type="checkbox"
              {...register("campaign_budget.isExplicitlyShared")}
            />
          </div>

          <div>
            <label className="block">Target Google Search</label>
            <input
              type="checkbox"
              {...register("network_settings.targetGoogleSearch")}
            />
          </div>

          <div>
            <label className="block">Target Search Network</label>
            <input
              type="checkbox"
              {...register("network_settings.targetSearchNetwork")}
            />
          </div>

          <div>
            <label className="block">Target Content Network</label>
            <input
              type="checkbox"
              {...register("network_settings.targetContentNetwork")}
            />
          </div>

          <div>
            <label className="block">Target Partner Search Network</label>
            <input
              type="checkbox"
              {...register("network_settings.targetPartnerSearchNetwork")}
            />
          </div>

          <div>
            <label className="block">Bidding Strategy Type</label>
            <select {...register("bidding_strategy_type")}>
              <option value="MANUAL_CPC">Manual CPC</option>
              <option value="TARGET_CPA">Target CPA</option>
              <option value="MAXIMIZE_CONVERSIONS">Maximize Conversions</option>
            </select>
          </div>

          <div>
            <label className="block">Start Date</label>
            <input
              className="border border-black"
              type="date"
              {...register("start_date")}
            />
          </div>

          <div>
            <label className="block">End Date</label>
            <input
              className="border border-black"
              type="date"
              {...register("end_date")}
            />
          </div>
          <button
            disabled={!allFieldsExist}
            title={
              !allFieldsExist
                ? "you must fill all fields before submitting"
                : ""
            }
            className="my-4 px-2 py-1 rounded shadow bg-zinc-50 text-zinc-800 font-medium hover:bg-zinc-100 transition border border-zinc-300 disabled:text-zinc-400 disabled:cursor-not-allowed"
            type="submit"
          >
            Create Campaign
          </button>
        </form>
      </details>
    </GoogleAuthLayout>
  );
}
