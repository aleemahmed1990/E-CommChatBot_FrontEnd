// AllDiscounts.js
import React, { useState } from "react";
import {
  Bell,
  Home,
  Search as SearchIcon,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Sidebar from "../Sidebar/sidebar";

const dummyDiscounts = [
  {
    id: 1,
    type: "Clearance",
    product: "Tool",
    forWho: "Foreman",
    newPrice: "$100",
    status: "Expired",
    startDate: "2.4.2025",
    endDate: "3.5.2025",
  },
  {
    id: 2,
    type: "New product",
    product: "lucky cement",
    forWho: "Forman earnings mlm",
    newPrice: "$6",
    status: "Expired",
    startDate: "2.4.2025",
    endDate: "3.5.2025",
  },
  {
    id: 3,
    type: "General discount",
    product: "Drill",
    forWho: "Public",
    newPrice: "$6",
    status: "Ongoing",
    startDate: "2.4.2025",
    endDate: "3.5.2025",
  },
  {
    id: 4,
    type: "Fixed amount",
    product: "Screws",
    forWho: "Public referral",
    newPrice: "$100",
    status: "Scheduled",
    startDate: "2.4.2025",
    endDate: "3.5.2025",
  },
  {
    id: 5,
    type: "Above amount",
    product: "Paint",
    forWho: "Public",
    newPrice: "6%",
    status: "Ongoing",
    startDate: "2.4.2025",
    endDate: "3.5.2025",
  },
  {
    id: 6,
    type: "Specific amount",
    product: "Thiner",
    forWho: "Public referral",
    newPrice: "6%",
    status: "Ongoing",
    startDate: "2.4.2025",
    endDate: "3.5.2025",
  },
];

export default function AllDiscounts() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = dummyDiscounts.filter((d) =>
    [d.id, d.type, d.product, d.forWho]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const statusColor = (status) => {
    if (status === "Expired") return "text-red-500";
    if (status === "Ongoing") return "text-green-500";
    if (status === "Scheduled") return "text-orange-500";
    return "";
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <div
        className={`transition-all duration-300 ${
          isSidebarOpen ? "lg:ml-80" : ""
        } w-full bg-purple-50 p-4`}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4 bg-purple-800 p-4 rounded text-white">
          <div className="flex items-center space-x-2">
            <Home size={20} />
            <h1 className="text-lg font-semibold">72. All Discounts</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Bell size={20} className="cursor-pointer" />
            <div className="w-8 h-8 bg-purple-400 rounded-full" />
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
          <div className="flex flex-1 max-w-md items-center gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border rounded pl-4 pr-10 py-2"
              />
              <SearchIcon className="absolute right-3 top-1/2 -mt-2 text-gray-400" />
            </div>
            <button className="flex items-center px-3 py-2 bg-white border rounded">
              <span>Status: All</span>
              <ChevronDown className="ml-2" size={16} />
            </button>
          </div>
          <button className="flex items-center px-3 py-2 bg-white border rounded">
            <span>Filter by date range</span>
            <ChevronDown className="ml-2" size={16} />
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-white">
              <tr>
                {[
                  "Discount id",
                  "Type",
                  "Product",
                  "Applicable to who",
                  "new price",
                  "Status",
                  "Start date",
                  "End date",
                ].map((col) => (
                  <th
                    key={col}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase whitespace-nowrap"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filtered.map((d, idx) => (
                <tr key={idx}>
                  <td className="px-6 py-4 text-sm text-gray-700">{d.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{d.type}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {d.product}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {d.forWho}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {d.newPrice}
                  </td>
                  <td
                    className={`px-6 py-4 text-sm font-medium ${statusColor(
                      d.status
                    )}`}
                  >
                    {d.status}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {d.startDate}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {d.endDate}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center mt-4 gap-2 text-sm text-gray-600">
          <ChevronLeft className="cursor-not-allowed text-gray-400" />
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              className={`w-8 h-8 flex items-center justify-center rounded ${
                n === 1 ? "bg-blue-500 text-white" : "hover:bg-gray-100"
              }`}
            >
              {n}
            </button>
          ))}
          <ChevronDown className="opacity-0" /> {/* spacer */}
          <ChevronRight className="cursor-pointer hover:text-gray-700" />
        </div>
      </div>
    </div>
  );
}
