// Enhanced AllDeliveryComplaints.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Home,
  ArrowRight,
  Check,
  MoreVertical,
  User,
  Package,
} from "lucide-react";
import Sidebar from "../Sidebar/sidebar";
import axios from "axios";

const AllDeliveryComplaints = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [complaints, setComplaints] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchComplaints();
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    try {
      const { data } = await axios.get(
        "https://married-flower-fern.glitch.me/api/employees",
        {
          params: { employeeCategory: "Driver" },
        }
      );
      setDrivers(data.data);
    } catch (err) {
      console.error("Error fetching drivers:", err);
    }
  };

  const fetchComplaints = async () => {
    try {
      const { data } = await axios.get(
        "https://married-flower-fern.glitch.me/api/complaints"
      );
      setComplaints(data.complaints);
    } catch (err) {
      console.error("Failed to fetch complaints:", err);
    }
  };

  const getDriverName = (driverId) => {
    const driver = drivers.find((d) => d._id === driverId);
    return driver ? driver.name : driverId;
  };

  const handleComplainPress = async (orderId) => {
    try {
      await axios.put(
        `https://married-flower-fern.glitch.me/api/orders/${orderId}/status`,
        {
          status: "complain-order",
        }
      );
      setComplaints((prev) => prev.filter((c) => c.orderId !== orderId));
    } catch (err) {
      console.error("Failed to update complaint status:", err);
    }
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
        } w-full bg-gray-50`}
      >
        <header className="bg-purple-900 text-white p-4"></header>

        <div className="p-4">
          <div className="flex items-center gap-2 mb-6">
            <Home className="w-5 h-5 text-gray-600" />
            <h1 className="text-xl font-semibold text-gray-800">
              5. Complaints / Resolutions
            </h1>
          </div>

          <div className="space-y-6">
            {complaints.map((item, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-lg shadow-sm"
              >
                <div className="p-4 flex">
                  <div className="mr-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="w-10 h-10 text-gray-400" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-sm text-gray-700">
                          Driver Id:{" "}
                          {item.complaint?.reportedBy?.driverId || "N/A"}
                        </div>
                        <div className="text-blue-500">
                          Order Id#{item.orderId}
                        </div>
                        <div className="text-sm text-gray-600">
                          Driver Name:{" "}
                          {getDriverName(item.complaint?.reportedBy?.driverId)}
                        </div>
                      </div>
                      <div
                        className={`px-3 py-1 rounded text-sm ${
                          item.complaint.status === "resolved"
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {item.complaint.status === "resolved"
                          ? "Resolved"
                          : "Not Resolved Yet"}
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Issue reported on{" "}
                      {new Date(item.complaint.reportedAt).toLocaleString()}
                    </div>
                    <div className="mt-1 text-gray-800">
                      {item.complaint.customerRequestDetails ||
                        "No notes provided"}
                    </div>
                    <div className="bg-gray-200 h-24 mt-3 p-2 rounded overflow-auto text-xs text-gray-700">
                      {item.complaint.additionalDetails}
                    </div>
                    <div className="flex justify-between mt-2">
                      <button className="text-blue-500 flex items-center text-sm">
                        View details <ArrowRight className="w-4 h-4 ml-1" />
                      </button>
                      <button
                        className="bg-red-500 text-white text-xs px-4 py-1 rounded hover:bg-red-600"
                        onClick={() => handleComplainPress(item.orderId)}
                      >
                        Mark As Complain & Remove
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-4 border-t border-gray-200">
                  <div className="text-xs text-gray-600 mb-2">Order Items</div>
                  <div className="border border-gray-300 rounded">
                    {item.items.map((prod, idx) => (
                      <div
                        key={idx}
                        className="p-3 border-b border-gray-200 flex justify-between items-center"
                      >
                        <div className="flex items-center">
                          <Package className="w-10 h-10 text-gray-400 mr-3" />
                          <div>
                            <div className="font-medium text-gray-800">
                              {prod.productName}
                            </div>
                            <div className="text-xs text-gray-500">
                              Qty: {prod.quantity} ({prod.weight})
                            </div>
                          </div>
                        </div>
                        <div className="text-red-500 font-bold">COMPLAIN</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-8">
            <button
              className="bg-blue-500 text-white rounded px-6 py-2 hover:bg-blue-600"
              onClick={() => navigate("/Delivery")}
            >
              Back to Delivery
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllDeliveryComplaints;
