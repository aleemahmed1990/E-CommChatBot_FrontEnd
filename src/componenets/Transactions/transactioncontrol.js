// src/components/views/TransactionControlView.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Sidebar/sidebar";
import {
  Home,
  Search,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Check,
  X,
} from "lucide-react";

export default function TransactionControlView() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedTypes, setSelectedTypes] = useState({
    "order-made-not-paid": true,
    "pay-not-confirmed": false,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [expandedOrder, setExpandedOrder] = useState(null);

  const getActiveTypes = () =>
    Object.entries(selectedTypes)
      .filter(([, on]) => on)
      .map(([t]) => t)
      .join(",");

  useEffect(() => {
    const params = new URLSearchParams({
      status: getActiveTypes(),
      search: searchQuery,
      page: String(page),
      limit: String(itemsPerPage),
    });

    fetch(`http://localhost:5000/api/orders?${params}`)
      .then((res) => res.json())
      .then(({ orders = [], total = 0 }) => {
        setOrders(orders);
        setTotal(total);
      })
      .catch(console.error);
  }, [selectedTypes, searchQuery, page]);

  const totalPages = Math.ceil(total / itemsPerPage);

  return (
    <div className="flex">
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen((o) => !o)}
      />

      <div
        className={`transition-all duration-300 ${
          isSidebarOpen ? "ml-80" : ""
        } flex-1 bg-gray-50 p-6`}
      >
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-2xl font-semibold flex items-center">
            <Home className="mr-2" size={24} /> Transaction Control
          </h1>
          <p className="text-gray-600 ml-9 mt-1">
            Filter and verify “Made order/not paid” & “Pay not confirmed”
          </p>
        </div>

        {/* Search */}
        <div className="flex justify-between items-center mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by order id"
              className="pl-10 pr-4 py-2 border rounded-md w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
            />
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={18}
            />
          </div>
        </div>

        {/* Status Filters */}
        <div className="mb-4 flex space-x-3">
          <span className="text-sm font-medium">Filter by status:</span>
          {[
            ["order-made-not-paid", "Made order/not paid"],
            ["pay-not-confirmed", "Pay not confirmed"],
          ].map(([key, label]) => (
            <button
              key={key}
              onClick={() =>
                setSelectedTypes((prev) => ({ ...prev, [key]: !prev[key] }))
              }
              className={`px-4 py-1 text-sm rounded-full flex items-center ${
                selectedTypes[key]
                  ? "bg-orange-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {label}
              {selectedTypes[key] ? (
                <Check className="ml-2" size={14} />
              ) : (
                <X className="ml-2" size={14} />
              )}
            </button>
          ))}
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr className="text-left text-gray-500 text-sm">
                <th className="py-3 px-4">ORDER ID</th>
                <th className="py-3 px-4">CREATED</th>
                <th className="py-3 px-4">CUSTOMER</th>
                <th className="py-3 px-4">TOTAL</th>
                <th className="py-3 px-4">STATUS</th>
                <th className="py-3 px-4">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.length === 0 && (
                <tr>
                  <td colSpan="6" className="py-4 text-center text-gray-500">
                    No orders found.
                  </td>
                </tr>
              )}
              {orders.map((o) => (
                <React.Fragment key={o.orderId}>
                  <tr className="hover:bg-gray-50">
                    <td className="py-4 px-4">{o.orderId}</td>
                    <td className="py-4 px-4 text-gray-600">
                      {new Date(o.created).toLocaleString()}
                    </td>
                    <td className="py-4 px-4">{o.customer}</td>
                    <td className="py-4 px-4">{o.totalAmount}</td>
                    <td className="py-4 px-4">
                      <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm inline-flex items-center">
                        {o.status === "order-made-not-paid"
                          ? "Made order/not paid"
                          : "Pay not confirmed"}
                        <ChevronDown className="ml-1" size={16} />
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right flex items-center space-x-2">
                      {o.status === "pay-not-confirmed" && (
                        <button
                          onClick={() => navigate(`/verification/${o.orderId}`)}
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                        >
                          Verify
                        </button>
                      )}
                      <button
                        className="text-gray-400 hover:text-gray-600"
                        onClick={() =>
                          setExpandedOrder(
                            expandedOrder === o.orderId ? null : o.orderId
                          )
                        }
                      >
                        <ChevronRight size={20} />
                      </button>
                    </td>
                  </tr>
                  {expandedOrder === o.orderId && (
                    <tr>
                      <td colSpan="6" className="px-4 py-4 bg-gray-50">
                        <table className="min-w-full text-sm">
                          <thead>
                            <tr className="text-left text-gray-500">
                              <th className="py-2 px-4">#</th>
                              <th className="py-2 px-4">Product</th>
                              <th className="py-2 px-4">Qty</th>
                              <th className="py-2 px-4">Unit Price</th>
                              <th className="py-2 px-4">Line Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            {o.items.map((it, i) => (
                              <tr key={i} className="border-t">
                                <td className="py-2 px-4">{i + 1}</td>
                                <td className="py-2 px-4">{it.productName}</td>
                                <td className="py-2 px-4">{it.quantity}</td>
                                <td className="py-2 px-4">{it.price}</td>
                                <td className="py-2 px-4">{it.totalPrice}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center bg-white px-4 py-3 border-t border-gray-200 mt-4">
          <div className="text-sm text-gray-700">
            Showing {(page - 1) * itemsPerPage + 1}–
            {Math.min(page * itemsPerPage, total)} of {total}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="p-2 border rounded-md"
            >
              <ChevronLeft size={18} />
            </button>
            <span className="text-sm">
              Page {page} of {totalPages || 1}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages || totalPages === 0}
              className="p-2 border rounded-md"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
