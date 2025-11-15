import React, { useState, useEffect, useRef } from "react";
import {
  Clock,
  CheckCircle,
  AlertTriangle,
  Package,
  X,
  Play,
  Eye,
} from "lucide-react";

const API_BASE_URL = "https://e-commchatbot-backend-4.onrender.com";

const PackingStaffDashboard = () => {
  const [packingQueue, setPackingQueue] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ pending: 0, packing: 0, completed: 0 });
  const [packingNotes, setPackingNotes] = useState("");
  const [complaintData, setComplaintData] = useState({
    itemIndex: null,
    complaintType: "",
    details: "",
  });
  const [showComplaintForm, setShowComplaintForm] = useState(false);
  const [employeeInfo, setEmployeeInfo] = useState(null);
  const updateTimeoutRef = useRef(null);

  const EMPLOYEE_ID = localStorage.getItem("packingStaffId") || "PACKING_001";

  useEffect(() => {
    fetchEmployeeInfo();
    fetchPackingQueue();
    fetchStats();

    const interval = setInterval(() => {
      fetchPackingQueueQuiet();
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
      console.error("Error fetching employee info:", error);
    }
  };

  const fetchPackingQueue = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/packing/queue`);
      const data = await response.json();
      setPackingQueue(data || []);
    } catch (error) {
      console.error("Error fetching packing queue:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPackingQueueQuiet = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/packing/queue`);
      const data = await response.json();
      setPackingQueue((prev) => {
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
      const response = await fetch(`${API_BASE_URL}/api/packing/stats`);
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const fetchStatsQuiet = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/packing/stats`);
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchOrderDetails = async (orderId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/packing/order/${orderId}`
      );
      const data = await response.json();
      setOrderDetails(data);
      setSelectedOrder(orderId);
    } catch (error) {
      console.error("Error fetching order details:", error);
    }
  };

  const fetchOrderDetailsQuiet = async (orderId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/packing/order/${orderId}`
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

  const startPacking = async (orderId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/packing/start/${orderId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            employeeId: EMPLOYEE_ID,
            employeeName: employeeInfo?.name || "Packing Staff",
          }),
        }
      );

      if (response.ok) {
        alert("Packing started!");
        fetchPackingQueue();
        fetchOrderDetails(orderId);
        fetchStats();
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to start packing");
    }
  };

  const markItemPacked = async (itemIndex) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/packing/item/${selectedOrder}/${itemIndex}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            employeeId: EMPLOYEE_ID,
            employeeName: employeeInfo?.name || "Packing Staff",
          }),
        }
      );

      if (response.ok) {
        const result = await response.json();
        alert(
          `Item packed! Progress: ${result.packedItems}/${result.totalItems}`
        );
        fetchOrderDetails(selectedOrder);
        fetchPackingQueue();
        fetchStats();
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to mark item");
    }
  };

  const completePacking = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/packing/complete/${selectedOrder}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            employeeId: EMPLOYEE_ID,
            employeeName: employeeInfo?.name || "Packing Staff",
            packingNotes: packingNotes,
          }),
        }
      );

      if (response.ok) {
        alert("Packing completed!");
        setSelectedOrder(null);
        setOrderDetails(null);
        setPackingNotes("");
        fetchPackingQueue();
        fetchStats();
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to complete packing");
    }
  };

  const registerComplaint = async () => {
    if (!complaintData.complaintType) {
      alert("Select complaint type");
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/packing/complaint/${selectedOrder}/${complaintData.itemIndex}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            complaintType: complaintData.complaintType,
            details: complaintData.details,
            reportedBy: employeeInfo?.name || "Packing Staff",
            reportedAt: new Date(),
          }),
        }
      );

      if (response.ok) {
        alert("Complaint registered!");
        setShowComplaintForm(false);
        setComplaintData({ itemIndex: null, complaintType: "", details: "" });
        fetchOrderDetails(selectedOrder);
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
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <p className="text-sm">
            <strong>Packing Staff:</strong> {employeeInfo.name}
          </p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-yellow-600 rounded-lg p-4 text-white">
          <p className="text-sm opacity-90">Pending</p>
          <p className="text-3xl font-bold mt-1">{stats.pending}</p>
        </div>
        <div className="bg-blue-600 rounded-lg p-4 text-white">
          <p className="text-sm opacity-90">Packing</p>
          <p className="text-3xl font-bold mt-1">{stats.packing}</p>
        </div>
        <div className="bg-green-600 rounded-lg p-4 text-white">
          <p className="text-sm opacity-90">Completed</p>
          <p className="text-3xl font-bold mt-1">{stats.completed}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Queue */}
        <div className="bg-white rounded-lg shadow">
          <div className="bg-gray-800 text-white p-4 flex items-center space-x-2 rounded-t-lg">
            <Package className="h-5 w-5" />
            <h3 className="font-bold">Packing Queue</h3>
          </div>

          {loading ? (
            <div className="p-8 text-center text-gray-500">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : packingQueue.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p>No orders to pack</p>
            </div>
          ) : (
            <div className="divide-y max-h-96 overflow-y-auto">
              {packingQueue.map((order) => (
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
                      order.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Details & Actions */}
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

              {/* Customer & Delivery Info */}
              <div className="border-t pt-4 bg-gray-50 p-3 rounded">
                <p className="text-sm">
                  <strong>Phone:</strong> {orderDetails.customerPhone}
                </p>
                <p className="text-sm">
                  <strong>Address:</strong> {orderDetails.deliveryAddress}
                </p>
              </div>

              {/* Items */}
              <div className="border-t pt-4">
                <h4 className="font-bold text-gray-900 mb-3">Items to Pack</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {orderDetails.items?.map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-gray-50 p-3 rounded flex justify-between items-start"
                    >
                      <div>
                        <p className="font-semibold text-gray-900">
                          {item.productName}
                        </p>
                        <p className="text-sm text-gray-600">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <div className="space-x-2 flex">
                        {item.packed ? (
                          <span className="inline-flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                            <CheckCircle className="h-4 w-4" />
                            <span>Packed</span>
                          </span>
                        ) : (
                          <>
                            <button
                              onClick={() => markItemPacked(idx)}
                              className="px-2 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                            >
                              Pack
                            </button>
                            <button
                              onClick={() => {
                                setComplaintData({
                                  itemIndex: idx,
                                  complaintType: "",
                                  details: "",
                                });
                                setShowComplaintForm(true);
                              }}
                              className="px-2 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                            >
                              Issue
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Packing Notes */}
              <div className="border-t pt-4">
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Packing Notes
                </label>
                <textarea
                  value={packingNotes}
                  onChange={(e) => setPackingNotes(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="2"
                  placeholder="Special instructions or notes..."
                />
              </div>

              {/* Actions */}
              <div className="border-t pt-4 flex space-x-3">
                <button
                  onClick={() => startPacking(selectedOrder)}
                  className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                >
                  <Play className="h-4 w-4" />
                  <span>Start Packing</span>
                </button>
                <button
                  onClick={completePacking}
                  className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  <CheckCircle className="h-4 w-4" />
                  <span>Complete Packing</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
              <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Select an order to begin packing</p>
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
                Complaint Type
              </label>
              <select
                value={complaintData.complaintType}
                onChange={(e) =>
                  setComplaintData({
                    ...complaintData,
                    complaintType: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Type</option>
                <option value="damaged">Damaged Item</option>
                <option value="missing">Missing Item</option>
                <option value="wrong_item">Wrong Item</option>
                <option value="quantity_mismatch">Quantity Mismatch</option>
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

export default PackingStaffDashboard;
