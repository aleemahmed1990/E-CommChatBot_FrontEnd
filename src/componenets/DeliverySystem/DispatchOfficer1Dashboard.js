import React, { useState, useEffect, useRef } from "react";
import { User, CheckCircle, AlertTriangle, X, Users, Eye } from "lucide-react";

const API_BASE_URL = "https://e-commchatbot-backend-4.onrender.com";

const DispatchOfficer1Dashboard = () => {
  const [readyOrders, setReadyOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    readyForAssignment: 0,
    assigned: 0,
    pending: 0,
  });
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [employeeInfo, setEmployeeInfo] = useState(null);
  const updateTimeoutRef = useRef(null);

  const EMPLOYEE_ID =
    localStorage.getItem("dispatchOfficer1Id") || "DISPATCH1_001";

  useEffect(() => {
    fetchEmployeeInfo();
    fetchReadyOrders();
    fetchDrivers();
    fetchStats();

    const interval = setInterval(() => {
      fetchReadyOrdersQuiet();
      fetchDriversQuiet();
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

  const fetchReadyOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${API_BASE_URL}/api/dispatch1/ready-orders`
      );
      const data = await response.json();
      setReadyOrders(data || []);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReadyOrdersQuiet = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/dispatch1/ready-orders`
      );
      const data = await response.json();
      setReadyOrders((prev) => {
        if (JSON.stringify(prev) !== JSON.stringify(data)) {
          return data || [];
        }
        return prev;
      });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchDrivers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/employees?role=driver`);
      const data = await response.json();
      setDrivers(Array.isArray(data) ? data : data.employees || []);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchDriversQuiet = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/employees?role=driver`);
      const data = await response.json();
      const driverList = Array.isArray(data) ? data : data.employees || [];
      setDrivers((prev) => {
        if (JSON.stringify(prev) !== JSON.stringify(driverList)) {
          return driverList;
        }
        return prev;
      });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/dispatch1/stats`);
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchStatsQuiet = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/dispatch1/stats`);
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchOrderDetails = async (orderId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/dispatch1/order/${orderId}`
      );
      const data = await response.json();
      setOrderDetails(data);
      setSelectedOrder(orderId);
      setSelectedDriver(null);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchOrderDetailsQuiet = async (orderId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/dispatch1/order/${orderId}`
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

  const assignDriver = async () => {
    if (!selectedDriver) {
      alert("Please select a driver");
      return;
    }

    try {
      const driver = drivers.find((d) => d._id === selectedDriver);
      const response = await fetch(
        `${API_BASE_URL}/api/dispatch1/assign-driver/${selectedOrder}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            driverId: selectedDriver,
            employeeId: EMPLOYEE_ID,
            employeeName: employeeInfo?.name || "Dispatch Officer 1",
            assignedDriver: {
              employeeId: driver.employeeId,
              employeeName: driver.name,
              phone: driver.phone?.[0],
              vehicleType: driver.assignedVehicle?.vehicleType,
            },
            verificationDetails: {
              driverAvailable: driver.isAvailable,
              driverWorkload: `${driver.currentAssignments}/${driver.maxAssignments}`,
              verifiedBy: employeeInfo?.name,
              timestamp: new Date(),
            },
          }),
        }
      );

      if (response.ok) {
        alert(`Driver ${driver.name} assigned successfully!`);
        setSelectedOrder(null);
        setOrderDetails(null);
        setSelectedDriver(null);
        fetchReadyOrders();
        fetchStats();
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to assign driver");
    }
  };

  const availableDrivers = drivers.filter(
    (d) => d.isAvailable && d.currentAssignments < d.maxAssignments
  );

  return (
    <div className="space-y-6">
      {/* Employee Info */}
      {employeeInfo && (
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <p className="text-sm">
            <strong>Dispatch Officer 1:</strong> {employeeInfo.name}
          </p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-yellow-600 rounded-lg p-4 text-white">
          <p className="text-sm opacity-90">Ready for Assignment</p>
          <p className="text-3xl font-bold mt-1">{stats.readyForAssignment}</p>
        </div>
        <div className="bg-green-600 rounded-lg p-4 text-white">
          <p className="text-sm opacity-90">Assigned</p>
          <p className="text-3xl font-bold mt-1">{stats.assigned}</p>
        </div>
        <div className="bg-blue-600 rounded-lg p-4 text-white">
          <p className="text-sm opacity-90">Pending</p>
          <p className="text-3xl font-bold mt-1">{stats.pending}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Orders */}
        <div className="bg-white rounded-lg shadow">
          <div className="bg-gray-800 text-white p-4 flex items-center space-x-2 rounded-t-lg">
            <Users className="h-5 w-5" />
            <h3 className="font-bold">Ready for Dispatch</h3>
          </div>

          {loading ? (
            <div className="p-8 text-center text-gray-500">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : readyOrders.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p>No orders ready for dispatch</p>
            </div>
          ) : (
            <div className="divide-y max-h-96 overflow-y-auto">
              {readyOrders.map((order) => (
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
                  <p className="text-xs text-gray-600 mt-1 line-clamp-1">
                    {order.deliveryAddress}
                  </p>
                  <span className="inline-block mt-2 px-2 py-1 text-xs font-semibold bg-yellow-100 text-yellow-800 rounded">
                    Ready
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

              {/* Delivery Info */}
              <div className="border-t pt-4 bg-gray-50 p-3 rounded">
                <p className="text-sm">
                  <strong>Phone:</strong> {orderDetails.customerPhone}
                </p>
                <p className="text-sm">
                  <strong>Address:</strong> {orderDetails.deliveryAddress}
                </p>
                <p className="text-sm">
                  <strong>Items:</strong> {orderDetails.items?.length || 0}
                </p>
                <p className="text-sm">
                  <strong>Amount:</strong> PKR{" "}
                  {orderDetails.totalAmount?.toFixed(2) || "0.00"}
                </p>
              </div>

              {/* Items */}
              <div className="border-t pt-4">
                <h4 className="font-bold text-gray-900 mb-3">Items</h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {orderDetails.items?.map((item, idx) => (
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

              {/* Driver Selection */}
              <div className="border-t pt-4">
                <h4 className="font-bold text-gray-900 mb-3">Assign Driver</h4>
                {availableDrivers.length === 0 ? (
                  <p className="text-sm text-gray-600">No available drivers</p>
                ) : (
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {availableDrivers.map((driver) => (
                      <button
                        key={driver._id}
                        onClick={() => setSelectedDriver(driver._id)}
                        className={`w-full p-3 rounded border-2 transition text-left ${
                          selectedDriver === driver._id
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <p className="font-semibold text-gray-900">
                          {driver.name}
                        </p>
                        <p className="text-xs text-gray-600">
                          {driver.phone?.[0] || "N/A"}
                        </p>
                        <p className="text-xs text-gray-600">
                          Workload: {driver.currentAssignments}/
                          {driver.maxAssignments}
                        </p>
                        {driver.assignedVehicle && (
                          <p className="text-xs text-gray-600">
                            Vehicle: {driver.assignedVehicle.vehicleType}
                          </p>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Action */}
              <div className="border-t pt-4">
                <button
                  onClick={assignDriver}
                  disabled={!selectedDriver}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  <CheckCircle className="h-4 w-4" />
                  <span>Assign Driver</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
              <User className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Select an order to assign a driver</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DispatchOfficer1Dashboard;
