import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Sidebar/sidebar";
import {
  Home,
  ArrowLeft,
  MessageCircle,
  User,
  Edit,
  Package,
  AlertCircle,
  Circle,
} from "lucide-react";

export default function OrderDetails() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();

  // Timeline events in reverse chronological order
  const events = [
    {
      label: "Order returned Nov 5th, 2025 at 11:10 PM",
      notes: [
        "2.2.2025 at 4:00 PM: Driver: customer return it saying its damaged",
        "2.2.2025 at 3:50 PM: Driver: customer return it saying its damaged",
      ],
    },
    { label: "Order delivered Nov 5th, 2025 at 11:00 PM", notes: [] },
    { label: "Order on the way Nov 5th, 2025 at 10:00 PM", notes: [] },
    { label: "Order shipped Nov 5th, 2025 at 9:00 PM", notes: [] },
    { label: "Order picked Nov 4th, 2025 at 9:00 PM", notes: [] },
    { label: "Order processing Nov 4th, 2025 at 7:00 PM", notes: [] },
    {
      label: "Order confirmed via cash transfer Nov 3rd, 2025 at 9:00 AM",
      notes: [],
    },
    { label: "Order placed Nov 3rd, 2025 at 7:00 AM", notes: [] },
  ];

  return (
    <div className="flex min-h-screen">
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      <div
        className={`transition-all duration-300 ${
          isSidebarOpen ? "lg:ml-80" : ""
        } w-full bg-[#f3f0ff]`}
      >
        {/* Header */}
        <header className="bg-gray-800 text-white p-4 flex items-center gap-4">
          <Home className="w-5 h-5" />
          <h1 className="text-lg font-medium">Order details</h1>
        </header>

        <main className="p-6 space-y-8">
          {/* Order summary */}
          <section className="bg-white p-4 rounded-md border">
            <h2 className="text-2xl font-bold">Order #123WA</h2>
            <div className="mt-2 grid grid-cols-4 text-sm text-gray-600 gap-4">
              <div>Placed on Jan 31, 2025 at 9:08 PM</div>
              <div>3 items</div>
              <div>Amount $300</div>
              <div className="text-right">
                <span className="inline-block bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-xs font-semibold">
                  Order Confirmed
                </span>
              </div>
            </div>
            <div className="mt-4 flex gap-2 justify-end">
              <button
                className="bg-gray-700 text-white px-4 py-2 rounded-md"
                onClick={() => navigate("/driver-chat")}
              >
                View driver chat
              </button>
              <button
                className="bg-yellow-500 text-black px-4 py-2 rounded-md"
                onClick={() => navigate("/customer-chat")}
              >
                View customer chat
              </button>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-md ml-4"
                onClick={() => navigate("/delivery-orders")}
              >
                Manage All-orders
              </button>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-md ml-4"
                onClick={() => navigate("/non-delivered-orders")}
              >
                View non-delivered orders
              </button>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-md ml-4"
                onClick={() => navigate("/view-refunds")}
              >
                View Refunds
              </button>
            </div>
          </section>

          {/* Items and Notes */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Items Card */}
            <div className="col-span-2 bg-white p-4 rounded-md border space-y-4">
              <h3 className="font-semibold text-lg">Items</h3>
              {[
                { name: "Lucky Cement", qty: "1 kg", price: "$50" },
                { name: "Golden screws", qty: "1 bag", price: "$50" },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Package className="w-12 h-12 text-gray-700" />
                    <div>
                      View Refunds
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-gray-500">
                        Qty: {item.qty}
                      </div>
                    </div>
                  </div>
                  <div className="font-semibold">{item.price}</div>
                </div>
              ))}
              <div className="mt-6 space-y-2 text-sm text-gray-500">
                <div className="flex justify-between">
                  <span>Sub total</span>
                  <span>$100</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping fees</span>
                  <span>$10</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax fees</span>
                  <span>$0</span>
                </div>
                <div className="flex justify-between">
                  <span>Discount</span>
                  <span>$0</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>$110</span>
                </div>
              </div>
            </div>

            {/* Notes Card */}
            <div className="bg-white p-4 rounded-md border space-y-4">
              <h3 className="font-semibold text-lg flex justify-between items-center">
                Notes
                <Edit className="w-4 h-4 text-gray-500 cursor-pointer" />
              </h3>
              {[
                {
                  time: "2.2.2025 at 4:00 PM",
                  text: "Driver delivered the order but customer return it saying its damaged",
                },
                {
                  time: "2.2.2025 at 4:05 PM",
                  text: "Driver says I am bringing it back",
                },
              ].map((note, i) => (
                <div key={i} className="bg-gray-100 p-2 rounded">
                  <div className="text-gray-600 text-xs">{note.time}</div>
                  <div>{note.text}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Transaction Card */}
          <section className="bg-white p-4 rounded-md border space-y-4">
            <h3 className="font-semibold text-lg">Transaction</h3>
            <table className="w-full text-sm">
              <thead className="border-b">
                <tr className="text-left">
                  <th className="p-2">transaction id</th>
                  <th className="p-2">date</th>
                  <th className="p-2">amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-2">123</td>
                  <td className="p-2">Jan 3, 2025</td>
                  <td className="p-2">$300</td>
                </tr>
                <tr className="border-t font-semibold">
                  <td className="p-2"></td>
                  <td className="p-2">Total</td>
                  <td className="p-2">$300</td>
                </tr>
              </tbody>
            </table>
          </section>

          {/* Customer Information Card */}
          <section className="bg-white p-4 rounded-md border space-y-4">
            <h3 className="font-semibold text-lg">Customer Information</h3>
            <div className="flex items-center gap-4">
              <User className="w-16 h-16 text-gray-400" />
              <div>
                <div className="font-medium">Jeny Solice</div>
                <div className="text-sm text-gray-500">contact 1234567677</div>
                <div className="text-sm text-gray-500">jeny@gmail.com</div>
              </div>
            </div>
            <div className="mt-2 text-sm">
              <div className="font-semibold">Address</div>
              <div>Jessica Moore</div>
              <div>Random Federation</div>
              <div>115302, Moscow</div>
              <div>ul. Varshavskaya, 15-2-178</div>
            </div>
          </section>

          {/* Order Status Timeline */}
          <section className="bg-white p-4 rounded-md border">
            <h3 className="font-semibold text-lg mb-6">Order Status</h3>
            <div className="relative pl-6">
              <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-orange-500"></div>

              {events.map((event, idx) => (
                <div key={idx} className="mb-12">
                  <div className="flex items-center mb-4">
                    <Circle className="w-3 h-3 text-orange-500" />
                    <div className="ml-4 font-medium">{event.label}</div>
                  </div>
                  {event.notes.map((note, j) => (
                    <div
                      key={j}
                      className="bg-orange-100 p-2 rounded mb-4 ml-8 text-sm"
                    >
                      {note}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
