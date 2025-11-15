import React, { useState, useEffect } from "react";
import {
  Package,
  Users,
  Building,
  Truck,
  User,
  Phone,
  FileText,
  Navigation,
  Menu,
  X,
  Home,
} from "lucide-react";

import OrderOverviewDashboard from "./OrderOverviewDashboard";
import PackingStaffDashboard from "./PackingStaffDashboard";
import DeliveryStorageOfficerDashboard from "./DeliveryStorageOfficerDashboard";
import DispatchOfficer1Dashboard from "./DispatchOfficer1Dashboard";
import DispatchOfficer2Dashboard from "./DispatchOfficer2";
import DriverDashboard from "./DriverDashboard";
import DriverOnDeliveryDashboard from "./Driverondelivery";
import ComplaintManagement from "./ComplainManagement";
import DeliveryTracking from "./DeliveryTracking";

const DeliveryManagementSystem = () => {
  const [selectedRole, setSelectedRole] = useState("Order Overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const roleButtons = [
    {
      name: "Order Overview",
      icon: Package,
      color: "bg-blue-600",
      section: "main",
    },
    {
      name: "Packing Staff",
      icon: Package,
      color: "bg-purple-600",
      section: "operations",
    },
    {
      name: "Storage Officer",
      icon: Building,
      color: "bg-orange-600",
      section: "operations",
    },
    {
      name: "Dispatch Officer 1",
      icon: User,
      color: "bg-green-600",
      section: "dispatch",
    },
    {
      name: "Dispatch Officer 2",
      icon: User,
      color: "bg-teal-600",
      section: "dispatch",
    },
    {
      name: "Driver",
      icon: Truck,
      color: "bg-red-600",
      section: "delivery",
    },
    {
      name: "Driver on Delivery",
      icon: Navigation,
      color: "bg-pink-600",
      section: "delivery",
    },
    {
      name: "Complaint Manager",
      icon: Phone,
      color: "bg-yellow-600",
      section: "complaints",
    },
    {
      name: "Order Tracking",
      icon: Navigation,
      color: "bg-cyan-600",
      section: "tracking",
    },
  ];

  const getSectionName = (section) => {
    const sectionNames = {
      main: "MAIN",
      operations: "OPERATIONS",
      dispatch: "DISPATCH",
      delivery: "DELIVERY",
      complaints: "COMPLAINTS",
      tracking: "TRACKING",
    };
    return sectionNames[section] || section;
  };

  const renderContent = () => {
    switch (selectedRole) {
      case "Order Overview":
        return <OrderOverviewDashboard />;
      case "Packing Staff":
        return <PackingStaffDashboard />;
      case "Storage Officer":
        return <DeliveryStorageOfficerDashboard />;
      case "Dispatch Officer 1":
        return <DispatchOfficer1Dashboard />;
      case "Dispatch Officer 2":
        return <DispatchOfficer2Dashboard />;
      case "Driver":
        return <DriverDashboard />;
      case "Driver on Delivery":
        return <DriverOnDeliveryDashboard />;
      case "Complaint Manager":
        return <ComplaintManagement />;
      case "Order Tracking":
        return <DeliveryTracking />;
      default:
        return <OrderOverviewDashboard />;
    }
  };

  const getSectionRoles = (section) =>
    roleButtons.filter((r) => r.section === section);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-72" : "w-20"
        } bg-gray-900 text-white transition-all duration-300 fixed h-screen overflow-y-auto z-40 md:static`}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-700 sticky top-0 bg-gray-900">
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <div>
                <h2 className="text-lg font-bold">Delivery System</h2>
                <p className="text-xs text-gray-400">Management</p>
              </div>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1 hover:bg-gray-800 rounded"
            >
              {sidebarOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Sections */}
        <div className="p-3">
          {[
            "main",
            "operations",
            "dispatch",
            "delivery",
            "complaints",
            "tracking",
          ].map((section) => (
            <div key={section} className="mb-4">
              {sidebarOpen && (
                <p className="text-xs uppercase font-bold text-gray-500 px-2 py-2">
                  {getSectionName(section)}
                </p>
              )}
              <div className="space-y-1">
                {getSectionRoles(section).map((role) => (
                  <button
                    key={role.name}
                    onClick={() => {
                      setSelectedRole(role.name);
                      if (isMobile) setSidebarOpen(false);
                    }}
                    className={`w-full px-3 py-2 rounded-lg transition-all flex items-center space-x-3 ${
                      selectedRole === role.name
                        ? `${role.color} text-white shadow-lg`
                        : "text-gray-300 hover:bg-gray-800"
                    }`}
                  >
                    <role.icon className="h-5 w-5 flex-shrink-0" />
                    {sidebarOpen && (
                      <span className="text-sm font-medium truncate">
                        {role.name}
                      </span>
                    )}
                  </button>
                ))}
              </div>
              {sidebarOpen && section !== "tracking" && (
                <div className="border-t border-gray-700 mt-4"></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {isMobile && (
          <div className="bg-gray-900 text-white p-3 sticky top-0 z-30">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-700 rounded"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        )}

        <div className="p-6">
          <div className="mb-6">
            <div className="flex items-center space-x-2 mb-2">
              <Home className="h-6 w-6 text-gray-600" />
              <h1 className="text-3xl font-bold text-gray-900">
                {selectedRole}
              </h1>
            </div>
            <p className="text-gray-600">
              Complete delivery management from order confirmation to delivery
            </p>
          </div>

          {renderContent()}
        </div>
      </div>

      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default DeliveryManagementSystem;
