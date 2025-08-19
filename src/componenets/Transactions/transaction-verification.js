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
  const [updating, setUpdating] = useState(false);

  const reasons = [
    "cannot find amount against name/time",
    "empty page",
    "not clear text",
    "missing page",
    "believe fake/scam",
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

  const handleApprove = async () => {
    if (updating) return;

    setUpdating(true);
    try {
      const response = await fetch(
        `http://localhost:5000/api/orders/${orderId}/status`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: "order-confirmed",
            reason: "Payment verified and approved",
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      const result = await response.json();
      console.log("Order approved:", result);

      // Show success message
      alert("Order approved successfully!");

      // Navigate back to transactions control
      navigate("/Transactions-control");
    } catch (err) {
      console.error("Error approving order:", err);
      alert("Failed to approve order: " + err.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleReject = async () => {
    if (updating) return;

    if (!reason) {
      alert("Please select a reason for rejection");
      return;
    }

    const rejectionReason = reason === "other" ? otherText : reason;
    if (reason === "other" && !otherText.trim()) {
      alert("Please provide a reason for rejection");
      return;
    }

    setUpdating(true);
    try {
      const response = await fetch(
        `http://localhost:5000/api/orders/${orderId}/status`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: "order-refunded",
            reason: rejectionReason,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      const result = await response.json();
      console.log("Order rejected:", result);

      // Show success message
      alert(`Order rejected successfully. Reason: ${rejectionReason}`);

      // Navigate back to transactions control
      navigate("/Transactions-control");
    } catch (err) {
      console.error("Error rejecting order:", err);
      alert("Failed to reject order: " + err.message);
    } finally {
      setUpdating(false);
    }
  };

  const toggleImageZoom = () => {
    setImageZoomed(!imageZoomed);
  };

  // Enhanced helper function to correctly handle the image data
  const getImageSource = () => {
    if (!order || !order.receiptImage) return null;

    try {
      // Handle the case where receiptImage is a string containing the data URL
      if (typeof order.receiptImage === "string") {
        return order.receiptImage;
      }

      // Handle the case where receiptImage is an object with data property
      if (order.receiptImage && typeof order.receiptImage === "object") {
        // If data is already a base64 string with data: prefix
        if (typeof order.receiptImage.data === "string") {
          if (order.receiptImage.data.startsWith("data:")) {
            return order.receiptImage.data;
          }

          // Otherwise construct the full data URL
          const contentType =
            order.receiptImage.contentType ||
            order.receiptImageMetadata?.mimetype ||
            "image/jpeg";
          return `data:${contentType};base64,${order.receiptImage.data}`;
        }

        // If data is an array (Buffer representation in JSON)
        if (Array.isArray(order.receiptImage.data)) {
          const contentType =
            order.receiptImage.contentType ||
            order.receiptImageMetadata?.mimetype ||
            "image/jpeg";
          const base64String = btoa(
            order.receiptImage.data
              .map((byte) => String.fromCharCode(byte))
              .join("")
          );
          return `data:${contentType};base64,${base64String}`;
        }

        // Handle direct data property
        if (
          order.receiptImage.data &&
          order.receiptImage.data.startsWith("data:")
        ) {
          return order.receiptImage.data;
        }
      }

      console.warn("Unsupported receiptImage format:", order.receiptImage);
      return null;
    } catch (error) {
      console.error("Error processing receipt image:", error);
      return null;
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    if (typeof amount === "number") {
      return `Rs. ${amount.toLocaleString()}`;
    }
    return `Rs. ${amount || "0"}`;
  };

  if (loading) {
    return (
      <div className="flex">
        <Sidebar isOpen={true} toggleSidebar={() => {}} />
        <div className="ml-80 flex-1 bg-gray-50 p-6">
          <div className="flex items-center justify-center h-64">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="ml-4 text-gray-500">Loading order details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex">
        <Sidebar isOpen={true} toggleSidebar={() => {}} />
        <div className="ml-80 flex-1 bg-gray-50 p-6">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <strong>Error: </strong>
            {error}
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex">
        <Sidebar isOpen={true} toggleSidebar={() => {}} />
        <div className="ml-80 flex-1 bg-gray-50 p-6">
          <div className="text-center py-8">
            <p className="text-gray-500">Order not found</p>
          </div>
        </div>
      </div>
    );
  }

  const imageSource = getImageSource();

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
                className="absolute top-2 right-2 bg-white rounded-full p-1 hover:bg-gray-100"
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
          className="mb-4 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md transition-colors"
        >
          &larr; Back to Transactions
        </button>

        <div className="bg-white rounded-md p-6 mb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* LEFT SIDE - Transaction Details */}
          <div className="flex space-x-4">
            <div className="text-center">
              <User className="h-12 w-12 text-gray-500 mx-auto" />
              <p className="mt-2 text-gray-600 text-xs">
                {order.customer || order.customerName}
              </p>
              <p className="text-gray-600 text-xs">Order #: {order.orderId}</p>
              <p className="text-gray-500 text-xs">
                {order.orderDate
                  ? new Date(order.orderDate).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
            <div className="flex-1">
              <h2 className="text-sm font-semibold mb-2 text-gray-700">
                Transaction Screenshot
              </h2>
              <div
                className="w-full h-40 bg-gray-100 flex items-center justify-center rounded-md mb-4 overflow-hidden cursor-pointer border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors"
                onClick={imageSource ? toggleImageZoom : undefined}
              >
                {imageSource ? (
                  <img
                    src={imageSource}
                    alt="Receipt"
                    className="object-contain h-full w-full"
                    onError={(e) => {
                      console.error("Image failed to load:", e);
                      e.target.style.display = "none";
                      e.target.parentElement.innerHTML = `
                        <div class="flex flex-col items-center justify-center text-gray-500">
                          <svg class="h-10 w-10 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                          </svg>
                          <p class="text-sm">Failed to load image</p>
                        </div>
                      `;
                    }}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-gray-500">
                    <ImageIcon className="h-10 w-10 mb-2" />
                    <p className="text-sm">No image available</p>
                  </div>
                )}
              </div>
              {imageSource && (
                <p className="text-xs text-blue-500 text-center mb-2">
                  Click to zoom image
                </p>
              )}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold">AMOUNT RECEIVED:</h3>
                  <span className="text-lg font-bold text-red-600">
                    {formatCurrency(order.totalAmount)}
                  </span>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>
                    <span className="font-medium">From:</span>{" "}
                    {order.accountHolderName || "Not provided"}
                  </p>
                  <p>
                    <span className="font-medium">Bank:</span>{" "}
                    {order.paidBankName || "Not provided"}
                  </p>
                  <p>
                    <span className="font-medium">Transaction ID:</span>{" "}
                    {order.transactionId || "Not provided"}
                  </p>
                  <p>
                    <span className="font-medium">Payment Method:</span>{" "}
                    {order.paymentMethod || "Bank Transfer"}
                  </p>
                  <p>
                    <span className="font-medium">Status:</span>
                    <span
                      className={`ml-1 px-2 py-1 rounded text-xs font-medium ${
                        order.status === "pay-not-confirmed"
                          ? "bg-yellow-100 text-yellow-800"
                          : order.status === "order-confirmed"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {order.status || "Unknown"}
                    </span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigate(`/bank-view/${orderId}`)}
                className="mt-4 w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-md font-medium transition-colors"
              >
                Double Check Manually
              </button>
            </div>
          </div>

          {/* RIGHT SIDE - Approval Section */}
          <div>
            <h3 className="text-gray-700 font-semibold mb-3">Final Approval</h3>
            <div className="flex space-x-2 mb-4">
              <button
                onClick={handleApprove}
                disabled={updating}
                className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white py-2 rounded-md font-medium transition-colors"
              >
                {updating ? "Processing..." : "Approved"}
              </button>
              <button
                onClick={handleReject}
                disabled={updating}
                className="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white py-2 rounded-md font-medium transition-colors"
              >
                {updating ? "Processing..." : "Not Approved"}
              </button>
            </div>
            <div className="border rounded-md p-4">
              <p className="font-medium mb-2 text-gray-700">
                If not approved, select a reason:
              </p>
              <div className="space-y-2 mb-3 text-sm text-gray-600">
                {reasons.map((r) => (
                  <label key={r} className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="reason"
                      value={r}
                      checked={reason === r}
                      onChange={() => setReason(r)}
                      className="mr-2"
                    />
                    <span className="capitalize">{r}</span>
                  </label>
                ))}
              </div>
              {reason === "other" && (
                <input
                  type="text"
                  placeholder="Write your reason"
                  className="w-full border border-gray-300 rounded-md p-2 mb-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={otherText}
                  onChange={(e) => setOtherText(e.target.value)}
                />
              )}
            </div>
          </div>
        </div>

        {/* ORDER DETAILS */}
        <div className="bg-white rounded-md p-6">
          <h3 className="text-gray-700 font-semibold mb-4">Order Details</h3>
          <div className="border rounded-md p-4 space-y-4">
            {/* Order Items */}
            {order.items && order.items.length > 0 ? (
              order.items.map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Package className="w-8 h-8 text-gray-500" />
                    <div>
                      <p className="font-medium">{item.productName}</p>
                      <p className="text-xs text-gray-600">
                        Qty: {item.quantity}{" "}
                        {item.weight && `• Weight: ${item.weight}`}
                      </p>
                      {item.unitPrice && (
                        <p className="text-xs text-gray-500">
                          Unit Price: {formatCurrency(item.unitPrice)}
                        </p>
                      )}
                    </div>
                  </div>
                  <p className="font-medium">
                    {formatCurrency(item.totalPrice)}
                  </p>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-gray-500">
                No items found
              </div>
            )}

            {/* Order Summary */}
            <div className="pt-4 border-t space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>
                  {formatCurrency(
                    order.items
                      ? order.items.reduce(
                          (sum, item) => sum + (item.totalPrice || 0),
                          0
                        )
                      : 0
                  )}
                </span>
              </div>

              {order.deliveryCharge > 0 && (
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span>{formatCurrency(order.deliveryCharge)}</span>
                </div>
              )}

              {order.ecoDeliveryDiscount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Eco Delivery Discount</span>
                  <span>-{formatCurrency(order.ecoDeliveryDiscount)}</span>
                </div>
              )}

              {order.firstOrderDiscount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>First Order Discount</span>
                  <span>-{formatCurrency(order.firstOrderDiscount)}</span>
                </div>
              )}

              <div className="flex justify-between font-bold text-gray-800 pt-2 border-t">
                <span>Total Amount</span>
                <span>{formatCurrency(order.totalAmount)}</span>
              </div>
            </div>

            {/* Delivery Information */}
            {(order.deliveryAddress ||
              order.deliveryLocation ||
              order.deliveryOption) && (
              <div className="pt-4 border-t">
                <h4 className="font-medium text-gray-700 mb-2">
                  Delivery Information
                </h4>
                <div className="text-sm text-gray-600 space-y-1">
                  {order.deliveryOption && (
                    <p>
                      <span className="font-medium">Delivery Option:</span>{" "}
                      {order.deliveryOption}
                    </p>
                  )}
                  {order.deliveryLocation && (
                    <p>
                      <span className="font-medium">Location:</span>{" "}
                      {order.deliveryLocation}
                    </p>
                  )}
                  {order.deliveryAddress && (
                    <div>
                      <p className="font-medium">Address:</p>
                      <div className="ml-2">
                        {order.deliveryAddress.nickname && (
                          <p>• {order.deliveryAddress.nickname}</p>
                        )}
                        {order.deliveryAddress.fullAddress && (
                          <p>• {order.deliveryAddress.fullAddress}</p>
                        )}
                        {order.deliveryAddress.area && (
                          <p>• Area: {order.deliveryAddress.area}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Customer Information */}
            <div className="pt-4 border-t">
              <h4 className="font-medium text-gray-700 mb-2">
                Customer Information
              </h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p>
                  <span className="font-medium">Name:</span>{" "}
                  {order.customer || order.customerName}
                </p>
                <p>
                  <span className="font-medium">Phone:</span>{" "}
                  {order.customerPhone}
                </p>
                <p>
                  <span className="font-medium">Customer ID:</span>{" "}
                  {order.customerId}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
