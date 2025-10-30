import React, { useState, useEffect } from "react";
import {
  Clock,
  CheckCircle,
  Archive,
  Target,
  Navigation,
  Search,
  Calendar,
  MapPin,
  AlertTriangle,
  Package,
  Users,
  Building,
  Truck,
  User,
  Phone,
  FileText,
  X,
  Eye,
  MessageCircle,
  ExternalLink,
  Mail,
  CreditCard,
} from "lucide-react";

const API_BASE_URL = "https://e-commchatbot-backend-4.onrender.com";

const OrderOverviewDashboard = ({ selectedRole, setSelectedRole }) => {
  const [orders, setOrders] = useState([]);
  const [workflowStatus, setWorkflowStatus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [priorityFilter, setPriorityFilter] = useState("All Priorities");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [initializingTracking, setInitializingTracking] = useState(false);

  const roleButtons = [
    {
      name: "Order Overview",
      icon: Package,
      active: true,
      color: "bg-gray-800 text-white",
    },
    {
      name: "Packing Staff",
      icon: Package,
      active: false,
      color: "bg-gray-100 text-gray-700",
    },
    {
      name: "Delivery Storage Officer",
      icon: Building,
      active: false,
      color: "bg-gray-100 text-gray-700",
    },
    {
      name: "Dispatch Officer 1",
      icon: User,
      active: false,
      color: "bg-gray-100 text-gray-700",
    },
    {
      name: "Dispatch Officer 2",
      icon: User,
      active: false,
      color: "bg-gray-100 text-gray-700",
    },
    {
      name: "Driver",
      icon: Truck,
      active: false,
      color: "bg-gray-100 text-gray-700",
    },
    {
      name: "Driver on Delivery",
      icon: Navigation,
      active: false,
      color: "bg-gray-100 text-gray-700",
    },
  ];

  const secondRowRoles = [
    {
      name: "Complaint Manager on Delivery",
      icon: Phone,
      active: false,
      color: "bg-gray-100 text-gray-700",
    },
    {
      name: "Complaint Manager After Delivery",
      icon: FileText,
      active: false,
      color: "bg-gray-100 text-gray-700",
    },
  ];

  useEffect(() => {
    initializeSystem();
  }, []);

  useEffect(() => {
    if (!initializingTracking) {
      fetchOrders();
      fetchWorkflowStatus();

      // Auto-refresh every 10 seconds for real-time updates
      const interval = setInterval(() => {
        fetchOrders();
        fetchWorkflowStatus();
      }, 10000);

      return () => clearInterval(interval);
    }
  }, [searchQuery, statusFilter, priorityFilter, initializingTracking]);

  const initializeSystem = async () => {
    try {
      setInitializingTracking(true);
      console.log("🚀 Initializing delivery tracking system...");

      const response = await fetch(
        `${API_BASE_URL}/api/delivery/initialize-tracking`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log("✅ Tracking initialized:", result);
      }
    } catch (error) {
      console.error("Error initializing tracking:", error);
    } finally {
      setInitializingTracking(false);
    }
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchQuery) params.append("search", searchQuery);
      if (statusFilter !== "All Status") params.append("status", statusFilter);
      if (priorityFilter !== "All Priorities")
        params.append("priority", priorityFilter);

      const response = await fetch(
        `${API_BASE_URL}/api/delivery/orders/overview?${params}`
      );
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWorkflowStatus = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/delivery/workflow-status`
      );
      const data = await response.json();

      const statusArray = [
        { label: "Pending", count: data.pending || 0, icon: Clock },
        { label: "Packed", count: data.packed || 0, icon: CheckCircle },
        { label: "Storage", count: data.storage || 0, icon: Archive },
        { label: "Assigned", count: data.assigned || 0, icon: Target },
        { label: "Loaded", count: data.loaded || 0, icon: CheckCircle },
        { label: "In Transit", count: data.inTransit || 0, icon: Navigation },
        { label: "Delivered", count: data.delivered || 0, icon: CheckCircle },
      ];

      setWorkflowStatus(statusArray);
    } catch (error) {
      console.error("Error fetching workflow status:", error);
    }
  };

  const fetchOrderDetails = async (orderId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/delivery/orders/${orderId}/details`
      );
      const data = await response.json();
      setSelectedOrder(data);
      setShowOrderModal(true);
    } catch (error) {
      console.error("Error fetching order details:", error);
    }
  };

  const sendWhatsAppMessage = async (
    orderId,
    messageType = "general_inquiry"
  ) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/delivery/orders/${orderId}/whatsapp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messageType: messageType,
          }),
        }
      );

      if (response.ok) {
        const result = await response.json();
        // Open WhatsApp in new tab
        window.open(result.whatsappUrl, "_blank");
        alert(`WhatsApp message prepared for ${result.customerPhone}`);
      } else {
        const error = await response.json();
        alert(`Failed to prepare WhatsApp message: ${error.error}`);
      }
    } catch (error) {
      console.error("Error sending WhatsApp message:", error);
      alert("Failed to prepare WhatsApp message");
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "HIGH":
        return "bg-red-500 text-white";
      case "MEDIUM":
        return "bg-yellow-500 text-white";
      case "LOW":
        return "bg-green-500 text-white";
      default:
        return "bg-gray-300 text-gray-700";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "In Transit":
        return "bg-blue-100 text-blue-800 border border-blue-200";
      case "Loaded":
        return "bg-green-100 text-green-800 border border-green-200";
      case "Assigned":
        return "bg-purple-100 text-purple-800 border border-purple-200";
      case "Packing":
        return "bg-yellow-100 text-yellow-800 border border-yellow-200";
      case "Pending":
        return "bg-orange-100 text-orange-800 border border-orange-200";
      case "Delivered":
        return "bg-green-100 text-green-800 border border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  const isOverdue = (schedule) => {
    if (!schedule || schedule === "Not scheduled") return false;
    const scheduleDate = new Date(schedule);
    const now = new Date();
    return scheduleDate < now;
  };

  const OrderDetailsModal = ({ order, onClose }) => {
    if (!order) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-screen overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">
                Order Details - {order.orderId}
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-3">
                  Customer Information
                </h3>
                <div className="space-y-2">
                  <p>
                    <span className="font-medium">Name:</span>{" "}
                    {order.customer.name}
                  </p>
                  <p>
                    <span className="font-medium">Phone:</span>{" "}
                    {order.customer.phone}
                  </p>
                  <p>
                    <span className="font-medium">Email:</span>{" "}
                    {order.customer.email || "Not provided"}
                  </p>
                  <p>
                    <span className="font-medium">Address:</span>{" "}
                    {order.customer.address?.fullAddress || "Not provided"}
                  </p>
                  <p>
                    <span className="font-medium">Area:</span>{" "}
                    {order.customer.address?.area || "Not provided"}
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-3 text-green-600">
                  Order Information
                </h3>
                <div className="space-y-2">
                  <p>
                    <span className="font-medium">Order Value:</span>{" "}
                    <span className="text-green-600 font-semibold">
                      AED {order.totalAmount?.toFixed(2)}
                    </span>
                  </p>
                  <p>
                    <span className="font-medium">Item Count:</span>{" "}
                    {order.items?.length || 0} items
                  </p>
                  <p>
                    <span className="font-medium">Status:</span>
                    <span
                      className={`ml-2 px-2 py-1 text-xs rounded ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </p>
                  <p>
                    <span className="font-medium">Scheduled Delivery:</span>{" "}
                    {order.deliveryDate
                      ? new Date(order.deliveryDate).toLocaleDateString()
                      : "Not scheduled"}
                  </p>
                  <p>
                    <span className="font-medium">Time Slot:</span>{" "}
                    {order.timeSlot || "Not specified"}
                  </p>
                  <p>
                    <span className="font-medium">Driver:</span>{" "}
                    {order.driver1 || order.driver2 || "Not assigned"}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-3">
                Order Items ({order.items?.length || 0} items)
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Item Name
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Quantity
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Weight
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Price
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {order.items?.map((item, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2">{item.productName}</td>
                        <td className="px-4 py-2">{item.quantity}</td>
                        <td className="px-4 py-2">{item.weight || "N/A"}</td>
                        <td className="px-4 py-2">
                          AED {item.totalPrice?.toFixed(2) || "0.00"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {order.specialInstructions && (
              <div className="mt-6 bg-orange-50 border border-orange-200 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2 flex items-center">
                  <AlertTriangle className="h-5 w-5 text-orange-600 mr-2" />
                  Special Instructions
                </h3>
                <p className="text-orange-800">{order.specialInstructions}</p>
              </div>
            )}

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={() =>
                  sendWhatsAppMessage(order.orderId, "status_update")
                }
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                WhatsApp Customer
              </button>
              <button
                onClick={() =>
                  sendWhatsAppMessage(order.orderId, "delivery_notification")
                }
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <Phone className="h-4 w-4 mr-2" />
                Delivery Update
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (initializingTracking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Initializing Delivery System
          </h2>
          <p className="text-gray-600">
            Setting up tracking for your existing orders...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            Delivery Management System
          </h1>
          <p className="text-gray-600">
            Complete workflow management from packing to delivery confirmation
          </p>
        </div>

        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Select Role
          </h2>
          <div className="space-y-3">
            <div className="flex flex-wrap gap-3">
              {roleButtons.map((role, index) => {
                const IconComponent = role.icon;
                return (
                  <button
                    key={index}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      role.name === selectedRole
                        ? "bg-gray-800 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                    onClick={() => setSelectedRole(role.name)}
                  >
                    <IconComponent className="h-4 w-4" />
                    <span>{role.name}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex flex-wrap gap-3">
              {secondRowRoles.map((role, index) => {
                const IconComponent = role.icon;
                return (
                  <button
                    key={index}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      role.name === selectedRole
                        ? "bg-gray-800 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                    onClick={() => setSelectedRole(role.name)}
                  >
                    <IconComponent className="h-4 w-4" />
                    <span>{role.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div>
          <div className="mb-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Live Workflow Status
            </h2>
            <div className="grid grid-cols-7 gap-4">
              {workflowStatus.map((status, index) => {
                const IconComponent = status.icon;
                return (
                  <div key={index} className="text-center">
                    <div className="flex justify-center mb-2">
                      <div className="p-3 rounded-full bg-gray-100">
                        <IconComponent className="h-6 w-6 text-gray-600" />
                      </div>
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      {status.label}
                    </div>
                    <div className="text-lg font-semibold text-gray-900 mt-1">
                      {status.count}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Search & Filter Orders
            </h2>
            <div className="flex items-center space-x-4">
              <div className="flex-1 relative">
                <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search orders, customers, or addresses..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <select
                className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option>All Status</option>
                <option>Pending</option>
                <option>Packing</option>
                <option>Assigned</option>
                <option>In Transit</option>
                <option>Delivered</option>
              </select>
              <select
                className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
              >
                <option>All Priorities</option>
                <option>HIGH</option>
                <option>MEDIUM</option>
                <option>LOW</option>
              </select>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">
                Orders Overview ({orders.length} orders)
              </h3>
              <div className="flex items-center space-x-2 text-sm text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Live Updates</span>
              </div>
            </div>

            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading orders...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <div className="min-w-[1200px]">
                  {/* Header Row */}
                  <div className="bg-gray-50 border-b border-gray-200">
                    <div className="grid grid-cols-11 gap-4 px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="col-span-2">Schedule & Priority</div>
                      <div className="col-span-2">Status & Progress</div>
                      <div className="col-span-2">Customer</div>
                      <div className="col-span-2">Order Details</div>
                      <div className="text-center">Pending</div>
                      <div className="text-center">Packed</div>
                      <div className="text-center">Storage</div>
                    </div>
                    <div className="grid grid-cols-11 gap-4 px-6 pb-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="col-span-8"></div>
                      <div className="text-center">Assigned</div>
                      <div className="text-center">Loaded</div>
                      <div className="text-center">In Transit</div>
                    </div>
                    <div className="grid grid-cols-11 gap-4 px-6 pb-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="col-span-8"></div>
                      <div className="text-center">Delivered</div>
                      <div className="text-center">Actions</div>
                      <div></div>
                    </div>
                  </div>

                  {/* Data Rows */}
                  <div className="divide-y divide-gray-200">
                    {orders.map((order, index) => (
                      <div
                        key={index}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <div className="grid grid-cols-11 gap-4 px-6 py-4">
                          {/* Schedule & Priority */}
                          <div className="col-span-2">
                            <div className="font-medium text-gray-900 text-sm">
                              {order.id}
                            </div>
                            <div className="flex items-center text-sm text-gray-600 mt-1">
                              <MapPin className="h-3 w-3 mr-1" />
                              {order.location}
                            </div>
                            <div className="text-sm font-medium text-green-600 mt-1">
                              {order.amount}
                            </div>
                            <div className="text-sm text-gray-600">
                              {order.items}
                            </div>
                            {isOverdue(order.schedule) && (
                              <div className="text-xs text-red-500 mt-1 font-medium">
                                Overdue
                              </div>
                            )}
                            <span
                              className={`inline-block px-2 py-1 text-xs font-medium rounded mt-2 ${getPriorityColor(
                                order.priority
                              )}`}
                            >
                              {order.priority}
                            </span>
                          </div>

                          {/* Status & Progress */}
                          <div className="col-span-2">
                            <span
                              className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(
                                order.status
                              )}`}
                            >
                              {order.status}
                            </span>
                            {order.officer && (
                              <div className="text-xs text-gray-600 mt-2">
                                <span className="font-medium">Driver:</span>{" "}
                                {order.officer}
                              </div>
                            )}
                            {order.hasComplaints && (
                              <div className="flex items-center text-xs text-red-600 mt-1">
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                Has Complaints
                              </div>
                            )}
                            {order.specialInstructions && (
                              <div className="flex items-center text-xs text-blue-600 mt-1">
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                Special Instructions
                              </div>
                            )}
                          </div>

                          {/* Customer */}
                          <div className="col-span-2">
                            <div className="font-medium text-gray-900 text-sm">
                              {order.customerDetails?.name || order.customer}
                            </div>
                            <div className="flex items-center text-sm text-gray-600 mt-1">
                              <Phone className="h-3 w-3 mr-1" />
                              {order.customerDetails?.phone || order.phone}
                            </div>
                            {order.customerDetails?.email && (
                              <div className="flex items-center text-sm text-gray-600 mt-1">
                                <Mail className="h-3 w-3 mr-1" />
                                {order.customerDetails.email.length > 20
                                  ? order.customerDetails.email.substring(
                                      0,
                                      20
                                    ) + "..."
                                  : order.customerDetails.email}
                              </div>
                            )}
                            <div className="text-xs text-gray-500 mt-1">
                              Since:{" "}
                              {order.customerDetails?.customerSince ||
                                "Unknown"}
                            </div>
                          </div>

                          {/* Order Details */}
                          <div className="col-span-2">
                            <div className="font-medium text-gray-900 text-sm">
                              {order.orderDetails?.orderId || order.id}
                            </div>
                            <div className="text-sm text-gray-600 mt-1">
                              {order.orderDetails?.orderDate || "Unknown"}
                            </div>
                            <div className="text-sm text-gray-600">
                              {order.orderDetails?.itemCount || 0} items
                            </div>
                            <div className="flex items-center text-sm text-gray-600 mt-1">
                              <CreditCard className="h-3 w-3 mr-1" />
                              {order.orderDetails?.paymentStatus || "pending"}
                            </div>
                          </div>

                          {/* Workflow Progress Icons */}
                          <div className="flex justify-center items-center">
                            {order.progress?.pending ? (
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            ) : (
                              <Clock className="h-5 w-5 text-gray-300" />
                            )}
                          </div>
                          <div className="flex justify-center items-center">
                            {order.progress?.packed ? (
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            ) : (
                              <Clock className="h-5 w-5 text-gray-300" />
                            )}
                          </div>
                          <div className="flex justify-center items-center">
                            {order.progress?.storage ? (
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            ) : (
                              <Clock className="h-5 w-5 text-gray-300" />
                            )}
                          </div>
                        </div>

                        {/* Second Row for remaining workflow steps */}
                        <div className="grid grid-cols-11 gap-4 px-6 pb-2">
                          <div className="col-span-8"></div>
                          <div className="flex justify-center items-center">
                            {order.progress?.assigned ? (
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            ) : (
                              <Clock className="h-5 w-5 text-gray-300" />
                            )}
                          </div>
                          <div className="flex justify-center items-center">
                            {order.progress?.loaded ? (
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            ) : (
                              <Clock className="h-5 w-5 text-gray-300" />
                            )}
                          </div>
                          <div className="flex justify-center items-center">
                            {order.progress?.inTransit ? (
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            ) : (
                              <Clock className="h-5 w-5 text-gray-300" />
                            )}
                          </div>
                        </div>

                        {/* Third Row for final steps */}
                        <div className="grid grid-cols-11 gap-4 px-6 pb-4">
                          <div className="col-span-8"></div>
                          <div className="flex justify-center items-center">
                            {order.progress?.delivered ? (
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            ) : (
                              <Clock className="h-5 w-5 text-gray-300" />
                            )}
                          </div>
                          {/* Actions */}
                          <div className="flex items-center justify-center space-x-2">
                            <button
                              onClick={() => fetchOrderDetails(order.id)}
                              className="p-2 text-blue-600 hover:bg-blue-100 rounded-full transition-colors"
                              title="View Details"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => sendWhatsAppMessage(order.id)}
                              className="p-2 text-green-600 hover:bg-green-100 rounded-full transition-colors"
                              title="WhatsApp Customer"
                            >
                              <MessageCircle className="h-4 w-4" />
                            </button>
                          </div>
                          <div></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* No orders message */}
                {orders.length === 0 && (
                  <div className="text-center py-12">
                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No orders found
                    </h3>
                    <p className="text-gray-600">
                      Try adjusting your search or filter criteria.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {showOrderModal && (
          <OrderDetailsModal
            order={selectedOrder}
            onClose={() => {
              setShowOrderModal(false);
              setSelectedOrder(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default OrderOverviewDashboard;
