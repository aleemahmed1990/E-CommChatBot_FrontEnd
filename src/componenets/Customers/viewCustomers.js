// src/pages/CustomerPage.jsx
import React, { useState } from "react";
import {
  Search,
  Edit,
  Lock,
  Trash,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Sidebar/sidebar";

const CustomerPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();

  // Dummy customer data
  const customers = Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    name: "Robert Fox",
    email: "robert@gmail.com",
    phone: "(201) 555-0124",
    created: "6 April 2023",
    blocked: i === 0,
  }));

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
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Customers</h1>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center cursor-pointer">
                  {/* Bell icon */}
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
              <div className="w-10 h-10 rounded-full bg-purple-600 cursor-pointer"></div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mb-6">
            <input
              type="text"
              placeholder="Search..."
              className="w-full md:w-64 pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <Search size={18} />
            </div>
          </div>

          {/* Customers Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="text-left text-gray-500 text-sm">
                  <th className="py-4 pl-4 font-normal">NAME</th>
                  <th className="py-4 font-normal">PHONE NUMBER</th>
                  <th className="py-4 font-normal">CREATED</th>
                  <th className="py-4 font-normal">ACTION</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((cust) => (
                  <tr
                    key={cust.id}
                    className="border-t border-gray-100 hover:bg-gray-50 cursor-pointer"
                    onClick={() => navigate(`/customers/${cust.id}`)}
                  >
                    <td className="py-4 pl-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-cyan-300 mr-3 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-gray-800">
                            {cust.name}
                          </p>
                          <p className="text-gray-500 text-sm">{cust.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4">{cust.phone}</td>
                    <td className="py-4">{cust.created}</td>
                    <td className="py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          className="p-1 text-gray-400 hover:text-gray-600"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          className={`p-1 relative ${
                            cust.blocked
                              ? "text-red-500"
                              : "text-gray-400 hover:text-gray-600"
                          }`}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Lock size={18} />
                          {cust.blocked && (
                            <div className="absolute text-xs bg-black text-white px-2 py-1 rounded -mt-12 ml-1 whitespace-nowrap">
                              Blocked on 2.3.2025
                            </div>
                          )}
                        </button>
                        <button
                          className="p-1 text-gray-400 hover:text-gray-600"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Trash size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-500">
              Showing
              <select className="mx-2 py-1 px-2 border border-gray-200 rounded focus:outline-none">
                <option>10</option>
                <option>20</option>
                <option>50</option>
              </select>
              of 50
            </div>
            <div className="flex items-center">
              <button className="p-2 border border-gray-200 rounded-l-lg text-gray-500 hover:bg-gray-50">
                <ChevronLeft size={16} />
              </button>
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  className={`p-2 border-t border-b border-r border-gray-200 px-3 ${
                    n === 1
                      ? "bg-orange-500 text-white"
                      : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  {n}
                </button>
              ))}
              <button className="p-2 border-t border-b border-r border-gray-200 rounded-r-lg text-gray-500 hover:bg-gray-50">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerPage;
