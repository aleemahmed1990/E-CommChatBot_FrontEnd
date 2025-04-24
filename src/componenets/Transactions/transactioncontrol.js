// src/components/views/TransactionControlView.jsx
import React, { useState } from "react";
import Sidebar from "../Sidebar/sidebar";
import { ChevronDown } from "lucide-react";

const TransactionControlView = ({ type, setType, navigateTo }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Sample order data
  const orders = [
    {
      id: "#6548",
      created: "2 min ago",
      customer: "Joseph Wheeler",
      total: "$654",
      status:
        type === "paid"
          ? "Made order/not paid"
          : "Placed order but did not proceed with Screenshot",
    },
    {
      id: "#6549",
      created: "5 min ago",
      customer: "Alice Johnson",
      total: "$432",
      status:
        type === "paid"
          ? "Made order/not paid"
          : "Placed order but did not proceed with Screenshot",
    },
    {
      id: "#6550",
      created: "10 min ago",
      customer: "Bob Smith",
      total: "$210",
      status:
        type === "paid"
          ? "Made order/not paid"
          : "Placed order but did not proceed with Screenshot",
    },
    {
      id: "#6551",
      created: "15 min ago",
      customer: "Carol White",
      total: "$125",
      status:
        type === "paid"
          ? "Made order/not paid"
          : "Placed order but did not proceed with Screenshot",
    },
    {
      id: "#6552",
      created: "20 min ago",
      customer: "David Lee",
      total: "$98",
      status:
        type === "paid"
          ? "Made order/not paid"
          : "Placed order but did not proceed with Screenshot",
    },
  ];

  return (
    <div className="flex">
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {/* Main content container now shifts right when sidebar is open */}
      <div
        className={`transition-all duration-300 ${
          isSidebarOpen ? "ml-80" : ""
        } flex-1 bg-gray-50 p-4`}
      >
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-2xl font-semibold flex items-center">
            <span className="mr-2">🏠</span>
            2. Transaction control ... paid / or not ( pertical emp finance )
          </h1>
          <p className="text-gray-600 ml-6">
            {type === "paid"
              ? "b.O. paid or not / paid control (we are double checking the payment)"
              : "a. arrived to pay and disappeared"}
          </p>
        </div>

        {/* Disappeared info */}
        {type === "disappeared" && (
          <div className="bg-gray-100 p-4 mb-4 rounded">
            <p className="text-lg">
              They try to place an order, reached the payment step and
              disappeared without payment
            </p>
          </div>
        )}

        {/* Search and navigation buttons */}
        <div className="flex justify-between mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by order id"
              className="pl-8 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="absolute left-3 top-2.5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => navigateTo("verification")}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded"
            >
              Go to verification 2.b.1
            </button>
            <button className="bg-gray-700 hover:bg-gray-800 text-white px-6 py-2 rounded">
              Go back
            </button>
          </div>
        </div>

        {/* Orders table with inline status toggle */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ORDER ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  CREATED
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  CUSTOMER
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  TOTAL
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  STATUS
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{order.id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{order.created}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {order.customer}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{order.total}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap flex items-center space-x-2">
                    <span className="px-2 inline-flex text-xs font-semibold rounded-full bg-orange-100 text-orange-800">
                      {order.status}
                    </span>
                    <ChevronDown
                      className="h-4 w-4 text-gray-500 cursor-pointer"
                      onClick={() =>
                        setType(type === "paid" ? "disappeared" : "paid")
                      }
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => navigateTo("verification")}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex items-center">
              <span className="text-sm text-gray-700">Showing</span>
              <select className="mx-2 border-gray-300 rounded-md text-sm">
                <option>10</option>
                <option>20</option>
                <option>50</option>
              </select>
              <span className="text-sm text-gray-700">of 50</span>
            </div>
            <div className="flex items-center space-x-2">
              <button className="px-2 py-1 border rounded-md hover:bg-gray-50">
                &lt;
              </button>
              <button className="px-3 py-1 bg-gray-800 text-white rounded-md">
                1
              </button>
              <button className="px-3 py-1 border rounded-md hover:bg-gray-50">
                2
              </button>
              <button className="px-3 py-1 border rounded-md hover:bg-gray-50">
                3
              </button>
              <button className="px-3 py-1 border rounded-md hover:bg-gray-50">
                4
              </button>
              <button className="px-3 py-1 border rounded-md hover:bg-gray-50">
                5
              </button>
              <button className="px-2 py-1 border rounded-md hover:bg-gray-50">
                &gt;
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionControlView;
