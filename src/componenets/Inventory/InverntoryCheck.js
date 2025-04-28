// InventoryCheck.js
import React, { useState } from "react";
import {
  Search,
  Home,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Sidebar from "../Sidebar/sidebar";

export default function InventoryCheck() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [status, setStatus] = useState("All");
  const [perPage, setPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  const allInventoryData = [
    {
      id: "#5089",
      productName: "Lucky cement",
      category: "cement",
      price: "$2.564",
      currentStock: "12 bags",
      correctedStock: "12 bags",
      lostStock: "",
      sold: "6 bags",
      alert: "2 bags",
    },
    {
      id: "#5090",
      productName: "Super sand",
      category: "sand",
      price: "$1.200",
      currentStock: "20 bags",
      correctedStock: "20 bags",
      lostStock: "",
      sold: "8 bags",
      alert: "5 bags",
    },
    {
      id: "#5091",
      productName: "Ultra gravel",
      category: "gravel",
      price: "$3.100",
      currentStock: "0 bags",
      correctedStock: "0 bags",
      lostStock: "5 bags",
      sold: "15 bags",
      alert: "0 bags",
    },
  ];

  const filteredData = allInventoryData.filter(
    (item) =>
      searchTerm === "" ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {/* Main Content */}
      <div
        className={`transition-all duration-300 ${
          isSidebarOpen ? "lg:ml-80" : ""
        } w-full bg-gray-100`}
      >
        {/* Header */}
        <header className="bg-gray-700 text-white p-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Home size={20} />
            <span className="font-bold text-lg">33 Inventory check</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">1</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                <span className="text-xs">JM</span>
              </div>
              <div>
                <p className="text-sm font-medium">Jack Miller</p>
                <p className="text-xs text-gray-300">Employee</p>
              </div>
            </div>
          </div>
        </header>

        <div className="p-6">
          {/* Title */}
          <h1 className="text-lg font-medium text-gray-800 mb-6">
            <span className="text-red-500">
              (confirming staff double check and correct)
            </span>
          </h1>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-6">
            {/* Search */}
            <div className="relative w-full sm:w-1/3 md:w-1/4">
              <input
                type="text"
                placeholder="Search by ID..."
                className="w-full pl-3 pr-10 py-2 border rounded-md"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="absolute right-3 top-2.5">
                <Search size={18} className="text-gray-400" />
              </button>
            </div>

            {/* Status */}
            <div className="relative w-full sm:w-1/3 md:w-1/4">
              <button className="w-full flex items-center justify-between px-3 py-2 bg-white border rounded-md">
                <span>Status : {status}</span>
                <ChevronDown size={18} />
              </button>
            </div>

            {/* Stock Quantity */}
            <div className="relative w-full sm:w-1/3 md:w-1/4">
              <button className="w-full flex items-center justify-between px-3 py-2 bg-white border rounded-md">
                <span>Filter by stock quantity</span>
                <ChevronDown size={18} />
              </button>
            </div>

            {/* Date Range */}
            <div className="relative w-full sm:w-1/3 md:w-1/4 ml-auto">
              <button className="w-full flex items-center justify-between px-3 py-2 bg-white border rounded-md">
                <span>Filter by date range</span>
                <ChevronDown size={18} />
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-white">
                  <tr>
                    {[
                      "ID",
                      "Product name",
                      "Category",
                      "Price/unit",
                      "Current stock",
                      "Corrected stock",
                      "Lost stock",
                      "Sold",
                      "Out of stock alert",
                      "Action",
                    ].map((col) => (
                      <th
                        key={col}
                        className="px-6 py-4 text-left text-sm font-medium text-gray-800"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredData.map((item, idx) => (
                    <tr key={idx}>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {item.id}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {item.productName}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {item.category}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {item.price}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {item.currentStock}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {item.correctedStock}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {item.lostStock}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {item.sold}
                      </td>
                      <td className="px-6 py-4 text-sm text-red-500">
                        {item.alert}
                      </td>
                      <td className="px-6 py-4 text-sm text-blue-500">
                        <button>View Details</button>
                      </td>
                    </tr>
                  ))}
                  {!filteredData.length && (
                    <tr>
                      <td
                        colSpan="10"
                        className="px-6 py-4 text-center text-sm text-gray-500"
                      >
                        No items found matching your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="bg-white px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between">
              <div className="flex items-center mb-3 sm:mb-0">
                <span className="text-sm text-gray-700 mr-2">Showing</span>
                <div className="relative w-24">
                  <select
                    className="w-full bg-white border border-gray-300 px-3 py-1 pr-8 rounded-md text-sm"
                    value={perPage}
                    onChange={(e) => setPerPage(Number(e.target.value))}
                  >
                    {[10, 20, 50].map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                    <ChevronDown size={16} />
                  </div>
                </div>
                <span className="text-sm text-gray-700 ml-2">of 50</span>
              </div>

              <div className="flex items-center space-x-2">
                <button className="p-1 border rounded-md">
                  <ChevronLeft size={18} />
                </button>
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    className={`w-8 h-8 rounded-md flex items-center justify-center ${
                      n === 2
                        ? "bg-blue-500 text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {n}
                  </button>
                ))}
                <button className="p-1 border rounded-md">
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
