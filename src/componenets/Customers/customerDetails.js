import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ChevronLeft,
  Edit,
  Search,
  ChevronDown,
  MoreHorizontal,
} from "lucide-react";
import Sidebar from "../Sidebar/sidebar";

const CustomerDetail = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();

  // Dummy fetch by ID
  const customer = {
    id,
    name: "Robert Fox",
    email: "robert@gmail.com",
    phone: "(201) 555-0124",
    memberSince: "3 March, 2023",
    avatarColor: "bg-purple-300",
  };
  const totalSpent = { order2023: 635, order2024: 12, lifetime: 12300 };
  const stats = { totalOrder: 150, completed: 140, canceled: 10 };
  const topProducts = [
    "Lucky cement",
    "golden screws",
    "bricks",
    "pro 4",
    "pro5",
    "pro 6",
    "pro7",
    "pro 8",
    "pro 9",
    "pro 10",
  ];
  const orders = [
    { id: "#6548", created: "2 min ago", total: "$654", status: "Placed" },
    {
      id: "#6548",
      created: "2 min ago",
      total: "$654",
      status: "Confirmed COD",
    },
    { id: "#6548", created: "2 min ago", total: "$654", status: "Processing" },
    { id: "#6548", created: "2 min ago", total: "$654", status: "Picked" },
    { id: "#6548", created: "2 min ago", total: "$654", status: "Shipped" },
    { id: "#6548", created: "2 min ago", total: "$654", status: "Delivered" },
  ];

  const [selectedTab, setSelectedTab] = useState("All");
  const [notes, setNotes] = useState("");

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <div
        className={`transition-all duration-300 ${
          isSidebarOpen ? "lg:ml-80" : ""
        } w-full p-6`}
      >
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Top Bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button onClick={() => navigate("/customers")}>
                {" "}
                <ChevronLeft size={24} />{" "}
              </button>
              <h1 className="text-2xl font-bold">Customer Detail</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center cursor-pointer">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                  </svg>
                  <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    4
                  </div>
                </div>
              </div>
              <div className="w-10 h-10 rounded-full bg-purple-600"></div>
              <button className="bg-orange-500 text-white px-4 py-2 rounded-lg">
                View Chat
              </button>
            </div>
          </div>

          {/* Info Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Personal Info */}
            <div className="lg:col-span-2 bg-gray-50 p-6 rounded-lg space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-500 font-medium">
                  PERSONAL INFORMATION
                </span>
                <Edit
                  size={20}
                  className="cursor-pointer text-gray-400 hover:text-gray-600"
                />
              </div>
              <div className="flex items-center space-x-4">
                <div
                  className={`w-12 h-12 rounded-full ${customer.avatarColor}`}
                />
                <div>
                  <p className="text-lg font-semibold">{customer.name}</p>
                  <p className="text-gray-500">{customer.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-gray-600">
                <div>
                  <span className="font-medium">WhatsApp Number</span>
                  <br />
                  {customer.phone}
                </div>
                <div>
                  <span className="font-medium">Member Since</span>
                  <br />
                  {customer.memberSince}
                </div>
                <div>
                  <span className="font-medium">Email</span>
                  <br />
                  ---
                </div>
              </div>
            </div>

            {/* Total Spent */}
            <div className="bg-gray-50 p-6 rounded-lg space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-500 font-medium">TOTAL SPENT</span>
                <Edit
                  size={20}
                  className="cursor-pointer text-gray-400 hover:text-gray-600"
                />
              </div>
              <div className="grid grid-cols-2 gap-x-4 text-gray-700">
                <div>
                  order 2023{" "}
                  <span className="font-semibold">${totalSpent.order2023}</span>
                </div>
                <div>
                  order 2024{" "}
                  <span className="font-semibold">${totalSpent.order2024}</span>
                </div>
                <div>
                  life time order{" "}
                  <span className="font-semibold">${totalSpent.lifetime}</span>
                </div>
              </div>
              <div className="grid grid-cols-3 text-center text-gray-700 mt-4">
                <div>
                  <p className="text-xl font-bold">{stats.totalOrder}</p>
                  <p>Total Order</p>
                </div>
                <div>
                  <p className="text-xl font-bold">{stats.completed}</p>
                  <p>Completed</p>
                </div>
                <div>
                  <p className="text-xl font-bold">{stats.canceled}</p>
                  <p>Canceled</p>
                </div>
              </div>
            </div>

            {/* Top Products */}
            <div className="lg:col-span-3 bg-gray-50 p-6 rounded-lg">
              <h2 className="text-gray-600 font-medium mb-2">
                10 most ordered products
              </h2>
              <ol className="list-decimal list-inside space-y-1 text-gray-700">
                {topProducts.map((prod, idx) => (
                  <li key={idx}>{prod}</li>
                ))}
              </ol>
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-gray-50 p-6 rounded-lg">
            {/* Tabs */}
            <div className="flex space-x-4 border-b border-gray-200 pb-2">
              {[
                "All",
                "Placed",
                "Confirmed COD",
                "Processing",
                "Picked",
                "Shipped",
                "Delivered",
                "Cancelled",
              ].map((tab) => (
                <button
                  key={tab}
                  className={`pb-2 ${
                    selectedTab === tab
                      ? "border-b-2 border-orange-500 text-orange-500"
                      : "text-gray-600"
                  }`}
                  onClick={() => setSelectedTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Search & Filter */}
            <div className="flex justify-between items-center mt-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by order id"
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
              </div>
              <button className="text-gray-600 hover:text-gray-800 flex items-center">
                Filter by date range <ChevronDown size={16} className="ml-1" />
              </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto mt-4">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-gray-500 text-sm">
                    <th className="py-2">ORDER ID</th>
                    <th className="py-2">CREATED</th>
                    <th className="py-2">TOTAL</th>
                    <th className="py-2">STATUS</th>
                    <th className="py-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order, i) => (
                    <tr key={i} className="border-t border-gray-100">
                      <td className="py-2 font-medium">{order.id}</td>
                      <td className="py-2">{order.created}</td>
                      <td className="py-2">{order.total}</td>
                      <td className="py-2">
                        <span
                          className={`px-2 py-px rounded-full text-xs ${
                            {
                              Placed: "bg-yellow-200 text-yellow-800",
                              "Confirmed COD": "bg-green-200 text-green-800",
                              Processing: "bg-blue-200 text-blue-800",
                              Picked: "bg-indigo-200 text-indigo-800",
                              Shipped: "bg-purple-200 text-purple-800",
                              Delivered: "bg-green-100 text-green-800",
                            }[order.status]
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="py-2 text-right text-gray-400">
                        <MoreHorizontal size={20} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-500">
                Showing{" "}
                <select className="mx-2 p-1 border border-gray-200 rounded focus:outline-none">
                  <option>10</option>
                  <option>20</option>
                  <option>50</option>
                </select>{" "}
                of 50
              </div>
              <div className="flex items-center space-x-1">
                <button onClick={() => {}}>
                  <ChevronLeft size={16} />
                </button>
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    className={`px-3 py-1 border border-gray-200 ${
                      n === 1 ? "bg-orange-500 text-white" : "text-gray-600"
                    }`}
                    onClick={() => {}}
                  >
                    {n}
                  </button>
                ))}
                <button onClick={() => {}}>
                  <ChevronDown size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Notes Panel */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-500 font-medium">
                text box for other notes/information and other contzct number
              </span>
              <Edit
                size={20}
                className="cursor-pointer text-gray-400 hover:text-gray-600"
              />
            </div>
            <div className="h-40 p-4 bg-white border border-gray-200 rounded-lg overflow-auto space-y-2">
              <p className="text-gray-400">09 am 2025 emp: what text</p>
              <p className="text-gray-400">09 am 2025 emp: what text</p>
              <p className="text-gray-400">09 am 2025 emp: what text</p>
            </div>
            <div className="mt-2 flex">
              <textarea
                rows={2}
                placeholder="Write here"
                className="flex-1 border border-gray-200 rounded-l-lg p-2 focus:outline-none"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
              <button className="bg-orange-500 px-4 py-2 rounded-r-lg text-white">
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetail;
