import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import {
  Cog8ToothIcon,
  FolderIcon,
  CalendarIcon,
} from "@heroicons/react/16/solid";
import ParseJWT from "@/lib/jwt";
import Link from "next/link";
import {
  FacebookIcon,
  GoogleAdsIcon,
  TwitterIcon,
  LogoutIcon,
} from "@/components/custom-icons/temporary";
import { useRouter } from "next/router";
import { LogOutIcon } from "lucide-react";
import { SetCookie } from "@/lib/cookies";

const navigation = [
  { name: "Projects", href: "#", icon: FolderIcon, current: false },
  { name: "Calendar", href: "#", icon: CalendarIcon, current: false },
  { name: "Settings", href: "#", icon: Cog8ToothIcon, current: false },
];

const platforms = [
  {
    name: "Facebook Ads",
    href: "/fb",
    icon: FacebookIcon,
    current: false,
    subItems: [
      { name: "Campaigns", href: "/fb/campaigns", current: false },
      { name: "Ad Sets", href: "/fb/adsets", current: false },
      { name: "Ads", href: "/fb/ads", current: false },
    ],
  },
  {
    name: "Google Ads",
    href: "/google",
    icon: GoogleAdsIcon,
    current: false,
    subItems: [
      { name: "Campaigns", href: "/google/campaigns", current: false },
      { name: "Ad Groups", href: "/google/adgroups", current: false },
      { name: "Ads", href: "/google/ads", current: false },
    ],
  },
  { name: "Twitter Ads", href: "/404", icon: TwitterIcon, current: false },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const UserProfile = ({ name, role }: { name: string; role: string }) => {
  return (
    <div className="flex gap-2 items-center">
      <div className="bg-yellow-700 rounded-md h-6 w-6 flex items-center justify-center">
        <p className="text-white text-xs font-light">
          {name
            .split(" ")
            .map((word) => word[0].toUpperCase() + word[1].toUpperCase())
            .join("")}
        </p>
      </div>
      <div className="flex gap-1">
        <p className="text-sm font-medium text-zinc-700 capitalize">{name}</p>
        <p className="text-sm font-light text-zinc-500 capitalize"> ({role})</p>
      </div>
    </div>
  );
};

const DesktopSidebar = ({
  navigation,
  adPlatformsToken,
}: {
  navigation: any;
  adPlatformsToken: string;
}) => {
  const router = useRouter();
  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-60 lg:flex-col bg-slate-100">
      {/* Sidebar component, swap this element with another sidebar if you like */}
      <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-ds-zinc-150 px-5">
        <div className="flex h-14 items-center">
          <UserProfile
            name={ParseJWT(adPlatformsToken)?.first_name}
            role={ParseJWT(adPlatformsToken)?.role}
          />
        </div>
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col">
            <li>
              <ul role="list" className="-mx-2 space-y-1">
                {platforms.map((item: any) => (
                  <li
                    className="flex flex-col  items-center w-full"
                    key={item.name}
                  >
                    <Link
                      href={item.href}
                      className={classNames(
                        router.pathname === item.href
                          ? "bg-ds-zinc-250 text-ds-decoration-blue"
                          : "hover:bg-ds-zinc-250 text-zinc-700",
                        "group flex gap-x-3 rounded-md px-2 py-1.5 text-sm w-full hover:text-ds-decoration-blue",
                      )}
                    >
                      <item.icon
                        className={classNames(
                          router.pathname === item.href
                            ? "text-blue-600"
                            : "text-zinc-600 group-hover:text-blue-600",
                          "h-4 w-4 shrink-0 flex items-center mt-0.5",
                        )}
                        aria-hidden="true"
                      />
                      {item.name}
                    </Link>

                    {/* render subitems */}
                    {item.subItems && router.pathname.startsWith(item.href) && (
                      <div className="ml-14 w-full">
                        {item.subItems.map((subItem: any) => (
                          <div className="mr-7" key={subItem.name}>
                            <Link
                              href={subItem.href}
                              className={classNames(
                                router.pathname === subItem.href
                                  ? "bg-ds-zinc-250 text-ds-decoration-blue"
                                  : "hover:bg-ds-zinc-250 text-zinc-700",
                                "group flex gap-x-3 rounded-md px-2 py-1.5 text-sm w-full hover:text-ds-decoration-blue",
                              )}
                            >
                              {subItem.icon && (
                                <subItem.icon
                                  className={classNames(
                                    router.pathname === subItem.href
                                      ? "text-blue-600"
                                      : "text-zinc-600 group-hover:text-blue-600",
                                    "h-4 w-4 shrink-0 flex items-center mt-0.5",
                                  )}
                                  aria-hidden="true"
                                />
                              )}
                              {subItem.name}
                            </Link>
                          </div>
                        ))}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </li>

            <li className="mb-4 mt-auto">
              <ul role="list" className="-mx-2 space-y-1">
                {navigation.map((item: any) => (
                  <li className="flex items-center h-7 w-full" key={item.name}>
                    <Link
                      href={item.href}
                      className={classNames(
                        router.pathname === item.href
                          ? "bg-ds-zinc-250 text-zinc-800"
                          : "hover:bg-ds-zinc-250 text-zinc-700",
                        "group flex gap-x-3 rounded-md px-2 py-1.5 text-sm w-full hover:text-zinc-800",
                      )}
                    >
                      <item.icon
                        className={classNames(
                          router.pathname === item.href
                            ? "text-blue-600"
                            : "text-zinc-600 group-hover:text-blue-600",
                          "h-4 w-4 shrink-0 flex items-center mt-0.5",
                        )}
                        aria-hidden="true"
                      />
                      {item.name}
                    </Link>
                  </li>
                ))}

                <li className="flex items-center h-7 w-full">
                  <button
                    className={classNames(
                      "group flex gap-x-3 rounded-md px-2 py-1.5 text-sm w-full text-zinc-700 hover:bg-ds-zinc-250 hover:text-zinc-800",
                    )}
                    onClick={() => {
                      SetCookie("ad_platforms_token", "", 0);
                      window.location.reload();
                    }}
                  >
                    <LogoutIcon />
                    Log Out
                  </button>
                </li>
              </ul>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

const MobileTransitionSidebar = ({
  sidebarOpen,
  setSidebarOpen,
  navigation,
}: {
  sidebarOpen: boolean;
  setSidebarOpen: (value: boolean) => void;
  navigation: any;
}) => {
  return (
    <Transition.Root show={sidebarOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50 lg:hidden"
        onClose={setSidebarOpen}
      >
        <Transition.Child
          as={Fragment}
          enter="transition-opacity ease-linear duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity ease-linear duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-900/80" />
        </Transition.Child>

        <div className="fixed inset-0 flex">
          <Transition.Child
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
              <Transition.Child
                as={Fragment}
                enter="ease-in-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in-out duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                  <button
                    type="button"
                    className="-m-2.5 p-2.5"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <span className="sr-only">Close sidebar</span>
                    <XMarkIcon
                      className="h-6 w-6 text-white"
                      aria-hidden="true"
                    />
                  </button>
                </div>
              </Transition.Child>
              {/* Sidebar component, swap this element with another sidebar if you like */}
              <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-2">
                <div className="flex h-16 shrink-0 items-center">
                  <UserProfile name="--" role="--" />
                </div>
                <nav className="flex flex-1 flex-col">
                  <ul role="list" className="flex flex-1 flex-col gap-y-7">
                    <li>
                      <ul role="list" className="-mx-2 space-y-1">
                        {navigation.map((item: any) => (
                          <li key={item.name}>
                            <Link
                              href={item.href}
                              className={classNames(
                                item.current
                                  ? "bg-ds-zinc-250 text-zinc-800"
                                  : "hover:bg-ds-zinc-250 text-zinc-500",
                                "group flex gap-x-3 rounded-md px-2 py-1.5 text-sm w-full hover:text-zinc-800",
                              )}
                            >
                              <item.icon
                                className={classNames(
                                  item.current
                                    ? "text-blue-600"
                                    : "text-gray-400 group-hover:text-blue-600",
                                  "h-6 w-6 shrink-0",
                                )}
                                aria-hidden="true"
                              />
                              {item.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </li>
                  </ul>
                </nav>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

const MobileNavbar = ({
  setSidebarOpen,
}: {
  setSidebarOpen: (value: boolean) => void;
}) => {
  return (
    <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-white px-4 py-4 shadow-sm sm:px-6 lg:hidden">
      <button
        type="button"
        className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
        onClick={() => setSidebarOpen(true)}
      >
        <span className="sr-only">Open sidebar</span>
        <Bars3Icon className="h-6 w-6" aria-hidden="true" />
      </button>
      <div className="flex-1 text-sm font-semibold leading-6 text-gray-900">
        Dashboard
      </div>
      <Link href="#">
        <span className="sr-only">Your profile</span>
        <UserProfile name="--" role="--" />
      </Link>
    </div>
  );
};

export default function SidebarLayout({
  adPlatformsToken,
  children,
}: {
  adPlatformsToken: string;
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div>
      <MobileTransitionSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        navigation={navigation}
      />

      {/* Static sidebar for desktop */}
      <DesktopSidebar
        navigation={navigation}
        adPlatformsToken={adPlatformsToken}
      />

      <MobileNavbar setSidebarOpen={setSidebarOpen} />

      <main className="lg:pl-60">{children}</main>
    </div>
  );
}

// <html className="h-full bg-white">
// <body className="h-full">
