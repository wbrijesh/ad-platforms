import AuthLayout from "@/layouts/main";
import { SetCookie } from "@/lib/cookies";

const HomePage = () => {
  return (
    <AuthLayout>
      <div className="flex items-center justify-between px-5 py-3 border-b border-ds-zinc-250 shadow-ds-zinc-150">
        <p className="text-base text-semibold text-zinc-900">Dashboard</p>
        <div></div>
      </div>

      <p className="mb-5">
        Todo: Build a non ideal state to select platforms from
      </p>
      <button
        className="bg-blue-500 px-[8px] py-[6px] rounded transition duration-300 hover:bg-blue-600 text-white text-sm font-medium"
        onClick={() => {
          SetCookie("ad_platforms_token", "", 0);
          window.location.reload();
        }}
      >
        Sign Out
      </button>
    </AuthLayout>
  );
};

export default HomePage;
