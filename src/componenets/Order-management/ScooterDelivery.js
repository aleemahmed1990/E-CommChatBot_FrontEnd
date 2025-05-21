import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Sidebar/sidebar";
import {
  ChevronDown,
  Clock,
  AlertCircle,
  MoreVertical,
  ArrowLeft,
  Package,
  CheckCircle,
  Truck,
  Bike,
} from "lucide-react";
import axios from "axios";

export default function ScooterDelivery() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const [activeTimeSlotOrder, setActiveTimeSlotOrder] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [orders, setOrders] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [selectedArea, setSelectedArea] = useState("North Bali");
  const [selectedDriver1, setSelectedDriver1] = useState("");
  const [selectedDriver2, setSelectedDriver2] = useState("");
  const [selectedPickupType, setSelectedPickupType] = useState("three-wheeler");

  // Hardcoded data for area and pickup type
  const areas = [
    "North Bali",
    "South Bali",
    "East Bali",
    "West Bali",
    "Central Bali",
  ];

  // Fetch orders and drivers from the backend
  useEffect(() => {
    const fetchOrders = async () => {
      const { data } = await axios.get("http://localhost:5000/api/orders", {
        params: {
          status: "order-confirmed",
          deliveryType: "scooter", // Only fetch orders with scooter delivery type
        },
      });
      setOrders(data.orders);
    };

    const fetchDrivers = async () => {
      const { data } = await axios.get("http://localhost:5000/api/employees", {
        params: { employeeCategory: "Driver" },
      });
      setDrivers(data.data);
    };

    fetchOrders();
    fetchDrivers();
  }, []);

  const handleViewOrderDetails = (orderId) => {
    navigate("/order-details");
  };

  const handleManagePickup = () => {
    navigate("/pickup-orders");
  };
  const handleManagedelivery = () => {
    navigate("/delivery-orders");
  };
  const handleManageScooterDelivery = () => {
    navigate("/scooter-delivery");
  };

  const handleToggleTimeSlotSelection = (orderId) => {
    if (activeTimeSlotOrder === orderId) {
      setActiveTimeSlotOrder(null);
    } else {
      setActiveTimeSlotOrder(orderId);
    }
  };

  const handleSelectTimeSlot = (timeSlot) => {
    setSelectedTimeSlot(timeSlot);
  };

  const handleDoneTimeSlot = async () => {
    // Update the order with selected time slot and status
    await axios.put(
      `http://localhost:5000/api/orders/${activeTimeSlotOrder}/status`,
      {
        status: "allocated-driver",
        timeSlot: selectedTimeSlot,
        driver1: selectedDriver1,
        driver2: selectedDriver2,
        pickupType: selectedPickupType,
        truckOnDeliver: false, // Set truck on delivery to false initially
      }
    );

    // Remove the order from the table and add it to the respective timeslot
    setOrders(orders.filter((order) => order.id !== activeTimeSlotOrder));
    setActiveTimeSlotOrder(null);
  };

  const toggleTruckOnDeliver = async (orderId) => {
    const order = orders.find((o) => o.id === orderId);
    if (order) {
      const updatedOrder = { ...order, truckOnDeliver: !order.truckOnDeliver };
      await axios.put(`http://localhost:5000/api/orders/${orderId}/status`, {
        status: "allocated-driver",
        truckOnDeliver: updatedOrder.truckOnDeliver,
      });
      setOrders(orders.map((o) => (o.id === orderId ? updatedOrder : o)));
    }
  };

  // Modal overlay for time slot selection
  const TimeSlotModal = () => {
    if (!activeTimeSlotOrder) return null;

    const order = orders.find((o) => o.id === activeTimeSlotOrder) || {};

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-md p-6 w-96 max-w-full">
          <div className="mb-3 font-medium text-red-500">
            requested time of delivery:{" "}
            {order.requestedTime || "morning 6-9 am"}
          </div>
          <div className="mb-3 font-medium">
            Which time slots do you want to allocate this order?
          </div>
          <div className="space-y-2">
            {[
              { label: "7:00 to 9:00 AM", desc: "in the morning" },
              { label: "9:30 to 11:00 AM", desc: "in the morning" },
              { label: "11:30 to 2:00 PM", desc: "Later" },
            ].map(({ label, desc }) => (
              <label
                key={label}
                className="flex items-center border rounded-md p-2 cursor-pointer"
              >
                <input
                  type="radio"
                  name="timeSlot"
                  className="h-4 w-4 text-orange-500"
                  onChange={() => handleSelectTimeSlot(label)}
                  checked={selectedTimeSlot === label}
                />
                <span className="ml-2">
                  {label} {desc}
                </span>
              </label>
            ))}
          </div>
          <div className="mt-4 flex justify-end">
            <button
              className="bg-blue-500 text-white px-4 py-1 rounded-md"
              onClick={handleDoneTimeSlot}
            >
              Done
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {/* Main content */}
      <div
        className={`transition-all duration-300 ${
          isSidebarOpen ? "lg:ml-80" : ""
        } w-full bg-gray-50 p-4`}
      >
        <div className="min-h-screen bg-gray-100">
          <header className="bg-gray-800 text-white p-4 flex items-center justify-between">
            <div className="ml-4 text-lg font-medium">4C.Scooter Delivery</div>
          </header>

          <main className="p-4 max-w-6xl mx-auto">
            {/* Buttons */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-6 rounded-xl mb-6 flex justify-center">
              <button
                className="flex items-center gap-2 bg-white text-indigo-600 px-5 py-3 rounded-full shadow-lg hover:bg-gray-100"
                onClick={handleManagedelivery}
              >
                <Truck className="w-5 h-5" />
                4A Manage Delivery Orders
              </button>
              <button
                className="flex items-center gap-2 ml-5 bg-white text-indigo-600 px-5 py-3 rounded-full shadow-lg hover:bg-gray-100"
                onClick={handleManagePickup}
              >
                <CheckCircle className="w-5 h-5" />
                4B Manage Pickup Orders
              </button>
              <button
                className="flex items-center gap-2 ml-5 bg-white text-indigo-600 px-5 py-3 rounded-full shadow-lg hover:bg-gray-100"
                onClick={handleManageScooterDelivery}
              >
                <Bike className="w-5 h-5" />
                4C Scooter Delivery
              </button>
            </div>

            {/* Alerts */}
            <div className="bg-orange-100 p-4 rounded-md mb-4 flex items-start gap-2">
              <Clock className="w-5 h-5 text-orange-500" />
              <p>
                Pick a driver, select date, then allocate orders for that area.
              </p>
            </div>
            <div className="bg-red-100 p-4 rounded-md mb-6 flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <p>Max allocation per slot is 10 orders.</p>
            </div>

            <h1 className="text-5xl font-bold text-black mb-10">
              {" "}
              <Bike className="w-20 h-20 text-gray-700" />
              Scooter Delivery
            </h1>
            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              {[
                {
                  label: "Area",
                  value: selectedArea,
                  onChange: setSelectedArea,
                  options: areas,
                },
                {
                  label: "Pickup Type",
                  value: selectedPickupType,
                  onChange: setSelectedPickupType,
                  options: [
                    "Three-wheeler",
                    "Scooter heavy delivery",
                    "Scooter",
                  ],
                },
                {
                  label: "Driver 1",
                  value: selectedDriver1,
                  onChange: setSelectedDriver1,
                  options: drivers.map((d) => ({ label: d.name, value: d.id })),
                },
                {
                  label: "Driver 2",
                  value: selectedDriver2,
                  onChange: setSelectedDriver2,
                  options: drivers.map((d) => ({ label: d.name, value: d.id })),
                },
              ].map(({ label, value, onChange, options }) => (
                <div key={label}>
                  <label className="block text-sm font-medium mb-1">
                    {label}
                  </label>
                  <div className="relative">
                    <select
                      className="w-full p-2 border rounded-md pr-8 appearance-none bg-white"
                      value={value}
                      onChange={(e) => onChange(e.target.value)}
                    >
                      {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-2 top-3 w-4 h-4 text-gray-500" />
                  </div>
                </div>
              ))}
            </div>

            {/* Orders Table */}
            <div className="mb-8 space-y-6">
              {orders.length === 0 ? (
                <div className="text-center p-4 text-gray-500">
                  No orders available right now.
                </div>
              ) : (
                orders.map((order) => (
                  <div key={order.id}>
                    <div className="p-2 border-b last:border-0">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">Order {order.id}</span>
                        <span className="text-xs text-gray-500">
                          {order.status}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span>{order.customer}</span>
                        <button
                          className="text-indigo-600 text-sm"
                          onClick={() =>
                            handleToggleTimeSlotSelection(order.id)
                          }
                        >
                          Allocate
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Time slot selection modal */}
      <TimeSlotModal />
    </div>
  );
}
