// DiscountedProductsInvA.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Home, Search as SearchIcon, ChevronDown } from "lucide-react";
import Sidebar from "../Sidebar/sidebar";

const DUMMY_A = [
  {
    id: 1,
    productId: 1,
    name: "Cement",
    code: "Happy666",
    type: "Specific amount",
    rule: "buy at least 1",
    qty: 1,
    newPrice: "$100",
    status: "Ongoing",
    endDate: "3.5.2025",
  },
  {
    id: 2,
    productId: 2,
    name: "Screws",
    code: "14thFeb",
    type: "clearance discount",
    rule: "rule 2",
    qty: 2,
    newPrice: "$6",
    status: "Ongoing",
    endDate: "3.5.2025",
  },
  {
    id: 3,
    productId: 3,
    name: "Tools",
    code: "1stMay",
    type: "new product",
    rule: "rule 3",
    qty: "<2",
    newPrice: "$6",
    status: "Ongoing",
    endDate: "3.5.2025",
  },
  {
    id: 4,
    productId: 1,
    name: "Sand",
    code: "10thDec",
    type: "fixed amount",
    rule: "online only",
    qty: 1,
    newPrice: "$100",
    status: "Ongoing",
    endDate: "3.5.2025",
  },
  {
    id: 5,
    productId: 2,
    name: "Mirror",
    code: "14thFeb",
    type: "percentage",
    rule: "rule 4",
    qty: 2,
    newPrice: "6%",
    status: "Ongoing",
    endDate: "3.5.2025",
  },
  {
    id: 6,
    productId: 2,
    name: "Wood",
    code: "14thFeb",
    type: "percentage",
    rule: "rule 5",
    qty: 1,
    newPrice: "6%",
    status: "Ongoing",
    endDate: "3.5.2025",
  },
];

const statusStyles = {
  Expired: "bg-red-100 text-red-800",
  Ongoing: "bg-green-100 text-green-800",
  Scheduled: "bg-orange-100 text-orange-800",
};

export default function DiscountedProductsInvA() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const filtered = DUMMY_A.filter((row) =>
    [row.productId, row.name, row.code, row.type, row.rule]
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
              73 Discounted Products inv A
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <Bell size={20} className="cursor-pointer" />
            <div className="w-8 h-8 bg-purple-400 rounded-full" />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 mb-4">
          <button
            onClick={() => navigate("/discount-inventory")}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            73 A
          </button>
          <button
            onClick={() => navigate("/discount-inventory-check")}
            className="px-4 py-2 bg-white text-gray-700 border rounded"
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
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                {[
                  "Product ID",
                  "Product name",
                  "Discount code",
                  "Type",
                  "Rule",
                  "Qty",
                  "new price",
                  "Status",
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
              {filtered.map((r, i) => (
                <tr key={i} className={i % 2 ? "bg-gray-50" : "bg-white"}>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {r.productId}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">{r.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{r.code}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{r.type}</td>
                  <td className="px-6 py-4 text-sm text-blue-600">{r.rule}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{r.qty}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {r.newPrice}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${
                        statusStyles[r.status]
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {r.endDate}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center mt-4 gap-2 text-sm text-gray-600">
          <ChevronDown className="opacity-0" />
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
          <ChevronDown className="opacity-0" />
        </div>
      </div>
    </div>
  );
}
