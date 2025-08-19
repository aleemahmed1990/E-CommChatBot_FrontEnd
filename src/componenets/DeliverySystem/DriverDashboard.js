import React, { useState, useEffect } from "react";
import {
  Package,
  Building,
  Truck,
  User,
  Phone,
  FileText,
  Navigation,
  CheckCircle,
  AlertTriangle,
  Eye,
  X,
  MapPin,
  Clock,
  Camera,
  Upload,
  AlertCircle,
  MessageSquare,
} from "lucide-react";

const API_BASE_URL = "http://localhost:5000";

const DriverDashboard = ({ selectedRole, setSelectedRole }) => {
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [vehicleOrders, setVehicleOrders] = useState([]);
  const [stats, setStats] = useState({
    readyForPickup: 0,
    onRoute: 0,
    totalVehicles: 0,
  });
  const [loading, setLoading] = useState(true);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [verifiedOrders, setVerifiedOrders] = useState(new Set());

  // Complaint Modal States
  const [showComplaintModal, setShowComplaintModal] = useState(false);
  const [complaintOrder, setComplaintOrder] = useState(null);
  const [complaintData, setComplaintData] = useState({
    problemTypes: [],
    customerWantsToDo: [],
    itemReturn: "",
    solutionCustomerAskingFor: [],
    additionalNotes: "",
    mediaAttachments: [],
  });
  const [submittingComplaint, setSubmittingComplaint] = useState(false);

  const roleButtons = [
    {
      name: "Order Overview",
      icon: Package,
      active: false,
      color: "bg-gray-100 text-gray-700",
    },
    {
      name: "Packing Staff",
      icon: Package,
      active: false,
      color: "bg-gray-100 text-gray-700",
    },
    {
      name: "Delivery Storage Officer",
      icon: Building,
      active: false,
      color: "bg-gray-100 text-gray-700",
    },
    {
      name: "Dispatch Officer 1",
      icon: User,
      active: false,
      color: "bg-gray-100 text-gray-700",
    },
    {
      name: "Dispatch Officer 2",
      icon: User,
      active: false,
      color: "bg-gray-100 text-gray-700",
    },
    {
      name: "Driver",
      icon: Truck,
      active: true,
      color: "bg-gray-800 text-white",
    },
    {
      name: "Driver on Delivery",
      icon: Navigation,
      active: false,
      color: "bg-gray-100 text-gray-700",
    },
  ];

  const secondRowRoles = [
    {
      name: "Complaint Manager on Delivery",
      icon: Phone,
      active: false,
      color: "bg-gray-100 text-gray-700",
    },
    {
      name: "Complaint Manager After Delivery",
      icon: FileText,
      active: false,
      color: "bg-gray-100 text-gray-700",
    },
  ];

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (selectedVehicle) {
      fetchVehicleOrders(selectedVehicle.vehicleId);
    }
  }, [selectedVehicle]);

  const fetchData = async () => {
    try {
      await Promise.all([fetchVehicles(), fetchStats()]);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchVehicles = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/driver/vehicles`);
      const data = await response.json();
      setVehicles(data);

      if (data.length > 0 && !selectedVehicle) {
        setSelectedVehicle(data[0]);
      }
    } catch (error) {
      console.error("Error fetching vehicles:", error);
    }
  };

  const fetchVehicleOrders = async (vehicleId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/driver/vehicle/${vehicleId}/orders`
      );
      const data = await response.json();
      setVehicleOrders(data);
    } catch (error) {
      console.error("Error fetching vehicle orders:", error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/driver/stats`);
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const handleVerifyOrder = async (orderId, verified = true) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/driver/verify-order/${orderId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            driverId: "DR_001",
            driverName: "Driver",
            verified: verified,
            notes: verified
              ? "Order verified by driver"
              : "Order rejected by driver",
          }),
        }
      );

      if (response.ok) {
        if (verified) {
          setVerifiedOrders((prev) => new Set([...prev, orderId]));
        } else {
          setVerifiedOrders((prev) => {
            const newSet = new Set(prev);
            newSet.delete(orderId);
            return newSet;
          });
        }
        alert(
          `Order ${orderId} ${verified ? "verified" : "rejected"} successfully`
        );
      } else {
        const error = await response.json();
        alert(`Verification failed: ${error.error}`);
      }
    } catch (error) {
      console.error("Error verifying order:", error);
      alert("Failed to verify order");
    }
  };

  const debugDriverOrders = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/driver/debug-tracking`);
      const debugData = await response.json();

      console.log("🔍 DRIVER TRACKING DEBUG DATA:", debugData);

      alert(`DRIVER TRACKING DEBUG INFO:
    
Total Tracking Records: ${debugData.totalTracking}
Ready for Driver: ${debugData.readyForDriverCount}
On Route: ${debugData.onRouteCount}
Order Complete: ${debugData.orderCompleteCount}

Orders with 'ready for driver' status:
${debugData.orders
  .filter((o) => o.trackingStatus === "ready for driver")
  .map(
    (order) =>
      `${order.orderId}: Tracking=${order.trackingStatus}, Order=${
        order.orderStatus
      } (Vehicle: ${order.vehicleName || "None"})`
  )
  .join("\n")}

Check console for full details.`);
    } catch (error) {
      console.error("Error fetching debug info:", error);
      alert("Debug failed - check console");
    }
  };

  const handleStartRoute = async () => {
    if (!selectedVehicle) {
      alert("Please select a vehicle first");
      return;
    }

    const unverifiedOrders = vehicleOrders.filter(
      (order) => !verifiedOrders.has(order.orderId)
    );

    if (unverifiedOrders.length > 0) {
      alert(
        `Please verify all orders before starting route. ${unverifiedOrders.length} orders still need verification.`
      );
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/driver/start-route/${selectedVehicle.vehicleId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            driverId: "DR_001",
            driverName: "Driver",
          }),
        }
      );

      if (response.ok) {
        const result = await response.json();
        alert(result.message);
        // Refresh data to show updated status
        fetchData();
        setSelectedVehicle(null);
        setVehicleOrders([]);
        setVerifiedOrders(new Set());
      } else {
        const error = await response.json();
        alert(`Failed to start route: ${error.error}`);
      }
    } catch (error) {
      console.error("Error starting route:", error);
      alert("Failed to start route");
    }
  };

  const fetchOrderDetails = async (orderId) => {
    try {
      const order = vehicleOrders.find((o) => o.orderId === orderId);
      setSelectedOrder(order);
      setShowOrderModal(true);
    } catch (error) {
      console.error("Error fetching order details:", error);
    }
  };

  // Complaint handling functions
  const handleReportComplaint = (order) => {
    setComplaintOrder(order);
    setComplaintData({
      problemTypes: [],
      customerWantsToDo: [],
      itemReturn: "",
      solutionCustomerAskingFor: [],
      additionalNotes: "",
      mediaAttachments: [],
    });
    setShowComplaintModal(true);
  };

  const handleComplaintChange = (field, value) => {
    setComplaintData((prev) => {
      if (
        field === "problemTypes" ||
        field === "customerWantsToDo" ||
        field === "solutionCustomerAskingFor"
      ) {
        const currentArray = prev[field];
        if (currentArray.includes(value)) {
          return {
            ...prev,
            [field]: currentArray.filter((item) => item !== value),
          };
        } else {
          return {
            ...prev,
            [field]: [...currentArray, value],
          };
        }
      } else {
        return {
          ...prev,
          [field]: value,
        };
      }
    });
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);

    files.forEach((file) => {
      if (file.size > 50 * 1024 * 1024) {
        // 50MB limit
        alert(`File ${file.name} is too large. Maximum size is 50MB.`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const mediaItem = {
          mediaId:
            Date.now().toString() + Math.random().toString(36).substr(2, 9),
          mediaType: file.type.startsWith("image/") ? "image" : "video",
          filename: file.name,
          mimetype: file.type,
          fileSize: file.size,
          base64Data: e.target.result.split(",")[1], // Remove data:image/jpeg;base64, prefix
          uploadedAt: new Date().toISOString(),
        };

        setComplaintData((prev) => ({
          ...prev,
          mediaAttachments: [...prev.mediaAttachments, mediaItem],
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeMedia = (mediaId) => {
    setComplaintData((prev) => ({
      ...prev,
      mediaAttachments: prev.mediaAttachments.filter(
        (media) => media.mediaId !== mediaId
      ),
    }));
  };

  const submitComplaint = async () => {
    if (complaintData.problemTypes.length === 0) {
      alert("Please select at least one problem type");
      return;
    }

    setSubmittingComplaint(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/complaints/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId: complaintOrder.orderId,
          customerId: complaintOrder.customerId || "unknown",
          customerName: complaintOrder.customerName,
          customerPhone: complaintOrder.customerPhone,
          driverInfo: {
            driverId: "DR_001",
            driverName: "Driver",
            driverPhone: "+1-555-0101",
            vehicleId: selectedVehicle?.vehicleId,
            vehicleName: selectedVehicle?.displayName,
          },
          problemTypes: complaintData.problemTypes,
          mediaAttachments: complaintData.mediaAttachments,
          customerWantsToDo: complaintData.customerWantsToDo,
          itemReturn: complaintData.itemReturn,
          solutionCustomerAskingFor: complaintData.solutionCustomerAskingFor,
          additionalNotes: complaintData.additionalNotes,
          deliveryLocation: {
            area: complaintOrder.deliveryAddress?.area,
            fullAddress: complaintOrder.deliveryAddress?.fullAddress,
          },
          orderValue: complaintOrder.totalAmount || 0,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        alert(
          `Complaint submitted successfully! Complaint ID: ${result.complaintId}`
        );
        setShowComplaintModal(false);
        // Refresh orders to show complaint status
        fetchVehicleOrders(selectedVehicle.vehicleId);
      } else {
        const error = await response.json();
        alert(`Failed to submit complaint: ${error.error}`);
      }
    } catch (error) {
      console.error("Error submitting complaint:", error);
      alert("Failed to submit complaint. Please try again.");
    } finally {
      setSubmittingComplaint(false);
    }
  };

  // Complaint Modal Component
  const ComplaintModal = () => {
    if (!showComplaintModal || !complaintOrder) return null;

    const problemOptions = [
      { value: "item_broken_damaged", label: "Item broken/damaged" },
      { value: "wrong_size", label: "Wrong size" },
      { value: "wrong_item_delivered", label: "Wrong item delivered" },
      { value: "not_as_described", label: "Not as described" },
      { value: "missing_item_amount", label: "Missing item(s)" },
      { value: "poor_quality", label: "Poor quality" },
      { value: "other", label: "Other" },
    ];

    const customerWantsOptions = [
      {
        value: "customer_wants_cancel_order",
        label: "Customer wants to cancel order",
      },
      {
        value: "customer_wants_replacement",
        label: "Customer wants replacement",
      },
      {
        value: "customer_wants_full_refund",
        label: "Customer wants full refund",
      },
      {
        value: "customer_wants_partial_refund_keep_product",
        label: "Customer wants partial refund (keep product)",
      },
    ];

    const itemReturnOptions = [
      {
        value: "customer_sending_order_item_back_with_truck",
        label: "Customer is sending the order/item back with the truck",
      },
      { value: "immediate_replacement", label: "Immediate replacement" },
      {
        value: "full_refund_processed_today",
        label: "Full refund processed today",
      },
      {
        value: "partial_refund_keep_defective_items",
        label: "Partial refund (keep defective items)",
      },
      {
        value: "store_credit_instead_of_refund",
        label: "Store credit instead of refund",
      },
      {
        value: "expedited_shipping_for_replacement",
        label: "Expedited shipping for replacement",
      },
      { value: "discount_on_next_order", label: "Discount on next order" },
      {
        value: "cancel_order_and_full_refund",
        label: "Cancel order and full refund",
      },
      {
        value: "exchange_for_different_size_color",
        label: "Exchange for different size/color",
      },
      { value: "other", label: "Other" },
    ];

    const solutionOptions = [
      { value: "immediate_replacement", label: "Immediate replacement" },
      {
        value: "full_refund_processed_today",
        label: "Full refund processed today",
      },
      {
        value: "partial_refund_keep_defective_items",
        label: "Partial refund (keep defective items)",
      },
      {
        value: "store_credit_instead_of_refund",
        label: "Store credit instead of refund",
      },
      {
        value: "expedited_shipping_for_replacement",
        label: "Expedited shipping for replacement",
      },
      { value: "discount_on_next_order", label: "Discount on next order" },
      {
        value: "cancel_order_and_full_refund",
        label: "Cancel order and full refund",
      },
      {
        value: "exchange_for_different_size_color",
        label: "Exchange for different size/color",
      },
      { value: "other", label: "Other" },
    ];

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-screen overflow-y-auto">
          {/* Header */}
          <div className="bg-red-50 border-b border-red-200 px-6 py-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                  Report Customer Complaint
                </h2>
                <p className="text-red-600 text-sm mt-1">
                  Order: {complaintOrder.orderId}
                </p>
              </div>
              <button
                onClick={() => setShowComplaintModal(false)}
                className="p-2 hover:bg-red-100 rounded-full"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Complaint Instructions */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
              <h3 className="text-sm font-medium text-yellow-800 mb-2">
                Complaint Reporting Instructions
              </h3>
              <ol className="list-decimal list-inside text-sm text-yellow-700 space-y-1">
                <li>Verify the problem with the customer on the line before</li>
                <li>
                  Enter the order number and select all applicable problems
                </li>
                <li>
                  Indicate what the customer wants to do (cancel, replace,
                  refund)
                </li>
                <li>Check if the customer is returning items with you</li>
                <li>
                  Describe the specific solution the customer is requesting
                </li>
                <li>
                  Submit the form - the complaint manager will contact you
                  shortly
                </li>
              </ol>
            </div>

            {/* Order Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">
                  Customer Information
                </h4>
                <p className="text-sm text-gray-600">
                  Name: {complaintOrder.customerName}
                </p>
                <p className="text-sm text-gray-600">
                  Phone: {complaintOrder.customerPhone}
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Order Information</h4>
                <p className="text-sm text-gray-600">
                  Order ID: {complaintOrder.orderId}
                </p>
                <p className="text-sm text-gray-600">
                  Items: {complaintOrder.totalItems} items
                </p>
              </div>
            </div>

            {/* Problem Selection */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                What is the problem? <span className="text-red-500">*</span>{" "}
                (Select all that apply)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {problemOptions.map((option) => (
                  <label
                    key={option.value}
                    className="flex items-center space-x-2"
                  >
                    <input
                      type="checkbox"
                      checked={complaintData.problemTypes.includes(
                        option.value
                      )}
                      onChange={() =>
                        handleComplaintChange("problemTypes", option.value)
                      }
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Photo/Video Upload */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                Upload Photo/Video of Damaged Item (Optional)
              </h3>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <div className="text-center">
                  <Upload className="mx-auto h-8 w-8 text-gray-400" />
                  <label className="mt-2 block text-sm font-medium text-gray-700 cursor-pointer">
                    Choose Files
                    <input
                      type="file"
                      multiple
                      accept="image/*,video/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                  <p className="text-xs text-gray-500 mt-1">
                    Upload images or videos (Max 50MB per file)
                  </p>
                </div>

                {complaintData.mediaAttachments.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
                    {complaintData.mediaAttachments.map((media) => (
                      <div key={media.mediaId} className="relative">
                        <div className="bg-gray-100 rounded p-2 text-center">
                          {media.mediaType === "image" ? (
                            <Camera className="h-6 w-6 mx-auto text-gray-400" />
                          ) : (
                            <FileText className="h-6 w-6 mx-auto text-gray-400" />
                          )}
                          <p className="text-xs text-gray-600 mt-1 truncate">
                            {media.filename}
                          </p>
                        </div>
                        <button
                          onClick={() => removeMedia(media.mediaId)}
                          className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Customer Wants */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                What does the customer want to do? (Select all that apply)
              </h3>
              <div className="space-y-2">
                {customerWantsOptions.map((option) => (
                  <label
                    key={option.value}
                    className="flex items-center space-x-2"
                  >
                    <input
                      type="checkbox"
                      checked={complaintData.customerWantsToDo.includes(
                        option.value
                      )}
                      onChange={() =>
                        handleComplaintChange("customerWantsToDo", option.value)
                      }
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Item Return */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                Item Return
              </h3>
              <div className="space-y-2">
                {itemReturnOptions.map((option) => (
                  <label
                    key={option.value}
                    className="flex items-center space-x-2"
                  >
                    <input
                      type="radio"
                      name="itemReturn"
                      value={option.value}
                      checked={complaintData.itemReturn === option.value}
                      onChange={(e) =>
                        handleComplaintChange("itemReturn", e.target.value)
                      }
                      className="border-gray-300"
                    />
                    <span className="text-sm">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Solution Customer is Asking For */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                Solution Customer is Asking For (Select all that apply)
              </h3>
              <div className="space-y-2">
                {solutionOptions.map((option) => (
                  <label
                    key={option.value}
                    className="flex items-center space-x-2"
                  >
                    <input
                      type="checkbox"
                      checked={complaintData.solutionCustomerAskingFor.includes(
                        option.value
                      )}
                      onChange={() =>
                        handleComplaintChange(
                          "solutionCustomerAskingFor",
                          option.value
                        )
                      }
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Additional Notes */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                Additional Notes (Optional)
              </h3>
              <textarea
                value={complaintData.additionalNotes}
                onChange={(e) =>
                  handleComplaintChange("additionalNotes", e.target.value)
                }
                placeholder="Any additional information about the complaint..."
                className="w-full border border-gray-300 rounded-md p-2 h-24"
                maxLength={1000}
              />
              <p className="text-xs text-gray-500 mt-1">
                {complaintData.additionalNotes.length}/1000 characters
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex justify-between">
            <button
              onClick={() => setShowComplaintModal(false)}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={submitComplaint}
              disabled={
                submittingComplaint || complaintData.problemTypes.length === 0
              }
              className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
            >
              {submittingComplaint ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Submitting...
                </>
              ) : (
                "Submit Complaint"
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const OrderDetailsModal = ({ order, onClose }) => {
    if (!order) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-screen overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">
                Order Verification - {order.orderId}
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-3">
                  Customer Information
                </h3>
                <div className="space-y-2">
                  <p>
                    <span className="font-medium">Name:</span>{" "}
                    {order.customerName}
                  </p>
                  <p>
                    <span className="font-medium">Phone:</span>{" "}
                    {order.customerPhone}
                  </p>
                  <p>
                    <span className="font-medium">Delivery Date:</span>{" "}
                    {new Date(order.deliveryDate).toLocaleDateString()}
                  </p>
                  <p>
                    <span className="font-medium">Time Slot:</span>{" "}
                    {order.timeSlot || "Not specified"}
                  </p>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-3 text-blue-800">
                  Delivery Address
                </h3>
                <div className="flex items-start space-x-2">
                  <MapPin className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium">{order.deliveryAddress?.area}</p>
                    <p className="text-gray-600">
                      {order.deliveryAddress?.fullAddress}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {order.specialInstructions && (
              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-6">
                <h3 className="text-lg font-semibold mb-2 flex items-center">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
                  Special Instructions
                </h3>
                <p className="text-yellow-800">{order.specialInstructions}</p>
              </div>
            )}

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">
                Items in this order ({order.totalItems} items)
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Item
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Quantity
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Weight
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {order.items?.map((item, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2">{item.productName}</td>
                        <td className="px-4 py-2">{item.quantity}</td>
                        <td className="px-4 py-2">{item.weight || "N/A"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Close
              </button>
              {!verifiedOrders.has(order.orderId) && (
                <button
                  onClick={() => {
                    handleVerifyOrder(order.orderId, true);
                    onClose();
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Verify Order
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Loading Driver Dashboard
          </h2>
          <p className="text-gray-600">
            Fetching available vehicles and orders...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        {/* Title */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            Delivery Management System
          </h1>
          <p className="text-gray-600">
            Complete workflow management from packing to delivery confirmation
          </p>
        </div>

        {/* Role Selection */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Select Role
          </h2>
          <div className="space-y-3">
            <div className="flex flex-wrap gap-3">
              {roleButtons.map((role, index) => {
                const IconComponent = role.icon;
                return (
                  <button
                    key={index}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      role.name === selectedRole
                        ? "bg-gray-800 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                    onClick={() => setSelectedRole(role.name)}
                  >
                    <IconComponent className="h-4 w-4" />
                    <span>{role.name}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex flex-wrap gap-3">
              {secondRowRoles.map((role, index) => {
                const IconComponent = role.icon;
                return (
                  <button
                    key={index}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      role.name === selectedRole
                        ? "bg-gray-800 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                    onClick={() => setSelectedRole(role.name)}
                  >
                    <IconComponent className="h-4 w-4" />
                    <span>{role.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Driver Dashboard
              </h2>
              <button
                onClick={debugDriverOrders}
                className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                title="Debug driver orders from DeliveryTracking"
              >
                🔍 Debug Tracking
              </button>
              <p className="text-gray-600">
                Final verification and delivery route management
              </p>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <CheckCircle className="h-4 w-4 mr-1" />
              {stats.readyForPickup} orders to verify
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-blue-600 mr-2" />
              <span className="text-sm text-blue-800">
                Verify all orders before starting your delivery route. Check
                items carefully for any damages.
              </span>
            </div>
          </div>

          {/* Vehicle Selection */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Select Your Vehicle
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {vehicles.map((vehicle, index) => (
                <div
                  key={index}
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                    selectedVehicle?.vehicleId === vehicle.vehicleId
                      ? "border-gray-800 bg-gray-50"
                      : "border-gray-300 bg-white hover:border-gray-400"
                  }`}
                  onClick={() => setSelectedVehicle(vehicle)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <Truck
                        className={`h-5 w-5 mr-2 ${
                          selectedVehicle?.vehicleId === vehicle.vehicleId
                            ? "text-gray-800"
                            : "text-gray-600"
                        }`}
                      />
                      <span className="font-medium text-gray-900">
                        {vehicle.displayName}
                      </span>
                    </div>
                    <span className="px-2 py-1 text-xs bg-yellow-600 text-white rounded">
                      {vehicle.status}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>Type: {vehicle.type}</div>
                    <div>Orders: {vehicle.assignedOrders.length}</div>
                    <div>
                      Load: {vehicle.totalItems}/{vehicle.maxCapacity}
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div
                        className="bg-gray-800 h-2 rounded-full"
                        style={{ width: `${vehicle.loadProgress}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {vehicle.loadProgress}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Orders Queue */}
          {selectedVehicle && (
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Dispatch Queue - Final Check ({selectedVehicle.displayName})
              </h3>
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="grid grid-cols-7 gap-4 px-6 py-3 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                  <div>Order</div>
                  <div>Customer</div>
                  <div>Delivery Time</div>
                  <div>Route</div>
                  <div>Items</div>
                  <div>Status</div>
                  <div>Actions</div>
                </div>

                {vehicleOrders.length === 0 ? (
                  <div className="p-8 text-center">
                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No Orders Assigned
                    </h3>
                    <p className="text-gray-600">
                      This vehicle has no orders ready for delivery.
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {vehicleOrders.map((order, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-7 gap-4 px-6 py-4 hover:bg-gray-50"
                      >
                        <div>
                          <div className="font-medium text-gray-900">
                            {order.orderId}
                          </div>
                          <div className="text-sm text-blue-600">
                            {order.deliveryAddress?.area}
                          </div>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {order.customerName}
                          </div>
                          <div className="flex items-center text-sm text-gray-600 mt-1">
                            <Phone className="h-3 w-3 mr-1" />
                            {order.customerPhone}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-900">
                            {new Date(order.deliveryDate).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-gray-500">
                            {order.timeSlot}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-900">
                            Route-
                            {order.deliveryAddress?.area?.substring(0, 2) ||
                              "XX"}
                            {index + 1}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-900">
                            {order.totalItems} items
                          </div>
                        </div>
                        <div>
                          {verifiedOrders.has(order.orderId) ? (
                            <span className="inline-block px-2 py-1 text-xs font-medium rounded bg-gray-800 text-white">
                              verified
                            </span>
                          ) : (
                            <span className="inline-block px-2 py-1 text-xs font-medium rounded bg-green-100 text-green-800">
                              ready for driver
                            </span>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => fetchOrderDetails(order.orderId)}
                            className="flex items-center px-3 py-1 text-xs bg-gray-800 text-white rounded hover:bg-gray-700"
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            View Details
                          </button>
                          <button
                            onClick={() =>
                              window.open(`tel:${order.customerPhone}`, "_self")
                            }
                            className="flex items-center px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                          >
                            <Phone className="h-3 w-3 mr-1" />
                            Call
                          </button>
                          <button
                            onClick={() => handleReportComplaint(order)}
                            className="flex items-center px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                          >
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Report Issue
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Ready for Delivery */}
          {selectedVehicle && vehicleOrders.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
                  <div>
                    <div className="font-medium text-yellow-800">
                      Ready for Delivery
                    </div>
                    <div className="text-sm text-yellow-700">
                      {verifiedOrders.size}/{vehicleOrders.length} orders
                      verified
                    </div>
                    <div className="text-sm text-yellow-700">
                      Vehicle: {selectedVehicle.displayName} (
                      {selectedVehicle.type})
                    </div>
                    {verifiedOrders.size < vehicleOrders.length && (
                      <div className="text-sm text-yellow-700 mt-1">
                        Please verify all orders before starting delivery route
                      </div>
                    )}
                  </div>
                </div>
                <button
                  onClick={handleStartRoute}
                  disabled={verifiedOrders.size < vehicleOrders.length}
                  className={`flex items-center px-4 py-2 rounded transition-colors ${
                    verifiedOrders.size === vehicleOrders.length
                      ? "bg-gray-800 text-white hover:bg-gray-700"
                      : "bg-gray-400 text-gray-200 cursor-not-allowed"
                  }`}
                >
                  <Navigation className="h-4 w-4 mr-2" />
                  Leaving for Delivery
                </button>
              </div>
            </div>
          )}
        </div>

        {showOrderModal && (
          <OrderDetailsModal
            order={selectedOrder}
            onClose={() => {
              setShowOrderModal(false);
              setSelectedOrder(null);
            }}
          />
        )}

        {showComplaintModal && <ComplaintModal />}
      </div>
    </div>
  );
};

export default DriverDashboard;
