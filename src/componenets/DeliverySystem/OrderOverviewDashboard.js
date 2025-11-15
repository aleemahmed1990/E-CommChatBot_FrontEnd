import React, { useState, useEffect, useRef } from "react";
import {
  Clock,
  CheckCircle,
  AlertTriangle,
  Search,
  Eye,
  MapPin,
  User,
  Phone,
  Mail,
  DollarSign,
  X,
} from "lucide-react";

const API_BASE_URL = "https://e-commchatbot-backend-4.onrender.com";

const OrderOverviewDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [workflowStatus, setWorkflowStatus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const updateTimeoutRef = useRef(null);

  const ORDER_STATUSES = [
    "cart-not-paid",
    "order-made-not-paid",
    "pay-not-confirmed",
    "order-confirmed",
    "order-not-picked",
    "issue-customer",
    "customer-confirmed",
    "order-refunded",
    "picking-order",
    "allocated-driver",
    "assigned-dispatch-officer-2",
    "ready-to-pickup",
    "order-not-pickedup",
    "order-picked-up",
    "on-way",
    "driver-confirmed",
    "order-processed",
    "refund",
    "complain-order",
    "issue-driver",
    "parcel-returned",
    "order-complete",
  ];

  useEffect(() => {
    fetchAllOrders();
    const interval = setInterval(fetchAllOrdersQuiet, 5000);
    return () => {
      clearInterval(interval);
      if (updateTimeoutRef.current) clearTimeout(updateTimeoutRef.current);
    };
  }, []);

  const fetchAllOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/orders/all`);
      if (response.ok) {
        const data = await response.json();
        setOrders(data || []);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllOrdersQuiet = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/orders/all`);
      if (response.ok) {
        const data = await response.json();
        setOrders((prev) => {
          if (JSON.stringify(prev) !== JSON.stringify(data)) {
            return data || [];
          }
          return prev;
        });
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerPhone?.includes(searchQuery);

    const matchesStatus =
      statusFilter === "All Status" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    const colors = {
      "order-confirmed": "bg-green-100 text-green-800",
      "picking-order": "bg-blue-100 text-blue-800",
      "ready-to-pickup": "bg-yellow-100 text-yellow-800",
      "on-way": "bg-orange-100 text-orange-800",
      "order-complete": "bg-emerald-100 text-emerald-800",
      "complain-order": "bg-red-100 text-red-800",
      "issue-customer": "bg-red-100 text-red-800",
      "issue-driver": "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-blue-600 rounded-lg p-4 text-white">
          <p className="text-sm opacity-90">Total Orders</p>
          <p className="text-3xl font-bold mt-1">{orders.length}</p>
        </div>
        <div className="bg-green-600 rounded-lg p-4 text-white">
          <p className="text-sm opacity-90">Confirmed</p>
          <p className="text-3xl font-bold mt-1">
            {orders.filter((o) => o.status === "order-confirmed").length}
          </p>
        </div>
        <div className="bg-yellow-600 rounded-lg p-4 text-white">
          <p className="text-sm opacity-90">In Delivery</p>
          <p className="text-3xl font-bold mt-1">
            {
              orders.filter(
                (o) =>
                  o.status?.includes("order-picked") || o.status === "on-way"
              ).length
            }
          </p>
        </div>
        <div className="bg-emerald-600 rounded-lg p-4 text-white">
          <p className="text-sm opacity-90">Completed</p>
          <p className="text-3xl font-bold mt-1">
            {orders.filter((o) => o.status === "order-complete").length}
          </p>
        </div>
        <div className="bg-red-600 rounded-lg p-4 text-white">
          <p className="text-sm opacity-90">Issues</p>
          <p className="text-3xl font-bold mt-1">
            {
              orders.filter(
                (o) =>
                  o.status?.includes("issue") || o.status === "complain-order"
              ).length
            }
          </p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-lg shadow p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search Order ID, Customer Name, Phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All Status">All Status</option>
            {ORDER_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status.replace(/-/g, " ").toUpperCase()}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <p className="mt-2">Loading orders...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <p className="text-lg">No orders found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="px-4 py-3 text-left">Order ID</th>
                  <th className="px-4 py-3 text-left">Customer</th>
                  <th className="px-4 py-3 text-left">Phone</th>
                  <th className="px-4 py-3 text-left">Amount</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Date</th>
                  <th className="px-4 py-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order, idx) => (
                  <tr
                    key={order._id}
                    className={`${
                      idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                    } border-b hover:bg-gray-100`}
                  >
                    <td className="px-4 py-3 font-semibold text-gray-900">
                      {order.orderId}
                    </td>
                    <td className="px-4 py-3">{order.customerName}</td>
                    <td className="px-4 py-3">{order.customerPhone}</td>
                    <td className="px-4 py-3 font-semibold text-green-600">
                      PKR {order.totalAmount?.toFixed(2) || "0.00"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-sm font-medium ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status?.replace(/-/g, " ").toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowOrderModal(true);
                        }}
                        className="inline-flex items-center space-x-1 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        <Eye className="h-4 w-4" />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showOrderModal && selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => {
            setShowOrderModal(false);
            setSelectedOrder(null);
          }}
        />
      )}
    </div>
  );
};

const OrderDetailModal = ({ order, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto">
        <div className="bg-gray-800 text-white p-6 flex justify-between items-center sticky top-0">
          <h2 className="text-2xl font-bold">Order Details</h2>
          <button onClick={onClose} className="text-white hover:text-gray-300">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Order Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-gray-600">
                Order ID
              </label>
              <p className="text-lg font-bold text-gray-900">{order.orderId}</p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-600">
                Status
              </label>
              <p className="text-lg font-bold text-green-600">
                {order.status?.replace(/-/g, " ").toUpperCase()}
              </p>
            </div>
          </div>

          {/* Customer Info */}
          <div className="border-t pt-4">
            <h3 className="font-bold text-gray-900 mb-3 flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Customer Information</span>
            </h3>
            <div className="grid grid-cols-2 gap-4 ml-7">
              <div>
                <label className="text-xs font-semibold text-gray-600">
                  Name
                </label>
                <p className="text-gray-900">{order.customerName}</p>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600">
                  Phone
                </label>
                <p className="text-gray-900 flex items-center space-x-1">
                  <Phone className="h-4 w-4" />
                  <span>{order.customerPhone}</span>
                </p>
              </div>
              {order.customerEmail && (
                <div className="col-span-2">
                  <label className="text-xs font-semibold text-gray-600">
                    Email
                  </label>
                  <p className="text-gray-900 flex items-center space-x-1">
                    <Mail className="h-4 w-4" />
                    <span>{order.customerEmail}</span>
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Delivery Address */}
          <div className="border-t pt-4">
            <h3 className="font-bold text-gray-900 mb-3 flex items-center space-x-2">
              <MapPin className="h-5 w-5" />
              <span>Delivery Address</span>
            </h3>
            <p className="text-gray-900 ml-7">{order.deliveryAddress}</p>
            {order.deliveryInstructions && (
              <p className="text-sm text-gray-600 ml-7 mt-1">
                <strong>Instructions:</strong> {order.deliveryInstructions}
              </p>
            )}
          </div>

          {/* Items */}
          <div className="border-t pt-4">
            <h3 className="font-bold text-gray-900 mb-3">
              Items ({order.items?.length || 0})
            </h3>
            <div className="space-y-2">
              {order.items?.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-gray-50 p-3 rounded flex justify-between"
                >
                  <div>
                    <p className="font-semibold text-gray-900">
                      {item.productName}
                    </p>
                    <p className="text-sm text-gray-600">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="font-bold text-green-600">
                    PKR {item.price?.toFixed(2) || "0.00"}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Payment */}
          <div className="border-t pt-4 bg-gray-50 p-4 rounded">
            <h3 className="font-bold text-gray-900 mb-3 flex items-center space-x-2">
              <DollarSign className="h-5 w-5" />
              <span>Payment Summary</span>
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>
                  PKR{" "}
                  {(
                    (order.totalAmount || 0) - (order.deliveryFee || 0)
                  ).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee:</span>
                <span>PKR {(order.deliveryFee || 0).toFixed(2)}</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-bold text-base">
                <span>Total:</span>
                <span className="text-green-600">
                  PKR {order.totalAmount?.toFixed(2) || "0.00"}
                </span>
              </div>
            </div>
          </div>

          {/* Assignment Details */}
          {order.assignmentDetails && (
            <div className="border-t pt-4 bg-blue-50 p-4 rounded">
              <h3 className="font-bold text-gray-900 mb-3">
                Assignment Details
              </h3>
              <div className="space-y-1 text-sm">
                {order.assignmentDetails.assignedDriver && (
                  <p>
                    <strong>Driver:</strong>{" "}
                    {order.assignmentDetails.assignedDriver.employeeName}
                  </p>
                )}
                {order.assignmentDetails.vehicleType && (
                  <p>
                    <strong>Vehicle:</strong>{" "}
                    {order.assignmentDetails.vehicleType}
                  </p>
                )}
                {order.assignmentDetails.dispatchOfficer && (
                  <p>
                    <strong>Dispatch Officer:</strong>{" "}
                    {order.assignmentDetails.dispatchOfficer}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Timestamps */}
          <div className="border-t pt-4 text-sm text-gray-600 space-y-1">
            <p>
              <strong>Created:</strong>{" "}
              {new Date(order.createdAt).toLocaleString()}
            </p>
            {order.updatedAt && (
              <p>
                <strong>Updated:</strong>{" "}
                {new Date(order.updatedAt).toLocaleString()}
              </p>
            )}
          </div>
        </div>

        <div className="bg-gray-100 p-4 border-t text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderOverviewDashboard;
