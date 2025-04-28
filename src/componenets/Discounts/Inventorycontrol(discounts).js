// InventoryControlCheckDiscount.js (73 B)
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  Home,
  Search as SearchIcon,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Sidebar from "../Sidebar/sidebar";

const DUMMY_B = [
  {
    id: "#5089",
    name: "Lucky cement",
    category: "cement",
    price: "$2,564",
    currentStock: "12 bags",
    fillingStock: "12 bags",
    stockAfter: "24 bags",
    around: "24 bags",
    alert: "2 bags",
    status: "Ongoing",
  },
  {
    id: "#5090",
    name: "Super sand",
    category: "sand",
    price: "$1,200",
    currentStock: "20 bags",
    fillingStock: "15 bags",
    stockAfter: "35 bags",
    around: "35 bags",
    alert: "0 bags",
    status: "Expired",
  },
  {
    id: "#5091",
    name: "Ultra gravel",
    category: "gravel",
    price: "$3,100",
    currentStock: "0 bags",
    fillingStock: "0 bags",
    stockAfter: "0 bags",
    around: "5 bags",
    alert: "5 bags",
    status: "Scheduled",
  },
];

const statusStyles = {
  Expired: "bg-red-100 text-red-800",
  Ongoing: "bg-green-100 text-green-800",
  Scheduled: "bg-orange-100 text-orange-800",
};

export default function InventoryControlCheckDiscount() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [corrections, setCorrections] = useState({});
  const navigate = useNavigate();

  const filtered = DUMMY_B.filter((r) =>
    [r.id, r.name, r.category]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

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
            <h1 className="text-lg font-semibold">
              73 (discount) Inventory control check B
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <Bell className="cursor-pointer" size={20} />
            <div className="w-8 h-8 bg-purple-400 rounded-full" />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 mb-4">
          <button
            onClick={() => navigate("/discount-inventory")}
            className="px-4 py-2 bg-white text-gray-700 border rounded"
          >
            73 A
          </button>
          <button
            onClick={() => navigate("/discount-inventory-check")}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            73 B
          </button>
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
        <div className="relative overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-white">
              <tr>
                {[
                  "ID",
                  "PRODUCT NAME",
                  "CATEGORY",
                  "PRICE/UNIT",
                  "CURRENT STOCK",
                  "FILLING STOCK",
                  "STOCK AFTER FILL",
                  "STOCK AROUND FACILITY",
                  "OUT OF STOCK ALERT",
                  "ACTION",
                ].map((col) => (
                  <th
                    key={col}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase whitespace-nowrap"
                  >
                    {col}
                  </th>
                ))}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase sticky right-0 bg-white">
                  correction:
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filtered.map((r, i) => (
                <tr key={i} className={i % 2 ? "bg-gray-50" : "bg-white"}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {r.id}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">{r.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {r.category}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">{r.price}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {r.currentStock}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {r.fillingStock}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {r.stockAfter}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {r.around}
                  </td>
                  <td className="px-6 py-4 text-sm text-red-500">{r.alert}</td>
                  <td className="px-6 py-4 text-sm text-indigo-600 hover:underline cursor-pointer">
                    View Details
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap sticky right-0 bg-white">
                    <input
                      type="number"
                      value={corrections[i] ?? 5}
                      onChange={(e) =>
                        setCorrections((c) => ({
                          ...c,
                          [i]: Number(e.target.value),
                        }))
                      }
                      className="w-16 text-center border rounded"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col md:flex-row items-center justify-between mt-4 text-sm text-gray-600">
          <div className="flex items-center mb-2 md:mb-0">
            <span>Showing</span>
            <select className="mx-2 border rounded px-2 py-1">
              {[10, 20, 30].map((n) => (
                <option key={n}>{n}</option>
              ))}
            </select>
            <span>of 50</span>
          </div>
          <div className="flex items-center space-x-1">
            <ChevronLeft className="text-gray-400 cursor-not-allowed" />
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
            <ChevronRight className="cursor-pointer hover:text-gray-700" />
          </div>
        </div>
      </div>
    </div>
  );
}
