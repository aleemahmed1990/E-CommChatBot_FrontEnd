// FillingInventory.js
import React, { useState } from "react";
import {
  Bell,
  Search as SearchIcon,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Sidebar from "../Sidebar/sidebar";

export default function FillingInventory() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [quantities, setQuantities] = useState({});

  const data = [
    {
      id: "#5089",
      productName: "Lucky cement",
      category: "cement",
      price: "$2,564",
      currentStock: "12 bags",
      fillingStock: "12 bags",
      stockAfterFill: "24 bags",
      stockAroundFacility: "24 bags",
      outOfStockAlert: "2 bags",
    },
    {
      id: "#5089",
      productName: "Lucky cement",
      category: "cement",
      price: "$2,564",
      currentStock: "12 bags",
      fillingStock: "12 bags",
      stockAfterFill: "24 bags",
      stockAroundFacility: "24 bags",
      outOfStockAlert: "2 bags",
    },
    {
      id: "#5089",
      productName: "Lucky cement",
      category: "cement",
      price: "$2,564",
      currentStock: "12 bags",
      fillingStock: "0 bags",
      stockAfterFill: "12 bags",
      stockAroundFacility: "12 bags",
      outOfStockAlert: "2 bags",
    },
  ];

  const filtered = data.filter(
    (row) =>
      row.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.productName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const inc = (i) => setQuantities((q) => ({ ...q, [i]: (q[i] || 5) + 1 }));
  const dec = (i) =>
    setQuantities((q) => ({
      ...q,
      [i]: Math.max((q[i] || 5) - 1, 0),
    }));

  return (
    <div className="flex min-h-screen">
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <div
        className={`transition-all duration-300 ${
          isSidebarOpen ? "lg:ml-80" : ""
        } w-full bg-gray-50 p-4`}
      >
        {/* Page Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">54 Filling inventory</h2>
          <div className="flex items-center gap-4">
            <Bell className="cursor-pointer" size={20} />
            <div className="w-8 h-8 bg-purple-500 rounded-full" />
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-4 gap-4">
          {/* Left group */}
          <div className="flex flex-1 max-w-md items-center gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-4 pr-10 py-2 border rounded"
              />
              <SearchIcon className="absolute right-3 top-1/2 -mt-2 text-gray-400" />
            </div>
            <button className="flex items-center px-3 py-2 border rounded bg-white">
              <span>Status: All</span>
              <ChevronDown className="ml-2" size={16} />
            </button>
          </div>

          {/* Center */}
          <div className="text-lg font-medium">weeks 1</div>

          {/* Right group */}
          <button className="flex items-center px-3 py-2 border rounded bg-white">
            <span>Filter by date range</span>
            <ChevronDown className="ml-2" size={16} />
          </button>
        </div>

        {/* Table */}
        <div className="relative overflow-x-auto bg-white rounded shadow">
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
                    className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider whitespace-nowrap"
                  >
                    {col}
                  </th>
                ))}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider whitespace-nowrap sticky right-0 bg-white">
                  QUANTITY
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filtered.map((row, idx) => (
                <tr key={idx}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {row.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {row.productName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {row.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {row.price}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {row.currentStock}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {row.fillingStock}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {row.stockAfterFill}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {row.stockAroundFacility}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-red-500">
                    {row.outOfStockAlert}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-indigo-600 hover:underline cursor-pointer">
                    View Details
                  </td>

                  {/* Sticky Quantity Column */}
                  <td className="px-6 py-4 whitespace-nowrap sticky right-0 bg-white">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => inc(idx)}
                        className="px-2 py-1 bg-orange-500 text-white rounded"
                      >
                        +
                      </button>
                      <input
                        type="text"
                        readOnly
                        value={quantities[idx] ?? 5}
                        className="w-12 text-center border"
                      />
                      <button
                        onClick={() => dec(idx)}
                        className="px-2 py-1 bg-orange-500 text-white rounded"
                      >
                        –
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Controls */}
        <div className="flex flex-col md:flex-row items-center justify-between mt-4 text-sm text-gray-600">
          <div className="flex items-center mb-2 md:mb-0">
            <span>Showing</span>
            <select className="mx-2 border rounded px-2 py-1">
              {[10, 20, 30, 40, 50].map((n) => (
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
