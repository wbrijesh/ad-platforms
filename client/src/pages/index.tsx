import AuthLayout from "@/layouts/main";

const HomePage = () => {
  return (
    <AuthLayout>
      <div className="flex items-center justify-between px-5 py-3 border-b border-ds-zinc-250 shadow-ds-zinc-150">
        <p className="text-base text-semibold text-zinc-900">Dashboard</p>
        <div></div>
      </div>

      <div
        className="flex items-center justify-center flex-col m-4"
        style={{ height: "calc(100vh - 50px)" }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="size-6"
        >
          <path d="M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.036-.84-1.875-1.875-1.875h-.75ZM9.75 8.625c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-.75a1.875 1.875 0 0 1-1.875-1.875V8.625ZM3 13.125c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v6.75c0 1.035-.84 1.875-1.875 1.875h-.75A1.875 1.875 0 0 1 3 19.875v-6.75Z" />
        </svg>

        <p className="text-xl font-medium mt-3">No Dashboard Available</p>

        <p className="mb-5">
          Dashboard will be implemented in the future. Stay tuned!
        </p>
      </div>
    </AuthLayout>
  );
};

export default HomePage;
