import React, { useState } from "react";
import { Home, ChevronRight, ChevronLeft, Filter } from "lucide-react";
import Sidebar from "../Sidebar/sidebar";

const OrderStatusFilters = [
  { id: "cart-not-paid", label: "In the cart not paid yet", color: "#ffd166" },
  {
    id: "order-made-not-paid",
    label: "Made order but did not pay yet",
    color: "#ffb347",
  },
  {
    id: "pay-not-confirmed",
    label: "Pay for the order but not confirmed (double checking)",
    color: "#ffc38b",
  },
  {
    id: "order-confirmed",
    label: "Order confirmed (payment confirmed)",
    color: "#a9b6fb",
  },
  {
    id: "picking-order",
    label: "Picking order from inventory",
    color: "#b0f2c2",
  },
  { id: "allocated-driver", label: "Allocated to driver", color: "#90cdf4" },
  { id: "on-way", label: "On the way to deliver", color: "#73b5e8" },
  {
    id: "driver-confirmed",
    label: "Driver confirmed order(handing over to customer)",
    color: "#f4a593",
  },
  { id: "issue-driver", label: "Issue reported by driver", color: "#ffa07a" },
  {
    id: "issue-customer",
    label: "Issue reported by customer",
    color: "#ffb3a7",
  },
  { id: "parcel-returned", label: "Parcel returned", color: "#ffb6ad" },
  {
    id: "customer-confirmed",
    label: "Customer confirmed order",
    color: "#c084fc",
  },
  { id: "order-refunded", label: "Order refunded", color: "#e5e5e5" },
  {
    id: "order-complete",
    label: "Order Complete successfully",
    color: "#86efac",
  },
  {
    id: "order not picked",
    label: "Orders waiting for customers to pick up",
    color: "#c084fc",
  },
];

// Generate dummy orders with various statuses
const generateDummyOrders = () => {
  const customers = [
    "Joseph Wheeler",
    "Emma Thompson",
    "Michael Chen",
    "Sofia Rodriguez",
    "David Kim",
  ];
  const dummyOrders = [];

  for (let i = 1; i <= 50; i++) {
    const randomStatus =
      OrderStatusFilters[Math.floor(Math.random() * OrderStatusFilters.length)];
    const randomCustomer =
      customers[Math.floor(Math.random() * customers.length)];
    const randomTotal = Math.floor(Math.random() * 1000) + 50;

    dummyOrders.push({
      id: `#${65000 + i}`,
      created: `${Math.floor(Math.random() * 60)} min ago`,
      customer: randomCustomer,
      total: `$${randomTotal}`,
      status: randomStatus.id,
      statusLabel: randomStatus.label,
      statusColor: randomStatus.color,
    });
  }

  return dummyOrders;
};

const AllOrders = () => {
  const allOrders = generateDummyOrders();
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  // Filter orders based on selected status filters and search query
  const filteredOrders = allOrders.filter((order) => {
    const matchesFilter =
      selectedFilters.length === 0 || selectedFilters.includes(order.status);
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  // Toggle filter selection
  const toggleFilter = (filterId) => {
    if (selectedFilters.includes(filterId)) {
      setSelectedFilters(selectedFilters.filter((id) => id !== filterId));
    } else {
      setSelectedFilters([...selectedFilters, filterId]);
    }
    setCurrentPage(1); // Reset to first page when filter changes
  };

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

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
        } w-full bg-gray-50 p-4`}
      >
        {/* Header with Filters */}
        <div className="bg-purple-900 text-white p-4 flex flex-wrap justify-between items-center">
          <div className="flex items-center">
            <Home className="mr-2" size={20} />
            <h1 className="text-xl font-semibold">3. All Orders</h1>
          </div>
        </div>

        {/* Filters */}
        <div className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2 mb-4">
            {OrderStatusFilters.map((filter) => (
              <div
                key={filter.id}
                className={`rounded px-2 py-1 text-center text-sm cursor-pointer transition-all flex items-center ${
                  selectedFilters.includes(filter.id)
                    ? "ring-2 ring-green-500"
                    : ""
                }`}
                style={{ backgroundColor: filter.color }}
                onClick={() => toggleFilter(filter.id)}
              >
                <input
                  type="checkbox"
                  checked={selectedFilters.includes(filter.id)}
                  onChange={() => {}}
                  className="mr-2"
                />
                <span className="truncate">{filter.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Search and Filter controls */}
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 mb-4">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search by order id"
              className="w-full pl-3 pr-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="absolute right-3 top-2">
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
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Filter by date range</span>
            <button className="flex items-center px-3 py-2 border rounded-md text-sm">
              <Filter size={16} className="mr-2" />
              <span>Select dates</span>
            </button>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentOrders.map((order, index) => (
                <React.Fragment key={`${order.id}-${index}`}>
                  {/* Main Order Row */}
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium">
                      {order.id}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {order.created}
                    </td>
                    <td className="px-6 py-4 text-sm">{order.customer}</td>
                    <td className="px-6 py-4 text-sm">{order.total}</td>
                    <td className="px-6 py-4">
                      <span
                        className="px-3 py-1 rounded-full text-sm"
                        style={{ backgroundColor: order.statusColor }}
                      >
                        {order.statusLabel}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-sm">
                      <button
                        className="text-gray-400 hover:text-gray-600 rounded-full p-1"
                        onClick={() =>
                          setExpandedOrderId(
                            expandedOrderId === order.id ? null : order.id
                          )
                        }
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </td>
                  </tr>

                  {/* Expanded Details Row */}
                  {expandedOrderId === order.id && (
                    <tr className="bg-gray-50">
                      <td colSpan={6} className="px-6 py-4">
                        <table className="w-full text-sm">
                          <thead>
                            <tr>
                              {[
                                "#",
                                "SKU",
                                "NAME",
                                "PRICE",
                                "QTY",
                                "DISC.",
                                "TOTAL",
                              ].map((h) => (
                                <th
                                  key={h}
                                  className="py-2 text-left text-gray-500 uppercase"
                                >
                                  {h}
                                </th>
                              ))}
                              <th className="text-right text-blue-600">
                                view receipt
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {[
                              {
                                sku: "#6548",
                                name: "Lucky Cement",
                                price: "$999.29",
                                qty: "x1",
                                disc: "5%",
                                total: "$949.32",
                              },
                              {
                                sku: "#6548",
                                name: "Drill Machine",
                                price: "$999.29",
                                qty: "x1",
                                disc: "5%",
                                total: "$949.32",
                              },
                              {
                                sku: "#6548",
                                name: "Screws",
                                price: "$999.29",
                                qty: "x1",
                                disc: "5%",
                                total: "$949.32",
                              },
                            ].map((item, i) => (
                              <tr key={i} className="border-t">
                                <td className="py-2">{i + 1}</td>
                                <td>{item.sku}</td>
                                <td>{item.name}</td>
                                <td>{item.price}</td>
                                <td>{item.qty}</td>
                                <td className="text-red-500">{item.disc}</td>
                                <td>{item.total}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>

                        {/* Summary */}
                        <div className="mt-4 text-sm text-gray-700 space-y-1 text-right">
                          <div>Subtotal: $2,847.96</div>
                          <div>Shipping: $5.50</div>
                          <div className="text-red-500">Discount: $150.32</div>
                          <div className="font-semibold">Total: $2,647.32</div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>

          {/* Pagination omitted for brevity… */}
        </div>
      </div>
    </div>
  );
};

export default AllOrders;
