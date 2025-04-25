// src/components/NonDeliveredOrders.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Home, Bell, Search, User as UserIcon } from "lucide-react";
import Sidebar from "../Sidebar/sidebar";

const NonDeliveredOrders = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const orders = [
    {
      id: "123WA",
      customer: "Jeny Solice",
      amount: "$230",
      placedOn: "Jan 31, 2025",
      lastActivity: "Jan 28, 2025 8:00 PM",
      status: "Customer returned the order",
    },
    {
      id: "123WB",
      customer: "Jeny Solice",
      amount: "$230",
      placedOn: "Jan 31, 2025",
      lastActivity: "Jan 28, 2025 8:00 PM",
      status: "Customer returned the order",
    },
    {
      id: "123WC",
      customer: "Jeny Solice",
      amount: "$230",
      placedOn: "Jan 31, 2025",
      lastActivity: "Jan 28, 2025 8:00 PM",
      status: "Customer returned the order",
    },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {/* Main content */}
      <div
        className={`transition-all duration-300 ${
          isSidebarOpen ? "lg:ml-80" : ""
        } w-full bg-gray-50`}
      >
        {/* Top bar */}
        <header className="bg-purple-900 text-white p-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Home className="w-5 h-5" />
            <h1 className="text-xl font-semibold">
              6. Non delivered orders or issues BEFORE DELIVERY
            </h1>
          </div>
          <div className="flex items-center space-x-4"></div>
        </header>

        {/* Body */}
        <div className="p-4">
          {/* Search */}
          <div className="relative max-w-md mb-6">
            <input
              type="text"
              placeholder="Search for order"
              className="w-full border border-gray-300 rounded-lg py-2 px-4 pr-10 focus:outline-none"
            />
            <Search className="w-5 h-5 text-gray-500 absolute right-3 top-1/2 transform -translate-y-1/2" />
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300">
              <thead className="bg-amber-50">
                <tr>
                  {[
                    "Order ID",
                    "Customer",
                    "Amount",
                    "Placed on",
                    "Last activity",
                    "Status",
                    "Action",
                  ].map((col) => (
                    <th
                      key={col}
                      className="p-3 text-left text-sm font-medium text-gray-900"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.map((order, idx) => (
                  <tr key={idx} className="border-t border-gray-200">
                    <td className="p-3 text-sm text-gray-700">{order.id}</td>
                    <td className="p-3 text-sm text-gray-700">
                      {order.customer}
                    </td>
                    <td className="p-3 text-sm text-gray-700">
                      {order.amount}
                    </td>
                    <td className="p-3 text-sm text-gray-700">
                      {order.placedOn}
                    </td>
                    <td className="p-3 text-sm text-gray-700">
                      {order.lastActivity}
                    </td>
                    <td className="p-3 text-sm text-gray-700">
                      {order.status}
                    </td>
                    <td className="p-3 text-sm text-gray-700 space-y-1">
                      <button
                        onClick={() => navigate("/order-details")}
                        className="text-blue-500 underline"
                      >
                        View Details
                      </button>
                      <div>Contact customer</div>
                      <div>Refund now replace</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NonDeliveredOrders;
