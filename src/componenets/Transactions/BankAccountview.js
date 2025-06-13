// src/components/views/BankAccountView.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../Sidebar/sidebar";
import { FiMoreVertical } from "react-icons/fi";
import { FaRegFileImage } from "react-icons/fa";

export default function BankAccountView() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);

  // admin-editable
  const [textBox, setTextBox] = useState("");
  const [allocatedToOrder, setAllocatedToOrder] = useState(orderId);
  const [allocatedEmpName, setAllocatedEmpName] = useState("");
  const [allocatedStatus, setAllocatedStatus] = useState("allocated");

  useEffect(() => {
    fetch(`https://married-flower-fern.glitch.me/api/orders/${orderId}`)
      .then((r) => r.json())
      .then(setOrder)
      .catch(console.error);
  }, [orderId]);

  const handleSave = () => {
    alert("The receipt is marked as correct");
    navigate("/verification/ORD10028");
  };

  const getImageSource = () => {
    if (!order || !order.receiptImage) return null;

    const receipt = order.receiptImage;

    if (typeof receipt === "string") return receipt;

    if (receipt.data) {
      if (typeof receipt.data === "string") {
        if (receipt.data.startsWith("data:")) return receipt.data;
        const contentType = receipt.contentType || "image/jpeg";
        return `data:${contentType};base64,${receipt.data}`;
      }

      if (Array.isArray(receipt.data)) {
        try {
          const contentType = receipt.contentType || "image/jpeg";
          const base64String = btoa(
            receipt.data.map((byte) => String.fromCharCode(byte)).join("")
          );
          return `data:${contentType};base64,${base64String}`;
        } catch (err) {
          console.error("Error converting image data:", err);
          return null;
        }
      }
    }

    if (typeof receipt.data === "string" && receipt.data.startsWith("data:")) {
      return receipt.data;
    }

    console.error("Unsupported receiptImage format:", receipt);
    return null;
  };

  if (!order) return <div className="p-6">Loading…</div>;

  const receivedAt = new Date(order.orderDate).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const receivedDate = new Date(order.orderDate).toLocaleDateString();

  const imageSource = getImageSource();

  return (
    <div className="flex">
      <Sidebar isOpen={true} toggleSidebar={() => {}} />
      <div className="ml-80 flex-1 bg-gray-50 p-6">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 text-sm text-blue-600 hover:underline"
        >
          ← Back to Verification
        </button>

        <h1 className="text-2xl font-bold mb-6">Bank Account</h1>

        {/* ─── TABLE ──────────────────────────────────────────── */}
        <div className="overflow-x-auto border rounded-lg mb-8 bg-white">
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
                  "",
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
              <tr className="hover:bg-gray-100">
                <td className="py-3 px-4 text-sm">{receivedAt}</td>
                <td className="py-3 px-4 text-sm">{receivedDate}</td>
                <td className="py-3 px-4 text-sm">{order.customer}</td>
                <td className="py-3 px-4 text-sm">
                  <input
                    type="text"
                    value={textBox}
                    onChange={(e) => setTextBox(e.target.value)}
                    placeholder="notes…"
                    className="w-full border rounded p-1 text-sm"
                  />
                </td>
                <td className="py-3 px-4 text-sm">{order.totalAmount}</td>
                <td className="py-3 px-4 text-sm">
                  <input
                    type="text"
                    value={allocatedToOrder}
                    onChange={(e) => setAllocatedToOrder(e.target.value)}
                    className="w-full border rounded p-1 text-sm"
                  />
                </td>
                <td className="py-3 px-4 text-sm">
                  <input
                    type="text"
                    value={allocatedEmpName}
                    onChange={(e) => setAllocatedEmpName(e.target.value)}
                    placeholder="emp name"
                    className="w-full border rounded p-1 text-sm"
                  />
                </td>
                <td className="py-3 px-4 text-sm">
                  <select
                    value={allocatedStatus}
                    onChange={(e) => setAllocatedStatus(e.target.value)}
                    className="border rounded p-1 text-sm"
                  >
                    <option value="allocated">allocated</option>
                    <option value="not allocated">not allocated</option>
                    <option value="issue">issue</option>
                  </select>
                </td>
                <td className="py-3 px-4 text-right">
                  <FiMoreVertical size={20} className="text-gray-400" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* ─── INFO + RECEIPT ───────────────────────────────── */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* MORE INFO */}
          <div className="flex-1 bg-white rounded-md p-6 space-y-4">
            <h2 className="text-xl font-semibold">more info about payment</h2>
            <div className="space-y-2 text-gray-700">
              <div>
                <span className="font-medium">time received:</span> {receivedAt}
              </div>
              <div>
                <span className="font-medium">time credited in account:</span>—
              </div>
              <div>
                <span className="font-medium">bank:</span>{" "}
                {order.paidBankName || "—"}
              </div>
              <div>
                <span className="font-medium">account sender:</span>{" "}
                {order.accountHolderName || "—"}
              </div>
              <div>
                <span className="font-medium">text:</span> {textBox || "—"}
              </div>
            </div>
            <button
              onClick={handleSave}
              className="mt-4 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
            >
              Correct Receipt
            </button>
          </div>

          {/* RECEIPT PHOTO */}
          <div className="w-full md:w-64 bg-white rounded-md p-6 flex flex-col items-center">
            <h2 className="mb-4 font-semibold">Receipt photo</h2>
            <div className="w-full h-48 bg-gray-100 flex items-center justify-center mb-4">
              {imageSource ? (
                <img
                  src={imageSource}
                  alt="receipt"
                  className="object-contain h-full"
                />
              ) : (
                <FaRegFileImage size={48} className="text-gray-400" />
              )}
            </div>
            <div className="text-gray-700 text-sm space-y-1 mb-4">
              <div>
                <span className="font-medium">Bank:</span>{" "}
                {order.paidBankName || "—"}
              </div>
              <div>
                <span className="font-medium">Sender acct #:</span>{" "}
                {order.accountHolderName || "—"}
              </div>
            </div>
            <button
              onClick={() => navigate(-1)}
              className="bg-gray-700 hover:bg-gray-800 text-white py-2 px-4 rounded"
            >
              Back to Verification
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
