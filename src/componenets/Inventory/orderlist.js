// OrderListApprovedStock.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MoreVertical,
  Printer,
  FileText,
  Bell,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Sidebar from "../Sidebar/sidebar";

const DUMMY_DATA = [
  { productId: 1, currentQty: 1, supplier: "Jimmy and co" },
  { productId: 2, currentQty: 2, supplier: "sup b" },
  { productId: 3, currentQty: "more then 2", supplier: "sub c and co" },
  { productId: 1, currentQty: 1, supplier: "sup d and co" },
  { productId: 2, currentQty: 2, supplier: "sup e and co" },
  { productId: 2, currentQty: 1, supplier: "sup g and co" },
];

export default function OrderListApprovedStock() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [actionMenuOpen, setActionMenuOpen] = useState(null);
  const navigate = useNavigate();

  const filtered = DUMMY_DATA.filter(
    (row) =>
      String(row.productId).includes(searchTerm) ||
      row.supplier.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleAction = (idx) =>
    setActionMenuOpen(actionMenuOpen === idx ? null : idx);

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
        {/* Top Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            35. Order list (Approved Stock)
          </h2>
          <div className="flex items-center gap-4">
            <Printer className="cursor-pointer" />
            <FileText className="cursor-pointer" />
            <div className="relative">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
                4
              </span>
            </div>
            <div className="w-8 h-8 bg-purple-500 rounded-full" />
          </div>
        </div>

        {/* Search + Links */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2">
          <input
            type="text"
            placeholder="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-1/3 border rounded p-2"
          />
          <div className="flex flex-col md:flex-row gap-2">
            <button
              onClick={() => navigate("/print-order-list")}
              className="text-indigo-600 hover:underline text-sm"
            >
              print order list by supplier
            </button>
            <button
              onClick={() => navigate("/final-and-make-order")}
              className="text-indigo-600 hover:underline text-sm"
            >
              final and make order
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full">
            <thead className="bg-orange-500 text-white">
              <tr>
                <th className="p-3 text-left">Product ID</th>
                <th className="p-3 text-left">Current qty.</th>
                <th className="p-3 text-left">Approved Supplier</th>
                <th className="p-3 text-left">Action</th>
                <th className="p-3 text-left">Ordered Done</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row, idx) => (
                <tr
                  key={idx}
                  className={idx % 2 === 1 ? "bg-gray-100" : "bg-white"}
                >
                  <td className="p-3">{row.productId}</td>
                  <td className="p-3">{row.currentQty}</td>
                  <td className="p-3">{row.supplier}</td>

                  {/* Action cell */}
                  <td className="p-3 relative">
                    <MoreVertical
                      className="cursor-pointer"
                      onClick={() => toggleAction(idx)}
                    />
                    {actionMenuOpen === idx && (
                      <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg z-10">
                        <button
                          onClick={() => navigate("/show-order")}
                          className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                        >
                          show order
                        </button>
                        <button
                          onClick={() => navigate("/view-suppliers")}
                          className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                        >
                          Show supplier list
                        </button>
                      </div>
                    )}
                  </td>

                  {/* Ordered Done */}
                  <td className="p-3">
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500">
                        ordered done
                      </span>
                      <input
                        type="text"
                        className="border rounded px-2 py-1 w-16 focus:outline-none"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col md:flex-row justify-between items-center mt-4 text-sm text-gray-600">
          <div className="flex items-center gap-2 mb-2 md:mb-0">
            Showing
            <select className="border rounded p-1">
              {[10, 20, 30, 40, 50].map((n) => (
                <option key={n}>{n}</option>
              ))}
            </select>
            of 50
          </div>
          <div className="flex items-center gap-1">
            <ChevronLeft className="cursor-not-allowed text-gray-400" />
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                className={`px-3 py-1 rounded ${
                  n === 1 ? "bg-orange-500 text-white" : "hover:bg-gray-200"
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
