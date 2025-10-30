import React, { useState, useEffect } from "react";
import {
  Clock,
  CheckCircle,
  Play,
  X,
  AlertTriangle,
  Package,
} from "lucide-react";

const API_BASE_URL = "https://e-commchatbot-backend-4.onrender.com";

const PackingStaffDashboard = () => {
  const [packingQueue, setPackingQueue] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ pending: 0, packing: 0, completed: 0 });
  const [showComplaintModal, setShowComplaintModal] = useState(false);
  const [complaintData, setComplaintData] = useState({
    itemIndex: null,
    complaintType: "",
    complaintDetails: "",
  });
  const [packingNotes, setPackingNotes] = useState("");

  useEffect(() => {
    fetchPackingQueue();
    fetchStats();

    // Real-time updates every 5 seconds
    const interval = setInterval(() => {
      fetchPackingQueue();
      fetchStats();
      if (selectedOrder) {
        fetchOrderDetails(selectedOrder);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [selectedOrder]);

  const fetchPackingQueue = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/packing/queue`);
      const data = await response.json();
      setPackingQueue(data);
    } catch (error) {
      console.error("Error fetching packing queue:", error);
    } finally {
      setLoading(false);
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

  const startPacking = async (orderId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/packing/start/${orderId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            employeeId: "PACKING_001",
            employeeName: "Packing Staff",
          }),
        }
      );

      if (response.ok) {
        const result = await response.json();
        alert(`Packing started for order ${orderId}`);

        // Refresh data immediately
        fetchPackingQueue();
        fetchOrderDetails(orderId);
        fetchStats();
      } else {
        const error = await response.json();
        alert(`Failed to start packing: ${error.error}`);
      }
    } catch (error) {
      console.error("Error starting packing:", error);
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
            employeeId: "PACKING_001",
            employeeName: "Packing Staff",
          }),
        }
      );

      if (response.ok) {
        const result = await response.json();

        // Show progress notification
        alert(
          `Item packed! Progress: ${result.packedItems}/${result.totalItems} items`
        );

        // Refresh data immediately
        fetchOrderDetails(selectedOrder);
        fetchPackingQueue();
        fetchStats();
      } else {
        const error = await response.json();
        alert(`Failed to mark item as packed: ${error.error}`);
      }
    } catch (error) {
      console.error("Error marking item as packed:", error);
      alert("Failed to mark item as packed");
    }
  };

  const addComplaint = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/packing/complaint/${selectedOrder}/${complaintData.itemIndex}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            complaintType: complaintData.complaintType,
            complaintDetails: complaintData.complaintDetails,
            employeeId: "PACKING_001",
            employeeName: "Packing Staff",
          }),
        }
      );

      if (response.ok) {
        const result = await response.json();

        setShowComplaintModal(false);
        setComplaintData({
          itemIndex: null,
          complaintType: "",
          complaintDetails: "",
        });

        // Show success notification
        alert(`Complaint added successfully: ${result.complaintId}`);

        // Refresh data immediately
        fetchOrderDetails(selectedOrder);
        fetchPackingQueue();
      } else {
        const error = await response.json();
        alert(`Failed to add complaint: ${error.error}`);
      }
    } catch (error) {
      console.error("Error adding complaint:", error);
      alert("Failed to add complaint");
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
            packingNotes: packingNotes,
            employeeId: "PACKING_001",
            employeeName: "Packing Staff",
          }),
        }
      );

      if (response.ok) {
        const result = await response.json();

        // Show success notification
        alert(
          `Order ${selectedOrder} packing completed! Status: ${result.newStatus}`
        );

        // Reset state
        setSelectedOrder(null);
        setOrderDetails(null);
        setPackingNotes("");

        // Refresh data immediately
        fetchPackingQueue();
        fetchStats();
      } else {
        const error = await response.json();
        alert(`Failed to complete packing: ${error.error}`);
      }
    } catch (error) {
      console.error("Error completing packing:", error);
      alert("Failed to complete packing");
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-500 text-white";
      case "medium":
        return "bg-gray-800 text-white";
      case "low":
        return "bg-gray-500 text-white";
      default:
        return "bg-gray-300 text-gray-700";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "picking-order":
        return "bg-blue-100 text-blue-800";
      case "allocated-driver":
        return "bg-green-100 text-green-800";
      case "order-confirmed":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getItemStatusColor = (packingStatus) => {
    switch (packingStatus) {
      case "packed":
        return "bg-green-100 text-green-800";
      case "unavailable":
        return "bg-red-100 text-red-800";
      case "packing":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-orange-100 text-orange-800";
    }
  };

  const ComplaintModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Add Item Complaint</h3>
          <button onClick={() => setShowComplaintModal(false)}>
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
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
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">Select complaint type</option>
              <option value="not_available">Item not available</option>
              <option value="damaged">Item damaged</option>
              <option value="expired">Item expired</option>
              <option value="insufficient_stock">Insufficient stock</option>
              <option value="quality_issue">Quality issue</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Details
            </label>
            <textarea
              value={complaintData.complaintDetails}
              onChange={(e) =>
                setComplaintData({
                  ...complaintData,
                  complaintDetails: e.target.value,
                })
              }
              className="w-full p-2 border border-gray-300 rounded-md"
              rows="3"
              placeholder="Enter complaint details..."
            />
          </div>

          <div className="flex space-x-3">
            <button
              onClick={() => setShowComplaintModal(false)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={addComplaint}
              disabled={
                !complaintData.complaintType || !complaintData.complaintDetails
              }
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
            >
              Add Complaint
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Packing Dashboard
          </h2>
          <p className="text-gray-600">Manage order packing and preparation</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="h-4 w-4 mr-1" />
            {stats.pending} pending orders
          </div>
          <div className="flex items-center space-x-2 text-sm text-green-600">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Live Updates</span>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
        <div className="flex items-center">
          <Clock className="h-5 w-5 text-blue-600 mr-2" />
          <span className="text-sm text-blue-800">
            Orders should be packed 2-3 hours before scheduled delivery time to
            ensure freshness.
          </span>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Packing Queue</h3>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading packing queue...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-6 gap-4 px-6 py-3 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
              <div>Order</div>
              <div>Priority</div>
              <div>Pack By</div>
              <div>Delivery Time</div>
              <div>Status</div>
              <div>Actions</div>
            </div>

            <div className="divide-y divide-gray-200">
              {packingQueue.map((order, index) => (
                <div
                  key={index}
                  className="grid grid-cols-6 gap-4 px-6 py-4 hover:bg-gray-50"
                >
                  <div>
                    <div className="font-medium text-gray-900">
                      {order.orderId}
                    </div>
                    <div className="text-sm text-gray-600">
                      {order.customerName}
                    </div>
                  </div>
                  <div>
                    <span
                      className={`inline-block px-2 py-1 text-xs font-medium rounded ${getPriorityColor(
                        order.priority
                      )}`}
                    >
                      {order.priority}
                    </span>
                  </div>
                  <div>
                    <div className="text-sm text-gray-900">
                      {formatTime(order.packByTime)}
                    </div>
                    {order.isOverdue && (
                      <div className="text-xs text-red-600">Overdue</div>
                    )}
                  </div>
                  <div>
                    <div className="text-sm text-gray-900">
                      {new Date(order.deliveryDate).toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <span
                      className={`inline-block px-2 py-1 text-xs font-medium rounded ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status === "order-confirmed"
                        ? "pending"
                        : order.status === "picking-order"
                        ? "packing"
                        : order.status === "allocated-driver"
                        ? "packed"
                        : order.status}
                    </span>
                    {order.packedItemsCount > 0 && (
                      <div className="text-xs text-gray-500 mt-1">
                        {order.packedItemsCount}/{order.itemsCount} items
                      </div>
                    )}
                  </div>
                  <div>
                    {order.status === "order-confirmed" ? (
                      <button
                        onClick={() => startPacking(order.orderId)}
                        className="flex items-center px-3 py-1 text-xs bg-gray-800 text-white rounded hover:bg-gray-700"
                      >
                        <Play className="h-3 w-3 mr-1" />
                        Start Packing
                      </button>
                    ) : order.status === "picking-order" ? (
                      <button
                        onClick={() => fetchOrderDetails(order.orderId)}
                        className="flex items-center px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        <Package className="h-3 w-3 mr-1" />
                        Continue
                      </button>
                    ) : (
                      <button className="flex items-center px-3 py-1 text-xs bg-green-600 text-white rounded">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Packed
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Packing Details Section */}
      {selectedOrder && orderDetails && (
        <div className="mt-6 bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">
              Packing Details - {selectedOrder}
            </h3>
            <div className="flex items-center space-x-2 text-sm text-blue-600">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span>Real-time updates</span>
            </div>
          </div>

          <div className="p-6">
            <h4 className="font-medium mb-4">Items to Pack:</h4>

            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 uppercase">
                      Order ID
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 uppercase">
                      Item
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 uppercase">
                      Quantity
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 uppercase">
                      Action
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 uppercase">
                      Make Complaint
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {orderDetails.items.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <input
                          type="radio"
                          checked={item.packingStatus === "packed"}
                          readOnly
                          className="h-4 w-4 text-gray-600"
                        />
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {selectedOrder}
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm text-gray-900">
                          {item.productName}
                        </div>
                        {item.itemComplaints &&
                          item.itemComplaints.length > 0 && (
                            <div className="flex items-center text-xs text-red-600 mt-1">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              Complaint:{" "}
                              {
                                item.itemComplaints[
                                  item.itemComplaints.length - 1
                                ].complaintDetails
                              }
                            </div>
                          )}
                        {item.packingStatus && (
                          <span
                            className={`inline-block px-2 py-1 text-xs rounded mt-1 ${getItemStatusColor(
                              item.packingStatus
                            )}`}
                          >
                            {item.packingStatus}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {item.quantity} {item.weight}
                      </td>
                      <td className="py-3 px-4">
                        {item.packingStatus === "packed" ? (
                          <span className="inline-flex items-center px-3 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Packed
                          </span>
                        ) : item.packingStatus === "unavailable" ? (
                          <span className="inline-flex items-center px-3 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Unavailable
                          </span>
                        ) : (
                          <button
                            onClick={() => markItemPacked(index)}
                            className="flex items-center px-3 py-1 text-xs bg-gray-800 text-white rounded hover:bg-gray-700"
                          >
                            Mark Packed
                          </button>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => {
                            setComplaintData({
                              itemIndex: index,
                              complaintType: "",
                              complaintDetails: "",
                            });
                            setShowComplaintModal(true);
                          }}
                          className="flex items-center px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                        >
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Make Complaint
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Packing Notes */}
            <div className="mt-6">
              <h4 className="font-medium mb-2">Packing Notes:</h4>
              <textarea
                value={packingNotes}
                onChange={(e) => setPackingNotes(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md"
                rows="3"
                placeholder="Add any special notes about packing (fragile items, special handling, etc.)"
              />
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex justify-between">
              <button
                onClick={() => {
                  setSelectedOrder(null);
                  setOrderDetails(null);
                  setPackingNotes("");
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Close
              </button>

              <div className="flex space-x-3">
                <button
                  onClick={completePacking}
                  disabled={
                    !orderDetails.items.every(
                      (item) =>
                        item.packingStatus === "packed" ||
                        item.packingStatus === "unavailable"
                    )
                  }
                  className="flex items-center px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Complete Packing
                </button>
              </div>
            </div>

            {/* Enhanced Progress Indicator */}
            <div className="mt-4 bg-gray-50 p-4 rounded-md">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Packing Progress</span>
                <span>
                  {
                    orderDetails.items.filter(
                      (item) => item.packingStatus === "packed"
                    ).length
                  }{" "}
                  / {orderDetails.items.length} items
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-green-600 h-3 rounded-full transition-all duration-500 ease-in-out"
                  style={{
                    width: `${
                      (orderDetails.items.filter(
                        (item) => item.packingStatus === "packed"
                      ).length /
                        orderDetails.items.length) *
                      100
                    }%`,
                  }}
                ></div>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                Complaints:{" "}
                {orderDetails.items.reduce(
                  (count, item) =>
                    count +
                    (item.itemComplaints ? item.itemComplaints.length : 0),
                  0
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Complaint Modal */}
      {showComplaintModal && <ComplaintModal />}
    </div>
  );
};

export default PackingStaffDashboard;
