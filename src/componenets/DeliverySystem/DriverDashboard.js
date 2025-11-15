import React, { useState, useEffect, useRef } from "react";
import {
  Truck,
  CheckCircle,
  AlertTriangle,
  X,
  Phone,
  MapPin,
  Eye,
} from "lucide-react";

const API_BASE_URL = "https://e-commchatbot-backend-4.onrender.com";

const DriverDashboard = () => {
  const [assignedOrders, setAssignedOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    assigned: 0,
    accepted: 0,
    completed: 0,
    failed: 0,
  });
  const [driverInfo, setDriverInfo] = useState(null);
  const updateTimeoutRef = useRef(null);

  const DRIVER_ID = localStorage.getItem("driverId") || "DRIVER_001";

  useEffect(() => {
    fetchDriverInfo();
    fetchAssignedOrders();
    fetchStats();

    const interval = setInterval(() => {
      fetchAssignedOrdersQuiet();
      fetchStatsQuiet();
      if (selectedOrder) {
        fetchOrderDetailsQuiet(selectedOrder);
      }
    }, 5000);

    return () => {
      clearInterval(interval);
      if (updateTimeoutRef.current) clearTimeout(updateTimeoutRef.current);
    };
  }, [selectedOrder]);

  const fetchDriverInfo = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/employees/${DRIVER_ID}`
      );
      if (response.ok) {
        const data = await response.json();
        setDriverInfo(data);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchAssignedOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${API_BASE_URL}/api/driver/assigned-orders/${DRIVER_ID}`
      );
      const data = await response.json();
      setAssignedOrders(data || []);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAssignedOrdersQuiet = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/driver/assigned-orders/${DRIVER_ID}`
      );
      const data = await response.json();
      setAssignedOrders((prev) => {
        if (JSON.stringify(prev) !== JSON.stringify(data)) {
          return data || [];
        }
        return prev;
      });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/driver/stats/${DRIVER_ID}`
      );
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchStatsQuiet = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/driver/stats/${DRIVER_ID}`
      );
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchOrderDetails = async (orderId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/driver/order/${orderId}`
      );
      const data = await response.json();
      setOrderDetails(data);
      setSelectedOrder(orderId);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchOrderDetailsQuiet = async (orderId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/driver/order/${orderId}`
      );
      const data = await response.json();
      setOrderDetails((prev) => {
        if (JSON.stringify(prev) !== JSON.stringify(data)) {
          return data;
        }
        return prev;
      });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const acceptOrder = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/driver/accept-order/${selectedOrder}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            driverId: DRIVER_ID,
            driverName: driverInfo?.name || "Driver",
            acceptanceDetails: {
              acceptedAt: new Date(),
              driverVerification: true,
              readyForDelivery: true,
            },
          }),
        }
      );

      if (response.ok) {
        alert("Order accepted! Ready for delivery");
        setSelectedOrder(null);
        setOrderDetails(null);
        fetchAssignedOrders();
        fetchStats();
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to accept order");
    }
  };

  const rejectOrder = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/driver/reject-order/${selectedOrder}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            driverId: DRIVER_ID,
            reason: "Unable to accept at this time",
            rejectionDetails: {
              rejectedAt: new Date(),
              driverName: driverInfo?.name || "Driver",
            },
          }),
        }
      );

      if (response.ok) {
        alert("Order rejected and reassigned");
        setSelectedOrder(null);
        setOrderDetails(null);
        fetchAssignedOrders();
        fetchStats();
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to reject order");
    }
  };

  return (
    <div className="space-y-6">
      {/* Driver Info */}
      {driverInfo && (
        <div className="bg-red-50 rounded-lg p-4 border border-red-200 space-y-2">
          <p className="text-sm">
            <strong>Driver:</strong> {driverInfo.name}
          </p>
          <p className="text-sm">
            <strong>License:</strong> {driverInfo.licenseNumber || "N/A"}
          </p>
          <p className="text-sm">
            <strong>Rating:</strong>{" "}
            {driverInfo.performanceMetrics?.rating || "5.0"} ⭐
          </p>
          {driverInfo.assignedVehicle && (
            <p className="text-sm">
              <strong>Vehicle:</strong>{" "}
              {driverInfo.assignedVehicle.vehicleType?.toUpperCase()} -{" "}
              {driverInfo.assignedVehicle.registrationNumber}
            </p>
          )}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-600 rounded-lg p-4 text-white">
          <p className="text-sm opacity-90">Assigned</p>
          <p className="text-3xl font-bold mt-1">{stats.assigned}</p>
        </div>
        <div className="bg-green-600 rounded-lg p-4 text-white">
          <p className="text-sm opacity-90">Accepted</p>
          <p className="text-3xl font-bold mt-1">{stats.accepted}</p>
        </div>
        <div className="bg-emerald-600 rounded-lg p-4 text-white">
          <p className="text-sm opacity-90">Completed</p>
          <p className="text-3xl font-bold mt-1">{stats.completed}</p>
        </div>
        <div className="bg-red-600 rounded-lg p-4 text-white">
          <p className="text-sm opacity-90">Failed</p>
          <p className="text-3xl font-bold mt-1">{stats.failed}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Queue */}
        <div className="bg-white rounded-lg shadow">
          <div className="bg-gray-800 text-white p-4 flex items-center space-x-2 rounded-t-lg">
            <Truck className="h-5 w-5" />
            <h3 className="font-bold">My Deliveries</h3>
          </div>

          {loading ? (
            <div className="p-8 text-center text-gray-500">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : assignedOrders.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p>No deliveries assigned</p>
            </div>
          ) : (
            <div className="divide-y max-h-96 overflow-y-auto">
              {assignedOrders.map((order) => (
                <div
                  key={order._id}
                  onClick={() => fetchOrderDetails(order.orderId)}
                  className={`p-4 cursor-pointer hover:bg-gray-50 transition ${
                    selectedOrder === order.orderId
                      ? "bg-blue-50 border-l-4 border-blue-500"
                      : ""
                  }`}
                >
                  <p className="font-semibold text-gray-900 text-sm">
                    {order.orderId}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    {order.customerName}
                  </p>
                  <p className="text-xs text-gray-600 line-clamp-1">
                    {order.deliveryAddress}
                  </p>
                  <span
                    className={`inline-block mt-2 px-2 py-1 text-xs font-semibold rounded ${
                      order.status === "order-picked-up"
                        ? "bg-yellow-100 text-yellow-800"
                        : order.status === "on-way"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-purple-100 text-purple-800"
                    }`}
                  >
                    {order.status?.replace(/-/g, " ")}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="lg:col-span-2">
          {selectedOrder && orderDetails ? (
            <div className="bg-white rounded-lg shadow p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {orderDetails.orderId}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {orderDetails.customerName}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Customer Info */}
              <div className="bg-gray-50 p-4 rounded">
                <h4 className="font-bold text-gray-900 mb-3">
                  Customer Information
                </h4>
                <div className="space-y-2 text-sm">
                  <p className="flex items-center space-x-2">
                    <Phone className="h-4 w-4" />
                    <a
                      href={`tel:${orderDetails.customerPhone}`}
                      className="text-blue-600 hover:underline"
                    >
                      {orderDetails.customerPhone}
                    </a>
                  </p>
                  <p className="flex items-start space-x-2">
                    <MapPin className="h-4 w-4 mt-0.5" />
                    <span>{orderDetails.deliveryAddress}</span>
                  </p>
                  {orderDetails.deliveryInstructions && (
                    <p className="text-xs bg-yellow-50 p-2 rounded">
                      📝 {orderDetails.deliveryInstructions}
                    </p>
                  )}
                </div>
              </div>

              {/* Route Info */}
              {orderDetails.routeDetails && (
                <div className="bg-blue-50 p-3 rounded">
                  <h4 className="font-bold text-gray-900 mb-2">
                    Route Details
                  </h4>
                  <p className="text-sm text-gray-700">
                    {orderDetails.routeDetails}
                  </p>
                </div>
              )}

              {/* Items */}
              <div className="border-t pt-4">
                <h4 className="font-bold text-gray-900 mb-3">
                  Items to Deliver
                </h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {orderDetails.items?.map((item, idx) => (
                    <div key={idx} className="bg-gray-50 p-3 rounded">
                      <p className="font-semibold text-gray-900 text-sm">
                        {item.productName}
                      </p>
                      <p className="text-xs text-gray-600">
                        Qty: {item.quantity}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment */}
              <div className="bg-green-50 p-4 rounded">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-900">
                    Total Amount:
                  </span>
                  <span className="text-xl font-bold text-green-600">
                    PKR {orderDetails.totalAmount?.toFixed(2) || "0.00"}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="border-t pt-4 flex flex-col space-y-2">
                <button
                  onClick={acceptOrder}
                  className="flex items-center justify-center space-x-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 font-semibold"
                >
                  <CheckCircle className="h-4 w-4" />
                  <span>Accept Delivery</span>
                </button>
                <button
                  onClick={rejectOrder}
                  className="flex items-center justify-center space-x-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 font-semibold"
                >
                  <AlertTriangle className="h-4 w-4" />
                  <span>Reject Delivery</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
              <Truck className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Select a delivery to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DriverDashboard;
