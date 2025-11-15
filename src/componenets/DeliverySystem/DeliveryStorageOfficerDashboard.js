import React, { useState, useEffect, useRef } from "react";
import {
  Building,
  CheckCircle,
  AlertTriangle,
  X,
  Archive,
  Eye,
} from "lucide-react";

const API_BASE_URL = "https://e-commchatbot-backend-4.onrender.com";

const DeliveryStorageOfficerDashboard = () => {
  const [storageOrders, setStorageOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    inStorage: 0,
    readyToPickup: 0,
    retrieved: 0,
  });
  const [storageLocation, setStorageLocation] = useState("");
  const [employeeInfo, setEmployeeInfo] = useState(null);
  const [complaintData, setComplaintData] = useState({ type: "", details: "" });
  const [showComplaintForm, setShowComplaintForm] = useState(false);
  const updateTimeoutRef = useRef(null);

  const EMPLOYEE_ID = localStorage.getItem("storageOfficerId") || "STORAGE_001";

  useEffect(() => {
    fetchEmployeeInfo();
    fetchStorageOrders();
    fetchStats();

    const interval = setInterval(() => {
      fetchStorageOrdersQuiet();
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

  const fetchEmployeeInfo = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/employees/${EMPLOYEE_ID}`
      );
      if (response.ok) {
        const data = await response.json();
        setEmployeeInfo(data);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchStorageOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/storage/orders`);
      const data = await response.json();
      setStorageOrders(data || []);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStorageOrdersQuiet = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/storage/orders`);
      const data = await response.json();
      setStorageOrders((prev) => {
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
      const response = await fetch(`${API_BASE_URL}/api/storage/stats`);
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchStatsQuiet = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/storage/stats`);
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchOrderDetails = async (orderId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/storage/order/${orderId}`
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
        `${API_BASE_URL}/api/storage/order/${orderId}`
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

  const storeOrder = async () => {
    if (!storageLocation.trim()) {
      alert("Enter storage location");
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/storage/store/${selectedOrder}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            employeeId: EMPLOYEE_ID,
            employeeName: employeeInfo?.name || "Storage Officer",
            storageLocation: storageLocation,
            verificationDetails: {
              allItemsVerified: true,
              packedCorrectly: true,
              storageOfficer: employeeInfo?.name,
              timestamp: new Date(),
            },
          }),
        }
      );

      if (response.ok) {
        alert(`Order stored at ${storageLocation}`);
        setStorageLocation("");
        fetchStorageOrders();
        fetchOrderDetails(selectedOrder);
        fetchStats();
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to store order");
    }
  };

  const markReadyToPickup = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/storage/ready/${selectedOrder}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            employeeId: EMPLOYEE_ID,
            employeeName: employeeInfo?.name || "Storage Officer",
            verificationDetails: {
              qualityChecked: true,
              quantityVerified: true,
              readyForPickup: true,
              verifiedBy: employeeInfo?.name,
              timestamp: new Date(),
            },
          }),
        }
      );

      if (response.ok) {
        alert("Order marked as ready for pickup!");
        fetchStorageOrders();
        fetchOrderDetails(selectedOrder);
        fetchStats();
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to mark as ready");
    }
  };

  const retrieveOrder = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/storage/retrieve/${selectedOrder}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            employeeId: EMPLOYEE_ID,
            employeeName: employeeInfo?.name || "Storage Officer",
          }),
        }
      );

      if (response.ok) {
        alert("Order retrieved for dispatch!");
        setSelectedOrder(null);
        setOrderDetails(null);
        fetchStorageOrders();
        fetchStats();
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to retrieve order");
    }
  };

  const registerComplaint = async () => {
    if (!complaintData.type) {
      alert("Select complaint type");
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/storage/complaint/${selectedOrder}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            complaintType: complaintData.type,
            details: complaintData.details,
            reportedBy: employeeInfo?.name || "Storage Officer",
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

  return (
    <div className="space-y-6">
      {/* Employee Info */}
      {employeeInfo && (
        <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
          <p className="text-sm">
            <strong>Storage Officer:</strong> {employeeInfo.name}
          </p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-blue-600 rounded-lg p-4 text-white">
          <p className="text-sm opacity-90">In Storage</p>
          <p className="text-3xl font-bold mt-1">{stats.inStorage}</p>
        </div>
        <div className="bg-yellow-600 rounded-lg p-4 text-white">
          <p className="text-sm opacity-90">Ready to Pickup</p>
          <p className="text-3xl font-bold mt-1">{stats.readyToPickup}</p>
        </div>
        <div className="bg-green-600 rounded-lg p-4 text-white">
          <p className="text-sm opacity-90">Retrieved</p>
          <p className="text-3xl font-bold mt-1">{stats.retrieved}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Queue */}
        <div className="bg-white rounded-lg shadow">
          <div className="bg-gray-800 text-white p-4 flex items-center space-x-2 rounded-t-lg">
            <Building className="h-5 w-5" />
            <h3 className="font-bold">Storage Queue</h3>
          </div>

          {loading ? (
            <div className="p-8 text-center text-gray-500">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : storageOrders.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p>No orders in storage</p>
            </div>
          ) : (
            <div className="divide-y max-h-96 overflow-y-auto">
              {storageOrders.map((order) => (
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
                  <p className="text-xs text-gray-600 mt-1">
                    Items: {order.items?.length || 0}
                  </p>
                  <span
                    className={`inline-block mt-2 px-2 py-1 text-xs font-semibold rounded ${
                      order.status === "ready-to-pickup"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
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

              {/* Status */}
              <div className="bg-blue-50 p-3 rounded">
                <p className="text-sm text-gray-600">Current Status</p>
                <p className="text-lg font-bold text-blue-600">
                  {orderDetails.status?.replace(/-/g, " ").toUpperCase()}
                </p>
              </div>

              {/* Customer Info */}
              <div className="border-t pt-4 bg-gray-50 p-3 rounded">
                <p className="text-sm">
                  <strong>Name:</strong> {orderDetails.customerName}
                </p>
                <p className="text-sm">
                  <strong>Phone:</strong> {orderDetails.customerPhone}
                </p>
                <p className="text-sm">
                  <strong>Address:</strong> {orderDetails.deliveryAddress}
                </p>
              </div>

              {/* Items */}
              <div className="border-t pt-4">
                <h4 className="font-bold text-gray-900 mb-3">Items</h4>
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

              {/* Storage Location */}
              {orderDetails.status !== "ready-to-pickup" && (
                <div className="border-t pt-4">
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Storage Location
                  </label>
                  <input
                    type="text"
                    value={storageLocation}
                    onChange={(e) => setStorageLocation(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Rack A-12, Shelf B-5"
                  />
                </div>
              )}

              {/* Actions */}
              <div className="border-t pt-4 flex flex-col space-y-2">
                {orderDetails.status !== "ready-to-pickup" ? (
                  <>
                    <button
                      onClick={storeOrder}
                      className="flex items-center justify-center space-x-2 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                    >
                      <Archive className="h-4 w-4" />
                      <span>Store Order</span>
                    </button>
                    <button
                      onClick={markReadyToPickup}
                      className="flex items-center justify-center space-x-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      <CheckCircle className="h-4 w-4" />
                      <span>Mark Ready for Pickup</span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={retrieveOrder}
                    className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    <Eye className="h-4 w-4" />
                    <span>Retrieve for Dispatch</span>
                  </button>
                )}
                <button
                  onClick={() => setShowComplaintForm(true)}
                  className="flex items-center justify-center space-x-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  <AlertTriangle className="h-4 w-4" />
                  <span>Register Complaint</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
              <Building className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Select an order from storage queue</p>
            </div>
          )}
        </div>
      </div>

      {/* Complaint Form */}
      {showComplaintForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-lg font-bold text-gray-900">
              Register Complaint
            </h3>

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
                <option value="damaged">Damaged Packaging</option>
                <option value="storage_issue">Storage Issue</option>
                <option value="item_missing">Item Missing</option>
                <option value="quantity_error">Quantity Error</option>
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
                Register
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

export default DeliveryStorageOfficerDashboard;
