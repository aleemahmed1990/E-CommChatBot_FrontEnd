// ReferralDashboard.js
import React, { useState } from "react";
import { Search, Filter, MoreVertical } from "lucide-react";
import Sidebar from "../Sidebar/sidebar";
import ReferralDetail from "../Refferal/referralDetail";
import { useNavigate } from "react-router-dom";

const DUMMY_VIDEOS = [
  { id: "1A", customer: "Ali", shared: 6, code: "123A", date: "4.12.2024" },
  { id: "2B", customer: "David", shared: 6, code: "123B", date: "4.12.2024" },
  { id: "3C", customer: "Frisky", shared: 8, code: "123C", date: "4.12.2024" },
];

const TABS = [
  { key: "incoming", label: "Incoming unverified videos" },
  { key: "manager", label: "videos moved to manager" },
  { key: "verified", label: "Verified videos" },
  { key: "spam", label: "videos moved to spam" },
];

const TIME_FILTERS = [
  "Today",
  "This week",
  "This month",
  "Most referred person",
];

// Map each tab key to status text + pill classes
const STATUS_MAP = {
  incoming: {
    text: "Pending/unverified",
    classes: "bg-gray-200 text-gray-700",
  },
  manager: {
    text: "Moved to manager",
    classes: "bg-yellow-300 text-yellow-800",
  },
  verified: { text: "Verified", classes: "bg-green-200 text-green-800" },
  spam: { text: "Moved to spam", classes: "bg-red-200 text-red-800" },
};

export default function ReferralDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("incoming");
  const [timeFilter, setTimeFilter] = useState("Today");
  const [menuOpen, setMenuOpen] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const navigate = useNavigate();

  // Simple search filter
  const filtered = DUMMY_VIDEOS.filter(
    (v) =>
      v.id.toLowerCase().includes(search.toLowerCase()) ||
      v.customer.toLowerCase().includes(search.toLowerCase())
  );

  // If user clicked “View Video,” show detail screen
  if (selectedVideo) {
    return (
      <ReferralDetail
        video={selectedVideo}
        onBack={() => setSelectedVideo(null)}
        sidebarOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />
    );
  }

  const { text: statusText, classes: statusClasses } = STATUS_MAP[activeTab];

  return (
    <div className="flex min-h-screen">
      <Sidebar
        isOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      <div
        className={`transition-all duration-300 ${
          sidebarOpen ? "lg:ml-80" : ""
        } w-full bg-gray-50 p-6`}
      >
        {/* Title */}
        <h1 className="text-2xl font-semibold mb-4">
          Referral Video Verifications
        </h1>
        <button
          onClick={() => navigate("/referral-profits")}
          className="ml-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Foreman Profits
        </button>

        {/* Search & Filter */}
        <div className="flex items-center justify-between mb-6">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border rounded p-2 pr-10"
            />
            <Search className="absolute right-3 top-1/2 -mt-2 text-gray-400 cursor-pointer" />
          </div>
          <button className="ml-4 flex items-center border rounded px-4 py-2 bg-white">
            <span>Filter</span>
            <Filter className="ml-2" />
          </button>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg overflow-hidden mb-4 shadow">
          <div className="grid grid-cols-4">
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={`py-3 text-center font-medium ${
                  activeTab === t.key
                    ? "bg-green-100 text-gray-900 border-b-4 border-green-500"
                    : "text-gray-700"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Time Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          {TIME_FILTERS.map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeFilter(tf)}
              className={`px-6 py-2 rounded ${
                timeFilter === tf ? "bg-green-100" : "bg-white border"
              }`}
            >
              {tf}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                  Video ID
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                  Shared
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                  Video
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                  Created on
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filtered.map((v, idx) => (
                <tr key={v.id} className={idx % 2 ? "bg-gray-50" : ""}>
                  <td className="px-6 py-4 text-sm text-gray-700">{v.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {v.customer}
                  </td>
                  <td className="px-6 py-4 text-sm text-blue-600">
                    {v.shared} people
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">{v.code}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{v.date}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${statusClasses}`}
                    >
                      {statusText}
                    </span>
                  </td>
                  <td className="px-6 py-4 relative">
                    <MoreVertical
                      className="cursor-pointer"
                      onClick={() => setMenuOpen(menuOpen === idx ? null : idx)}
                    />
                    {menuOpen === idx && (
                      <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow-lg z-10">
                        <button
                          onClick={() => setSelectedVideo(v)}
                          className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                        >
                          View Video
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="p-4 text-right text-sm text-gray-600">
            1 out of 20
          </div>
        </div>
      </div>
    </div>
  );
}
