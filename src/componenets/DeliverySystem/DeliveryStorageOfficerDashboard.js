import React, { useState, useEffect } from "react";
import {
  Clock,
  CheckCircle2,
  CheckCircle,
  Eye,
  Package,
  Users,
  Building,
  Truck,
  User,
  Phone,
  FileText,
  Navigation,
  X,
  AlertTriangle,
} from "lucide-react";

const API_BASE_URL = "https://e-commchatbot-backend-4.onrender.com";

const DeliveryStorageOfficerDashboard = ({ selectedRole, setSelectedRole }) => {
  const [storageQueue, setStorageQueue] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    pending: 0,
    verifying: 0,
    completed: 0,
  });
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [showComplaintModal, setShowComplaintModal] = useState(false);
  const [complaintData, setComplaintData] = useState({
    itemIndex: null,
    complaintType: "",
    complaintDetails: "",
  });
  const [storageNotes, setStorageNotes] = useState("");
  const [storageLocation, setStorageLocation] = useState("");

  const roleButtons = [
    {
      name: "Order Overview",
      icon: Package,
      active: false,
      color: "bg-gray-100 text-gray-700",
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
      active: true,
      color: "bg-gray-800 text-white",
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
    fetchStorageQueue();
    fetchStats();

    // Real-time updates every 5 seconds
    const interval = setInterval(() => {
      fetchStorageQueue();
      fetchStats();
      if (selectedOrder) {
        fetchOrderDetails(selectedOrder);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [selectedOrder]);

  const fetchStorageQueue = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/storage/queue`);
      const data = await response.json();
      setStorageQueue(data);
    } catch (error) {
      console.error("Error fetching storage queue:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/storage/stats`);
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Error fetching stats:", error);
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
      setShowVerificationModal(true);
    } catch (error) {
      console.error("Error fetching order details:", error);
    }
  };

  const startVerification = async (orderId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/storage/start/${orderId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            employeeId: "STORAGE_001",
            employeeName: "Storage Officer",
          }),
        }
      );

      if (response.ok) {
        fetchOrderDetails(orderId);
      } else {
        const error = await response.json();
        alert(`Failed to start verification: ${error.error}`);
      }
    } catch (error) {
      console.error("Error starting verification:", error);
      alert("Failed to start verification");
    }
  };

  const verifyItem = async (itemIndex, verified = true, condition = "good") => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/storage/item/${selectedOrder}/${itemIndex}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            employeeId: "STORAGE_001",
            employeeName: "Storage Officer",
            verified: verified,
            condition: condition,
          }),
        }
      );

      if (response.ok) {
        const result = await response.json();
        alert(
          `Item verified! Progress: ${result.verifiedItems}/${result.totalItems} items`
        );

        // Refresh data
        fetchOrderDetails(selectedOrder);
        fetchStorageQueue();
        fetchStats();
      } else {
        const error = await response.json();
        alert(`Failed to verify item: ${error.error}`);
      }
    } catch (error) {
      console.error("Error verifying item:", error);
      alert("Failed to verify item");
    }
  };

  const addComplaint = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/storage/complaint/${selectedOrder}/${complaintData.itemIndex}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            complaintType: complaintData.complaintType,
            complaintDetails: complaintData.complaintDetails,
            employeeId: "STORAGE_001",
            employeeName: "Storage Officer",
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

        alert(`Storage complaint added successfully: ${result.complaintId}`);
        fetchOrderDetails(selectedOrder);
        fetchStorageQueue();
      } else {
        const error = await response.json();
        alert(`Failed to add complaint: ${error.error}`);
      }
    } catch (error) {
      console.error("Error adding complaint:", error);
      alert("Failed to add complaint");
    }
  };

  const completeVerification = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/storage/complete/${selectedOrder}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            storageNotes: storageNotes,
            storageLocation: storageLocation,
            employeeId: "STORAGE_001",
            employeeName: "Storage Officer",
          }),
        }
      );

      if (response.ok) {
        const result = await response.json();
        alert(`All items verified and handed over to Dispatch Officer 1`);

        // Reset state
        setSelectedOrder(null);
        setOrderDetails(null);
        setShowVerificationModal(false);
        setStorageNotes("");
        setStorageLocation("");

        // Refresh data
        fetchStorageQueue();
        fetchStats();
      } else {
        const error = await response.json();
        alert(`Failed to complete verification: ${error.error}`);
      }
    } catch (error) {
      console.error("Error completing verification:", error);
      alert("Failed to complete verification");
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
      case "verified":
        return "bg-gray-800 text-white";
      case "pending":
        return "bg-orange-100 text-orange-800";
      case "verifying":
        return "bg-blue-100 text-blue-800";
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

  const ComplaintModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Add Storage Complaint</h3>
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
              <option value="damaged">Item damaged</option>
              <option value="missing">Item missing</option>
              <option value="wrong_item">Wrong item</option>
              <option value="quantity_mismatch">Quantity mismatch</option>
              <option value="packaging_issue">Packaging issue</option>
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

  const VerificationModal = () => {
    if (!orderDetails) return null;

    const allItemsVerified = orderDetails.items.every(
      (item) =>
        item.storageVerified === true ||
        (item.storageComplaints && item.storageComplaints.length > 0)
    );

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-screen overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Order Verification - {selectedOrder}
              </h2>
              <button
                onClick={() => {
                  setShowVerificationModal(false);
                  setSelectedOrder(null);
                  setOrderDetails(null);
                }}
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Items to Check:</h3>

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
                          {item.storageVerified ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : item.storageComplaints &&
                            item.storageComplaints.length > 0 ? (
                            <AlertTriangle className="h-5 w-5 text-red-500" />
                          ) : (
                            <div className="h-5 w-5 border-2 border-gray-300 rounded"></div>
                          )}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-900">
                          {selectedOrder}
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-sm text-gray-900">
                            {item.productName}
                          </div>
                          {item.storageComplaints &&
                            item.storageComplaints.length > 0 && (
                              <div className="flex items-center text-xs text-red-600 mt-1">
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                Complaint:{" "}
                                {
                                  item.storageComplaints[
                                    item.storageComplaints.length - 1
                                  ].complaintDetails
                                }
                              </div>
                            )}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-900">
                          {item.quantity} {item.weight}
                        </td>
                        <td className="py-3 px-4">
                          {item.storageVerified ? (
                            <span className="inline-flex items-center px-3 py-1 text-xs bg-gray-800 text-white rounded">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Verified
                            </span>
                          ) : item.storageComplaints &&
                            item.storageComplaints.length > 0 ? (
                            <span className="inline-flex items-center px-3 py-1 text-xs bg-red-100 text-red-800 rounded">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              Has Issue
                            </span>
                          ) : (
                            <button
                              onClick={() => verifyItem(index)}
                              className="flex items-center px-3 py-1 text-xs bg-gray-800 text-white rounded hover:bg-gray-700"
                            >
                              Verify Now
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
            </div>

            {/* Storage Notes */}
            <div className="mb-6">
              <h4 className="font-medium mb-2">Storage Notes:</h4>
              <textarea
                value={storageNotes}
                onChange={(e) => setStorageNotes(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md"
                rows="3"
                placeholder="Add any notes about item conditions, storage requirements, etc."
              />
            </div>

            {/* Storage Location */}
            <div className="mb-6">
              <h4 className="font-medium mb-2">Storage Location:</h4>
              <input
                type="text"
                value={storageLocation}
                onChange={(e) => setStorageLocation(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md"
                placeholder="e.g., Shelf A-12, Cold Storage Room 2, etc."
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between">
              <button
                onClick={() => {
                  setShowVerificationModal(false);
                  setSelectedOrder(null);
                  setOrderDetails(null);
                  setStorageNotes("");
                  setStorageLocation("");
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Close
              </button>

              {allItemsVerified && (
                <button
                  onClick={completeVerification}
                  className="flex items-center px-6 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  All items verified and handed over to Dispatch Officer 1
                </button>
              )}
            </div>

            {/* Progress Indicator */}
            <div className="mt-4 bg-gray-50 p-4 rounded-md">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Verification Progress</span>
                <span>
                  {
                    orderDetails.items.filter((item) => item.storageVerified)
                      .length
                  }{" "}
                  / {orderDetails.items.length} items
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-green-600 h-3 rounded-full transition-all duration-500 ease-in-out"
                  style={{
                    width: `${
                      (orderDetails.items.filter((item) => item.storageVerified)
                        .length /
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
                    (item.storageComplaints
                      ? item.storageComplaints.length
                      : 0),
                  0
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        {/* Title */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            Delivery Management System
          </h1>
          <p className="text-gray-600">
            Complete workflow management from packing to delivery confirmation
          </p>
        </div>

        {/* Role Selection */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Select Role
          </h2>
          <div className="space-y-3">
            {/* First Row - Main roles */}
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

            {/* Second Row - Complaint roles */}
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

        {/* Dashboard Content */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Delivery Storage Officer Dashboard
              </h2>
              <p className="text-gray-600">
                Verify packed orders and prepare for dispatch
              </p>
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
              <CheckCircle2 className="h-5 w-5 text-blue-600 mr-2" />
              <span className="text-sm text-blue-800">
                Verify all items match the packing list and check for any
                damages before sending to dispatch.
              </span>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Storage Operations
              </h3>
            </div>

            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading storage queue...</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-7 gap-4 px-6 py-3 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                  <div>Order</div>
                  <div>Priority</div>
                  <div>Packed By</div>
                  <div>Received At</div>
                  <div>Delivery Time</div>
                  <div>Status</div>
                  <div>Actions</div>
                </div>

                <div className="divide-y divide-gray-200">
                  {storageQueue.map((order, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-7 gap-4 px-6 py-4 hover:bg-gray-50"
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
                          {order.packedBy}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-900">
                          {formatTime(order.receivedAt)}
                        </div>
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
                          {order.status}
                        </span>
                        {order.verifiedItems > 0 && (
                          <div className="text-xs text-gray-500 mt-1">
                            {order.verifiedItems}/{order.totalItems} items
                          </div>
                        )}
                      </div>
                      <div>
                        {order.status === "verified" ? (
                          <button className="flex items-center px-3 py-1 text-xs bg-gray-800 text-white rounded">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Verified
                          </button>
                        ) : (
                          <button
                            onClick={() => startVerification(order.orderId)}
                            className="flex items-center px-3 py-1 text-xs bg-gray-800 text-white rounded hover:bg-gray-700"
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            Start Verifying
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Modals */}
        {showVerificationModal && <VerificationModal />}
        {showComplaintModal && <ComplaintModal />}
      </div>
    </div>
  );
};

export default DeliveryStorageOfficerDashboard;
