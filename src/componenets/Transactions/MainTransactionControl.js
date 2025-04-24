// src/App.jsx
import React, { useState } from "react";
import TransactionControlView from "./transactioncontrol";
import VerificationView from "./transaction-verification";
import BankAccountView from "./BankAccountview";
import Sidebar from "../Sidebar/sidebar";

const MainTransactionControl = () => {
  const [currentView, setCurrentView] = useState("transactionControl"); // "transactionControl", "verification", "bankAccount"
  const [transactionType, setTransactionType] = useState("paid"); // "paid" or "disMainTransactionControleared"
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const navigateTo = (view) => {
    setCurrentView(view);
  };

  return (
    <div>
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <div
        className={`transition-all duration-300 ${
          isSidebarOpen ? "lg:ml-80" : ""
        } w-full bg-gray-50 p-4`}
      ></div>

      <div className="bg-gray-100 min-h-screen">
        <header className="bg-gray-800 text-white p-4">
          <div className="container mx-auto flex justify-between items-center">
            <div className="uppercase font-bold">LOGO</div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          {currentView === "transactionControl" && (
            <TransactionControlView
              type={transactionType}
              setType={setTransactionType}
              navigateTo={navigateTo}
            />
          )}

          {currentView === "verification" && (
            <VerificationView navigateTo={navigateTo} />
          )}

          {currentView === "bankAccount" && (
            <BankAccountView navigateTo={navigateTo} />
          )}
        </div>
      </div>
    </div>
  );
};

export default MainTransactionControl;
