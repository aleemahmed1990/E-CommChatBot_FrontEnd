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
    fetch(`https://e-commchatbot-backend-4.onrender.com/api/orders/${orderId}`)
      .then((r) => r.json())
      .then(setOrder)
      .catch(console.error);
  }, [orderId]);

  const handleSave = () => {
    alert("The receipt is marked as correct");
    navigate(`/verification/${orderId}`);
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

        <h1 className="text-2xl font-bold mb-6">
          Bank Account - {order.orderId}
        </h1>

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
                <td className="py-3 px-4 text-sm">
                  {order.customer || order.customerName}
                </td>
                <td className="py-3 px-4 text-sm">
                  <input
                    type="text"
                    value={textBox}
                    onChange={(e) => setTextBox(e.target.value)}
                    placeholder="notes…"
                    className="w-full border rounded p-1 text-sm"
                  />
                </td>
                <td className="py-3 px-4 text-sm">${order.totalAmount}</td>
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
            <h2 className="text-xl font-semibold">
              Complete Payment Information
            </h2>
            <div className="space-y-2 text-gray-700 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="font-medium">Time Received:</span>{" "}
                  {receivedAt}
                </div>
                <div>
                  <span className="font-medium">Date:</span> {receivedDate}
                </div>
                <div>
                  <span className="font-medium">Bank:</span>{" "}
                  {order.paidBankName || "Not provided"}
                </div>
                <div>
                  <span className="font-medium">Account Holder:</span>{" "}
                  {order.accountHolderName || "Not provided"}
                </div>
                <div>
                  <span className="font-medium">Transaction ID:</span>{" "}
                  {order.transactionId || "Not provided"}
                </div>
                <div>
                  <span className="font-medium">Payment Method:</span>{" "}
                  {order.paymentMethod || "Bank Transfer"}
                </div>
                <div>
                  <span className="font-medium">Amount:</span> $
                  {order.totalAmount}
                </div>
                <div>
                  <span className="font-medium">Payment Status:</span>{" "}
                  {order.paymentStatus || "Pending"}
                </div>
              </div>

              {/* Delivery Information */}
              <div className="pt-4 border-t mt-4">
                <h3 className="font-semibold mb-2">Delivery Details</h3>
                <div className="space-y-1">
                  {order.deliveryOption && (
                    <div>
                      <span className="font-medium">Delivery Option:</span>{" "}
                      {order.deliveryOption}
                    </div>
                  )}
                  {order.deliveryType && (
                    <div>
                      <span className="font-medium">Delivery Type:</span>{" "}
                      {order.deliveryType}
                    </div>
                  )}
                  {order.deliverySpeed && (
                    <div>
                      <span className="font-medium">Delivery Speed:</span>{" "}
                      {order.deliverySpeed}
                    </div>
                  )}
                  {order.deliveryTimeFrame && (
                    <div>
                      <span className="font-medium">Time Frame:</span>{" "}
                      {order.deliveryTimeFrame}
                    </div>
                  )}
                  {order.timeSlot && (
                    <div>
                      <span className="font-medium">Time Slot:</span>{" "}
                      {order.timeSlot}
                    </div>
                  )}
                  {order.deliveryCharge > 0 && (
                    <div>
                      <span className="font-medium">Delivery Charge:</span> $
                      {order.deliveryCharge}
                    </div>
                  )}
                  {order.deliveryAddress && (
                    <div>
                      <span className="font-medium">Address:</span>
                      <div className="ml-4 mt-1">
                        {order.deliveryAddress.nickname && (
                          <div>
                            • Nickname: {order.deliveryAddress.nickname}
                          </div>
                        )}
                        {order.deliveryAddress.fullAddress && (
                          <div>• {order.deliveryAddress.fullAddress}</div>
                        )}
                        {order.deliveryAddress.area && (
                          <div>• Area: {order.deliveryAddress.area}</div>
                        )}
                        {order.deliveryAddress.googleMapLink && (
                          <div>
                            • Map:{" "}
                            <a
                              href={order.deliveryAddress.googleMapLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              {order.deliveryAddress.googleMapLink}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Customer Information */}
              <div className="pt-4 border-t mt-4">
                <h3 className="font-semibold mb-2">Customer Information</h3>
                <div className="space-y-1">
                  <div>
                    <span className="font-medium">Name:</span>{" "}
                    {order.customer || order.customerName}
                  </div>
                  <div>
                    <span className="font-medium">Phone:</span>{" "}
                    {order.phoneNumber || order.customerPhone}
                  </div>
                  <div>
                    <span className="font-medium">Customer ID:</span>{" "}
                    {order.customerId}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t mt-4">
                <span className="font-medium">Admin Notes:</span>
                <div className="mt-1">{textBox || "—"}</div>
              </div>
            </div>
            <button
              onClick={handleSave}
              className="mt-4 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded w-full"
            >
              Correct Receipt - Mark as Verified
            </button>
          </div>

          {/* RECEIPT PHOTO */}
          <div className="w-full md:w-96 bg-white rounded-md p-6 flex flex-col">
            <h2 className="mb-4 font-semibold text-lg">Receipt Photo</h2>
            <div className="w-full h-96 bg-gray-100 flex items-center justify-center mb-4 rounded-lg overflow-hidden">
              {imageSource ? (
                <img
                  src={imageSource}
                  alt="receipt"
                  className="object-contain h-full w-full"
                />
              ) : (
                <div className="flex flex-col items-center text-gray-400">
                  <FaRegFileImage size={48} />
                  <p className="mt-2 text-sm">No receipt image uploaded</p>
                </div>
              )}
            </div>
            <div className="text-gray-700 text-sm space-y-2 mb-4 bg-gray-50 p-4 rounded">
              <div>
                <span className="font-medium">Bank:</span>{" "}
                {order.paidBankName || "Not provided"}
              </div>
              <div>
                <span className="font-medium">Account Holder:</span>{" "}
                {order.accountHolderName || "Not provided"}
              </div>
              <div>
                <span className="font-medium">Amount:</span> $
                {order.totalAmount}
              </div>
              <div>
                <span className="font-medium">Transaction ID:</span>{" "}
                {order.transactionId || "Not provided"}
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
