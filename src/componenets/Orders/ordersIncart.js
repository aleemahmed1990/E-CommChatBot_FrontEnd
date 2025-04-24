import React, { useState } from "react";
import { Search, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import Sidebar from "../Sidebar/sidebar";

export default function OrdersInCart() {
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Mock data for orders
  const initialOrders = [
    {
      id: "#6548",
      created: "2 min ago",
      customer: "Joseph Wheeler",
      PhoneNumber: "033333333",
      total: "$654",
      status: "In the cart",
    },
    {
      id: "#6548",
      created: "2 min ago",
      customer: "Joseph Wheeler",
      PhoneNumber: "033333333",
      total: "$654",
      status: "In the cart",
    },
    {
      id: "#6548",
      created: "2 min ago",
      customer: "Joseph Wheeler",
      PhoneNumber: "033333333",
      total: "$654",
      status: "In the cart",
    },
    {
      id: "#6548",
      created: "2 min ago",
      customer: "Joseph Wheeler",
      PhoneNumber: "033333333",
      total: "$654",
      status: "In the cart",
    },
    {
      id: "#6548",
      created: "2 min ago",
      customer: "Joseph Wheeler",
      PhoneNumber: "033333333",
      total: "$654",
      status: "In the cart",
    },
  ];

  // Product details for expanded view
  const productDetails = [
    {
      sku: "#6548",
      name: "Lucky Cement",
      price: "$999.29",
      qty: "x1",
      disc: "5%",
      outOfStock: true,
    },
    {
      sku: "#6549",
      name: "Super Cement",
      price: "$899.99",
      qty: "x2",
      disc: "3%",
      outOfStock: false,
    },
    {
      sku: "#6550",
      name: "Premium Cement",
      price: "$1299.99",
      qty: "x1",
      disc: "10%",
      outOfStock: true,
    },
  ];

  // Filter orders based on search query
  const filteredOrders = initialOrders.filter((order) =>
    searchQuery
      ? order.id.toLowerCase().includes(searchQuery.toLowerCase())
      : true
  );

  // Handle search
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  // Handle order expansion
  const toggleOrderExpansion = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  // Calculate pagination
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div>
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <div
        className={`transition-all duration-300 ${
          isSidebarOpen ? "lg:ml-80" : ""
        } w-full bg-gray-50 p-4`}
      >
        {/* Header */}
        <header className="bg-gray-700 text-white p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center"></div>
            <div className="flex items-center">
              <div className="relative mr-4"></div>
              <div className="flex items-center"></div>
            </div>
          </div>
          <div className="flex items-center mt-4">
            <div className="flex items-center text-xl">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
              1. Order is in cart not ordered yet
            </div>
          </div>
        </header>
        {/* Main Content */}
        <main className="flex-grow p-8">
          <div className="bg-white rounded-lg shadow p-6">
            {/* Search and Filter */}
            <div className="flex justify-between mb-6">
              <div className="relative w-64">
                <input
                  type="text"
                  placeholder="Search by order id"
                  className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md"
                  value={searchQuery}
                  onChange={handleSearch}
                />
                <div className="absolute right-3 top-2.5 text-gray-400">
                  <Search size={18} />
                </div>
              </div>
              <div className="relative w-64">
                <button className="w-full flex justify-between items-center pl-3 pr-4 py-2 border border-gray-300 rounded-md bg-white text-gray-500">
                  <span>Filter by date range</span>
                  <ChevronDown size={18} />
                </button>
              </div>
            </div>

            {/* Order Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="border-b text-left text-gray-500 text-sm">
                    <th className="py-3 px-4">ORDER ID</th>
                    <th className="py-3 px-4">CREATED</th>
                    <th className="py-3 px-4">CUSTOMER</th>
                    <th className="py-3 px-4">PhoneNumber</th>
                    <th className="py-3 px-4">TOTAL</th>
                    <th className="py-3 px-4">STATUS</th>
                    <th className="py-3 px-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedOrders.map((order, index) => (
                    <React.Fragment key={index}>
                      <tr className="border-b">
                        <td className="py-4 px-4 font-medium">{order.id}</td>
                        <td className="py-4 px-4 text-gray-600">
                          {order.created}
                        </td>
                        <td className="py-4 px-4">{order.customer}</td>
                        <td className="py-4 px-4">{order.PhoneNumber}</td>
                        <td className="py-4 px-4 font-medium">{order.total}</td>
                        <td className="py-4 px-4">
                          <span className="bg-yellow-100 text-yellow-800 px-3 py-1 text-sm rounded-md flex items-center w-fit">
                            {order.status}
                            <ChevronDown size={16} className="ml-1" />
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <button
                            className="rounded-full p-2 border border-gray-300"
                            onClick={() => toggleOrderExpansion(index)}
                          >
                            <svg
                              className="h-4 w-4 text-gray-500"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          </button>
                        </td>
                      </tr>
                      {expandedOrder === index && (
                        <tr>
                          <td colSpan="6" className="px-4 py-4">
                            <div className="border-t border-b py-4">
                              <table className="min-w-full">
                                <thead>
                                  <tr className="text-left text-gray-500 text-sm">
                                    <th className="py-2 px-4">#</th>
                                    <th className="py-2 px-4">SKU</th>
                                    <th className="py-2 px-4">NAME</th>
                                    <th className="py-2 px-4">PRICE</th>
                                    <th className="py-2 px-4">QTY</th>
                                    <th className="py-2 px-4">DISC.</th>
                                    <th className="py-2 px-4"></th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {productDetails.map((product, idx) => (
                                    <tr key={idx}>
                                      <td className="py-3 px-4">
                                        {product.sku}
                                      </td>
                                      <td className="py-3 px-4">
                                        {product.sku}
                                      </td>
                                      <td className="py-3 px-4 font-medium">
                                        {product.name}
                                      </td>
                                      <td className="py-3 px-4">
                                        {product.price}
                                      </td>
                                      <td className="py-3 px-4">
                                        {product.qty}
                                      </td>
                                      <td className="py-3 px-4 text-red-500">
                                        {product.disc}
                                      </td>
                                      <td className="py-3 px-4">
                                        {product.outOfStock && (
                                          <div className="w-8 h-8 bg-red-600 rounded-full"></div>
                                        )}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                              <div className="mt-4 flex justify-end">
                                <div className="text-gray-700">
                                  <strong>STOCK</strong>
                                  <p className="text-gray-600">
                                    PRODUCT OUT OF STOCK
                                  </p>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-6">
              <div className="flex items-center text-gray-600 text-sm">
                <span>Showing</span>
                <div className="relative mx-2">
                  <select
                    className="appearance-none border rounded-md pl-3 pr-8 py-1 bg-white"
                    value={itemsPerPage}
                    onChange={(e) => setItemsPerPage(parseInt(e.target.value))}
                  >
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <ChevronDown size={16} />
                  </div>
                </div>
                <span>of 50</span>
              </div>
              <div className="flex items-center">
                <button
                  className="p-1 rounded-md border border-gray-300 mr-1"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft size={18} className="text-gray-500" />
                </button>
                {[...Array(Math.min(5, totalPages))].map((_, i) => (
                  <button
                    key={i}
                    className={`w-8 h-8 flex items-center justify-center rounded-md mx-1 ${
                      currentPage === i + 1
                        ? "bg-gray-700 text-white"
                        : "bg-white text-gray-700 border border-gray-300"
                    }`}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  className="p-1 rounded-md border border-gray-300 ml-1"
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight size={18} className="text-gray-500" />
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
