import React, { useState, useEffect } from "react";
import {
  Target,
  Truck,
  Eye,
  Package,
  Users,
  Building,
  User,
  Phone,
  FileText,
  Navigation,
  Clock,
  CheckCircle,
  AlertTriangle,
  MapPin,
  Calendar,
  Weight,
  Box,
  Zap,
  X,
  Check,
  Send,
} from "lucide-react";

const API_BASE_URL = "http://localhost:5000";

const DispatchOfficer1Dashboard = ({ selectedRole, setSelectedRole }) => {
  const [assignmentQueue, setAssignmentQueue] = useState([]);
  const [availableVehicles, setAvailableVehicles] = useState([]);
  const [dispatchOfficers, setDispatchOfficers] = useState([]);
  const [stats, setStats] = useState({ pending: 0, assigned: 0, urgent: 0 });
  const [loading, setLoading] = useState(true);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [selectedDriver, setSelectedDriver] = useState("");
  const [assignmentNotes, setAssignmentNotes] = useState("");
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [vehicleSuggestion, setVehicleSuggestion] = useState(null);

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
      active: true,
      color: "bg-gray-800 text-white",
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
    fetchData();
    const interval = setInterval(fetchData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      await Promise.all([
        fetchAssignmentQueue(),
        fetchVehicles(),
        fetchDispatchOfficers(),
        fetchStats(),
      ]);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAssignmentQueue = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/dispatch1/queue`);
      const data = await response.json();
      setAssignmentQueue(data);
    } catch (error) {
      console.error("Error fetching assignment queue:", error);
    }
  };

  const fetchVehicles = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/dispatch1/vehicles`);
      const data = await response.json();
      setAvailableVehicles(data);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
    }
  };

  const fetchDispatchOfficers = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/dispatch1/dispatch-officers`
      );
      const data = await response.json();
      setDispatchOfficers(data.available);
    } catch (error) {
      console.error("Error fetching dispatch officers:", error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/dispatch1/stats`);
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const fetchOrderDetails = async (orderId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/dispatch1/order/${orderId}`
      );
      const data = await response.json();
      setSelectedOrder(data);

      // Fetch vehicle suggestion
      const suggestionResponse = await fetch(
        `${API_BASE_URL}/api/dispatch1/suggest-vehicle/${orderId}`
      );
      const suggestionData = await suggestionResponse.json();
      setVehicleSuggestion(suggestionData);

      setShowOrderModal(true);
    } catch (error) {
      console.error("Error fetching order details:", error);
    }
  };

  const handleOrderSelection = (orderId) => {
    setSelectedOrders((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleBulkAssignment = async () => {
    if (selectedOrders.length === 0 || !selectedVehicle || !selectedDriver) {
      alert("Please select orders, vehicle, and driver for assignment");
      return;
    }

    try {
      const driverDetails = dispatchOfficers.find(
        (d) => d.employeeId === selectedDriver
      );

      const assignments = selectedOrders.map((orderId) => ({
        orderId,
        vehicleId: selectedVehicle,
        driverDetails,
        notes: assignmentNotes,
      }));

      const response = await fetch(
        `${API_BASE_URL}/api/dispatch1/bulk-assign`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            assignments,
            employeeId: "DO1_001", // This should come from authentication
            employeeName: "Dispatch Officer 1",
          }),
        }
      );

      if (response.ok) {
        const result = await response.json();
        alert(result.message);

        // Reset selections
        setSelectedOrders([]);
        setSelectedVehicle("");
        setSelectedDriver("");
        setAssignmentNotes("");

        // Refresh data
        fetchData();
      } else {
        const error = await response.json();
        alert(`Assignment failed: ${error.error}`);
      }
    } catch (error) {
      console.error("Error in bulk assignment:", error);
      alert("Failed to assign orders");
    }
  };

  const handleSingleAssignment = async (orderId) => {
    if (!selectedVehicle || !selectedDriver) {
      alert("Please select vehicle and driver for assignment");
      return;
    }

    try {
      const driverDetails = dispatchOfficers.find(
        (d) => d.employeeId === selectedDriver
      );

      const response = await fetch(
        `${API_BASE_URL}/api/dispatch1/assign/${orderId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            vehicleId: selectedVehicle,
            driverDetails,
            assignmentNotes,
            employeeId: "DO1_001",
            employeeName: "Dispatch Officer 1",
          }),
        }
      );

      if (response.ok) {
        const result = await response.json();
        alert(result.message);
        fetchData();
        setShowOrderModal(false);
      } else {
        const error = await response.json();
        alert(`Assignment failed: ${error.error}`);
      }
    } catch (error) {
      console.error("Error assigning order:", error);
      alert("Failed to assign order");
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-500 text-white";
      case "medium":
        return "bg-yellow-500 text-white";
      case "low":
        return "bg-green-500 text-white";
      default:
        return "bg-gray-400 text-white";
    }
  };

  const formatVehicleCapacity = (specs) => {
    return `${specs.maxPackages}pkg | ${specs.maxWeight}kg | ${specs.maxVolume}m³`;
  };

  const OrderDetailsModal = ({ order, onClose }) => {
    if (!order) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-screen overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">
                Order Assignment - {order.orderId}
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="h-6 w-6" />
              </button>
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
                  <p>
                    <span className="font-medium">Total Amount:</span> AED{" "}
                    {order.totalAmount?.toFixed(2)}
                  </p>
                  <p>
                    <span className="font-medium">Items:</span>{" "}
                    {order.items?.length || 0} items
                  </p>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-3 text-blue-800">
                  Order Requirements
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Box className="h-4 w-4 mr-2 text-blue-600" />
                    <span>Packages: {order.requirements?.packages || 0}</span>
                  </div>
                  <div className="flex items-center">
                    <Weight className="h-4 w-4 mr-2 text-blue-600" />
                    <span>Weight: {order.requirements?.weight || 0} kg</span>
                  </div>
                  <div className="flex items-center">
                    <Package className="h-4 w-4 mr-2 text-blue-600" />
                    <span>Volume: {order.requirements?.volume || 0} m³</span>
                  </div>
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

            {vehicleSuggestion && (
              <div className="bg-green-50 border border-green-200 p-4 rounded-lg mb-6">
                <h3 className="text-lg font-semibold mb-3 text-green-800">
                  <Zap className="h-5 w-5 inline mr-2" />
                  Suggested Vehicle
                </h3>
                {vehicleSuggestion.suggestedVehicle ? (
                  <div className="bg-white p-3 rounded border">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">
                          {vehicleSuggestion.suggestedVehicle.displayName}
                        </h4>
                        <p className="text-sm text-gray-600 capitalize">
                          {vehicleSuggestion.suggestedVehicle.category}
                        </p>
                      </div>
                      <div className="text-sm text-gray-600">
                        {formatVehicleCapacity(
                          vehicleSuggestion.suggestedVehicle.specifications
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-orange-600">
                    No suitable vehicle found for current requirements
                  </p>
                )}
              </div>
            )}

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Order Items</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Item
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Quantity
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Weight
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Status
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
                          <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                            Verified
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Assignment Options</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Vehicle
                  </label>
                  <select
                    value={selectedVehicle}
                    onChange={(e) => setSelectedVehicle(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Choose a vehicle...</option>
                    {availableVehicles.map((vehicle) => (
                      <option key={vehicle.id} value={vehicle.id}>
                        {vehicle.displayName} -{" "}
                        {formatVehicleCapacity(vehicle.specifications)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Dispatch Officer 2
                  </label>
                  <select
                    value={selectedDriver}
                    onChange={(e) => setSelectedDriver(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Choose a dispatch officer...</option>
                    {dispatchOfficers.map((officer) => (
                      <option
                        key={officer.employeeId}
                        value={officer.employeeId}
                      >
                        {officer.employeeName} ({officer.currentAssignments}/
                        {officer.maxAssignments})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assignment Notes
                </label>
                <textarea
                  value={assignmentNotes}
                  onChange={(e) => setAssignmentNotes(e.target.value)}
                  placeholder="Enter any special instructions or notes..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleSingleAssignment(order.orderId)}
                  disabled={!selectedVehicle || !selectedDriver}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Assign Order
                </button>
              </div>
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
            Loading Assignment Queue
          </h2>
          <p className="text-gray-600">
            Fetching orders ready for vehicle assignment...
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
                Dispatch Officer 1 Dashboard
              </h2>
              <p className="text-gray-600">
                Assign vehicles and dispatch officers to verified orders
              </p>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center">
                <Target className="h-4 w-4 mr-1" />
                {stats.pending} pending assignments
              </div>
              {stats.urgent > 0 && (
                <div className="flex items-center text-red-600">
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  {stats.urgent} urgent
                </div>
              )}
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
            <div className="flex items-center">
              <Target className="h-5 w-5 text-blue-600 mr-2" />
              <span className="text-sm text-blue-800">
                Assign vehicles and dispatch officers to orders that have
                completed storage verification.
              </span>
            </div>
          </div>

          {/* Assignment Controls */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Bulk Assignment Controls
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vehicle
                </label>
                <select
                  value={selectedVehicle}
                  onChange={(e) => setSelectedVehicle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select vehicle...</option>
                  {availableVehicles.map((vehicle) => (
                    <option key={vehicle.id} value={vehicle.id}>
                      {vehicle.displayName} ({vehicle.category})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dispatch Officer 2
                </label>
                <select
                  value={selectedDriver}
                  onChange={(e) => setSelectedDriver(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select officer...</option>
                  {dispatchOfficers.map((officer) => (
                    <option key={officer.employeeId} value={officer.employeeId}>
                      {officer.employeeName} ({officer.currentAssignments}/
                      {officer.maxAssignments})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <input
                  type="text"
                  value={assignmentNotes}
                  onChange={(e) => setAssignmentNotes(e.target.value)}
                  placeholder="Assignment notes..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Action
                </label>
                <button
                  onClick={handleBulkAssignment}
                  disabled={
                    selectedOrders.length === 0 ||
                    !selectedVehicle ||
                    !selectedDriver
                  }
                  className="w-full px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  <Send className="h-4 w-4 inline mr-2" />
                  Assign Selected ({selectedOrders.length})
                </button>
              </div>
            </div>
          </div>

          {/* Assignment Queue */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Orders Ready for Assignment ({assignmentQueue.length} orders)
              </h3>
            </div>

            {assignmentQueue.length === 0 ? (
              <div className="p-8 text-center">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No Orders Ready
                </h3>
                <p className="text-gray-600">
                  All orders are either in progress or already assigned.
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                  <div>Select</div>
                  <div className="col-span-2">Order & Customer</div>
                  <div className="col-span-2">Requirements</div>
                  <div className="col-span-2">Delivery Info</div>
                  <div>Priority</div>
                  <div>Status</div>
                  <div className="col-span-2">Location</div>
                  <div>Actions</div>
                </div>

                <div className="divide-y divide-gray-200">
                  {assignmentQueue.map((order, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-gray-50"
                    >
                      <div className="flex justify-center">
                        <input
                          type="checkbox"
                          checked={selectedOrders.includes(order.orderId)}
                          onChange={() => handleOrderSelection(order.orderId)}
                          className="rounded border-gray-300"
                        />
                      </div>

                      <div className="col-span-2">
                        <div className="font-medium text-gray-900">
                          {order.orderId}
                        </div>
                        <div className="text-sm text-gray-600">
                          {order.customerName}
                        </div>
                        <div className="text-xs text-gray-500">
                          {order.customerPhone}
                        </div>
                        <div className="text-sm font-medium text-green-600">
                          AED {order.totalAmount?.toFixed(2)}
                        </div>
                      </div>

                      <div className="col-span-2">
                        <div className="flex items-center text-sm">
                          <Box className="h-3 w-3 mr-1 text-gray-500" />
                          {order.requirements?.packages || 0} pkg
                        </div>
                        <div className="flex items-center text-sm">
                          <Weight className="h-3 w-3 mr-1 text-gray-500" />
                          {order.requirements?.weight || 0} kg
                        </div>
                        <div className="flex items-center text-sm">
                          <Package className="h-3 w-3 mr-1 text-gray-500" />
                          {order.requirements?.volume || 0} m³
                        </div>
                      </div>

                      <div className="col-span-2">
                        <div className="flex items-center text-sm">
                          <Calendar className="h-3 w-3 mr-1 text-gray-500" />
                          {new Date(order.deliveryDate).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-gray-600">
                          {order.timeSlot || "Anytime"}
                        </div>
                        {order.isUrgent && (
                          <div className="text-xs text-red-600 font-medium">
                            Urgent ({order.hoursUntilDelivery}h left)
                          </div>
                        )}
                      </div>

                      <div>
                        <span
                          className={`inline-block px-2 py-1 text-xs font-medium rounded ${getPriorityColor(
                            order.priority
                          )}`}
                        >
                          {order.priority.toUpperCase()}
                        </span>
                      </div>

                      <div>
                        <span className="inline-block px-2 py-1 text-xs font-medium rounded bg-orange-100 text-orange-800">
                          Ready for Assignment
                        </span>
                      </div>

                      <div className="col-span-2">
                        <div className="font-medium text-gray-900">
                          {order.deliveryAddress?.area}
                        </div>
                        <div className="text-sm text-gray-600 truncate">
                          {order.deliveryAddress?.fullAddress}
                        </div>
                        {order.storageLocation && (
                          <div className="text-xs text-blue-600">
                            Storage: {order.storageLocation}
                          </div>
                        )}
                      </div>

                      <div>
                        <button
                          onClick={() => fetchOrderDetails(order.orderId)}
                          className="flex items-center px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {showOrderModal && (
          <OrderDetailsModal
            order={selectedOrder}
            onClose={() => {
              setShowOrderModal(false);
              setSelectedOrder(null);
              setVehicleSuggestion(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default DispatchOfficer1Dashboard;
