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
} from "lucide-react";

export default function OrderManagementDelivery() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();

  // Dummy data for drivers
  const drivers = [
    { id: 1, name: "John Smith" },
    { id: 2, name: "Sarah Johnson" },
    { id: 3, name: "Mike Wilson" },
    { id: 4, name: "Emma Davis" },
    { id: 5, name: "Robert Taylor" },
  ];

  // Dummy data for areas
  const areas = [
    "North Bali",
    "South Bali",
    "East Bali",
    "West Bali",
    "Central Bali",
  ];

  // Dummy data for pickup types
  const pickupTypes = ["Standard", "Express", "Same-day", "Scheduled"];

  // Dummy orders data
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
    },
  ];

  // State for form inputs
  const [selectedArea, setSelectedArea] = useState("North Bali");
  const [selectedDriver1, setSelectedDriver1] = useState("");
  const [selectedDriver2, setSelectedDriver2] = useState("");
  const [selectedPickupType, setSelectedPickupType] = useState("");

  // Dummy truck orders
  const truckOrders = {
    "6am-9am": [
      {
        id: "1234",
        items: [
          { name: "Lucky Cement", quantity: "1 kg" },
          { name: "Golden screws", quantity: "1 bag" },
        ],
        status: "Fully allocated",
      },
    ],
    "930am-1pm": [
      {
        id: "1234",
        items: [
          { name: "Lucky Cement", quantity: "1 kg" },
          { name: "Golden screws", quantity: "1 bag" },
        ],
        status: "Fully allocated",
      },
    ],
  };

  const handleViewOrderDetails = (orderId) => {
    navigate(`/order-details`);
  };

  const handleManagePickup = () => {
    navigate("/pickup-orders");
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {/* Main Content */}
      <div
        className={`transition-all duration-300 ${
          isSidebarOpen ? "lg:ml-80" : ""
        } w-full bg-gray-50 p-4`}
      >
        <div className="min-h-screen bg-gray-100">
          <header className="bg-gray-800 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="ml-4 text-lg font-medium">
                4.Order management delivery
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative"></div>
            </div>
          </header>

          <main className="p-4 max-w-6xl mx-auto">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-6 rounded-xl mb-6 flex justify-center">
              <button
                className="flex items-center gap-2 bg-white text-indigo-600 px-5 py-3 rounded-full shadow-lg hover:bg-gray-100"
                onClick={handleManagePickup}
              >
                <Truck className="w-5 h-5" />
                Manage Pickup Orders
              </button>
            </div>

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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium mb-1">Area</label>
                <div className="relative">
                  <select
                    className="w-full p-2 border rounded-md pr-8 appearance-none bg-white"
                    value={selectedArea}
                    onChange={(e) => setSelectedArea(e.target.value)}
                  >
                    {areas.map((area) => (
                      <option key={area} value={area}>
                        {area}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 top-3 w-4 h-4 text-gray-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Pickup Type
                </label>
                <div className="relative">
                  <select
                    className="w-full p-2 border rounded-md pr-8 appearance-none bg-white"
                    value={selectedPickupType}
                    onChange={(e) => setSelectedPickupType(e.target.value)}
                  >
                    <option value="">Select type</option>
                    {pickupTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 top-3 w-4 h-4 text-gray-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Driver 1
                </label>
                <div className="relative">
                  <select
                    className="w-full p-2 border rounded-md pr-8 appearance-none bg-white"
                    value={selectedDriver1}
                    onChange={(e) => setSelectedDriver1(e.target.value)}
                  >
                    <option value="">Select driver</option>
                    {drivers.map((driver) => (
                      <option key={driver.id} value={driver.id}>
                        {driver.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 top-3 w-4 h-4 text-gray-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Driver 2
                </label>
                <div className="relative">
                  <select
                    className="w-full p-2 border rounded-md pr-8 appearance-none bg-white"
                    value={selectedDriver2}
                    onChange={(e) => setSelectedDriver2(e.target.value)}
                  >
                    <option value="">Select driver</option>
                    {drivers.map((driver) => (
                      <option key={driver.id} value={driver.id}>
                        {driver.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 top-3 w-4 h-4 text-gray-500" />
                </div>
              </div>
            </div>

            <div className="mb-8 space-y-6">
              {Object.entries(truckOrders).map(([slot, orders]) => (
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
                    {orders.map((order, idx) => (
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
                            <div className="flex items-center gap-4">
                              <CheckCircle className="w-5 h-5 text-green-500" />
                              <span className="text-sm">On Truck</span>
                              <Truck className="w-5 h-5 text-blue-500" />
                              <span className="text-sm">In Transit</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

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
                          <button className="text-gray-500">
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
    </div>
  );
}
