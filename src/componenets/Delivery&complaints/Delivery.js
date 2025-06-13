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
  Bike,
  CheckCircle,
} from "lucide-react";
import Sidebar from "../Sidebar/sidebar";
import axios from "axios";

const DeliveryComponent = () => {
  const [showComplaintForm, setShowComplaintForm] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [orders, setOrders] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Filters
  const [selectedArea, setSelectedArea] = useState("");
  const [selectedDeliveryType, setSelectedDeliveryType] = useState("");
  const [selectedDriver1, setSelectedDriver1] = useState("");
  const [selectedDriver2, setSelectedDriver2] = useState("");

  // Complaint form state
  const [issueTypes, setIssueTypes] = useState([]);
  const [additionalDetails, setAdditionalDetails] = useState("");
  const [solutions, setSolutions] = useState([]);
  const [solutionDetails, setSolutionDetails] = useState("");
  const [customerRequests, setCustomerRequests] = useState([]);
  const [customerRequestDetails, setCustomerRequestDetails] = useState("");

  const modalRef = useRef(null);

  // Fetch allocated orders and drivers
  useEffect(() => {
    fetchOrders();
    fetchDrivers();
  }, [selectedArea, selectedDeliveryType, selectedDriver1, selectedDriver2]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = {
        status: "allocated-driver",
        limit: 100,
      };

      if (selectedArea) params.area = selectedArea;
      if (selectedDeliveryType) params.deliveryType = selectedDeliveryType;
      if (selectedDriver1) params.driver1 = selectedDriver1;
      if (selectedDriver2) params.driver2 = selectedDriver2;

      const { data } = await axios.get(
        "https://married-flower-fern.glitch.me/api/orders",
        {
          params,
        }
      );

      setOrders(data.orders || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchDrivers = async () => {
    try {
      const { data } = await axios.get(
        "https://married-flower-fern.glitch.me/api/employees",
        {
          params: { employeeCategory: "Driver" },
        }
      );
      setDrivers(data.data || []);
    } catch (error) {
      console.error("Error fetching drivers:", error);
      setDrivers([]);
    }
  };

  const getDriverName = (driverId) => {
    const driver = drivers.find((d) => d.id === driverId || d._id === driverId);
    return driver ? driver.name : driverId;
  };

  // Close modal when clicking outside
  useEffect(() => {
    if (showComplaintForm) {
      const handleClickOutside = (event) => {
        if (modalRef.current && !modalRef.current.contains(event.target)) {
          setShowComplaintForm(false);
          resetComplaintForm();
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
        resetComplaintForm();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [showComplaintForm]);

  const resetComplaintForm = () => {
    setIssueTypes([]);
    setAdditionalDetails("");
    setSolutions([]);
    setSolutionDetails("");
    setCustomerRequests([]);
    setCustomerRequestDetails("");
    setSelectedOrderId(null);
    setSelectedOrder(null);
  };

  const handleComplaint = (order) => {
    setSelectedOrderId(order.orderId);
    setSelectedOrder(order);
    setShowComplaintForm(true);
  };

  const handleIssueTypeChange = (type) => {
    setIssueTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleSolutionChange = (solution) => {
    setSolutions((prev) =>
      prev.includes(solution)
        ? prev.filter((s) => s !== solution)
        : [...prev, solution]
    );
  };

  const handleCustomerRequestChange = (request) => {
    setCustomerRequests((prev) =>
      prev.includes(request)
        ? prev.filter((r) => r !== request)
        : [...prev, request]
    );
  };

  const handleSubmitComplaint = async () => {
    if (issueTypes.length === 0) {
      alert("Please select at least one issue type");
      return;
    }

    try {
      setSubmitLoading(true);

      const complaintData = {
        issueTypes,
        additionalDetails,
        solutions,
        solutionDetails,
        customerRequests,
        customerRequestDetails,
        driverId: selectedOrder?.driver1 || "",
        driverName: getDriverName(selectedOrder?.driver1) || "",
      };

      await axios.post(
        `https://married-flower-fern.glitch.me/api/orders/${selectedOrderId}/complaint`,
        complaintData
      );

      setSuccessMessage("Complaint submitted successfully");
      setShowComplaintForm(false);
      resetComplaintForm();

      // Refresh orders to reflect status change
      fetchOrders();

      // Hide success message after 3 seconds
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error submitting complaint:", error);
      alert("Error submitting complaint. Please try again.");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleViewAllComplaints = () => {
    window.location.href = "/complaints";
  };

  const getDeliveryTypeIcon = (type) => {
    switch (type) {
      case "truck":
        return <Truck className="w-5 h-5" />;
      case "scooter":
        return <Bike className="w-5 h-5" />;
      case "self_pickup":
        return <Package className="w-5 h-5" />;
      default:
        return <Truck className="w-5 h-5" />;
    }
  };

  const getDeliveryTypeLabel = (type) => {
    switch (type) {
      case "truck":
        return "Truck Delivery";
      case "scooter":
        return "Scooter Delivery";
      case "self_pickup":
        return "Self Pickup";
      default:
        return type;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {/* Success Message */}
      {successMessage && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          {successMessage}
        </div>
      )}

      {/* Main Content */}
      <div
        className={`transition-all duration-300 ${
          isSidebarOpen ? "lg:ml-80" : ""
        } w-full`}
      >
        {/* Header */}
        <header className="bg-purple-900 text-white p-6 sticky top-0 z-10 shadow-md">
          <div className="flex items-center gap-3">
            <Home className="w-6 h-6" />
            <h1 className="text-xl font-semibold">5. Delivery Management</h1>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <Home className="w-5 h-5 text-purple-700" />
            <h1 className="text-xl font-semibold">
              Allocated Orders - Ready for Delivery
            </h1>
          </div>

          {/* Filter Section */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h3 className="text-lg font-medium mb-4 text-gray-800">
              Filter Orders
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Pick an area */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  <span className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-purple-600" />
                    Pick an area
                  </span>
                </label>
                <div className="relative">
                  <select
                    className="w-full p-3 border border-gray-300 rounded-lg bg-white pr-10 appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    value={selectedArea}
                    onChange={(e) => setSelectedArea(e.target.value)}
                  >
                    <option value="">All Areas</option>
                    <option value="North Bali">North Bali</option>
                    <option value="South Bali">South Bali</option>
                    <option value="East Bali">East Bali</option>
                    <option value="West Bali">West Bali</option>
                    <option value="Central Bali">Central Bali</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-3 w-4 h-4 pointer-events-none text-gray-500" />
                </div>
              </div>

              {/* Delivery Type */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  <span className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-purple-600" />
                    Delivery Type
                  </span>
                </label>
                <div className="relative">
                  <select
                    className="w-full p-3 border border-gray-300 rounded-lg bg-white pr-10 appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    value={selectedDeliveryType}
                    onChange={(e) => setSelectedDeliveryType(e.target.value)}
                  >
                    <option value="">All Types</option>
                    <option value="truck">Truck Delivery</option>
                    <option value="scooter">Scooter Delivery</option>
                    <option value="self_pickup">Self Pickup</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-3 w-4 h-4 pointer-events-none text-gray-500" />
                </div>
              </div>

              {/* Pick driver 1 */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  <span className="flex items-center gap-2">
                    <User className="w-4 h-4 text-purple-600" />
                    Driver 1
                  </span>
                </label>
                <div className="relative">
                  <select
                    className="w-full p-3 border border-gray-300 rounded-lg bg-white pr-10 appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    value={selectedDriver1}
                    onChange={(e) => setSelectedDriver1(e.target.value)}
                  >
                    <option value="">All Drivers</option>
                    {drivers.map((driver) => (
                      <option
                        key={driver.id || driver._id}
                        value={driver.id || driver._id}
                      >
                        {driver.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-3 w-4 h-4 pointer-events-none text-gray-500" />
                </div>
              </div>

              {/* Pick driver 2 */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  <span className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-purple-600" />
                    Driver 2
                  </span>
                </label>
                <div className="relative">
                  <select
                    className="w-full p-3 border border-gray-300 rounded-lg bg-white pr-10 appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    value={selectedDriver2}
                    onChange={(e) => setSelectedDriver2(e.target.value)}
                  >
                    <option value="">All Drivers</option>
                    {drivers.map((driver) => (
                      <option
                        key={driver.id || driver._id}
                        value={driver.id || driver._id}
                      >
                        {driver.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-3 w-4 h-4 pointer-events-none text-gray-500" />
                </div>
              </div>
            </div>
          </div>

          {/* Order Count and Info */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="flex items-center gap-4 text-sm text-gray-700">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-purple-600" />
                <span className="font-medium">Total Orders:</span>
                <span className="font-semibold text-purple-600">
                  {orders.length}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-purple-600" />
                <span className="font-medium">Status:</span>
                <span className="text-green-600 font-semibold">
                  Allocated for Delivery
                </span>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading allocated orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No allocated orders found</p>
              <p className="text-gray-400 text-sm mt-2">
                Try adjusting your filters or check back later
              </p>
            </div>
          ) : (
            /* Order Items */
            <div className="space-y-4 mb-6">
              {orders.map((order, index) => (
                <div
                  key={order.orderId}
                  className="bg-white rounded-lg shadow-sm overflow-hidden"
                >
                  <div className="bg-gray-50 p-4 border-b border-gray-100 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div>
                        <div className="font-medium text-gray-800">
                          Order {index + 1} of {order.orderId}
                        </div>
                        <div className="text-xs text-green-600 font-medium">
                          Fully allocated
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        {getDeliveryTypeIcon(order.deliveryType)}
                        <span>{getDeliveryTypeLabel(order.deliveryType)}</span>
                      </div>
                    </div>
                    <button
                      className="px-3 py-1 bg-white border border-red-300 rounded-lg shadow-sm hover:bg-red-50 flex items-center justify-center gap-1 text-red-600 text-sm font-medium transition-colors"
                      onClick={() => handleComplaint(order)}
                    >
                      <AlertTriangle className="w-4 h-4" />
                      Complain error in order
                    </button>
                  </div>

                  {/* Order Details */}
                  <div className="p-4 border-b border-gray-100">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">
                          Customer:
                        </span>
                        <span className="ml-2 text-gray-900">
                          {order.customer}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">
                          Amount:
                        </span>
                        <span className="ml-2 text-green-600 font-semibold">
                          ${order.totalAmount}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">
                          Time Slot:
                        </span>
                        <span className="ml-2 text-gray-900">
                          {order.timeSlot || "Not specified"}
                        </span>
                      </div>
                    </div>
                    {order.deliveryAddress && (
                      <div className="mt-2 text-sm">
                        <span className="font-medium text-gray-700">
                          Address:
                        </span>
                        <span className="ml-2 text-gray-900">
                          {order.deliveryAddress.fullAddress}
                        </span>
                      </div>
                    )}
                    <div className="mt-2 text-sm">
                      <span className="font-medium text-gray-700">
                        Drivers:
                      </span>
                      <span className="ml-2 text-gray-900">
                        {getDriverName(order.driver1)},{" "}
                        {getDriverName(order.driver2)}
                      </span>
                    </div>
                  </div>

                  {/* Order Items */}
                  {order.items &&
                    order.items.map((item, itemIndex) => (
                      <div
                        key={itemIndex}
                        className="p-4 border-b border-gray-100 flex justify-between items-center"
                      >
                        <div className="flex items-center">
                          <div className="mr-3 bg-gray-100 p-2 rounded-lg">
                            <Package className="w-8 h-8 text-purple-600" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-800">
                              {item.productName}
                            </div>
                            <div className="text-xs text-gray-500">
                              Qty: {item.quantity}{" "}
                              {item.weight && `(${item.weight})`}
                            </div>
                          </div>
                        </div>
                        <div className="text-sm font-medium text-gray-700">
                          ${item.totalPrice}
                        </div>
                      </div>
                    ))}
                </div>
              ))}
            </div>
          )}

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

      {/* Complaint Form Modal */}
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
                onClick={() => {
                  setShowComplaintForm(false);
                  resetComplaintForm();
                }}
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
                  {[
                    { value: "broken", label: "Broken" },
                    {
                      value: "not_what_ordered",
                      label: "Not what was ordered",
                    },
                    { value: "missing_amount", label: "Missing amount" },
                    { value: "other", label: "Other" },
                  ].map((issue) => (
                    <label
                      key={issue.value}
                      className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        className="mr-2 form-checkbox text-purple-600"
                        checked={issueTypes.includes(issue.value)}
                        onChange={() => handleIssueTypeChange(issue.value)}
                      />
                      <span>{issue.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Additional details
                </label>
                <textarea
                  className="w-full h-32 border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Describe the issue in detail..."
                  value={additionalDetails}
                  onChange={(e) => setAdditionalDetails(e.target.value)}
                ></textarea>
              </div>

              <div className="mb-6">
                <h3 className="font-medium text-gray-700 mb-3">Solution:</h3>
                <div className="space-y-3">
                  {[
                    {
                      value: "customer_keeps_product",
                      label: "Customer keeps product",
                    },
                    {
                      value: "customer_returns_with_truck",
                      label: "Customer returns with truck",
                    },
                  ].map((solution) => (
                    <label
                      key={solution.value}
                      className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        className="mr-2 form-checkbox text-purple-600"
                        checked={solutions.includes(solution.value)}
                        onChange={() => handleSolutionChange(solution.value)}
                      />
                      <span>{solution.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Solution details
                </label>
                <textarea
                  className="w-full h-32 border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Provide details about the solution..."
                  value={solutionDetails}
                  onChange={(e) => setSolutionDetails(e.target.value)}
                ></textarea>
              </div>

              <div className="mb-6">
                <h3 className="font-medium text-gray-700 mb-3">
                  Solution customer asks for:
                </h3>
                <div className="space-y-3">
                  {[
                    {
                      value: "customer_asks_cancellation",
                      label: "Customer asks for cancellation",
                    },
                    {
                      value: "customer_asks_replacement",
                      label: "Customer asks for replacement",
                    },
                  ].map((request) => (
                    <label
                      key={request.value}
                      className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        className="mr-2 form-checkbox text-purple-600"
                        checked={customerRequests.includes(request.value)}
                        onChange={() =>
                          handleCustomerRequestChange(request.value)
                        }
                      />
                      <span>{request.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Customer request details
                </label>
                <textarea
                  className="w-full h-32 border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Provide details about what the customer is requesting..."
                  value={customerRequestDetails}
                  onChange={(e) => setCustomerRequestDetails(e.target.value)}
                ></textarea>
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 font-medium transition-colors"
                  onClick={() => {
                    setShowComplaintForm(false);
                    resetComplaintForm();
                  }}
                  disabled={submitLoading}
                >
                  Cancel
                </button>
                <button
                  className="px-6 py-2 bg-purple-600 border border-purple-700 rounded-lg hover:bg-purple-700 text-white font-medium transition-colors disabled:bg-purple-400"
                  onClick={handleSubmitComplaint}
                  disabled={submitLoading}
                >
                  {submitLoading ? "Submitting..." : "Submit Complaint"}
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
