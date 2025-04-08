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
                <tr key={`${order.id}-${index}`} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {order.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.created}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.customer}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.total}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className="px-3 py-1 rounded-full text-sm"
                      style={{ backgroundColor: order.statusColor }}
                    >
                      {order.statusLabel}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-gray-400 hover:text-gray-600 rounded-full p-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
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
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                  currentPage === 1
                    ? "bg-gray-100 text-gray-400"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                  currentPage === totalPages
                    ? "bg-gray-100 text-gray-400"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing{" "}
                  <span className="font-medium">{indexOfFirstItem + 1}</span> to{" "}
                  <span className="font-medium">
                    {Math.min(indexOfLastItem, filteredOrders.length)}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium">{filteredOrders.length}</span>{" "}
                  results
                </p>
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">Showing</span>
                  <select
                    className="border rounded p-1 text-sm"
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                  >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>
                  <span className="text-sm text-gray-500">
                    of {filteredOrders.length}
                  </span>
                </div>
              </div>
              <nav
                className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                aria-label="Pagination"
              >
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                    currentPage === 1
                      ? "text-gray-300"
                      : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  <ChevronLeft size={16} />
                </button>

                {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                  // Show pages around current page
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        currentPage === pageNum
                          ? "z-10 bg-green-600 text-white border-green-600"
                          : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                    currentPage === totalPages
                      ? "text-gray-300"
                      : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  <ChevronRight size={16} />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllOrders;
