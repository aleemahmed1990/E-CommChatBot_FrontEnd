import { useState } from "react";
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

export default function ScooterDelivery() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const [activeTimeSlotOrder, setActiveTimeSlotOrder] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");

  // Dummy data
  const drivers = [
    { id: 1, name: "John Smith" },
    { id: 2, name: "Sarah Johnson" },
    { id: 3, name: "Mike Wilson" },
    { id: 4, name: "Emma Davis" },
    { id: 5, name: "Robert Taylor" },
  ];
  const areas = [
    "North Bali",
    "South Bali",
    "East Bali",
    "West Bali",
    "Central Bali",
  ];
  const pickupTypes = ["Standard", "Express", "Same-day", "Scheduled"];
  const orders = [
    {
      id: "12A",
      customer: "Frank Smith",
      address: "A-656, Street Abcd",
      amount: "$123",
      items: [
        { name: "Lucky Cement", quantity: "2 bags" },
        { name: "Golden Screws", quantity: "1 bag" },
      ],
      deliveryTime: "Jan 31, 2025 9:00 AM",
      allocationStatus: "",
      requestedTime: "morning 6-9 am",
    },
    {
      id: "12A",
      customer: "Frank Smith",
      address: "A-656, Street Abcd",
      amount: "$123",
      items: [
        { name: "Lucky Cement", quantity: "2 bags" },
        { name: "Golden Screws", quantity: "1 bag" },
      ],
      deliveryTime: "Jan 31, 2025 10:00 AM",
      allocationStatus: "Lucky Cement, Golden Screws",
      requestedTime: "morning 6-9 am",
    },
    {
      id: "12A",
      customer: "Frank Smith",
      address: "A-656, Street Abcd",
      amount: "$123",
      items: [
        { name: "Lucky Cement", quantity: "2 bags" },
        { name: "Golden Screws", quantity: "1 bag" },
      ],
      deliveryTime: "Jan 31, 2025 11:00 AM",
      allocationStatus: "",
      requestedTime: "morning 6-9 am",
    },
  ];

  // Form state
  const [selectedArea, setSelectedArea] = useState("North Bali");
  const [selectedDriver1, setSelectedDriver1] = useState("");
  const [selectedDriver2, setSelectedDriver2] = useState("");
  const [selectedPickupType, setSelectedPickupType] = useState("");

  // Truck orders state
  const [truckOrders, setTruckOrders] = useState({
    "6am-9am": [
      {
        id: "1234",
        items: [
          { name: "Lucky Cement", quantity: "1 kg", onTruck: false },
          { name: "Golden screws", quantity: "1 bag", onTruck: true },
        ],
        status: "Fully allocated",
        truckOnDeliver: false,
      },
    ],
    "930am-1pm": [
      {
        id: "1234",
        items: [
          { name: "Lucky Cement", quantity: "1 kg", onTruck: false },
          { name: "Golden screws", quantity: "1 bag", onTruck: false },
        ],
        status: "Fully allocated",
        truckOnDeliver: false,
      },
    ],
  });

  // Navigation handlers
  const handleViewOrderDetails = (orderId) => {
    navigate("/order-details");
  };
  const handleManagedelivery = () => {
    navigate("/delivery-orders");
  };
  const handleManagePickup = () => {
    navigate("/pickup-orders");
  };
  const handleManageScooterDelivery = () => {
    navigate("/scooter-delivery");
  };

  // Time-slot allocation
  const handleToggleTimeSlotSelection = (orderId) =>
    setActiveTimeSlotOrder(activeTimeSlotOrder === orderId ? null : orderId);
  const handleSelectTimeSlot = (timeSlot) => setSelectedTimeSlot(timeSlot);
  const handleDoneTimeSlot = () => {
    console.log(
      `Order ${activeTimeSlotOrder} allocated to ${selectedTimeSlot}`
    );
    setActiveTimeSlotOrder(null);
  };

  // Truck checkboxes
  const toggleProductOnTruck = (slotKey, orderIndex, itemIndex) => {
    const updated = { ...truckOrders };
    updated[slotKey][orderIndex].items[itemIndex].onTruck =
      !updated[slotKey][orderIndex].items[itemIndex].onTruck;
    setTruckOrders(updated);
  };
  const toggleTruckOnDeliver = (slotKey, orderIndex) => {
    const updated = { ...truckOrders };
    updated[slotKey][orderIndex].truckOnDeliver =
      !updated[slotKey][orderIndex].truckOnDeliver;
    setTruckOrders(updated);
  };

  // Modal for choosing a time slot
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
                  options: pickupTypes,
                  placeholder: "Select type",
                },
                {
                  label: "Driver 1",
                  value: selectedDriver1,
                  onChange: setSelectedDriver1,
                  options: drivers.map((d) => ({ label: d.name, value: d.id })),
                  placeholder: "Select driver",
                },
                {
                  label: "Driver 2",
                  value: selectedDriver2,
                  onChange: setSelectedDriver2,
                  options: drivers.map((d) => ({ label: d.name, value: d.id })),
                  placeholder: "Select driver",
                },
              ].map(({ label, value, onChange, options, placeholder }) => (
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
                      {placeholder && <option value="">{placeholder}</option>}
                      {options.map((opt) =>
                        typeof opt === "string" ? (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ) : (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        )
                      )}
                    </select>
                    <ChevronDown className="absolute right-2 top-3 w-4 h-4 text-gray-500" />
                  </div>
                </div>
              ))}
            </div>

            {/* Truck orders */}
            <div className="mb-8 space-y-6">
              {Object.entries(truckOrders).map(([slot, ordersInSlot]) => (
                <div key={slot}>
                  <div className="bg-gray-300 p-2 rounded-t-md">
                    <h3 className="font-medium uppercase">{slot}</h3>
                  </div>
                  <div className="border rounded-b-md">
                    <div className="p-2 border-b text-sm text-gray-600 flex items-center gap-1">
                      <Package className="w-4 h-4" />
                      <span>Orders on truck</span>
                      <span className="text-xs text-gray-500 ml-1">
                        (allocated appear here)
                      </span>
                    </div>
                    {ordersInSlot.map((order, idx) => (
                      <div
                        key={idx}
                        className="p-2 border-b last:border-0 bg-white"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">Order {order.id}</span>
                          <span className="text-xs text-gray-500">
                            {order.status}
                          </span>
                        </div>
                        {order.items.map((item, i) => (
                          <div
                            key={i}
                            className="flex justify-between items-center py-2"
                          >
                            <div className="flex items-center gap-3">
                              <Package className="w-6 h-6 text-gray-700" />
                              <div>
                                <div className="font-medium">{item.name}</div>
                                <div className="text-sm text-gray-500">
                                  Qty: {item.quantity}
                                </div>
                              </div>
                            </div>
                            <label className="flex items-center gap-1">
                              <input
                                type="checkbox"
                                className="h-4 w-4"
                                checked={item.onTruck}
                                onChange={() =>
                                  toggleProductOnTruck(slot, idx, i)
                                }
                              />
                              <span className="text-sm">products on truck</span>
                            </label>
                          </div>
                        ))}
                        <div className="mt-4 pt-2 border-t border-gray-300 flex justify-end">
                          <label className="flex items-center gap-1">
                            <input
                              type="checkbox"
                              className="h-4 w-4"
                              checked={order.truckOnDeliver}
                              onChange={() => toggleTruckOnDeliver(slot, idx)}
                            />
                            <span className="text-sm">Truck on Delivery</span>
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Orders table */}
            <div>
              <p className="mb-2 text-sm text-gray-600">
                Showing all orders of {selectedArea.toLowerCase()}
              </p>
              <div className="border rounded-md overflow-x-auto bg-white">
                <table className="min-w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-3 w-12"></th>
                      <th className="p-3 text-left">Delivery Time</th>
                      <th className="p-3 text-left">Tr ID</th>
                      <th className="p-3 text-left">Customer</th>
                      <th className="p-3 text-left">Address</th>
                      <th className="p-3 text-left">Amount</th>
                      <th className="p-3 text-left">Items</th>
                      <th className="p-3 text-left">Allocation</th>
                      <th className="p-3 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order, i) => (
                      <tr
                        key={i}
                        className={
                          i === 0
                            ? "bg-green-50"
                            : i === 1
                            ? "bg-yellow-50"
                            : "bg-white"
                        }
                      >
                        <td className="p-3 border-r">
                          <button
                            className="text-gray-500"
                            onClick={() =>
                              handleToggleTimeSlotSelection(order.id)
                            }
                          >
                            <MoreVertical className="w-5 h-5" />
                          </button>
                        </td>
                        <td className="p-3 border-r">{order.deliveryTime}</td>
                        <td className="p-3 border-r">{order.id}</td>
                        <td className="p-3 border-r">{order.customer}</td>
                        <td className="p-3 border-r">{order.address}</td>
                        <td className="p-3 border-r">{order.amount}</td>
                        <td className="p-3 border-r">
                          {order.items.map((itm, ix) => (
                            <div key={ix}>
                              {itm.name}{" "}
                              <span className="text-gray-500">
                                {itm.quantity}
                              </span>
                            </div>
                          ))}
                        </td>
                        <td className="p-3 border-r">
                          {order.allocationStatus}
                        </td>
                        <td className="p-3">
                          <div className="flex flex-col gap-1">
                            <button
                              className="text-indigo-600 text-sm"
                              onClick={() => handleViewOrderDetails(order.id)}
                            >
                              View Details
                            </button>
                            <button
                              className="text-indigo-600 text-sm"
                              onClick={() => handleViewOrderDetails(order.id)}
                            >
                              Allocate
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-center items-center mt-6 gap-4">
                <ArrowLeft className="w-5 h-5 text-red-500" />
                <hr className="w-32 border-t-2 border-red-500" />
              </div>
              <p className="text-center mt-2 text-sm text-gray-600">
                allocate all or partial allocation
              </p>
            </div>
          </main>
        </div>
      </div>

      <TimeSlotModal />
    </div>
  );
}
