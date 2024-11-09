import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Trash,
  Coins,
  Medal,
  Settings,
  Home,
  Leaf,
  Globe,
  ChevronLeft,
} from "lucide-react";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  weight: ["300", "400", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

const sidebarItems = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/report", icon: MapPin, label: "Report Waste" },
  { href: "/collect", icon: Trash, label: "Collect Waste" },
  { href: "/rewards", icon: Coins, label: "Rewards" },
  { href: "/leaderboard", icon: Medal, label: "Leaderboard" },
];

interface SidebarProps {
  open: boolean;
  onClose?: () => void;
}



export default function Component({ open, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Overlay for mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={onClose}
        />
      )}
      
      <aside
        className={`bg-gradient-to-br from-green-600 via-green-700 to-teal-800 text-white w-72 fixed inset-y-0 left-0 z-30 transform transition-all duration-300 ease-in-out ${
          open ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 shadow-2xl overflow-hidden ${poppins.className}`}
      >
        {/* Close button for mobile */}
        <button
          onClick={onClose}
          className="lg:hidden absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>

        <div className="h-full flex flex-col">
          {/* Logo section */}
          <div className="pt-32  pb-4 text-center">
           
            <h1 className="text-2xl font-bold mb-2">ZeroTrash</h1>
            <p className="text-sm text-green-100/80">Making Earth Cleaner</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6">
            <div className="space-y-2">
              {sidebarItems.map((item) => (
                <Link key={item.href} href={item.href} passHref>
                  <Button
                    variant={pathname === item.href ? "secondary" : "ghost"}
                    className={`w-full justify-start py-5 px-6 rounded-xl transition-all duration-300 ease-in-out group hover:scale-102 ${
                      pathname === item.href
                        ? "bg-white/90 text-green-800 shadow-lg"
                        : "text-green-50 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center w-full">
                      <item.icon
                        className={`mr-4 h-5 w-5 transition-transform duration-300 ${
                          pathname === item.href
                            ? "text-green-600"
                            : "group-hover:scale-110"
                        }`}
                      />
                      <span className="text-base font-medium flex-1">{item.label}</span>
                      {pathname === item.href && (
                        <div className="h-2 w-2 rounded-full bg-green-500 ml-2" />
                      )}
                    </div>
                  </Button>
                </Link>
              ))}
            </div>
          </nav>

          {/* Settings and footer */}
          <div className="p-4 mt-auto">
            <div className="p-4 bg-white/10 rounded-xl mb-4">
              <p className="text-sm text-center text-green-100">
                Together we've collected
                <br />
                <span className="text-xl font-bold">1,234 kg</span>
                <br />
                of waste this month
              </p>
            </div>
            
            <Link href="/settings" passHref>
              <Button
                variant={pathname === "/settings" ? "secondary" : "outline"}
                className={`w-full py-4 px-6 rounded-xl transition-all duration-300 group ${
                  pathname === "/settings"
                    ? "bg-white/90 text-green-800 "
                    : "text-green-100 bg-white/10 border-green-400/30 hover:bg-white hover:text-green-800"
                }`}
              >
                <Settings className="mr-4 h-5 w-5 group-hover:rotate-45 transition-transform duration-300" />
                <span className="text-base font-medium">Settings</span>
              </Button>
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}