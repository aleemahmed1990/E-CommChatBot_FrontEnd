// src/components/views/VerificationView.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../Sidebar/sidebar";
import { ChevronLeft, User, ImageIcon, Package } from "lucide-react";

export default function VerificationView() {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [reason, setReason] = useState("");
  const [otherText, setOtherText] = useState("");

  const reasons = [
    "cannot find amount against name/time",
    "empty page",
    "not clear text",
    "missing page",
    "fake/scam",
    "double check",
    "other",
  ];

  useEffect(() => {
    fetch(`http://localhost:5000/api/orders/${orderId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setOrder(data);
      })
      .catch(console.error);
  }, [orderId]);

  if (!order) return <div className="p-6">Loading…</div>;

  const handleApprove = () => {
    fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "order-confirmed" }),
    })
      .then(() => navigate("/Transactions-control"))
      .catch(console.error);
  };

  const handleReject = () => {
    const r = reason === "other" ? otherText : reason;
    fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "order-refunded", reason: r }),
    })
      .then(() => navigate("/Transactions-control"))
      .catch(console.error);
  };

  return (
    <div className="flex">
      <Sidebar isOpen={true} toggleSidebar={() => {}} />
      <div className="ml-80 flex-1 bg-gray-50 p-6">
        <button
          onClick={() => navigate("/Transactions-control")}
          className="mb-4 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md"
        >
          &larr; Back
        </button>

        <div className="bg-white rounded-md p-6 mb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* LEFT */}
          <div className="flex space-x-4">
            <div className="text-center">
              <User className="h-12 w-12 text-gray-500 mx-auto" />
              <p className="mt-2 text-gray-600 text-xs">{order.customer}</p>
              <p className="text-gray-600 text-xs">Order #: {order.orderId}</p>
            </div>
            <div className="flex-1">
              <h2 className="text-sm font-semibold mb-2 text-gray-700">
                Transaction screenshot
              </h2>
              <div className="w-full h-40 bg-gray-100 flex items-center justify-center rounded-md mb-4 overflow-hidden">
                {order.receiptImage ? (
                  <img
                    src={order.receiptImage}
                    alt="receipt"
                    className="object-contain h-full"
                  />
                ) : (
                  <ImageIcon className="h-10 w-10 text-gray-400" />
                )}
              </div>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold">AMOUNT RECEIVED:</h3>
                <span className="text-lg font-bold text-red-600">
                  {order.totalAmount}
                </span>
              </div>
              <p className="mt-2 text-gray-600 text-sm">
                From: {order.accountHolderName || "–"}
              </p>
              <p className="text-gray-600 text-sm">
                Bank: {order.paidBankName || "–"}
              </p>
              <button
                onClick={() => navigate(`/bank-view/${orderId}`)}
                className="mt-4 w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-md font-medium"
              >
                Double check manually
              </button>
            </div>
          </div>

          {/* RIGHT */}
          <div>
            <h3 className="text-gray-700 font-semibold mb-3">Final approval</h3>
            <div className="flex space-x-2 mb-4">
              <button
                onClick={handleApprove}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-md font-medium"
              >
                Approved
              </button>
              <button
                onClick={handleReject}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-md font-medium"
              >
                Not approved
              </button>
            </div>
            <div className="border rounded-md p-4">
              <p className="font-medium mb-2 text-gray-700">
                If not approved, select a reason:
              </p>
              <div className="space-y-2 mb-3 text-sm text-gray-600">
                {reasons.map((r) => (
                  <label key={r} className="flex items-center">
                    <input
                      type="radio"
                      name="reason"
                      value={r}
                      checked={reason === r}
                      onChange={() => setReason(r)}
                      className="mr-2"
                    />
                    {r}
                  </label>
                ))}
              </div>
              {reason === "other" && (
                <input
                  type="text"
                  placeholder="Write your reason"
                  className="w-full border border-gray-300 rounded-md p-2 mb-3 text-sm"
                  value={otherText}
                  onChange={(e) => setOtherText(e.target.value)}
                />
              )}
            </div>
          </div>
        </div>

        {/* ORDER ITEMS */}
        <div className="bg-white rounded-md p-6">
          <h3 className="text-gray-700 font-semibold mb-4">Order details</h3>
          <div className="border rounded-md p-4 space-y-4">
            {order.items.map((it, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Package className="w-8 h-8 text-gray-500" />
                  <div>
                    <p className="font-medium">{it.productName}</p>
                    <p className="text-xs text-gray-600">Qty: {it.quantity}</p>
                  </div>
                </div>
                <p className="font-medium">{it.totalPrice}</p>
              </div>
            ))}
            <div className="pt-4 border-t space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Sub total</span>
                <span>
                  {order.items.reduce((sum, i) => sum + i.totalPrice, 0)}
                </span>
              </div>
              {order.deliveryCharge > 0 && (
                <div className="flex justify-between">
                  <span>Shipping fee</span>
                  <span>{order.deliveryCharge}</span>
                </div>
              )}
              {order.ecoDeliveryDiscount > 0 && (
                <div className="flex justify-between">
                  <span>Eco discount</span>
                  <span>-{order.ecoDeliveryDiscount}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-gray-800">
                <span>Total</span>
                <span>{order.totalAmount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
