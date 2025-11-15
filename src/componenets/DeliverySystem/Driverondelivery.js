import React, { useState, useEffect, useRef } from "react";
import {
  Navigation,
  CheckCircle,
  AlertTriangle,
  MapPin,
  Phone,
  X,
  Camera,
  Clock,
} from "lucide-react";

const API_BASE_URL = "https://e-commchatbot-backend-4.onrender.com";

const DriverOnDeliveryDashboard = () => {
  const [activeDeliveries, setActiveDeliveries] = useState([]);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [deliveryDetails, setDeliveryDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    onWay: 0,
    nearby: 0,
    delivered: 0,
    failed: 0,
  });
  const [driverLocation, setDriverLocation] = useState(null);
  const [customerOTP, setCustomerOTP] = useState("");
  const [proofOfDelivery, setProofOfDelivery] = useState(null);
  const [deliveryNotes, setDeliveryNotes] = useState("");
  const [showComplaintForm, setShowComplaintForm] = useState(false);
  const [complaintData, setComplaintData] = useState({ type: "", details: "" });
  const updateTimeoutRef = useRef(null);

  const DRIVER_ID = localStorage.getItem("driverId") || "DRIVER_001";

  useEffect(() => {
    watchLocation();
    fetchActiveDeliveries();
    fetchStats();

    const interval = setInterval(() => {
      watchLocation();
      fetchActiveDeliveriesQuiet();
      fetchStatsQuiet();
      if (selectedDelivery) {
        fetchDeliveryDetailsQuiet(selectedDelivery);
      }
    }, 5000);

    return () => {
      clearInterval(interval);
      if (updateTimeoutRef.current) clearTimeout(updateTimeoutRef.current);
    };
  }, [selectedDelivery]);

  const watchLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setDriverLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      });
    }
  };

  const fetchActiveDeliveries = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${API_BASE_URL}/api/driver-delivery/active/${DRIVER_ID}`
      );
      const data = await response.json();
      setActiveDeliveries(data || []);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchActiveDeliveriesQuiet = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/driver-delivery/active/${DRIVER_ID}`
      );
      const data = await response.json();
      setActiveDeliveries((prev) => {
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
        `${API_BASE_URL}/api/driver-delivery/stats/${DRIVER_ID}`
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
        `${API_BASE_URL}/api/driver-delivery/stats/${DRIVER_ID}`
      );
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchDeliveryDetails = async (orderId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/driver-delivery/order/${orderId}`
      );
      const data = await response.json();
      setDeliveryDetails(data);
      setSelectedDelivery(orderId);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchDeliveryDetailsQuiet = async (orderId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/driver-delivery/order/${orderId}`
      );
      const data = await response.json();
      setDeliveryDetails((prev) => {
        if (JSON.stringify(prev) !== JSON.stringify(data)) {
          return data;
        }
        return prev;
      });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const markNearby = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/driver-delivery/nearby/${selectedDelivery}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            driverId: DRIVER_ID,
            location: driverLocation,
            nearbyNotification: {
              sentAt: new Date(),
              customerNotified: true,
            },
          }),
        }
      );

      if (response.ok) {
        alert("Customer notified - You are nearby!");
        fetchActiveDeliveries();
        fetchDeliveryDetails(selectedDelivery);
        fetchStats();
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to update status");
    }
  };

  const markDelivered = async () => {
    if (!customerOTP) {
      alert("Please enter customer OTP");
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/driver-delivery/delivered/${selectedDelivery}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            driverId: DRIVER_ID,
            customerOTP: customerOTP,
            deliveryNotes: deliveryNotes,
            location: driverLocation,
            proofOfDelivery: proofOfDelivery,
            verificationDetails: {
              otpVerified: true,
              photoCapture: !!proofOfDelivery,
              customerVerified: true,
              deliveredAt: new Date(),
            },
          }),
        }
      );

      if (response.ok) {
        alert("Delivery marked as complete!");
        setSelectedDelivery(null);
        setDeliveryDetails(null);
        setCustomerOTP("");
        setDeliveryNotes("");
        setProofOfDelivery(null);
        fetchActiveDeliveries();
        fetchStats();
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to mark delivery");
    }
  };

  const markFailed = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/driver-delivery/failed/${selectedDelivery}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            driverId: DRIVER_ID,
            reason: deliveryNotes || "Customer not available",
            location: driverLocation,
            failureDetails: {
              failedAt: new Date(),
              reason: deliveryNotes,
              needsReschedule: true,
            },
          }),
        }
      );

      if (response.ok) {
        alert("Delivery marked as failed");
        setSelectedDelivery(null);
        setDeliveryDetails(null);
        setDeliveryNotes("");
        fetchActiveDeliveries();
        fetchStats();
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to mark delivery");
    }
  };

  const registerComplaint = async () => {
    if (!complaintData.type) {
      alert("Select complaint type");
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/driver-delivery/complaint/${selectedDelivery}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            complaintType: complaintData.type,
            details: complaintData.details,
            reportedBy: DRIVER_ID,
            timestamp: new Date(),
          }),
        }
      );

      if (response.ok) {
        alert("Complaint registered!");
        setShowComplaintForm(false);
        setComplaintData({ type: "", details: "" });
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to register complaint");
    }
  };

  const handleImageCapture = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProofOfDelivery(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      {/* Location */}
      {driverLocation && (
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <p className="text-sm">
            📍 <strong>Current Location:</strong>{" "}
            {driverLocation.latitude.toFixed(4)},{" "}
            {driverLocation.longitude.toFixed(4)}
          </p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-600 rounded-lg p-4 text-white">
          <p className="text-sm opacity-90">On Way</p>
          <p className="text-3xl font-bold mt-1">{stats.onWay}</p>
        </div>
        <div className="bg-yellow-600 rounded-lg p-4 text-white">
          <p className="text-sm opacity-90">Nearby</p>
          <p className="text-3xl font-bold mt-1">{stats.nearby}</p>
        </div>
        <div className="bg-green-600 rounded-lg p-4 text-white">
          <p className="text-sm opacity-90">Delivered</p>
          <p className="text-3xl font-bold mt-1">{stats.delivered}</p>
        </div>
        <div className="bg-red-600 rounded-lg p-4 text-white">
          <p className="text-sm opacity-90">Failed</p>
          <p className="text-3xl font-bold mt-1">{stats.failed}</p>
        </div>
      </div>

      {/* Main */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* List */}
        <div className="bg-white rounded-lg shadow">
          <div className="bg-gray-800 text-white p-4 flex items-center space-x-2 rounded-t-lg">
            <Navigation className="h-5 w-5" />
            <h3 className="font-bold">Active Deliveries</h3>
          </div>

          {loading ? (
            <div className="p-8 text-center text-gray-500">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : activeDeliveries.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p>No active deliveries</p>
            </div>
          ) : (
            <div className="divide-y max-h-96 overflow-y-auto">
              {activeDeliveries.map((delivery) => (
                <div
                  key={delivery._id}
                  onClick={() => fetchDeliveryDetails(delivery.orderId)}
                  className={`p-4 cursor-pointer hover:bg-gray-50 transition ${
                    selectedDelivery === delivery.orderId
                      ? "bg-blue-50 border-l-4 border-blue-500"
                      : ""
                  }`}
                >
                  <p className="font-semibold text-gray-900 text-sm">
                    {delivery.orderId}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    {delivery.customerName}
                  </p>
                  <p className="text-xs text-gray-600 flex items-center space-x-1 mt-1">
                    <Clock className="h-3 w-3" />
                    <span>
                      {new Date(delivery.createdAt).toLocaleTimeString()}
                    </span>
                  </p>
                  <span className="inline-block mt-2 px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded">
                    {delivery.status?.replace(/-/g, " ")}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="lg:col-span-2">
          {selectedDelivery && deliveryDetails ? (
            <div className="bg-white rounded-lg shadow p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {deliveryDetails.orderId}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {deliveryDetails.customerName}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedDelivery(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Contact */}
              <div className="bg-blue-50 p-4 rounded">
                <h4 className="font-bold text-gray-900 mb-3">
                  Contact & Address
                </h4>
                <div className="space-y-2 text-sm">
                  <p className="flex items-center space-x-2">
                    <Phone className="h-4 w-4" />
                    <a
                      href={`tel:${deliveryDetails.customerPhone}`}
                      className="text-blue-600 hover:underline"
                    >
                      {deliveryDetails.customerPhone}
                    </a>
                  </p>
                  <p className="flex items-start space-x-2">
                    <MapPin className="h-4 w-4 mt-1" />
                    <span>{deliveryDetails.deliveryAddress}</span>
                  </p>
                </div>
              </div>

              {/* Items */}
              <div className="border-t pt-4">
                <h4 className="font-bold text-gray-900 mb-3">Items</h4>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {deliveryDetails.items?.map((item, idx) => (
                    <div key={idx} className="bg-gray-50 p-2 rounded text-sm">
                      <p className="font-semibold text-gray-900">
                        {item.productName}
                      </p>
                      <p className="text-xs text-gray-600">
                        Qty: {item.quantity}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* OTP */}
              {deliveryDetails.status !== "order-complete" && (
                <>
                  <div className="border-t pt-4">
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Customer OTP
                    </label>
                    <input
                      type="text"
                      value={customerOTP}
                      onChange={(e) =>
                        setCustomerOTP(e.target.value.slice(0, 6))
                      }
                      placeholder="Enter OTP"
                      maxLength="6"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-lg font-bold tracking-widest"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Delivery Notes
                    </label>
                    <textarea
                      value={deliveryNotes}
                      onChange={(e) => setDeliveryNotes(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows="2"
                      placeholder="Special notes..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Proof of Delivery
                    </label>
                    <div className="flex items-center space-x-2">
                      <label className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition cursor-pointer">
                        <Camera className="h-4 w-4" />
                        <span>Capture</span>
                        <input
                          type="file"
                          accept="image/*"
                          capture="environment"
                          onChange={handleImageCapture}
                          className="hidden"
                        />
                      </label>
                      {proofOfDelivery && (
                        <span className="text-xs text-green-600">
                          ✓ Captured
                        </span>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* Amount */}
              <div className="bg-green-50 p-4 rounded">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-900">Amount:</span>
                  <span className="text-xl font-bold text-green-600">
                    PKR {deliveryDetails.totalAmount?.toFixed(2) || "0.00"}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="border-t pt-4 flex flex-col space-y-2">
                <button
                  onClick={markNearby}
                  className="flex items-center justify-center space-x-2 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                >
                  <MapPin className="h-4 w-4" />
                  <span>I'm Nearby</span>
                </button>
                <button
                  onClick={markDelivered}
                  disabled={!customerOTP}
                  className="flex items-center justify-center space-x-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  <CheckCircle className="h-4 w-4" />
                  <span>Delivery Complete</span>
                </button>
                <button
                  onClick={markFailed}
                  className="flex items-center justify-center space-x-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  <AlertTriangle className="h-4 w-4" />
                  <span>Mark as Failed</span>
                </button>
                <button
                  onClick={() => setShowComplaintForm(true)}
                  className="flex items-center justify-center space-x-2 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
                >
                  <AlertTriangle className="h-4 w-4" />
                  <span>Report Issue</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
              <Navigation className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Select a delivery to view details</p>
            </div>
          )}
        </div>
      </div>

      {/* Complaint Form */}
      {showComplaintForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-lg font-bold text-gray-900">Report Issue</h3>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Type
              </label>
              <select
                value={complaintData.type}
                onChange={(e) =>
                  setComplaintData({ ...complaintData, type: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Type</option>
                <option value="customer_issue">Customer Issue</option>
                <option value="navigation_issue">Navigation Issue</option>
                <option value="address_issue">Address Issue</option>
                <option value="vehicle_issue">Vehicle Issue</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Details
              </label>
              <textarea
                value={complaintData.details}
                onChange={(e) =>
                  setComplaintData({
                    ...complaintData,
                    details: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="Describe the issue..."
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={registerComplaint}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Report
              </button>
              <button
                onClick={() => setShowComplaintForm(false)}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DriverOnDeliveryDashboard;
