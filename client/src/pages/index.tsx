import AuthLayout from "@/layouts/main";
import { SetCookie } from "@/lib/cookies";

const HomePage = () => {
  return (
    <AuthLayout>
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
