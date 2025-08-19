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
  Camera,
  MapPin,
  Clock,
  Upload,
  Star,
} from "lucide-react";

const API_BASE_URL = "http://localhost:5000";

const DriverOnDeliveryDashboard = ({ selectedRole, setSelectedRole }) => {
  const [activeDeliveries, setActiveDeliveries] = useState([]);
  const [currentDelivery, setCurrentDelivery] = useState(null);
  const [stats, setStats] = useState({
    totalDeliveries: 0,
    completed: 0,
    inProgress: 0,
    estimatedTime: "0h",
  });
  const [loading, setLoading] = useState(true);
  const [showPhotoUpload, setShowPhotoUpload] = useState(false);
  const [deliveryPhoto, setDeliveryPhoto] = useState(null);
  const [deliveryNotes, setDeliveryNotes] = useState("");
  const [customerSatisfaction, setCustomerSatisfaction] = useState(5);
  const [customerConfirmed, setCustomerConfirmed] = useState(false);

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
      active: false,
      color: "bg-gray-100 text-gray-700",
    },
    {
      name: "Driver on Delivery",
      icon: Navigation,
      active: true,
      color: "bg-gray-800 text-white",
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
    fetchActiveDeliveries();
    fetchStats();
    const interval = setInterval(() => {
      fetchActiveDeliveries();
      fetchStats();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (activeDeliveries.length > 0 && !currentDelivery) {
      // Auto-select first delivery
      setCurrentDelivery(activeDeliveries[0]);
    }
  }, [activeDeliveries]);

  const fetchActiveDeliveries = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/driver-on-delivery/active-deliveries`
      );
      const data = await response.json();
      setActiveDeliveries(data);
    } catch (error) {
      console.error("Error fetching active deliveries:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/driver-on-delivery/stats`
      );
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const handleMarkArrived = async () => {
    if (!currentDelivery) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/driver-on-delivery/mark-arrived/${currentDelivery.orderId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            driverId: "DR_001",
            driverName: "Driver",
            location: {
              address: currentDelivery.deliveryAddress?.fullAddress || "",
            },
          }),
        }
      );

      if (response.ok) {
        alert("Marked as arrived successfully!");
        fetchActiveDeliveries();
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error("Error marking as arrived:", error);
      alert("Failed to mark as arrived");
    }
  };

  const handlePhotoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setDeliveryPhoto({
          file: file,
          base64: e.target.result.split(",")[1],
          preview: e.target.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadDeliveryPhoto = async () => {
    if (!deliveryPhoto || !currentDelivery) return;

    try {
      const formData = new FormData();
      formData.append("deliveryPhoto", deliveryPhoto.file);
      formData.append("driverId", "DR_001");
      formData.append("driverName", "Driver");
      formData.append("notes", deliveryNotes);

      const response = await fetch(
        `${API_BASE_URL}/api/driver-on-delivery/upload-delivery-photo/${currentDelivery.orderId}`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        alert("Delivery photo uploaded successfully!");
        setShowPhotoUpload(false);
        setDeliveryPhoto(null);
        setDeliveryNotes("");
        fetchActiveDeliveries();
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error("Error uploading photo:", error);
      alert("Failed to upload photo");
    }
  };

  const handleCompleteDelivery = async () => {
    if (!currentDelivery) return;

    if (
      !currentDelivery.deliveryPhotos ||
      currentDelivery.deliveryPhotos.length === 0
    ) {
      alert("Please upload a delivery photo before completing the delivery!");
      return;
    }

    if (!customerConfirmed) {
      alert("Please confirm that the customer has received the delivery!");
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/driver-on-delivery/complete-delivery/${currentDelivery.orderId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            driverId: "DR_001",
            driverName: "Driver",
            customerConfirmed: customerConfirmed,
            deliveryNotes: deliveryNotes,
            customerSatisfaction: customerSatisfaction,
          }),
        }
      );

      if (response.ok) {
        alert("Delivery completed successfully!");
        setCurrentDelivery(null);
        setCustomerConfirmed(false);
        setDeliveryNotes("");
        setCustomerSatisfaction(5);
        fetchActiveDeliveries();
        fetchStats();
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error("Error completing delivery:", error);
      alert("Failed to complete delivery");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Loading Driver on Delivery Dashboard
          </h2>
          <p className="text-gray-600">Fetching active deliveries...</p>
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
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Driver on Delivery Dashboard
            </h2>
            <p className="text-gray-600">
              Manage deliveries and customer confirmations
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-blue-600 mr-2" />
              <span className="text-sm text-blue-800">
                Take photo/video of receiver for verification. Customer must
                confirm delivery while you're present.
              </span>
            </div>
          </div>

          {/* Today's Deliveries Stats */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3">
              Today's Deliveries
            </h3>
            <div className="grid grid-cols-4 gap-4 text-center">
              <div className="border-r border-gray-200 pr-4">
                <div className="text-2xl font-bold">
                  {stats.totalDeliveries}
                </div>
                <div className="text-sm text-gray-600">Total Deliveries</div>
              </div>
              <div className="border-r border-gray-200 pr-4">
                <div className="text-2xl font-bold">{stats.completed}</div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>
              <div className="border-r border-gray-200 pr-4">
                <div className="text-2xl font-bold">{stats.inProgress}</div>
                <div className="text-sm text-gray-600">In Progress</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.estimatedTime}</div>
                <div className="text-sm text-gray-600">Est. Time</div>
              </div>
            </div>
          </div>

          {/* Delivery Selection */}
          {activeDeliveries.length > 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                Select Active Delivery
              </h3>
              <div className="space-y-2">
                {activeDeliveries.map((delivery, index) => (
                  <button
                    key={index}
                    className={`w-full text-left p-3 rounded border ${
                      currentDelivery?.orderId === delivery.orderId
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => setCurrentDelivery(delivery)}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">{delivery.orderId}</div>
                        <div className="text-sm text-gray-600">
                          {delivery.customerName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {delivery.deliveryAddress?.area}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">
                          {delivery.isArrived ? "Arrived" : "En Route"}
                        </div>
                        <div className="text-xs text-gray-500">
                          {delivery.totalItems} items
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Current Delivery Details */}
          {currentDelivery ? (
            <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
              <div className="flex justify-between items-center mb-4">
                <div className="text-lg font-medium text-gray-900">
                  {currentDelivery.orderId}
                </div>
                <div className="flex items-center space-x-2">
                  {currentDelivery.isArrived && (
                    <span className="inline-block px-2 py-1 text-xs font-medium rounded bg-green-100 text-green-800">
                      Arrived
                    </span>
                  )}
                  {currentDelivery.deliveryPhotos &&
                    currentDelivery.deliveryPhotos.length > 0 && (
                      <span className="inline-block px-2 py-1 text-xs font-medium rounded bg-blue-100 text-blue-800">
                        Photo Uploaded
                      </span>
                    )}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="font-medium text-gray-900">
                    {currentDelivery.customerName}
                  </div>
                  <div className="text-sm text-gray-600 flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {currentDelivery.deliveryAddress?.fullAddress ||
                      currentDelivery.deliveryAddress?.area}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-500">Phone:</div>
                    <div className="text-sm text-gray-900 flex items-center">
                      <Phone className="h-4 w-4 mr-1" />
                      {currentDelivery.customerPhone}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Items:</div>
                    <div className="text-sm text-gray-900">
                      {currentDelivery.totalItems} items
                    </div>
                  </div>
                </div>

                <div>
                  <div className="text-sm text-gray-500">Estimated Time:</div>
                  <div className="text-sm text-gray-900 flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {new Date(currentDelivery.deliveryDate).toLocaleString()}
                  </div>
                </div>

                {currentDelivery.specialInstructions && (
                  <div className="pt-4 border-t border-gray-200">
                    <div className="text-sm text-gray-500 mb-1">
                      Special Instructions:
                    </div>
                    <div className="text-sm text-gray-900 bg-yellow-50 p-2 rounded">
                      {currentDelivery.specialInstructions}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="pt-4 border-t border-gray-200 space-y-3">
                  {!currentDelivery.isArrived && (
                    <button
                      onClick={handleMarkArrived}
                      className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
                    >
                      <MapPin className="h-4 w-4 mr-2" />
                      Mark as Arrived
                    </button>
                  )}

                  {currentDelivery.isArrived && (
                    <>
                      {/* Photo Upload Section */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">
                            Delivery Verification Photo
                          </span>
                          {currentDelivery.deliveryPhotos &&
                          currentDelivery.deliveryPhotos.length > 0 ? (
                            <span className="text-xs text-green-600">
                              ✓ Photo uploaded
                            </span>
                          ) : (
                            <span className="text-xs text-red-600">
                              Photo required
                            </span>
                          )}
                        </div>

                        {(!currentDelivery.deliveryPhotos ||
                          currentDelivery.deliveryPhotos.length === 0) && (
                          <div className="space-y-2">
                            <input
                              type="file"
                              accept="image/*,video/*"
                              onChange={handlePhotoUpload}
                              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />

                            {deliveryPhoto && (
                              <div className="space-y-2">
                                <img
                                  src={deliveryPhoto.preview}
                                  alt="Delivery verification"
                                  className="w-full h-48 object-cover rounded border"
                                />
                                <textarea
                                  value={deliveryNotes}
                                  onChange={(e) =>
                                    setDeliveryNotes(e.target.value)
                                  }
                                  placeholder="Add delivery notes (optional)"
                                  className="w-full p-2 border border-gray-300 rounded text-sm"
                                  rows="2"
                                />
                                <button
                                  onClick={uploadDeliveryPhoto}
                                  className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors flex items-center justify-center"
                                >
                                  <Upload className="h-4 w-4 mr-2" />
                                  Upload Photo
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Customer Confirmation */}
                      {currentDelivery.deliveryPhotos &&
                        currentDelivery.deliveryPhotos.length > 0 && (
                          <div className="space-y-3">
                            <div className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id="customerConfirmed"
                                checked={customerConfirmed}
                                onChange={(e) =>
                                  setCustomerConfirmed(e.target.checked)
                                }
                                className="rounded"
                              />
                              <label
                                htmlFor="customerConfirmed"
                                className="text-sm"
                              >
                                Customer confirmed receipt of delivery
                              </label>
                            </div>

                            <div className="space-y-2">
                              <label className="text-sm font-medium">
                                Customer Satisfaction (1-5 stars):
                              </label>
                              <div className="flex space-x-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <button
                                    key={star}
                                    onClick={() =>
                                      setCustomerSatisfaction(star)
                                    }
                                    className={`p-1 ${
                                      star <= customerSatisfaction
                                        ? "text-yellow-400"
                                        : "text-gray-300"
                                    }`}
                                  >
                                    <Star className="h-5 w-5 fill-current" />
                                  </button>
                                ))}
                              </div>
                            </div>

                            <textarea
                              value={deliveryNotes}
                              onChange={(e) => setDeliveryNotes(e.target.value)}
                              placeholder="Final delivery notes (optional)"
                              className="w-full p-2 border border-gray-300 rounded text-sm"
                              rows="2"
                            />

                            <button
                              onClick={handleCompleteDelivery}
                              disabled={!customerConfirmed}
                              className={`w-full py-3 rounded-md transition-colors flex items-center justify-center ${
                                customerConfirmed
                                  ? "bg-green-600 text-white hover:bg-green-700"
                                  : "bg-gray-400 text-gray-200 cursor-not-allowed"
                              }`}
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Complete Delivery
                            </button>
                          </div>
                        )}
                    </>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
              {activeDeliveries.length === 0 ? (
                <>
                  <Navigation className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No Active Deliveries
                  </h3>
                  <p className="text-gray-600">
                    All deliveries have been completed. Great work!
                  </p>
                </>
              ) : (
                <>
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Select a Delivery
                  </h3>
                  <p className="text-gray-600">
                    Choose a delivery from the list above to start processing.
                  </p>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DriverOnDeliveryDashboard;
