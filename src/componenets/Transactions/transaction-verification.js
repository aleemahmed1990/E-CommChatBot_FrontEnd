import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../Sidebar/sidebar";
import { ChevronLeft, User, ImageIcon, Package, X } from "lucide-react";

export default function VerificationView() {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [reason, setReason] = useState("");
  const [otherText, setOtherText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageZoomed, setImageZoomed] = useState(false);

  const reasons = [
    "cannot find amount against name/time",
    "empty page",
    "not clear text",
    "missing page",
    " believe fake/scam",
    "double check",
    "other",
  ];

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:5000/api/orders/${orderId}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Error ${res.status}: ${res.statusText}`);
        }
        return res.json();
      })
      .then((data) => {
        if (data.error) throw new Error(data.error);
        console.log("Received order data:", data);

        setOrder(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching order:", err);
        setError(err.message);
        setLoading(false);
      });
  }, [orderId]);

  const handleApprove = () => {
    fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "order-confirmed" }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to update status");
        return res.json();
      })
      .then(() => navigate("/Transactions-control"))
      .catch((err) => {
        console.error("Error approving order:", err);
        alert("Failed to approve order: " + err.message);
      });
  };

  const handleReject = () => {
    if (!reason) {
      alert("Please select a reason for rejection");
      return;
    }

    const r = reason === "other" ? otherText : reason;
    if (reason === "other" && !otherText) {
      alert("Please provide a reason for rejection");
      return;
    }

    fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "order-refunded", reason: r }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to update status");
        return res.json();
      })
      .then(() => navigate("/Transactions-control"))
      .catch((err) => {
        console.error("Error rejecting order:", err);
        alert("Failed to reject order: " + err.message);
      });
  };

  const toggleImageZoom = () => {
    setImageZoomed(!imageZoomed);
  };

  // Improved helper function to correctly handle the image data
  const getImageSource = () => {
    if (!order || !order.receiptImage) return null;

    // Handle the case where receiptImage is a string containing the data URL
    if (typeof order.receiptImage === "string") {
      return order.receiptImage;
    }

    // Handle the case where receiptImage is an object with data property
    if (order.receiptImage.data) {
      // If data is already a base64 string
      if (typeof order.receiptImage.data === "string") {
        // Check if data already includes the data:image prefix
        if (order.receiptImage.data.startsWith("data:")) {
          return order.receiptImage.data;
        }

        // Otherwise construct the full data URL
        const contentType = order.receiptImage.contentType || "image/jpeg";
        return `data:${contentType};base64,${order.receiptImage.data}`;
      }

      // If data is an array (Buffer representation in JSON)
      if (Array.isArray(order.receiptImage.data)) {
        try {
          const contentType = order.receiptImage.contentType || "image/jpeg";
          const base64String = btoa(
            order.receiptImage.data
              .map((byte) => String.fromCharCode(byte))
              .join("")
          );
          return `data:${contentType};base64,${base64String}`;
        } catch (err) {
          console.error("Error converting image data:", err);
          return null;
        }
      }
    }

    // Handle the direct format shown in your console
    // Where receiptImage has the structure { data: "data:image/jpeg;base64,..." }
    if (
      order.receiptImage &&
      typeof order.receiptImage === "object" &&
      typeof order.receiptImage.data === "string" &&
      order.receiptImage.data.startsWith("data:")
    ) {
      return order.receiptImage.data;
    }

    console.error("Unsupported receiptImage format:", order.receiptImage);
    return null;
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">Error: {error}</div>;
  if (!order) return <div className="p-6">Order not found</div>;

  const imageSource = getImageSource();
  console.log(
    "Image source:",
    imageSource ? `${imageSource.substring(0, 50)}...` : "null"
  );

  return (
    <div className="flex">
      <Sidebar isOpen={true} toggleSidebar={() => {}} />
      <div className="ml-80 flex-1 bg-gray-50 p-6">
        {/* Image zoom overlay */}
        {imageZoomed && imageSource && (
          <div
            className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4"
            onClick={toggleImageZoom}
          >
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleImageZoom();
                }}
                className="absolute top-2 right-2 bg-white rounded-full p-1"
              >
                <X className="h-6 w-6" />
              </button>
              <img
                src={imageSource}
                alt="Receipt (zoomed)"
                className="max-w-full max-h-screen object-contain rounded-lg"
              />
            </div>
          </div>
        )}

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
              <div
                className="w-full h-40 bg-gray-100 flex items-center justify-center rounded-md mb-4 overflow-hidden cursor-pointer"
                onClick={toggleImageZoom}
              >
                {imageSource ? (
                  <img
                    src={imageSource}
                    alt="Receipt"
                    className="object-contain h-full"
                    onError={(e) => {
                      console.error("Image failed to load:", e);
                      e.target.onerror = null;
                      e.target.src = "";
                      e.target.parentElement.innerHTML = `
                        <div class="flex flex-col items-center justify-center">
                          <svg class="h-10 w-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                          </svg>
                          <p class="text-sm text-gray-500 mt-2">Failed to load image</p>
                        </div>
                      `;
                    }}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center">
                    <ImageIcon className="h-10 w-10 text-gray-400" />
                    <p className="text-sm text-gray-500 mt-2">
                      No image available
                    </p>
                  </div>
                )}
              </div>
              {imageSource && (
                <p className="text-xs text-blue-500 text-center mb-2">
                  Click to zoom image
                </p>
              )}
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
            {order.items &&
              order.items.map((it, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Package className="w-8 h-8 text-gray-500" />
                    <div>
                      <p className="font-medium">{it.productName}</p>
                      <p className="text-xs text-gray-600">
                        Qty: {it.quantity}
                      </p>
                    </div>
                  </div>
                  <p className="font-medium">{it.totalPrice}</p>
                </div>
              ))}
            <div className="pt-4 border-t space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Sub total</span>
                <span>
                  {order.items
                    ? order.items.reduce((sum, i) => sum + i.totalPrice, 0)
                    : 0}
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
