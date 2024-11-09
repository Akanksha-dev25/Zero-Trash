"use client";

import { useState, useEffect } from "react";
import {
  ArrowRight,
  Leaf,
  Recycle,
  Users,
  Coins,
  MapPin,
  ChevronRight,
  Globe,
  BarChart2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Poppins } from "next/font/google";
import Link from "next/link";
import {
  getRecentReports,
  getAllRewards,
  getWasteCollectionTasks,
} from "@/utils/db/actions";

const poppins = Poppins({
  weight: ["300", "400", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

function AnimatedGlobe() {
  return (
    <div className="relative w-40 h-40 mx-auto mb-12">
      <div className="absolute inset-0 rounded-full bg-green-500 opacity-20 animate-pulse"></div>
      <div className="absolute inset-2 rounded-full bg-green-400 opacity-40 animate-ping"></div>
      <div className="absolute inset-4 rounded-full bg-green-300 opacity-60 animate-spin"></div>
      <div className="absolute inset-6 rounded-full bg-green-200 opacity-80 animate-bounce"></div>
      <Globe className="absolute inset-0 m-auto h-20 w-20 text-green-600 animate-pulse" />
    </div>
  );
}

export default function Home() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [impactData, setImpactData] = useState({
    wasteCollected: 0,
    reportsSubmitted: 0,
    tokensEarned: 0,
    co2Offset: 0,
  });

  useEffect(() => {
    async function fetchImpactData() {
      try {
        const reports = await getRecentReports(100);
        const rewards = await getAllRewards();
        const tasks = await getWasteCollectionTasks(100);

        const wasteCollected = tasks.reduce((total, task) => {
          const match = task.amount.match(/(\d+(\.\d+)?)/);
          const amount = match ? parseFloat(match[0]) : 0;
          return total + amount;
        }, 0);

        const reportsSubmitted = reports.length;
        const tokensEarned = rewards.reduce(
          (total, reward) => total + (reward.points || 0),
          0
        );
        const co2Offset = wasteCollected * 0.5;

        setImpactData({
          wasteCollected: Math.round(wasteCollected * 10) / 10,
          reportsSubmitted,
          tokensEarned,
          co2Offset: Math.round(co2Offset * 10) / 10,
        });
      } catch (error) {
        console.error("Error fetching impact data:", error);
        setImpactData({
          wasteCollected: 0,
          reportsSubmitted: 0,
          tokensEarned: 0,
          co2Offset: 0,
        });
      }
    }

    fetchImpactData();
  }, []);

  const login = () => {
    setLoggedIn(true);
  };

  return (
    <div
      className={`min-h-screen bg-gradient-to-b from-green-50 to-white ${poppins.className}`}
    >
      <div className="container mx-auto px-4 py-16">
        <section className="text-center mb-24">
          <AnimatedGlobe />
          <h1 className="text-6xl font-bold mb-6 text-gray-800 tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-teal-500">
              Zero-Trash
            </span>{" "}
            Waste Management
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed mb-12">
            Join our community in making waste management more efficient and
            rewarding. Together, we can create a cleaner, greener future!
          </p>
          {!loggedIn ? (
            <Button
              onClick={login}
              className="bg-gradient-to-r from-green-500 to-teal-400 hover:from-green-600 hover:to-teal-500 text-white text-lg py-6 px-10 rounded-full font-medium transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          ) : (
            <Link href="/report">
              <Button className="bg-gradient-to-r from-green-500 to-teal-400 hover:from-green-600 hover:to-teal-500 text-white text-lg py-6 px-10 rounded-full font-medium transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg hover:shadow-xl">
                Report Waste
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          )}
        </section>

        <section className="grid md:grid-cols-3 gap-10 mb-24">
          <FeatureCard
            icon={Leaf}
            title="Eco-Friendly"
            description="Contribute to a cleaner environment by reporting and collecting waste."
          />
          <FeatureCard
            icon={Coins}
            title="Earn Rewards"
            description="Get tokens for your contributions to waste management efforts."
          />
          <FeatureCard
            icon={Users}
            title="Community-Driven"
            description="Be part of a growing community committed to sustainable practices."
          />
        </section>

        <section className="bg-white p-10 rounded-3xl shadow-xl mb-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gray-100"></div>
          <div className="relative z-10">
            <h2 className="text-4xl font-bold mb-12 text-center text-gray-800">
              Our Impact
            </h2>
            <div className="grid md:grid-cols-4 gap-8">
              <ImpactCard
                title="Waste Collected"
                value={`${impactData.wasteCollected} kg`}
                icon={Recycle}
              />
              <ImpactCard
                title="Reports Submitted"
                value={impactData.reportsSubmitted.toString()}
                icon={MapPin}
              />
              <ImpactCard
                title="Tokens Earned"
                value={impactData.tokensEarned.toString()}
                icon={Coins}
              />
              <ImpactCard
                title="CO2 Offset"
                value={`${impactData.co2Offset} kg`}
                icon={Leaf}
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function ImpactCard({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
}) {
  const formattedValue =
    typeof value === "number"
      ? value.toLocaleString("en-US", { maximumFractionDigits: 1 })
      : value;

  return (
    <div className="p-6 rounded-xl bg-white border border-gray-100 transition-all duration-300 ease-in-out hover:shadow-lg group">
      <div className="flex items-center justify-between mb-4">
        <Icon className="h-10 w-10 text-green-500 group-hover:text-green-600 transition-colors duration-300" />
      </div>
      <p className="text-3xl font-bold mb-2 text-gray-800 group-hover:text-green-600 transition-colors duration-300">
        {formattedValue}
      </p>
      <p className="text-sm text-gray-600 group-hover:text-gray-800 transition-colors duration-300">
        {title}
      </p>
    </div>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 ease-in-out flex flex-col items-center text-center group">
      <div className="bg-green-100 p-4 rounded-full mb-6 group-hover:bg-green-200 transition-colors duration-300">
        <Icon className="h-8 w-8 text-green-600 group-hover:text-green-700 transition-colors duration-300" />
      </div>
      <h3 className="text-xl font-semibold mb-4 text-gray-800 group-hover:text-green-600 transition-colors duration-300">
        {title}
      </h3>
      <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
        {description}
      </p>
    </div>
  );
}
