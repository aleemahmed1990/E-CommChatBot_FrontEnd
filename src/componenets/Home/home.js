import React, { useState } from "react";
import { Home, User } from "lucide-react";
import Sidebar from "../Sidebar/sidebar";

const HomePage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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
        {/* Header */}
        <div className="bg-purple-900 text-white p-4 flex justify-between items-center">
          <div className="flex items-center">
            <Home className="mr-2" size={20} />
            <h1 className="text-xl font-semibold">Dashboard</h1>
          </div>
        </div>

        {/* Welcome Section */}
        <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
          <div className="text-center">
            <div className="bg-purple-100 p-6 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
              <User className="text-purple-600" size={48} />
            </div>
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Welcome, Admin
            </h2>
            <p className="text-xl text-gray-600">
              Have a great day managing your dashboard
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
