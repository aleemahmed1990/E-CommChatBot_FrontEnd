import React, { useState } from "react";
import Sidebar from "../Sidebar/sidebar";
import { FiMoreVertical } from "react-icons/fi";
import { FaRegFileImage } from "react-icons/fa";

// More Info Screen (Original Detail + Receipt)
const MoreInfoView = ({ onCorrectReceipt, onBackToVerification }) => {
  const tableData = [
    {
      date: "Dec 2.2025 at 8:00",
      time: "8:00",
      name: "Sarah",
      textBox: "sample text",
      amount: "$6",
      orderId: "",
      allocatedEmpName: "",
      allocated: "",
      status: "correct it",
    },
    {
      date: "Dec 2.2025 at 8:00",
      time: "8:00",
      name: "Sarah",
      textBox: "sample text",
      amount: "$6",
      orderId: "",
      allocatedEmpName: "",
      allocated: "",
      status: "correct it",
    },
    {
      date: "Dec 2.2025 at 8:00",
      time: "8:00",
      name: "Sarah",
      textBox: "sample text",
      amount: "$6",
      orderId: "",
      allocatedEmpName: "",
      allocated: "",
      status: "correct it",
    },
    {
      date: "Dec 2.2025 at 8:00",
      time: "8:00",
      name: "Ali",
      textBox: "sada asd",
      amount: "$100",
      orderId: "124A",
      allocatedEmpName: "Jimmy- id 5371",
      allocated: "allocated",
      status: "",
    },
    {
      date: "Dec 2.2025 at 8:00",
      time: "8:00",
      name: "John",
      textBox: "asdasd asd",
      amount: "$6",
      orderId: "345A",
      allocatedEmpName: "Jack- id 262",
      allocated: "not allocated 26 hours",
      status: "",
    },
    {
      date: "Dec 2.2025 at 8:00",
      time: "8:00",
      name: "Sarah",
      textBox: "nasddew asd",
      amount: "$6",
      orderId: "345A",
      allocatedEmpName: "Smith- id 89263",
      allocated: "issue",
      status: "",
    },
    {
      date: "Dec 2.2025 at 8:00",
      time: "8:00",
      name: "Sarah",
      textBox: "asdas prossssduct",
      amount: "$6",
      orderId: "",
      allocatedEmpName: "",
      allocated: "",
      status: "",
    },
    {
      date: "Dec 2.2025 at 8:00",
      time: "8:00",
      name: "Sarah",
      textBox: "nasd",
      amount: "$6",
      orderId: "345A",
      allocatedEmpName: "Smith- id 89263",
      allocated: "issue",
      status: "",
    },
    {
      date: "Dec 2.2025 at 8:00",
      time: "8:00",
      name: "Sarah",
      textBox: "asdasdf sdfsadf sdfct",
      amount: "$6",
      orderId: "",
      allocatedEmpName: "",
      allocated: "",
      status: "",
    },
    {
      date: "Dec 2.2025 at 8:00",
      time: "8:00",
      name: "Sarah",
      textBox: "nad",
      amount: "$6",
      orderId: "345A",
      allocatedEmpName: "Smith- id 89263",
      allocated: "issue",
      status: "",
    },
    {
      date: "Dec 2.2025 at 8:00",
      time: "8:00",
      name: "Sarah",
      textBox: "nesaaduct",
      amount: "$6",
      orderId: "",
      allocatedEmpName: "",
      allocated: "",
      status: "",
    },
  ];

  // More detailed transactions for the second tab view
  const detailedTransactions = [
    {
      date: "Dec 2.2025 at 8:00",
      time: "8:00",
      name: "Ali",
      textBox: "Specific amount",
      amount: "$100",
      orderId: "124A",
      allocatedEmpName: "Jimmy- id 5371",
      allocated: "allocated",
      status: "",
    },
    {
      date: "Dec 2.2025 at 8:00",
      time: "8:00",
      name: "John",
      textBox: "clearance discount",
      amount: "$6",
      orderId: "345A",
      allocatedEmpName: "Jack- id 262",
      allocated: "not allocated 26 hours",
      status: "",
    },
    {
      date: "Dec 2.2025 at 8:00",
      time: "8:00",
      name: "Sarah",
      textBox: "new product",
      amount: "$6",
      orderId: "345A",
      allocatedEmpName: "Smith- id 89263",
      allocated: "issue",
      status: "",
    },
    {
      date: "Dec 2.2025 at 8:00",
      time: "8:00",
      name: "Sarah",
      textBox: "new product",
      amount: "$6",
      orderId: "",
      allocatedEmpName: "",
      allocated: "",
      status: "",
    },
    {
      date: "Dec 2.2025 at 8:00",
      time: "8:00",
      name: "Sarah",
      textBox: "new product",
      amount: "$6",
      orderId: "345A",
      allocatedEmpName: "Smith- id 89263",
      allocated: "issue",
      status: "",
    },
    {
      date: "Dec 2.2025 at 8:00",
      time: "8:00",
      name: "Sarah",
      textBox: "new product",
      amount: "$6",
      orderId: "",
      allocatedEmpName: "",
      allocated: "",
      status: "",
    },
    {
      date: "Dec 2.2025 at 8:00",
      time: "8:00",
      name: "Sarah",
      textBox: "new product",
      amount: "$6",
      orderId: "345A",
      allocatedEmpName: "Smith- id 89263",
      allocated: "issue",
      status: "",
    },
    {
      date: "Dec 2.2025 at 8:00",
      time: "8:00",
      name: "Sarah",
      textBox: "new product",
      amount: "$6",
      orderId: "",
      allocatedEmpName: "",
      allocated: "",
      status: "",
    },
  ];

  return (
    <div className="bg-white min-h-screen">
      <div className="pt-4 px-4">
        {/* Employee Header */}
        <div className="mb-6 text-right">
          <div className="text-sm text-orange-500">Employee</div>
          <div className="font-medium">Smith - id 89263</div>
        </div>

        <h1 className="text-2xl font-bold mb-6">Bank Account</h1>

        {/* Transactions Table */}
        <div className="overflow-x-auto border rounded-lg mb-8">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50 border-b">
                {[
                  "time",
                  "date",
                  "name",
                  "text box",
                  "amount",
                  "allocated to order id",
                  "allocated emp name",
                  "allocated",
                ].map((h) => (
                  <th
                    key={h}
                    className="py-3 px-4 text-left text-sm font-medium text-gray-500"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableData.map((t, i) => (
                <tr key={i} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm">{t.time}</td>
                  <td className="py-3 px-4 text-sm">{t.date}</td>
                  <td className="py-3 px-4 text-sm">{t.name}</td>
                  <td className="py-3 px-4 text-sm">{t.textBox}</td>
                  <td className="py-3 px-4 text-sm">{t.amount}</td>
                  <td className="py-3 px-4 text-sm">{t.orderId}</td>
                  <td className="py-3 px-4 text-sm">{t.emp}</td>
                  <td className="py-3 px-4 text-sm">{t.allocated}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* More Info Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
          <div className="col-span-2">
            <div className="text-2xl font-bold mb-2">more info</div>
            <div className="text-2xl font-bold mb-4">about payment</div>
            <div className="space-y-2 mb-8">
              <div className="flex items-center">
                <span className="text-3xl mr-2">➜</span>
                <span className="text-xl">time received</span>
              </div>
              <div className="flex items-center">
                <span className="invisible text-3xl mr-2">➜</span>
                <span className="text-xl">time credited in account</span>
              </div>
            </div>
            <div className="text-2xl font-bold mb-2">XXXX</div>
            <div className="text-2xl font-bold mb-4">bank</div>
            <div className="text-2xl font-bold mb-2">account sender</div>
            <div className="text-2xl font-bold mb-4">name of sender</div>
            <div className="text-2xl font-bold mb-2">text</div>
          </div>
          <div className="col-span-1">
            <div className="text-2xl font-bold mb-4">Receipt photo</div>
            <div className="flex items-center justify-center bg-gray-100 h-48 w-full mb-4">
              <FaRegFileImage size={48} className="text-gray-400" />
            </div>
            <div className="text-2xl font-bold mb-2">bank name</div>
            <div className="text-2xl font-bold mb-4">sender account number</div>
            <button
              onClick={onCorrectReceipt}
              className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded w-full mb-2"
            >
              Correct Receipt
            </button>
            <button
              onClick={onBackToVerification}
              className="bg-gray-700 hover:bg-gray-800 text-white py-2 px-4 rounded w-full"
            >
              Back to Verification
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Details Entry Screen (Form + Table + Back Button)
const DetailsEntryView = ({ onBack }) => {
  const sampleData = [
    {
      date: "Dec 2.2025 at 8:00",
      time: "8:00",
      name: "Ali",
      textBox: "Specific amount",
      amount: "$100",
      orderId: "124A",
      allocatedEmpName: "Jimmy- id 5371",
      allocated: "allocated",
      status: "",
    },
    {
      date: "Dec 2.2025 at 8:00",
      time: "8:00",
      name: "John",
      textBox: "clearance discount",
      amount: "$6",
      orderId: "345A",
      allocatedEmpName: "Jack- id 262",
      allocated: "not allocated 26 hours",
      status: "",
    },
    {
      date: "Dec 2.2025 at 8:00",
      time: "8:00",
      name: "Sarah",
      textBox: "new product",
      amount: "$6",
      orderId: "345A",
      allocatedEmpName: "Smith- id 89263",
      allocated: "issue",
      status: "",
    },
    {
      date: "Dec 2.2025 at 8:00",
      time: "8:00",
      name: "Sarah",
      textBox: "new product",
      amount: "$6",
      orderId: "",
      allocatedEmpName: "",
      allocated: "",
      status: "",
    },
    {
      date: "Dec 2.2025 at 8:00",
      time: "8:00",
      name: "Sarah",
      textBox: "new product",
      amount: "$6",
      orderId: "345A",
      allocatedEmpName: "Smith- id 89263",
      allocated: "issue",
      status: "",
    },
    {
      date: "Dec 2.2025 at 8:00",
      time: "8:00",
      name: "Sarah",
      textBox: "new product",
      amount: "$6",
      orderId: "",
      allocatedEmpName: "",
      allocated: "",
      status: "",
    },
    {
      date: "Dec 2.2025 at 8:00",
      time: "8:00",
      name: "Sarah",
      textBox: "new product",
      amount: "$6",
      orderId: "345A",
      allocatedEmpName: "Smith- id 89263",
      allocated: "issue",
      status: "",
    },
    {
      date: "Dec 2.2025 at 8:00",
      time: "8:00",
      name: "Sarah",
      textBox: "new product",
      amount: "$6",
      orderId: "",
      allocatedEmpName: "",
      allocated: "",
      status: "",
    },
  ];

  return (
    <div className="bg-white min-h-screen">
      <div className="pt-4 px-4">
        {/* Header */}
        <div className="mb-6 text-right">
          <div className="text-sm text-orange-500">Employee</div>
          <div className="font-medium">Smith - id 89263</div>
        </div>
        <h1 className="text-2xl font-bold mb-6">Bank Account</h1>

        {/* Entry Form */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <label className="block text-sm mb-1">time</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded p-2"
            />
            <label className="block text-sm mt-4 mb-1">date</label>
            <div className="relative">
              <input
                type="text"
                value="automatic ,,, and can be changed"
                readOnly
                className="w-full border border-gray-300 rounded p-2"
              />
              <div className="absolute left-2 top-3">
                <FiMoreVertical size={16} />
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm mb-1">Amount</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded p-2"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">from whom</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded p-2"
            />
          </div>
        </div>

        <div className="mb-8">
          <label className="block text-sm mb-1">Text</label>
          <textarea className="w-full border border-gray-300 rounded p-2 h-24"></textarea>
        </div>
        <div className="flex justify-end mb-8">
          <button className="bg-gray-300 hover:bg-gray-400 text-black font-medium py-2 px-12 rounded">
            done
          </button>
        </div>

        {/* Transactions Table */}
        <div className="overflow-x-auto border rounded-lg mb-4">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50 border-b">
                {[
                  "date",
                  "time",
                  "name",
                  "text box",
                  "amount",
                  "order id",
                  "allocated emp name",
                  "allocated",
                ].map((h) => (
                  <th
                    key={h}
                    className="py-3 px-4 text-left text-sm font-medium text-gray-500"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sampleData.map((t, i) => (
                <tr
                  key={i}
                  className={`border-b hover:bg-gray-50 ${
                    t.allocated === "allocated" ? "bg-green-100" : ""
                  }`}
                >
                  <td className="py-3 px-4 text-sm">{t.date}</td>
                  <td className="py-3 px-4 text-sm">{t.time}</td>
                  <td className="py-3 px-4 text-sm">{t.name}</td>
                  <td className="py-3 px-4 text-sm">
                    <div className="bg-gray-100 px-2 py-1 rounded flex items-center justify-between">
                      {t.textBox}
                      <FiMoreVertical size={16} />
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm">{t.amount}</td>
                  <td className="py-3 px-4 text-sm">{t.orderId}</td>
                  <td className="py-3 px-4 text-sm">{t.emp}</td>
                  <td className="py-3 px-4 text-sm">
                    {t.allocated || t.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Back Button to More Info */}
        <div className="flex justify-end">
          <button
            onClick={onBack}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded"
          >
            Back to More Info
          </button>
        </div>
      </div>
    </div>
  );
};

// Main view orchestrator
const BankAccountView = ({ navigateTo }) => {
  const [currentView, setCurrentView] = useState("moreInfo");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex">
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      <div
        className={`${
          isSidebarOpen ? "ml-80" : ""
        } flex-1 transition-all duration-300 bg-gray-50 p-4`}
      >
        {currentView === "moreInfo" ? (
          <MoreInfoView
            onCorrectReceipt={() => setCurrentView("details")}
            onBackToVerification={() => navigateTo("verification")}
          />
        ) : (
          <DetailsEntryView onBack={() => setCurrentView("moreInfo")} />
        )}
      </div>
    </div>
  );
};

export default BankAccountView;
