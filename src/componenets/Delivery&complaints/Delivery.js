import React, { useState, useRef, useEffect } from "react";
import {
  Check,
  Home,
  ChevronDown,
  MoreVertical,
  Package,
  Truck,
  Box,
  MapPin,
  User,
  Users,
  Clock,
  X,
  Bell,
  ShoppingBag,
  AlertTriangle,
} from "lucide-react";
import Sidebar from "../Sidebar/sidebar";

const DeliveryComponent = () => {
  const [showComplaintForm, setShowComplaintForm] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const modalRef = useRef(null);

  // Close modal when clicking outside
  useEffect(() => {
    if (showComplaintForm) {
      const handleClickOutside = (event) => {
        if (modalRef.current && !modalRef.current.contains(event.target)) {
          setShowComplaintForm(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [showComplaintForm]);

  // Handle escape key to close modal
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && showComplaintForm) {
        setShowComplaintForm(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [showComplaintForm]);

  const handleComplaint = (orderId) => {
    setSelectedOrderId(orderId);
    setShowComplaintForm(true);
  };

  const handleViewAllComplaints = () => {
    // This would typically navigate to the AllDeliveryComplaints component
    // For standalone usage, you might use React Router
    window.location.href = "/complaints";
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
        } w-full`}
      >
        {/* Header */}
        <header className="bg-purple-900 text-white p-4 flex justify-between items-center sticky top-0 z-10 shadow-md">
          <div className="flex items-center"></div>
        </header>

        {/* Page Content */}
        <div className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <Home className="w-5 h-5 text-purple-700" />
            <h1 className="text-xl font-semibold">5. Delivery</h1>
          </div>

          {/* Form Section */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Pick an area */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  <span className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-purple-600" />
                    Pick an area
                  </span>
                </label>
                <div className="relative">
                  <select className="w-full p-3 border border-gray-300 rounded-lg bg-white pr-10 appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                    <option>North Bali</option>
                    <option>South Bali</option>
                    <option>East Bali</option>
                    <option>West Bali</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-3 w-4 h-4 pointer-events-none text-gray-500" />
                </div>
              </div>

              {/* Type of pickup */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  <span className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-purple-600" />
                    Type of pickup
                  </span>
                </label>
                <div className="relative">
                  <select className="w-full p-3 border border-gray-300 rounded-lg bg-white pr-10 appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                    <option>Standard</option>
                    <option>Express</option>
                    <option>Same Day</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-3 w-4 h-4 pointer-events-none text-gray-500" />
                </div>
              </div>

              {/* Pick driver 1 */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  <span className="flex items-center gap-2">
                    <User className="w-4 h-4 text-purple-600" />
                    Pick driver 1
                  </span>
                </label>
                <div className="relative">
                  <select className="w-full p-3 border border-gray-300 rounded-lg bg-white pr-10 appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                    <option>Select Driver</option>
                    <option>John Doe</option>
                    <option>Jane Smith</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-3 w-4 h-4 pointer-events-none text-gray-500" />
                </div>
              </div>

              {/* Pick driver 2 */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  <span className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-purple-600" />
                    Pick driver 2
                  </span>
                </label>
                <div className="relative">
                  <select className="w-full p-3 border border-gray-300 rounded-lg bg-white pr-10 appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                    <option>Select Driver</option>
                    <option>Alex Johnson</option>
                    <option>Michael Brown</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-3 w-4 h-4 pointer-events-none text-gray-500" />
                </div>
              </div>
            </div>
          </div>

          {/* Time Slot */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Clock className="w-4 h-4 text-purple-600" />
              <span className="font-medium">Time Slot:</span> 6am-9am
            </div>
          </div>

          {/* Orders on the truck */}
          <div className="mb-4">
            <div className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Truck className="w-4 h-4 text-purple-600" />
              <span>Orders on the truck</span>
              <span className="text-xs italic text-gray-500">
                (select after allocation appears here)
              </span>
            </div>
          </div>

          {/* Order Items */}
          <div className="space-y-4 mb-6">
            {/* Order 1 */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="bg-gray-50 p-4 border-b border-gray-100 flex justify-between items-center">
                <div>
                  <div className="font-medium text-gray-800">
                    Order 1 of 1234
                  </div>
                  <div className="text-xs text-green-600 font-medium">
                    Fully allocated
                  </div>
                </div>
                <button
                  className="px-3 py-1 bg-white border border-red-300 rounded-lg shadow-sm hover:bg-red-50 flex items-center justify-center gap-1 text-red-600 text-sm font-medium transition-colors"
                  onClick={() => handleComplaint("1")}
                >
                  <AlertTriangle className="w-4 h-4" />
                  Complain error in order
                </button>
              </div>

              <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                <div className="flex items-center">
                  <div className="mr-3 bg-gray-100 p-2 rounded-lg">
                    <Package className="w-8 h-8 text-purple-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-800">
                      Lucky Cement
                    </div>
                    <div className="text-xs text-gray-500">Qty: 1 kg</div>
                  </div>
                </div>
                <MoreVertical className="w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-600" />
              </div>

              <div className="p-4 flex justify-between items-center">
                <div className="flex items-center">
                  <div className="mr-3 bg-gray-100 p-2 rounded-lg">
                    <Box className="w-8 h-8 text-purple-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-800">
                      Golden screws
                    </div>
                    <div className="text-xs text-gray-500">Qty: 1 bag</div>
                  </div>
                </div>
                <MoreVertical className="w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-600" />
              </div>
            </div>

            {/* Order 2 */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="bg-gray-50 p-4 border-b border-gray-100 flex justify-between items-center">
                <div>
                  <div className="font-medium text-gray-800">
                    Order 2 of 1234
                  </div>
                  <div className="text-xs text-green-600 font-medium">
                    Fully allocated
                  </div>
                </div>
                <button
                  className="px-3 py-1 bg-white border border-red-300 rounded-lg shadow-sm hover:bg-red-50 flex items-center justify-center gap-1 text-red-600 text-sm font-medium transition-colors"
                  onClick={() => handleComplaint("2")}
                >
                  <AlertTriangle className="w-4 h-4" />
                  Complain error in order
                </button>
              </div>

              <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                <div className="flex items-center">
                  <div className="mr-3 bg-gray-100 p-2 rounded-lg">
                    <Package className="w-8 h-8 text-purple-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-800">
                      Lucky Cement
                    </div>
                    <div className="text-xs text-gray-500">Qty: 1 kg</div>
                  </div>
                </div>
                <MoreVertical className="w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-600" />
              </div>

              <div className="p-4 flex justify-between items-center">
                <div className="flex items-center">
                  <div className="mr-3 bg-gray-100 p-2 rounded-lg">
                    <Box className="w-8 h-8 text-purple-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-800">
                      Golden screws
                    </div>
                    <div className="text-xs text-gray-500">Qty: 1 bag</div>
                  </div>
                </div>
                <MoreVertical className="w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-600" />
              </div>
            </div>
          </div>

          {/* Delivery Status */}
          <div className="flex justify-end mb-6">
            <div className="bg-white rounded-lg shadow-sm px-4 py-2 flex items-center">
              <div className="w-8 h-8 bg-orange-100 border border-orange-400 rounded-full flex items-center justify-center mr-2">
                <Check className="w-5 h-5 text-orange-500" />
              </div>
              <div className="font-medium text-gray-700">Delivered</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center mt-6">
            <button
              className="px-6 py-3 bg-purple-600 border border-purple-700 rounded-lg shadow-sm hover:bg-purple-700 flex items-center justify-center gap-2 text-white font-medium transition-colors"
              onClick={handleViewAllComplaints}
            >
              <Home className="w-5 h-5" />
              View All Complaints
            </button>
          </div>
        </div>
      </div>

      {/* Complaint Form Modal with Scrolling */}
      {showComplaintForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-auto">
          <div
            ref={modalRef}
            className="bg-white rounded-lg shadow-lg w-full max-w-lg max-h-screen overflow-y-auto"
          >
            {/* Modal Header */}
            <div className="bg-purple-900 text-white p-4 flex justify-between items-center sticky top-0 z-10">
              <h2 className="text-xl font-bold">
                Complain or error in order #{selectedOrderId}
              </h2>
              <button
                onClick={() => setShowComplaintForm(false)}
                className="text-white hover:text-gray-200 focus:outline-none"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <div className="mb-6">
                <h3 className="font-medium text-gray-700 mb-3">
                  Select issue type:
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      className="mr-2 form-checkbox text-purple-600"
                    />
                    <span>Broken</span>
                  </label>
                  <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      className="mr-2 form-checkbox text-purple-600"
                    />
                    <span>Not what was ordered</span>
                  </label>
                  <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      className="mr-2 form-checkbox text-purple-600"
                    />
                    <span>Missing amount</span>
                  </label>
                  <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      className="mr-2 form-checkbox text-purple-600"
                    />
                    <span>Other</span>
                  </label>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Additional details
                </label>
                <textarea
                  className="w-full h-32 border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Describe the issue in detail..."
                ></textarea>
              </div>

              <div className="mb-6">
                <h3 className="font-medium text-gray-700 mb-3">Solution:</h3>
                <div className="space-y-3">
                  <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      className="mr-2 form-checkbox text-purple-600"
                    />
                    <span>Customer keeps product</span>
                  </label>
                  <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      className="mr-2 form-checkbox text-purple-600"
                    />
                    <span>Customer returns with truck</span>
                  </label>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Solution details
                </label>
                <textarea
                  className="w-full h-32 border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Provide details about the solution..."
                ></textarea>
              </div>

              <div className="mb-6">
                <h3 className="font-medium text-gray-700 mb-3">
                  Solution customer asks for:
                </h3>
                <div className="space-y-3">
                  <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      className="mr-2 form-checkbox text-purple-600"
                    />
                    <span>Customer asks for cancellation</span>
                  </label>
                  <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      className="mr-2 form-checkbox text-purple-600"
                    />
                    <span>Customer asks for replacement</span>
                  </label>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Customer request details
                </label>
                <textarea
                  className="w-full h-32 border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Provide details about what the customer is requesting..."
                ></textarea>
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 font-medium transition-colors"
                  onClick={() => setShowComplaintForm(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-6 py-2 bg-purple-600 border border-purple-700 rounded-lg hover:bg-purple-700 text-white font-medium transition-colors"
                  onClick={() => {
                    setShowComplaintForm(false);
                    // Here you would typically handle form submission
                  }}
                >
                  Submit Complaint
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryComponent;
