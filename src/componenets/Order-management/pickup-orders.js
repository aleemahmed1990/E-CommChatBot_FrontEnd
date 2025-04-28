import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Sidebar/sidebar";
import {
  ChevronDown,
  AlertCircle,
  MoreVertical,
  ArrowLeft,
  Package,
  Phone,
  Check,
} from "lucide-react";

export default function OrderManagementPickup() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const [orderReadyStatus, setOrderReadyStatus] = useState({
    "6am-9am": false,
    "930am-1pm": false,
  });

  // Dummy data for table
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

  // Dummy pickup orders per slot
  const pickupOrders = {
    "6am-9am": {
      id: "1234",
      items: [
        { name: "Lucky Cement", quantity: "1 kg" },
        { name: "Golden Screws", quantity: "1 bag" },
      ],
    },
    "930am-1pm": {
      id: "1234",
      items: [
        { name: "Lucky Cement", quantity: "1 kg" },
        { name: "Golden Screws", quantity: "1 bag" },
      ],
    },
  };

  const handleManageDelivery = () => {
    navigate("/delivery-orders");
  };
  const handleManagePickup = () => {
    navigate("/pickup-orders");
  };

  const handleViewOrderDetails = (orderId) => {
    navigate(`/order-details`);
  };

  const handleCallCustomer = () => {
    console.log("Calling customer...");
  };

  const toggleOrderReady = (slot) => {
    setOrderReadyStatus((prev) => ({
      ...prev,
      [slot]: !prev[slot],
    }));
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      <div
        className={`transition-all duration-300 ${
          isSidebarOpen ? "lg:ml-80" : ""
        } w-full bg-gray-50 p-4`}
      >
        {/* Header */}
        <header className="bg-gray-800 text-white p-4 flex items-center">
          <div className="ml-4 text-lg font-medium">
            4B. Customer will pickup Order management
          </div>
        </header>

        <main className="p-4 max-w-6xl mx-auto">
          {/* CTA to Delivery */}
          <div className="mb-6 flex justify-center">
            <button
              className="flex items-center gap-2 bg-green-500 text-white px-5 py-3 rounded-full shadow hover:bg-green-600"
              onClick={handleManageDelivery}
            >
              4A Manage Delivery Orders
            </button>
            <button
              className="flex items-center ml-5 gap-2 bg-green-500 text-white px-5 py-3 rounded-full shadow hover:bg-green-600"
              onClick={handleManagePickup}
            >
              4B Manage Pickup orders
            </button>
          </div>

          {/* Alert */}
          <div className="bg-red-100 p-4 rounded-md mb-6 flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <p>Maximum allocation of orders per time slot is 10.</p>
          </div>

          {/* Big heading */}
          <h1 className="text-5xl font-bold text-black mb-10">pick up</h1>

          {/* Pickup slots with out-of-stock markup */}
          <div className="space-y-6 mb-8">
            {Object.entries(pickupOrders).map(([slot, data]) => {
              const fillMessage =
                slot === "6am-9am"
                  ? "unknown /24h fill stock"
                  : "24h fill stock";
              return (
                <div key={slot}>
                  <div className="bg-gray-300 p-2 rounded-t-md">
                    <h3 className="font-medium uppercase">{slot}</h3>
                  </div>
                  <div className="border rounded-b-md">
                    {/* Order header */}
                    <div className="p-2 border-b bg-white flex justify-between items-center">
                      <div className="text-sm">
                        <div>Order id# {data.id}</div>
                        <div>Fully allocated</div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div
                          className="flex items-center cursor-pointer"
                          onClick={() => toggleOrderReady(slot)}
                        >
                          <div
                            className={`w-6 h-6 flex items-center justify-center border rounded mr-2 ${
                              orderReadyStatus[slot]
                                ? "bg-amber-500 border-amber-500"
                                : "bg-white border-gray-300"
                            }`}
                          >
                            {orderReadyStatus[slot] && (
                              <Check className="w-4 h-4 text-white" />
                            )}
                          </div>
                          <span>products ready</span>
                        </div>
                        <button className="text-gray-500">
                          <MoreVertical className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    {/* Items list */}
                    {data.items.map((item, idx) => (
                      <div
                        key={idx}
                        className={`p-2 flex justify-between items-center border-b last:border-0 ${
                          idx > 0 ? "bg-red-100" : "bg-white"
                        }`}
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
                        {idx > 0 && (
                          <div className="flex flex-col items-end text-right">
                            <span className="font-bold">missing</span>
                            <span>out of stock</span>
                            <span>{fillMessage}</span>
                          </div>
                        )}
                      </div>
                    ))}
                    {/* Call button */}
                    <div className="p-2 flex justify-between">
                      <div className="text-sm text-gray-500">
                        call only if nothing to deliver
                      </div>
                      <button
                        className="flex items-center gap-1 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                        onClick={handleCallCustomer}
                      >
                        <Phone className="w-4 h-4" />
                        Call the customer
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Orders table */}
          <div>
            <p className="mb-2 text-sm text-gray-600">
              Showing all orders of north bali
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
                      <td className="p-3 border-r">{order.allocationStatus}</td>
                      <td className="p-3">
                        <button
                          className="text-indigo-600 text-sm"
                          onClick={() => handleViewOrderDetails(order.id)}
                        >
                          View Details
                        </button>
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
  );
}
