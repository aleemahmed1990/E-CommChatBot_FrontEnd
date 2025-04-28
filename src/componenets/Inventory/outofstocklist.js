import React, { useState } from "react";
import {
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Search,
  Edit,
} from "lucide-react";
import Sidebar from "../Sidebar/sidebar";
import { useNavigate } from "react-router-dom";

const OutOfStockList = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeActionMenu, setActiveActionMenu] = useState(null);
  const navigate = useNavigate();

  const stockItems = [
    {
      id: 1,
      productId: 1,
      productName: "Cement",
      currentQty: 1,
      calculatedQty: 2,
      lastSupplier: "Jimmy and co",
      approvedSupplier: "Jimmy and co",
      txtNote: true,
    },
    {
      id: 2,
      productId: 2,
      productName: "Screws",
      currentQty: 2,
      calculatedQty: 2,
      lastSupplier: "Jimmy and co",
      approvedSupplier: "Jimmy and co",
      txtNote: true,
    },
    {
      id: 3,
      productId: 3,
      productName: "Tools",
      currentQty: 2,
      calculatedQty: 2,
      lastSupplier: "Jimmy and co",
      approvedSupplier: "Jimmy and co",
      txtNote: true,
    },
    {
      id: 4,
      productId: 1,
      productName: "Sand",
      currentQty: 1,
      calculatedQty: 1,
      lastSupplier: "Jimmy and co",
      approvedSupplier: "Jimmy and co",
      txtNote: true,
    },
    {
      id: 5,
      productId: 2,
      productName: "Mirror",
      currentQty: 2,
      calculatedQty: 2,
      lastSupplier: "Jimmy and co",
      approvedSupplier: "Jimmy and co",
      txtNote: true,
    },
    {
      id: 6,
      productId: 2,
      productName: "Wood",
      currentQty: 1,
      calculatedQty: 1,
      lastSupplier: "Jimmy and co",
      approvedSupplier: "Jimmy and co",
      txtNote: false,
    },
  ];

  const handleActionClick = (itemId) => {
    if (activeActionMenu === itemId) {
      setActiveActionMenu(null);
    } else {
      setActiveActionMenu(itemId);
    }
  };

  const moveToOrderList = () => {
    navigate("/order-list");
    setActiveActionMenu(null);
  };

  const showSupplierList = () => {
    navigate("/view-suppliers");
    setActiveActionMenu(null);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {/* Main Content */}
      <div
        className={`transition-all duration-300 ${
          isSidebarOpen ? "lg:ml-80" : ""
        } w-full p-4`}
      >
        <div className="bg-white rounded shadow">
          {/* Header */}
          <div className="p-4 border-b">
            <h1 className="text-xl font-semibold">
              35. Out of Stock list (Order Stock)
            </h1>
          </div>

          {/* Search and Action Bar */}
          <div className="p-4 flex flex-col md:flex-row justify-between items-center">
            <div className="w-full md:w-96 mb-4 md:mb-0">
              <div className="relative">
                <input
                  type="text"
                  placeholder="search"
                  className="w-full border rounded p-2 pl-3"
                />
                <Search
                  className="absolute right-3 top-2.5 text-gray-400"
                  size={18}
                />
              </div>
            </div>
            <button className="bg-white text-black border rounded px-4 py-2">
              final and make order
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-orange-300">
                  <th className="py-3 px-4 text-left">Product ID</th>
                  <th className="py-3 px-4 text-left">Product name</th>
                  <th className="py-3 px-4 text-left">Current qty.</th>
                  <th className="py-3 px-4 text-left">
                    Calculated qty. to order
                  </th>
                  <th className="py-3 px-4 text-left">Last Supplier</th>
                  <th className="py-3 px-4 text-left">Approved Supplier</th>
                  <th className="py-3 px-4 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {stockItems.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b bg-white even:bg-gray-100"
                  >
                    <td className="py-3 px-4">{item.productId}</td>
                    <td className="py-3 px-4">{item.productName}</td>
                    <td className="py-3 px-4">{item.currentQty}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <span className="bg-yellow-100 px-4 py-1 rounded mr-2">
                          {item.calculatedQty}
                        </span>
                        <Edit size={16} />
                      </div>
                    </td>
                    <td className="py-3 px-4 text-blue-500">
                      {item.lastSupplier}
                    </td>
                    <td className="py-3 px-4">
                      {item.txtNote && (
                        <span className="text-gray-500">txt note</span>
                      )}
                      <span className="text-blue-500 ml-2">
                        {item.approvedSupplier}
                      </span>
                    </td>
                    <td className="py-3 px-4 relative">
                      <button
                        onClick={() => handleActionClick(item.id)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <MoreVertical size={20} />
                      </button>

                      {activeActionMenu === item.id && (
                        <div className="absolute right-12 mt-0 bg-white shadow-lg rounded-md border z-10 w-48">
                          <button
                            onClick={moveToOrderList}
                            className="w-full text-left px-4 py-2 hover:bg-gray-100 text-blue-500"
                          >
                            move to order list
                          </button>
                          <button
                            onClick={showSupplierList}
                            className="w-full text-left px-4 py-2 hover:bg-gray-100"
                          >
                            Show supplier list
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center">
              <span className="mr-2 text-sm text-gray-500">Showing</span>
              <select className="border rounded px-2 py-1 text-sm mr-2">
                <option>10</option>
                <option>25</option>
                <option>50</option>
              </select>
              <span className="text-sm text-gray-500">of 50</span>
            </div>

            <div className="flex items-center">
              <button className="p-1 rounded border mx-1 text-gray-500">
                <ChevronLeft size={16} />
              </button>
              <button className="p-1 rounded border bg-orange-500 text-white mx-1 w-8 h-8 flex items-center justify-center">
                1
              </button>
              <button className="p-1 rounded border mx-1 w-8 h-8 flex items-center justify-center">
                2
              </button>
              <button className="p-1 rounded border mx-1 w-8 h-8 flex items-center justify-center">
                3
              </button>
              <button className="p-1 rounded border mx-1 w-8 h-8 flex items-center justify-center">
                4
              </button>
              <button className="p-1 rounded border mx-1 w-8 h-8 flex items-center justify-center">
                5
              </button>
              <button className="p-1 rounded border mx-1 text-gray-500">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OutOfStockList;
