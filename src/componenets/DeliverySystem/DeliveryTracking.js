import React, { useState, useEffect, useRef } from "react";
import {
  Navigation,
  Clock,
  CheckCircle,
  AlertTriangle,
  Search,
  MapPin,
  Phone,
  X,
  Package,
} from "lucide-react";

const API_BASE_URL = "https://e-commchatbot-backend-4.onrender.com";

const DeliveryTracking = () => {
  const [trackingData, setTrackingData] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const updateTimeoutRef = useRef(null);

  const ORDER_STATUSES = [
    "order-confirmed",
    "picking-order",
    "ready-to-pickup",
    "allocated-driver",
    "assigned-dispatch-officer-2",
    "order-picked-up",
    "on-way",
    "driver-confirmed",
    "order-complete",
  ];

  const getStatusIndex = (status) => {
    return ORDER_STATUSES.indexOf(status);
  };

  const searchOrder = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setError("Please enter an Order ID or Phone Number");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_BASE_URL}/api/tracking/order/${encodeURIComponent(searchQuery)}`
      );

      if (!response.ok) {
        throw new Error("Order not found");
      }

      const data = await response.json();
      setTrackingData(data);
    } catch (err) {
      setError(err.message || "Failed to fetch tracking");
      setTrackingData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (trackingData) {
      const interval = setInterval(() => {
        fetchTrackingQuiet();
      }, 10000);

      return () => clearInterval(interval);
    }
  }, [trackingData]);

  const fetchTrackingQuiet = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/tracking/order/${encodeURIComponent(
          trackingData.orderId
        )}`
      );

      if (response.ok) {
        const data = await response.json();
        setTrackingData((prev) => {
          if (JSON.stringify(prev) !== JSON.stringify(data)) {
            return data;
          }
          return prev;
        });
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      "order-confirmed": "bg-green-100 text-green-800",
      "picking-order": "bg-blue-100 text-blue-800",
      "ready-to-pickup": "bg-yellow-100 text-yellow-800",
      "allocated-driver": "bg-purple-100 text-purple-800",
      "assigned-dispatch-officer-2": "bg-indigo-100 text-indigo-800",
      "order-picked-up": "bg-teal-100 text-teal-800",
      "on-way": "bg-orange-100 text-orange-800",
      "driver-confirmed": "bg-cyan-100 text-cyan-800",
      "order-complete": "bg-green-100 text-green-800",
    };

    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const formatStatusLabel = (status) => {
    const labels = {
      "order-confirmed": "Order Confirmed",
      "picking-order": "Picking Order",
      "ready-to-pickup": "Ready for Pickup",
      "allocated-driver": "Driver Allocated",
      "assigned-dispatch-officer-2": "Vehicle Assigned",
      "order-picked-up": "Picked Up",
      "on-way": "On The Way",
      "driver-confirmed": "Arriving Soon",
      "order-complete": "Delivered",
    };
    return labels[status] || status.replace(/-/g, " ");
  };

  const currentStatusIndex = trackingData
    ? getStatusIndex(trackingData.status)
    : -1;

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Track Your Order
        </h2>
        <form
          onSubmit={searchOrder}
          className="flex flex-col md:flex-row gap-3"
        >
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Enter Order ID or Phone Number"
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center space-x-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition disabled:bg-gray-400 font-semibold"
          >
            <Search className="h-5 w-5" />
            <span>Track</span>
          </button>
        </form>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
            <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-red-800">{error}</p>
          </div>
        )}
      </div>

      {/* Timeline */}
      {trackingData && (
        <div className="space-y-6">
          {/* Order Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Info */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-bold text-gray-900 mb-4">
                Order Information
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-600">Order ID</p>
                  <p className="font-bold text-gray-900">
                    {trackingData.orderId}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Order Date</p>
                  <p className="text-sm text-gray-900">
                    {new Date(trackingData.createdAt).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Amount</p>
                  <p className="text-lg font-bold text-green-600">
                    PKR {trackingData.totalAmount?.toFixed(2) || "0.00"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Current Status</p>
                  <span
                    className={`inline-block mt-1 px-3 py-1 text-sm font-semibold rounded ${getStatusColor(
                      trackingData.status
                    )}`}
                  >
                    {formatStatusLabel(trackingData.status)}
                  </span>
                </div>
              </div>
            </div>

            {/* Delivery */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-bold text-gray-900 mb-4">
                Delivery Information
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-600">Recipient</p>
                  <p className="font-bold text-gray-900">
                    {trackingData.customerName}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Phone</p>
                  <a
                    href={`tel:${trackingData.customerPhone}`}
                    className="text-blue-600 hover:underline flex items-center space-x-1"
                  >
                    <Phone className="h-4 w-4" />
                    <span>{trackingData.customerPhone}</span>
                  </a>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Address</p>
                  <p className="text-sm text-gray-900 line-clamp-2">
                    {trackingData.deliveryAddress}
                  </p>
                </div>
                {trackingData.assignedDriver && (
                  <div>
                    <p className="text-xs text-gray-600">Assigned Driver</p>
                    <p className="text-sm font-semibold text-gray-900 flex items-center space-x-1">
                      <Package className="h-4 w-4" />
                      <span>{trackingData.assignedDriver.employeeName}</span>
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="font-bold text-gray-900 mb-6">Delivery Timeline</h3>

            <div className="space-y-6">
              {ORDER_STATUSES.map((status, index) => {
                const isCompleted = currentStatusIndex >= index;
                const isCurrent = currentStatusIndex === index;

                return (
                  <div key={status} className="flex gap-4">
                    {/* Dot */}
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                          isCompleted
                            ? "bg-green-500 text-white"
                            : "bg-gray-200 text-gray-600"
                        } ${isCurrent ? "ring-4 ring-green-300" : ""}`}
                      >
                        {isCompleted ? (
                          <CheckCircle className="h-5 w-5" />
                        ) : (
                          <Clock className="h-5 w-5" />
                        )}
                      </div>
                      {index < ORDER_STATUSES.length - 1 && (
                        <div
                          className={`w-1 h-12 ${
                            isCompleted ? "bg-green-500" : "bg-gray-200"
                          }`}
                        />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 pt-1">
                      <h4
                        className={`font-semibold ${
                          isCompleted ? "text-green-600" : "text-gray-600"
                        }`}
                      >
                        {formatStatusLabel(status)}
                      </h4>

                      {isCompleted && trackingData.statusUpdates?.[status] && (
                        <p className="text-xs text-gray-600 mt-1">
                          {new Date(
                            trackingData.statusUpdates[status]
                          ).toLocaleString()}
                        </p>
                      )}

                      {isCurrent && (
                        <div className="mt-2 inline-flex items-center space-x-1 px-2 py-1 bg-green-50 rounded">
                          <Clock className="h-3 w-3 text-green-600 animate-spin" />
                          <span className="text-xs text-green-700 font-semibold">
                            In Progress
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Items */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="font-bold text-gray-900 mb-4">
              Items ({trackingData.items?.length || 0})
            </h3>

            <div className="space-y-2">
              {trackingData.items?.map((item, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded"
                >
                  <div>
                    <p className="font-semibold text-gray-900">
                      {item.productName}
                    </p>
                    <p className="text-xs text-gray-600">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="font-semibold text-green-600">
                    PKR {item.price?.toFixed(2) || "0.00"}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Support */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-700 mb-3">
              Need help with your order?
            </p>
            <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
              Contact Support
            </button>
          </div>
        </div>
      )}

      {!trackingData && !error && (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <Navigation className="h-16 w-16 mx-auto text-gray-300 mb-4" />
          <p className="text-lg text-gray-600">
            Enter your Order ID or Phone Number to track your delivery
          </p>
        </div>
      )}
    </div>
  );
};

export default DeliveryTracking;
