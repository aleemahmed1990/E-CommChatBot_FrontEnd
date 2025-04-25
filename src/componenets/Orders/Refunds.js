// src/components/RefundComplain.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Home, Bell, User as UserIcon, MoreVertical } from "lucide-react";
import Sidebar from "../Sidebar/sidebar";

const RefundComplain = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [openMenuId, setOpenMenuId] = useState(null);
  const navigate = useNavigate();

  const totalRequests = 100;
  const totalAmount = "$12000";

  const refunds = Array.from({ length: 6 }).map((_, i) => ({
    orderId: "123#",
    customer: "Joseph Grey",
    contact: "0313-2456789",
    amount: "$230",
    id: i,
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
        } w-full bg-gray-50`}
      >
        <header className="bg-purple-900 text-white p-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Home className="w-5 h-5" />
            <h1 className="text-xl font-semibold">7. Refund Complain</h1>
          </div>
        </header>

        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-sm font-medium">Total refund request</div>
              <div className="mt-2 text-xl font-semibold">{totalRequests}</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-sm font-medium">Total amount refunded</div>
              <div className="mt-2 text-xl font-semibold">{totalAmount}</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow" />
          </div>

          <h2 className="text-lg font-semibold mb-2">All Refunds</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300">
              <thead className="bg-amber-50">
                <tr>
                  <th className="p-3 text-left text-sm font-medium text-gray-900">
                    order id
                  </th>
                  <th className="p-3 text-left text-sm font-medium text-gray-900">
                    Customer
                  </th>
                  <th className="p-3 text-left text-sm font-medium text-gray-900">
                    Customer contact
                  </th>
                  <th className="p-3 text-left text-sm font-medium text-gray-900">
                    Amount refunded
                  </th>
                  <th className="p-3 text-left text-sm font-medium text-gray-900">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {refunds.map((r) => (
                  <tr key={r.id} className="border-t border-gray-200">
                    <td className="p-3 text-sm text-gray-700">{r.orderId}</td>
                    <td className="p-3 text-sm text-gray-700">{r.customer}</td>
                    <td className="p-3 text-sm text-gray-700">{r.contact}</td>
                    <td className="p-3 text-sm text-gray-700">{r.amount}</td>
                    <td className="p-3 text-sm text-gray-700">
                      <div className="relative inline-block">
                        <MoreVertical
                          className="w-5 h-5 cursor-pointer"
                          onClick={() =>
                            setOpenMenuId(openMenuId === r.id ? null : r.id)
                          }
                        />
                        {openMenuId === r.id && (
                          <button
                            onClick={() => navigate("/order-details")}
                            className="absolute top-6 left-0 bg-white border rounded shadow px-3 py-1 text-sm"
                          >
                            View details
                          </button>
                        )}
                      </div>
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

export default RefundComplain;
