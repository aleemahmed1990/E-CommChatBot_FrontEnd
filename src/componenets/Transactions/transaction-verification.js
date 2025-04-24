import React, { useState } from "react";
import Sidebar from "../Sidebar/sidebar";
import {
  ChevronLeft,
  ChevronRight,
  User,
  ImageIcon,
  Package,
  Settings,
} from "lucide-react";

const VerificationView = ({ navigateTo }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedReason1, setSelectedReason1] = useState("");
  const [selectedReason2, setSelectedReason2] = useState("");

  const reasons1 = [
    "can not find the amount against the name from who and time",
    "Empty page",
    "Not clear text",
    "missing important page",
    "Not all page on it",
  ];

  const reasons2 = ["Looks fake / Seems scam", "want to double check", "other"];

  const timeline = [
    { color: "bg-green-500", label: "time", user: "Bill id user" },
    { color: "bg-red-500", label: "time", user: "Bill id user" },
    {
      color: "bg-gray-300",
      label: "time",
      user: "Bill id user",
      current: true,
    },
    { color: "bg-red-500", label: "time", user: "Bill id user" },
    { color: "bg-gray-300", label: "time", user: "Bill id user" },
    { color: "bg-gray-300", label: "time", user: "Bill id user" },
  ];

  return (
    <div className="flex">
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <div
        className={`transition-all duration-300 ${
          isSidebarOpen ? "ml-80" : ""
        } flex-1 bg-gray-50 p-6`}
      >
        {/* Header Buttons */}
        <div className="flex justify-end mb-4 space-x-2">
          <button
            onClick={() => navigateTo("transactionControl")}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            Go back to 2.b.0
          </button>
          <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium">
            Where it directs?
          </button>
        </div>

        {/* Timeline Navigation */}
        <div className="bg-white rounded-md p-4 mb-6">
          <p className="text-gray-700 text-sm mb-2">
            employee id number and name
          </p>
          <div className="flex items-center">
            <ChevronLeft className="h-6 w-6 text-gray-400" />
            <div className="flex-1 flex overflow-x-auto space-x-4 px-2">
              {timeline.map((item, idx) => (
                <div key={idx} className="flex flex-col items-center relative">
                  <div
                    className={`${item.color} w-20 h-16 flex items-center justify-center rounded-md`}
                  >
                    <span className="text-white text-sm font-medium">
                      {item.label}
                    </span>
                  </div>
                  {item.current && (
                    <span className="absolute -top-2 -right-2 block w-4 h-4 bg-red-500 rounded-full" />
                  )}
                  <p className="mt-2 text-gray-600 text-xs text-center">
                    {item.user}
                  </p>
                </div>
              ))}
            </div>
            <ChevronRight className="h-6 w-6 text-gray-400" />
          </div>
        </div>

        {/* Content Section */}
        <div className="bg-white rounded-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: User + Screenshot + Amount */}
            <div className="flex space-x-4">
              <div className="flex-shrink-0 text-center">
                <User className="h-12 w-12 text-gray-500 mx-auto" />
                <p className="mt-2 text-gray-600 text-xs">User id: 121</p>
                <p className="text-gray-600 text-xs">Receipt#: 125665</p>
              </div>
              <div className="flex-1">
                <h2 className="text-sm font-semibold mb-2 text-gray-700">
                  Transaction screenshot
                </h2>
                <div className="w-full h-40 bg-gray-100 flex items-center justify-center rounded-md mb-4">
                  <ImageIcon className="h-10 w-10 text-gray-400" />
                </div>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold">AMOUNT TO BE RECEIVED:</h3>
                  <span className="text-lg font-bold text-red-600">$110</span>
                </div>
                <button
                  onClick={() => navigateTo("bankAccount")}
                  className="mt-4 w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-md font-medium"
                >
                  Double check against account manually
                </button>
                <p className="mt-2 text-gray-600 text-sm">
                  Account no. sent from:
                </p>
                <p className="text-gray-600 text-sm">Bank name:</p>
              </div>
            </div>

            {/* Right: Approval Controls */}
            <div>
              <h3 className="text-gray-700 font-semibold mb-3">
                Final approval done by:
              </h3>
              <p className="text-gray-600 text-sm mb-6">
                Date and time: and who
              </p>
              <div className="flex space-x-2 mb-4">
                <button className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-md font-medium">
                  approved
                </button>
                <button className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-md font-medium">
                  Not approved
                </button>
                <button className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md font-medium">
                  send to higher responsible
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {/* Reasons Column 1 */}
                <div className="border rounded-md p-4">
                  <p className="font-medium mb-2 text-gray-700">
                    Why not approved? Select a reason and customer will be
                    notified
                  </p>
                  <div className="space-y-2 mb-3">
                    {reasons1.map((reason) => (
                      <label
                        key={reason}
                        className="flex items-center text-sm text-gray-600"
                      >
                        <input
                          type="radio"
                          name="reason1"
                          value={reason}
                          checked={selectedReason1 === reason}
                          onChange={() => setSelectedReason1(reason)}
                          className="mr-2"
                        />
                        {reason}
                      </label>
                    ))}
                  </div>
                  <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-md text-sm font-medium">
                    Save
                  </button>
                </div>
                {/* Reasons Column 2 */}
                <div className="border rounded-md p-4">
                  <p className="font-medium mb-2 text-gray-700">
                    Why not approved? Select a reason and customer will be
                    notified
                  </p>
                  <div className="space-y-2 mb-3">
                    {reasons2.map((reason) => (
                      <label
                        key={reason}
                        className="flex items-center text-sm text-gray-600"
                      >
                        <input
                          type="radio"
                          name="reason2"
                          value={reason}
                          checked={selectedReason2 === reason}
                          onChange={() => setSelectedReason2(reason)}
                          className="mr-2"
                        />
                        {reason}
                      </label>
                    ))}
                  </div>
                  {selectedReason2 === "other" && (
                    <input
                      type="text"
                      placeholder="Write down"
                      className="w-full border border-gray-300 rounded-md p-2 mb-3 text-sm"
                    />
                  )}
                  <button
                    onClick={() => navigateTo("bankAccount")}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-md text-sm font-medium"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Customer & Order Info */}
        <div className="bg-white rounded-md p-6">
          <h3 className="text-gray-700 font-semibold mb-4">
            Customer Information
          </h3>
          <div className="border rounded-md mb-6 p-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <p>google / whatsapp location</p>
              <p>name of property</p>
              <p>number to call</p>
            </div>
            <div>
              <p>name of person</p>
              <p>address</p>
              <p>delivery time date and hour slot</p>
            </div>
          </div>

          <h3 className="text-gray-700 font-semibold mb-4">
            order information
          </h3>
          <div className="border rounded-md p-4 space-y-4">
            <p className="text-sm">
              <span className="font-medium">Order date:</span> Jan 2, 2024 at
              9:00 AM
            </p>
            <p className="text-sm">
              <span className="font-medium">Payment method:</span> transfer
            </p>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Package className="w-12 h-12 text-gray-500" />
                  <div>
                    <p className="font-medium">Lucky Cement</p>
                    <p className="text-xs text-gray-600">Qty: 1 kg</p>
                  </div>
                </div>
                <p className="font-medium">$50</p>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Settings className="w-12 h-12 text-gray-500" />
                  <div>
                    <p className="font-medium">Golden screws</p>
                    <p className="text-xs text-gray-600">Qty: 1 bag</p>
                  </div>
                </div>
                <p className="font-medium">$50</p>
              </div>
            </div>

            <div className="pt-4 border-t space-y-2 text-sm text-gray-600">
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
                <span>$00</span>
              </div>
              <div className="flex justify-between">
                <span>Discount</span>
                <span>$00</span>
              </div>
              <div className="flex justify-between font-bold text-gray-800">
                <span>Total</span>
                <span>$110</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationView;
