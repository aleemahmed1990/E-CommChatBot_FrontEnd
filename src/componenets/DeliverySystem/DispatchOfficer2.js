import React, { useState, useEffect } from "react";
import {
  Package,
  Building,
  Truck,
  User,
  Phone,
  FileText,
  Navigation,
  CheckCircle,
  Clock,
  Eye,
  X,
  AlertTriangle,
  MapPin,
  Calendar,
} from "lucide-react";

const API_BASE_URL = "http://localhost:5000";

const DispatchOfficer2Dashboard = ({ selectedRole, setSelectedRole }) => {
  const [verificationQueue, setVerificationQueue] = useState([]);
  const [vehicleStatus, setVehicleStatus] = useState([]);
  const [stats, setStats] = useState({
    pending: 0,
    verifying: 0,
    readyForDispatch: 0,
    totalVehicles: 0,
  });
  const [loading, setLoading] = useState(true);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loadingNotes, setLoadingNotes] = useState("");

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
      active: true,
      color: "bg-gray-800 text-white",
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
    fetchData();
    const interval = setInterval(fetchData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      await Promise.all([
        fetchVerificationQueue(),
        fetchVehicleStatus(),
        fetchStats(),
      ]);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchVerificationQueue = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/dispatch2/queue`);
      const data = await response.json();
      setVerificationQueue(data);
    } catch (error) {
      console.error("Error fetching verification queue:", error);
    }
  };

  const fetchVehicleStatus = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/dispatch2/vehicles`);
      const data = await response.json();
      setVehicleStatus(data);
    } catch (error) {
      console.error("Error fetching vehicle status:", error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/dispatch2/stats`);
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const fetchOrderDetails = async (orderId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/dispatch2/order/${orderId}`
      );
      const data = await response.json();
      setSelectedOrder(data);
      setShowOrderModal(true);
    } catch (error) {
      console.error("Error fetching order details:", error);
    }
  };

  const handleItemVerification = async (
    orderId,
    itemIndex,
    verified,
    notes = ""
  ) => {
    try {
      console.log(
        `🔍 Frontend: Verifying item ${itemIndex} for order ${orderId}:`,
        {
          verified,
          verifiedType: typeof verified,
          notes,
        }
      );

      const response = await fetch(
        `${API_BASE_URL}/api/dispatch2/verify-item/${orderId}/${itemIndex}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            employeeId: "DO2_001",
            employeeName: "Dispatch Officer 2",
            verified: Boolean(verified), // Ensure boolean conversion
            notes: notes,
          }),
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log("✅ Frontend: Verification result:", result);

        // Update the selected order if modal is open
        if (selectedOrder && selectedOrder.orderId === orderId) {
          const updatedOrder = { ...selectedOrder };

          // CRITICAL: Ensure the verification status is properly set
          updatedOrder.items[itemIndex].loadingVerified = Boolean(verified);
          updatedOrder.items[itemIndex].loadingNotes = notes;
          updatedOrder.items[itemIndex].loadingVerifiedAt = new Date();

          // Update loading details
          const verifiedCount = updatedOrder.items.filter(
            (item) => item.loadingVerified === true
          ).length;
          const totalItems = updatedOrder.items.length;

          updatedOrder.loadingDetails = {
            ...updatedOrder.loadingDetails,
            totalItemsLoaded: verifiedCount,
            totalItemsRequested: totalItems,
            loadingProgress: Math.round((verifiedCount / totalItems) * 100),
          };

          console.log(`📊 Frontend: Updated verification status:`, {
            itemIndex,
            verified: Boolean(verified),
            verifiedCount,
            totalItems,
            progress: Math.round((verifiedCount / totalItems) * 100),
          });

          setSelectedOrder(updatedOrder);
        }

        // Refresh data to get updated status
        fetchData();
      } else {
        const error = await response.json();
        console.error("❌ Frontend: Verification failed:", error);
        alert(`Verification failed: ${error.error}`);
      }
    } catch (error) {
      console.error("❌ Frontend: Error verifying item:", error);
      alert("Failed to verify item");
    }
  };

  const handleCompleteOrderLoading = async (orderId) => {
    try {
      // Use the new debug route
      const debugResponse = await fetch(
        `${API_BASE_URL}/api/dispatch2/debug-verification/${orderId}`
      );
      const debugData = await debugResponse.json();

      console.log("🔍 Debug data before completion:", debugData);

      if (!debugData.allItemsVerifiedStrict) {
        alert(
          `Cannot complete loading. ${debugData.verifiedItemsStrict}/${
            debugData.totalItems
          } items verified.
        
Verified: ${debugData.verifiedItemNames.join(", ")}
Missing: ${debugData.itemsDebug
            .filter((item) => !item.isStrictlyTrue)
            .map((item) => item.productName)
            .join(", ")}`
        );
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}/api/dispatch2/complete-loading/${orderId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            loadingNotes: loadingNotes,
            employeeId: "DO2_001",
            employeeName: "Dispatch Officer 2",
          }),
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log("✅ Loading completed:", result);
        alert(result.message);
        setShowOrderModal(false);
        setSelectedOrder(null);
        setLoadingNotes("");
        fetchData();
      } else {
        const error = await response.json();
        console.error("❌ Loading completion failed:", error);
        alert(
          `Loading completion failed: ${error.error}\n${
            error.details ? JSON.stringify(error.details, null, 2) : ""
          }`
        );
      }
    } catch (error) {
      console.error("Error completing loading:", error);
      alert("Failed to complete loading");
    }
  };
  const handleCompleteVehicleLoading = async (vehicleId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/dispatch2/complete-vehicle-loading/${vehicleId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            employeeId: "DO2_001",
            employeeName: "Dispatch Officer 2",
          }),
        }
      );

      if (response.ok) {
        const result = await response.json();
        alert(result.message);
        fetchData();
      } else {
        const error = await response.json();
        alert(`Vehicle loading completion failed: ${error.error}`);
      }
    } catch (error) {
      console.error("Error completing vehicle loading:", error);
      alert("Failed to complete vehicle loading");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-orange-100 text-orange-800";
      case "verifying":
        return "bg-yellow-100 text-yellow-800";
      case "verified":
        return "bg-blue-100 text-blue-800";
      case "confirmed for dispatch":
        return "bg-gray-800 text-white";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getVehicleStatusColor = (status) => {
    switch (status) {
      case "loading":
        return "bg-yellow-100 text-yellow-800";
      case "ready for dispatch":
        return "bg-blue-100 text-blue-800";
      case "all orders loaded":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const OrderVerificationModal = ({ order, onClose }) => {
    if (!order) return null;

    // IMPROVED verification check - using consistent variable names
    const verifiedItems = order.items
      ? order.items.filter((item) => {
          // Check for strict boolean true
          const isVerified = item.loadingVerified === true;
          console.log(
            `Modal check - ${item.productName}: ${item.loadingVerified} -> ${isVerified}`
          );
          return isVerified;
        })
      : [];

    const totalItems = order.items ? order.items.length : 0;
    const verifiedCount = verifiedItems.length;
    const allItemsVerified = verifiedCount === totalItems && totalItems > 0;

    console.log("📊 Modal verification status:", {
      allItemsVerified,
      verifiedCount,
      totalItems,
      items: order.items?.map((item) => ({
        name: item.productName,
        verified: item.loadingVerified,
        type: typeof item.loadingVerified,
        isStrictlyTrue: item.loadingVerified === true,
      })),
    });

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-screen overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">
                Items Verification & Loading - {order.orderId}
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Progress indicator */}
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-blue-800">
                    Loading Progress
                  </h3>
                  <p className="text-blue-600">
                    {verifiedCount} of {totalItems} items verified
                  </p>
                </div>
                <div className="text-2xl font-bold text-blue-800">
                  {totalItems > 0
                    ? Math.round((verifiedCount / totalItems) * 100)
                    : 0}
                  %
                </div>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${
                      totalItems > 0 ? (verifiedCount / totalItems) * 100 : 0
                    }%`,
                  }}
                ></div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-3">
                  Order Information
                </h3>
                <div className="space-y-2">
                  <p>
                    <span className="font-medium">Customer:</span>{" "}
                    {order.customerName}
                  </p>
                  <p>
                    <span className="font-medium">Phone:</span>{" "}
                    {order.customerPhone}
                  </p>
                  <p>
                    <span className="font-medium">Delivery Date:</span>{" "}
                    {new Date(order.deliveryDate).toLocaleDateString()}
                  </p>
                  <p>
                    <span className="font-medium">Time Slot:</span>{" "}
                    {order.timeSlot || "Not specified"}
                  </p>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-3 text-blue-800">
                  Vehicle Assignment
                </h3>
                <div className="space-y-2">
                  <p>
                    <span className="font-medium">Vehicle:</span>{" "}
                    {order.assignmentDetails?.assignedVehicle?.displayName ||
                      "Not assigned"}
                  </p>
                  <p>
                    <span className="font-medium">Type:</span>{" "}
                    {order.assignmentDetails?.assignedVehicle?.category ||
                      "Unknown"}
                  </p>
                  <p>
                    <span className="font-medium">Driver:</span>{" "}
                    {order.assignmentDetails?.assignedDriver?.employeeName ||
                      "Not assigned"}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h3 className="text-lg font-semibold mb-3">Delivery Address</h3>
              <div className="flex items-start space-x-2">
                <MapPin className="h-5 w-5 text-gray-600 mt-0.5" />
                <div>
                  <p className="font-medium">{order.deliveryAddress?.area}</p>
                  <p className="text-gray-600">
                    {order.deliveryAddress?.fullAddress}
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">
                Items to Verify and Load
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Status
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Item
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Quantity
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {order.items?.map((item, index) => (
                      <tr
                        key={index}
                        className={item.loadingVerified ? "bg-green-50" : ""}
                      >
                        <td className="px-4 py-2">
                          {item.loadingVerified ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <Clock className="h-5 w-5 text-gray-400" />
                          )}
                        </td>
                        <td className="px-4 py-2">
                          <div className="font-medium">{item.productName}</div>
                          {item.loadingNotes && (
                            <div className="text-xs text-gray-500">
                              {item.loadingNotes}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-2">{item.quantity}</td>
                        <td className="px-4 py-2">
                          {item.loadingVerified ? (
                            <div className="flex items-center space-x-2">
                              <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                                Loaded
                              </span>
                              <button
                                onClick={() =>
                                  handleItemVerification(
                                    order.orderId,
                                    index,
                                    false
                                  )
                                }
                                className="px-2 py-1 text-xs bg-gray-200 text-gray-600 rounded hover:bg-gray-300"
                              >
                                Unload
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() =>
                                handleItemVerification(
                                  order.orderId,
                                  index,
                                  true
                                )
                              }
                              className="px-3 py-1 text-xs bg-gray-800 text-white rounded hover:bg-gray-700"
                            >
                              Verify Now
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {allItemsVerified && (
              <div className="bg-green-50 border border-green-200 p-4 rounded-lg mb-6">
                <div className="flex items-center mb-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                  <span className="text-green-800 font-medium">
                    All {totalItems} items verified and loaded!
                  </span>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Loading Notes
                  </label>
                  <textarea
                    value={loadingNotes}
                    onChange={(e) => setLoadingNotes(e.target.value)}
                    placeholder="Enter any loading notes or special instructions..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    rows="3"
                  />
                </div>

                <button
                  onClick={() => handleCompleteOrderLoading(order.orderId)}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Complete Loading - Ready for Driver
                </button>
              </div>
            )}

            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Loading Verification Queue
          </h2>
          <p className="text-gray-600">
            Fetching orders ready for verification and loading...
          </p>
        </div>
      </div>
    );
  }

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

        {/* Dashboard Content */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Dispatch Officer 2 Dashboard
              </h2>
              <p className="text-gray-600">
                Verify and load orders onto vehicles
              </p>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center">
                <Package className="h-4 w-4 mr-1" />
                {stats.pending + stats.verifying} orders to load
              </div>
              <div className="flex items-center">
                <Truck className="h-4 w-4 mr-1" />
                {stats.totalVehicles} vehicles
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-blue-600 mr-2" />
              <span className="text-sm text-blue-800">
                Verify items and load orders onto assigned vehicles for driver
                pickup.
              </span>
            </div>
          </div>

          {/* Orders for Verification & Loading */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Orders for Verification & Loading
            </h3>
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="grid grid-cols-6 gap-4 px-6 py-3 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                <div>Order</div>
                <div>Vehicle Assignment</div>
                <div>Route</div>
                <div>Time Slot</div>
                <div>Status</div>
                <div>Actions</div>
              </div>

              {verificationQueue.length === 0 ? (
                <div className="p-8 text-center">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No Orders to Load
                  </h3>
                  <p className="text-gray-600">
                    All orders are either completed or not yet assigned.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {verificationQueue.map((order, index) => (
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
                        <div className="text-xs text-gray-500">
                          {order.deliveryAddress?.fullAddress}
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center">
                          <Truck className="h-4 w-4 text-gray-600 mr-1" />
                          <span className="text-sm text-gray-900">
                            {order.assignmentDetails?.assignedVehicle
                              ?.displayName || "Not assigned"}
                          </span>
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-900">
                          {order.route}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-900">
                          {order.timeSlot}
                        </div>
                      </div>
                      <div>
                        <span
                          className={`inline-block px-2 py-1 text-xs font-medium rounded ${getStatusColor(
                            order.loadingStatus
                          )}`}
                        >
                          {order.loadingStatus}
                        </span>
                        {order.verificationProgress > 0 && (
                          <div className="text-xs text-gray-500 mt-1">
                            {order.verifiedItems}/{order.totalItems} items (
                            {order.verificationProgress}%)
                          </div>
                        )}
                      </div>
                      <div>
                        {order.loadingStatus === "confirmed for dispatch" ? (
                          <button className="flex items-center px-3 py-1 text-xs bg-gray-800 text-white rounded">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Confirmed for Dispatch
                          </button>
                        ) : (
                          <button
                            onClick={() => fetchOrderDetails(order.orderId)}
                            className="text-sm text-blue-600 hover:text-blue-800"
                          >
                            Verify Items
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Vehicle Status */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Vehicle Status
            </h3>
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="grid grid-cols-6 gap-4 px-6 py-3 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                <div>Vehicle</div>
                <div>Type</div>
                <div>Load Progress</div>
                <div>Assigned Orders</div>
                <div>Status</div>
                <div>Actions</div>
              </div>

              {vehicleStatus.length === 0 ? (
                <div className="p-8 text-center">
                  <Truck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No Active Vehicles
                  </h3>
                  <p className="text-gray-600">
                    No vehicles are currently assigned for loading.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {vehicleStatus.map((vehicle, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-6 gap-4 px-6 py-4 hover:bg-gray-50"
                    >
                      <div>
                        <div className="flex items-center">
                          <Truck className="h-4 w-4 text-gray-600 mr-2" />
                          <span className="font-medium">
                            {vehicle.displayName}
                          </span>
                        </div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-900 capitalize">
                          {vehicle.type}
                        </span>
                      </div>
                      <div>
                        <div className="text-sm text-gray-900">
                          {vehicle.loadedItems}/{vehicle.totalItems}
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                          <div
                            className="bg-gray-800 h-2 rounded-full"
                            style={{ width: `${vehicle.loadProgress}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {vehicle.loadProgress}%
                        </div>
                      </div>
                      <div>
                        {vehicle.assignedOrders.map((order, idx) => (
                          <div key={idx} className="text-sm text-gray-900">
                            {order.orderId}
                            {order.isFullyLoaded && (
                              <CheckCircle className="h-3 w-3 text-green-500 inline ml-1" />
                            )}
                          </div>
                        ))}
                      </div>
                      <div>
                        <span
                          className={`inline-block px-2 py-1 text-xs font-medium rounded ${getVehicleStatusColor(
                            vehicle.status
                          )}`}
                        >
                          {vehicle.status}
                        </span>
                      </div>
                      <div>
                        {vehicle.status === "ready for dispatch" && (
                          <button
                            onClick={() =>
                              handleCompleteVehicleLoading(vehicle.vehicleId)
                            }
                            className="flex items-center px-3 py-1 text-xs bg-gray-800 text-white rounded hover:bg-gray-700"
                          >
                            <Truck className="h-3 w-3 mr-1" />
                            All orders loaded
                          </button>
                        )}
                        {vehicle.status === "all orders loaded" && (
                          <button className="flex items-center px-3 py-1 text-xs bg-green-600 text-white rounded">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Ready for Driver
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {showOrderModal && (
          <OrderVerificationModal
            order={selectedOrder}
            onClose={() => {
              setShowOrderModal(false);
              setSelectedOrder(null);
              setLoadingNotes("");
            }}
          />
        )}
      </div>
    </div>
  );
};

export default DispatchOfficer2Dashboard;
