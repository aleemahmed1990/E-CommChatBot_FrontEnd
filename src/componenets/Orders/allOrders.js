// src/components/AllOrders.js
import React, { useState, useEffect } from "react";
import { Home, Filter } from "lucide-react";
import axios from "axios";

import Sidebar from "../Sidebar/sidebar";

// Extended statuses including new ones from schema
const OrderStatusFilters = [
  { id: "cart-not-paid", label: "In cart (not paid)", color: "#ffd166" },
  { id: "order-made-not-paid", label: "Order made (unpaid)", color: "#ffb347" },
  { id: "pay-not-confirmed", label: "Paid (unconfirmed)", color: "#ffc38b" },
  { id: "order-confirmed", label: "Order confirmed", color: "#a9b6fb" },
  { id: "picking-order", label: "Picking from inventory", color: "#b0f2c2" },
  { id: "allocated-driver", label: "Allocated to driver", color: "#90cdf4" },
  { id: "on-way", label: "On the way", color: "#73b5e8" },
  { id: "driver-confirmed", label: "Driver confirmed", color: "#f4a593" },
  { id: "issue-driver", label: "Issue (driver)", color: "#ffa07a" },
  { id: "issue-customer", label: "Issue (customer)", color: "#ffb3a7" },
  { id: "complain-order", label: "Customer complaint", color: "#ff6b6b" },
  { id: "parcel-returned", label: "Parcel returned", color: "#ffb6ad" },
  { id: "customer-confirmed", label: "Customer confirmed", color: "#c084fc" },
  { id: "order-refunded", label: "Order refunded", color: "#e5e5e5" },
  { id: "refund", label: "Refund", color: "#d3d3d3" },
  { id: "order-complete", label: "Order complete", color: "#86efac" },
  { id: "order not picked", label: "Awaiting pickup", color: "#c084fc" },
];

export default function AllOrders() {
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      // build query params
      const params = new URLSearchParams();
      if (selectedFilters.length)
        params.set("status", selectedFilters.join(","));
      if (searchQuery) params.set("search", searchQuery);
      params.set("page", currentPage);
      params.set("limit", itemsPerPage);

      try {
        // fetch list of orders
        const listRes = await axios.get(
          `https://married-flower-fern.glitch.me/api/orders?${params}`
        );
        const { orders: listOrders, total: listTotal } = listRes.data;

        // enrich each order with customer name if missing
        const enriched = await Promise.all(
          listOrders.map(async (o) => {
            if (!o.customer) {
              try {
                const detailRes = await axios.get(
                  `https://married-flower-fern.glitch.me/api/orders/${o.orderId}`
                );
                return { ...o, customer: detailRes.data.customer || "N/A" };
              } catch (err) {
                return { ...o, customer: "N/A" };
              }
            }
            return o;
          })
        );

        setOrders(enriched);
        setTotal(typeof listTotal === "number" ? listTotal : 0);
      } catch (e) {
        console.error("Fetch failed", e);
        setOrders([]);
        setTotal(0);
      }
    };

    fetchOrders();
  }, [selectedFilters, searchQuery, currentPage]);

  const toggleFilter = (id) => {
    setSelectedFilters((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
    setCurrentPage(1);
  };

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
        <div className="bg-purple-900 text-white p-4 flex items-center">
          <Home className="mr-2" size={20} />
          <h1 className="text-xl font-semibold">3. All Orders</h1>
        </div>

        <div className="p-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
          {OrderStatusFilters.map((f) => (
            <div
              key={f.id}
              onClick={() => toggleFilter(f.id)}
              className={`cursor-pointer flex items-center px-2 py-1 rounded text-sm ${
                selectedFilters.includes(f.id) ? "ring-2 ring-green-500" : ""
              }`}
              style={{ backgroundColor: f.color }}
            >
              <input
                type="checkbox"
                checked={selectedFilters.includes(f.id)}
                readOnly
                className="mr-2"
              />
              <span className="truncate">{f.label}</span>
            </div>
          ))}
        </div>

        <div className="flex space-x-4 mb-4">
          <input
            type="text"
            placeholder="Search by order id"
            className="flex-1 border px-3 py-2 rounded focus:outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="flex items-center px-3 py-2 border rounded">
            <Filter className="mr-2" size={16} />
            <span>Select dates</span>
          </button>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {[
                  "Order ID",
                  "Created",
                  "Customer",
                  "Total",
                  "Status",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <React.Fragment key={o.orderId}>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm">{o.orderId}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(o.created).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm">{o.customer}</td>
                    <td className="px-6 py-4 text-sm">{o.totalAmount}</td>
                    <td className="px-6 py-4">
                      <span
                        className="px-3 py-1 rounded-full text-sm"
                        style={{
                          backgroundColor: OrderStatusFilters.find(
                            (f) => f.id === o.status
                          )?.color,
                        }}
                      >
                        {OrderStatusFilters.find((f) => f.id === o.status)
                          ?.label || o.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() =>
                          setExpandedOrderId(
                            expandedOrderId === o.orderId ? null : o.orderId
                          )
                        }
                      >
                        ▶
                      </button>
                    </td>
                  </tr>
                  {expandedOrderId === o.orderId && (
                    <tr className="bg-gray-50">
                      <td colSpan={6} className="px-6 py-4">
                        <table className="w-full text-sm">
                          <thead>
                            <tr>
                              <th className="py-2 text-left">#</th>
                              <th className="py-2 text-left">Product</th>
                              <th className="py-2 text-left">Qty</th>
                              <th className="py-2 text-left">Unit Price</th>
                              <th className="py-2 text-left">Line Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            {o.items.map((item, i) => (
                              <tr key={i} className="border-t">
                                <td className="py-2">{i + 1}</td>
                                <td>{item.productName}</td>
                                <td>{item.quantity}</td>
                                <td>{item.price}</td>
                                <td>{item.totalPrice}</td>
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

        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded"
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {Math.ceil(total / itemsPerPage)}
          </span>
          <button
            onClick={() => setCurrentPage((p) => p + 1)}
            disabled={currentPage * itemsPerPage >= total}
            className="px-3 py-1 border rounded"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
