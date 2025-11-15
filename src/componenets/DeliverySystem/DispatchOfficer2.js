import React, { useState, useEffect, useRef } from "react";
import { Truck, CheckCircle, AlertTriangle, X, Navigation } from "lucide-react";

const API_BASE_URL = "https://e-commchatbot-backend-4.onrender.com";

const DispatchOfficer2Dashboard = () => {
  const [assignedOrders, setAssignedOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    assignedDrivers: 0,
    vehiclesAssigned: 0,
    onRoute: 0,
  });
  const [routeDetails, setRouteDetails] = useState("");
  const [vehicleType, setVehicleType] = useState("truck");
  const [employeeInfo, setEmployeeInfo] = useState(null);
  const updateTimeoutRef = useRef(null);

  const VEHICLE_TYPES = ["truck", "bike", "van", "scooter"];
  const EMPLOYEE_ID =
    localStorage.getItem("dispatchOfficer2Id") || "DISPATCH2_001";

  useEffect(() => {
    fetchEmployeeInfo();
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

  const fetchAssignedOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${API_BASE_URL}/api/dispatch2/assigned-orders`
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
        `${API_BASE_URL}/api/dispatch2/assigned-orders`
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
      const response = await fetch(`${API_BASE_URL}/api/dispatch2/stats`);
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchStatsQuiet = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/dispatch2/stats`);
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchOrderDetails = async (orderId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/dispatch2/order/${orderId}`
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
        `${API_BASE_URL}/api/dispatch2/order/${orderId}`
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

  const assignVehicle = async () => {
    if (!vehicleType || !routeDetails.trim()) {
      alert("Select vehicle and enter route details");
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/dispatch2/assign-vehicle/${selectedOrder}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            employeeId: EMPLOYEE_ID,
            employeeName: employeeInfo?.name || "Dispatch Officer 2",
            vehicleType: vehicleType,
            routeDetails: routeDetails,
            verificationDetails: {
              vehicleTypeSelected: vehicleType,
              routePlanned: true,
              verifiedBy: employeeInfo?.name,
              timestamp: new Date(),
            },
          }),
        }
      );

      if (response.ok) {
        alert("Vehicle assigned and route set!");
        setSelectedOrder(null);
        setOrderDetails(null);
        setRouteDetails("");
        fetchAssignedOrders();
        fetchStats();
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to assign vehicle");
    }
  };

  const markReadyForDelivery = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/dispatch2/ready-delivery/${selectedOrder}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            employeeId: EMPLOYEE_ID,
            employeeName: employeeInfo?.name || "Dispatch Officer 2",
            finalVerification: {
              readyForDelivery: true,
              verifiedBy: employeeInfo?.name,
              timestamp: new Date(),
            },
          }),
        }
      );

      if (response.ok) {
        alert("Order marked as ready for delivery!");
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
      alert("Failed to mark as ready");
    }
  };

  return (
    <div className="space-y-6">
      {/* Employee Info */}
      {employeeInfo && (
        <div className="bg-teal-50 rounded-lg p-4 border border-teal-200">
          <p className="text-sm">
            <strong>Dispatch Officer 2:</strong> {employeeInfo.name}
          </p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-purple-600 rounded-lg p-4 text-white">
          <p className="text-sm opacity-90">Drivers Assigned</p>
          <p className="text-3xl font-bold mt-1">{stats.assignedDrivers}</p>
        </div>
        <div className="bg-blue-600 rounded-lg p-4 text-white">
          <p className="text-sm opacity-90">Vehicles Assigned</p>
          <p className="text-3xl font-bold mt-1">{stats.vehiclesAssigned}</p>
        </div>
        <div className="bg-green-600 rounded-lg p-4 text-white">
          <p className="text-sm opacity-90">On Route</p>
          <p className="text-3xl font-bold mt-1">{stats.onRoute}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Orders */}
        <div className="bg-white rounded-lg shadow">
          <div className="bg-gray-800 text-white p-4 flex items-center space-x-2 rounded-t-lg">
            <Truck className="h-5 w-5" />
            <h3 className="font-bold">Assigned to Drivers</h3>
          </div>

          {loading ? (
            <div className="p-8 text-center text-gray-500">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : assignedOrders.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p>No orders assigned to drivers</p>
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
                    Driver: {order.assignedDriver?.employeeName || "Not yet"}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    {order.customerName}
                  </p>
                  <span className="inline-block mt-2 px-2 py-1 text-xs font-semibold bg-purple-100 text-purple-800 rounded">
                    {order.status?.replace(/-/g, " ") || "Pending"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Assignment Panel */}
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

              {/* Driver Info */}
              <div className="bg-blue-50 p-3 rounded">
                <h4 className="font-bold text-gray-900 mb-2">
                  Driver Assignment
                </h4>
                {orderDetails.assignedDriver ? (
                  <div className="space-y-1 text-sm">
                    <p>
                      <strong>Name:</strong>{" "}
                      {orderDetails.assignedDriver.employeeName}
                    </p>
                    <p>
                      <strong>Phone:</strong>{" "}
                      {orderDetails.assignedDriver.phone || "N/A"}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-600">
                    No driver assigned yet
                  </p>
                )}
              </div>

              {/* Delivery Info */}
              <div className="border-t pt-4 bg-gray-50 p-3 rounded">
                <p className="text-sm">
                  <strong>Address:</strong> {orderDetails.deliveryAddress}
                </p>
                <p className="text-sm">
                  <strong>Phone:</strong> {orderDetails.customerPhone}
                </p>
                <p className="text-sm">
                  <strong>Amount:</strong> PKR{" "}
                  {orderDetails.totalAmount?.toFixed(2) || "0.00"}
                </p>
              </div>

              {/* Vehicle Assignment */}
              <div className="border-t pt-4">
                <h4 className="font-bold text-gray-900 mb-3">
                  Vehicle Assignment
                </h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Vehicle Type
                    </label>
                    <select
                      value={vehicleType}
                      onChange={(e) => setVehicleType(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {VEHICLE_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {type.toUpperCase()}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Route Details
                    </label>
                    <textarea
                      value={routeDetails}
                      onChange={(e) => setRouteDetails(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows="3"
                      placeholder="Enter route, landmarks, delivery instructions..."
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="border-t pt-4 flex flex-col space-y-2">
                <button
                  onClick={assignVehicle}
                  className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  <Truck className="h-4 w-4" />
                  <span>Assign Vehicle & Route</span>
                </button>
                <button
                  onClick={markReadyForDelivery}
                  className="flex items-center justify-center space-x-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  <CheckCircle className="h-4 w-4" />
                  <span>Mark Ready for Delivery</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
              <Navigation className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Select an order to assign vehicle and route</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DispatchOfficer2Dashboard;
