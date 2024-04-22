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

interface Campaign {
  id: string;
  name: string;
  effective_status: string;
}

const NewAdsetPage = () => {
  const { data: session } = useSession();

  const [activeAndPausedCampaigns, setActiveAndPausedCampaigns] =
    useState<Campaign[]>();

  function getActiveAndPausedCampaigns() {
    const access_token =
      session && JSON.parse(JSON.stringify(session))?.accessToken;
    const ad_account_id = localStorage.getItem("ad_account_id");

    fetch(
      `https://graph.facebook.com/v12.0/${ad_account_id}/campaigns?fields=name,effective_status&access_token=${access_token}&filtering=[{'field':'effective_status','operator':'IN','value':['PAUSED','ACTIVE']}]`
    )
      .then((response) => response.json())
      .then((data) =>
        setActiveAndPausedCampaigns(
          data.data.map((campaign: any) => ({
            id: campaign.id,
            name: campaign.name,
            effective_status: campaign.effective_status,
          }))
        )
      );
  }

  const [selectedCampaign, setSelectedCampaign] = useState<string>();
  const [endTime, setEndTime] = useState<string>();

  const [optimizationGoal, setOptimizationGoal] = useState<string>("REACH");
  const [billingEvent, setBillingEvent] = useState<string>("IMPRESSIONS");
  const [bidAmount, setBidAmount] = useState<number>();
  const [dailyBudget, setDailyBudget] = useState<number>();
  const [adSetName, setAdSetName] = useState<string>();
  const [endTimeFormatted, setEndTimeFormatted] = useState<string>();

  const optimizationGoalTypes = [
    "NONE",
    "APP_INSTALLS",
    "AD_RECALL_LIFT",
    "CLICKS",
    "ENGAGED_USERS",
    "EVENT_RESPONSES",
    "IMPRESSIONS",
    "LEAD_GENERATION",
    "QUALITY_LEAD",
    "LINK_CLICKS",
    "OFFSITE_CONVERSIONS",
    "PAGE_LIKES",
    "POST_ENGAGEMENT",
    "QUALITY_CALL",
    "REACH",
    "LANDING_PAGE_VIEWS",
    "VISIT_INSTAGRAM_PROFILE",
    "VALUE",
    "THRUPLAY",
    "DERIVED_EVENTS",
    "APP_INSTALLS_AND_OFFSITE_CONVERSIONS",
    "CONVERSATIONS",
  ];

  const billingEventTypes = [
    "APP_INSTALLS",
    "CLICKS",
    "IMPRESSIONS",
    "LINK_CLICKS",
    "OFFER_CLAIMS",
    "PAGE_LIKES",
    "POST_ENGAGEMENT",
    "VIDEO_VIEWS",
    "THRUPLAY",
  ];

  const [createAdsetResponse, setCreateAdsetResponse] = useState<any>();

  function createNewAdSet(e: any) {
    e.preventDefault();

    const access_token =
      session && JSON.parse(JSON.stringify(session))?.accessToken;
    const ad_account_id = localStorage.getItem("ad_account_id");

    fetch(`https://graph.facebook.com/v19.0/${ad_account_id}/adsets`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: adSetName,
        optimization_goal: optimizationGoal,
        billing_event: billingEvent,
        daily_budget: dailyBudget,
        bid_amount: bidAmount,
        campaign_id: activeAndPausedCampaigns?.find(
          (campaign) => campaign.name === selectedCampaign
        )?.id,
        targeting: {
          geo_locations: {
            countries: ["IN"],
          },
        },
        status: "PAUSED",
        access_token: access_token,
      }),
    })
      .then((response) => response.json())
      .then((data) => setCreateAdsetResponse({ response: data }));
  }

  function convertToIST(date: string) {
    let dateObj = new Date(date);
    return (
      dateObj.getFullYear() +
      "-" +
      dateObj.getMonth().toString().padStart(2, "0") +
      "-" +
      dateObj.getDate().toString().padStart(2, "0") +
      " " +
      dateObj.getHours().toString().padStart(2, "0") +
      ":" +
      dateObj.getMinutes().toString().padStart(2, "0") +
      ":" +
      dateObj.getSeconds().toString().padStart(2, "0") +
      " IST"
    );
  }

  useEffect(() => {
    if (endTime) {
      setEndTimeFormatted(convertToIST(endTime).toLocaleString());
    }
  }, [endTime]);

  return (
    <MainLayout>
      <h1 className="text-xl font-medium mb-4">Create a new ad set</h1>
      <button
        className="mb-4 px-2 py-1 rounded-sm bg-blue-600 text-white hover:bg-blue-700 transition"
        onClick={() => getActiveAndPausedCampaigns()}
      >
        Load Campaigns
      </button>
      {activeAndPausedCampaigns && activeAndPausedCampaigns.length > 0 && (
        <form className="mb-4">
          <div className="mb-4">
            <div className="mb-1">
              <label className="text-sm" htmlFor="campaign-name">
                Select a Campaign to create Ad Set
              </label>
            </div>
            <Select
              value={selectedCampaign}
              onValueChange={(value) => setSelectedCampaign(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Campaign" />
              </SelectTrigger>
              <SelectContent>
                {activeAndPausedCampaigns?.map((campaign) => (
                  <SelectItem
                    key={"campaign-" + campaign.name}
                    value={campaign.name}
                  >
                    {campaign.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedCampaign && (
            <>
              <div className="mb-1">
                <label className="text-sm" htmlFor="ad-set-name">
                  Ad Set Name
                </label>
              </div>
              <input
                value={adSetName}
                onChange={(e) => setAdSetName(e.target.value)}
                type="text"
                id="ad-set-name"
                name="ad-set-name"
                className="px-2 py-1 rounded-sm border border-gray-500 transition focus:border-blue-500 focus:outline-none mb-4"
                required
              />

              <div className="mb-4">
                <div className="mb-1">
                  <label className="text-sm" htmlFor="daily-budget">
                    Daily Budget
                  </label>
                </div>
                <input
                  value={dailyBudget}
                  onChange={(e) => setDailyBudget(Number(e.target.value))}
                  type="number"
                  id="daily-budget"
                  name="daily-budget"
                  className="px-2 py-1 rounded-sm border border-gray-500 transition focus:border-blue-500 focus:outline-none mb-4"
                  required
                />
              </div>

              <div className="mb-4">
                <div className="mb-1">
                  <label className="text-sm" htmlFor="bid-amount">
                    Bid Amount
                  </label>
                </div>
                <input
                  value={bidAmount}
                  onChange={(e) => setBidAmount(Number(e.target.value))}
                  type="number"
                  id="bid-amount"
                  name="bid-amount"
                  className="px-2 py-1 rounded-sm border border-gray-500 transition focus:border-blue-500 focus:outline-none mb-4"
                  required
                />
              </div>

              <div className="mb-4">
                <div className="mb-1">
                  <label className="text-sm" htmlFor="optimization-goal">
                    Optimization Goal
                  </label>
                </div>
                <Select
                  value={optimizationGoal}
                  onValueChange={(value) => setOptimizationGoal(value)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Optimization Goal" />
                  </SelectTrigger>
                  <SelectContent>
                    {optimizationGoalTypes.map((goal) => (
                      <SelectItem key={"goal-" + goal} value={goal}>
                        {goal}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="mb-4">
                <div className="mb-1">
                  <label className="text-sm" htmlFor="billing-event">
                    Billing Event
                  </label>
                </div>
                <Select
                  value={billingEvent}
                  onValueChange={(value) => setBillingEvent(value)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Billing Event" />
                  </SelectTrigger>
                  <SelectContent>
                    {billingEventTypes.map((event) => (
                      <SelectItem key={"event-" + event} value={event}>
                        {event}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="mb-4">
                <div className="mb-1">
                  <label className="text-sm" htmlFor="end-time">
                    End Time
                  </label>
                </div>
                <input
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  id="end-time"
                  name="end-time"
                  className="px-2 py-1 rounded-sm border border-gray-500 transition focus:border-blue-500 focus:outline-none mb-4"
                  type="datetime-local"
                  min={new Date().toISOString().split(".")[0]}
                  // max="2018-06-14T00:00"
                  required
                />
              </div>
            </>
          )}

          <br />
          {selectedCampaign && (
            <button
              onClick={(e) => createNewAdSet(e)}
              className="px-2 py-1 rounded-sm bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              Create Ad Set
            </button>
          )}
        </form>
      )}

      {createAdsetResponse && (
        <pre className="mb-4">
          <details className="mb-4">
            <summary>Newly Cerated Ad Set</summary>
            <pre className="mb-4">
              {JSON.stringify(createAdsetResponse, null, 2)}
            </pre>
          </details>
        </pre>
      )}
    </MainLayout>
  );
};

export default NewAdsetPage;
