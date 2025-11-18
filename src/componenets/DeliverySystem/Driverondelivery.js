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
  X,
  ArrowLeft,
} from "lucide-react";

const API_BASE_URL = "https://e-commchatbot-backend-4.onrender.com";

const DriverOnDeliveryDashboard = ({ selectedRole, setSelectedRole }) => {
  const [activeDeliveries, setActiveDeliveries] = useState([]);
  const [currentDelivery, setCurrentDelivery] = useState(null);
  const [deliveryStep, setDeliveryStep] = useState("list"); // list, details, delivery
  const [stats, setStats] = useState({
    totalDeliveries: 0,
    completed: 0,
    inProgress: 0,
    todayDeliveries: 0,
  });
  const [loading, setLoading] = useState(true);

  // Delivery flow states
  const [deliveryPhoto, setDeliveryPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [deliveryNotes, setDeliveryNotes] = useState("");
  const [customerSatisfaction, setCustomerSatisfaction] = useState(5);
  const [customerConfirmed, setCustomerConfirmed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const roleButtons = [
    { name: "Order Overview", icon: Package },
    { name: "Packing Staff", icon: Package },
    { name: "Delivery Storage Officer", icon: Building },
    { name: "Dispatch Officer 1", icon: User },
    { name: "Dispatch Officer 2", icon: User },
    { name: "Driver", icon: Truck },
    { name: "Driver on Delivery", icon: Navigation, active: true },
  ];

  const secondRowRoles = [
    { name: "Complaint Manager on Delivery", icon: Phone },
    { name: "Complaint Manager After Delivery", icon: FileText },
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

  const fetchActiveDeliveries = async () => {
    try {
      console.log("🚗 Fetching active deliveries (on-route orders)...");
      const response = await fetch(
        `${API_BASE_URL}/api/driver-on-delivery/active-deliveries`
      );
      const data = await response.json();
      console.log(`📦 Found ${data.length} active deliveries`, data);
      setActiveDeliveries(data);
    } catch (error) {
      console.error("❌ Error fetching active deliveries:", error);
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

  // ✅ Mark as arrived
  const handleMarkArrived = async () => {
    if (!currentDelivery) return;

    try {
      console.log(`📍 Marking order ${currentDelivery.orderId} as arrived...`);

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
        console.log("✅ Marked as arrived");
        setDeliveryStep("delivery");
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error("Error marking as arrived:", error);
      alert("Failed to mark as arrived");
    }
  };

  // ✅ Handle photo upload
  const handlePhotoUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert("File size must be less than 10MB");
      return;
    }

    if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
      alert("Please upload an image or video file");
      return;
    }

    setDeliveryPhoto(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      setPhotoPreview(e.target.result);
    };
    reader.readAsDataURL(file);

    console.log("📸 Photo selected:", file.name);
  };

  // ✅ CRITICAL: Upload photo first
  const uploadDeliveryPhoto = async () => {
    if (!deliveryPhoto || !currentDelivery) {
      alert("Please select a photo first");
      return;
    }

    setIsSubmitting(true);
    setUploadProgress(0);

    try {
      console.log(
        `📤 Uploading delivery photo for order ${currentDelivery.orderId}...`
      );

      const formData = new FormData();
      formData.append("deliveryPhoto", deliveryPhoto);
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

      setUploadProgress(100);

      if (response.ok) {
        const result = await response.json();
        console.log("✅ Photo uploaded successfully:", result);

        // Update current delivery with photo
        setCurrentDelivery((prev) => ({
          ...prev,
          deliveryPhotos: [
            ...(prev.deliveryPhotos || []),
            {
              photoId: result.photoId,
              uploadedAt: result.uploadedAt,
            },
          ],
        }));

        setDeliveryPhoto(null);
        setPhotoPreview(null);
        setDeliveryNotes("");

        alert("✅ Photo uploaded successfully!");
      } else {
        const error = await response.json();
        alert(`Upload failed: ${error.error}`);
      }
    } catch (error) {
      console.error("Error uploading photo:", error);
      alert("Failed to upload photo");
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  // ✅ CRITICAL: Only complete after photo is uploaded
  const handleCompleteDelivery = async () => {
    if (!currentDelivery) {
      alert("No delivery selected");
      return;
    }

    // ✅ CRITICAL CHECK
    if (
      !currentDelivery.deliveryPhotos ||
      currentDelivery.deliveryPhotos.length === 0
    ) {
      alert(
        "❌ PHOTO REQUIRED\n\nYou must upload a delivery photo before marking the order as complete."
      );
      return;
    }

    if (!customerConfirmed) {
      alert("❌ Please confirm that the customer has received the delivery");
      return;
    }

    setIsSubmitting(true);

    try {
      console.log(
        `✅ Completing delivery for order ${currentDelivery.orderId}...`
      );
      console.log(
        `📸 Photo uploaded: Yes (${currentDelivery.deliveryPhotos.length})`
      );
      console.log(`👤 Customer confirmed: Yes`);

      const response = await fetch(
        `${API_BASE_URL}/api/driver-on-delivery/complete-delivery/${currentDelivery.orderId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            driverId: "DR_001",
            driverName: "Driver",
            customerConfirmed: true,
            deliveryNotes: deliveryNotes || "",
            customerSatisfaction: customerSatisfaction,
          }),
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log("🎉 DELIVERY COMPLETED:", result);

        alert(
          `✅ DELIVERY COMPLETED!\n\nOrder: ${currentDelivery.orderId}\nStatus: ${result.newStatus}`
        );

        setCurrentDelivery(null);
        setDeliveryStep("list");
        setDeliveryPhoto(null);
        setPhotoPreview(null);
        setDeliveryNotes("");
        setCustomerSatisfaction(5);
        setCustomerConfirmed(false);

        fetchActiveDeliveries();
        fetchStats();
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error("Error completing delivery:", error);
      alert("Failed to complete delivery");
    } finally {
      setIsSubmitting(false);
    }
  };

  const goBack = () => {
    setCurrentDelivery(null);
    setDeliveryStep("list");
    setDeliveryPhoto(null);
    setPhotoPreview(null);
    setDeliveryNotes("");
    setCustomerSatisfaction(5);
    setCustomerConfirmed(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Loading Driver on Delivery Dashboard
          </h2>
          <p className="text-gray-600">Fetching your active deliveries...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🚗 Driver on Delivery
          </h1>
          <p className="text-gray-600">
            Complete deliveries with photo verification
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

        {/* Main Content */}
        <div>
          {/* Delivery List View */}
          {deliveryStep === "list" && (
            <>
              {/* Stats */}
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
                  <div className="text-3xl font-bold text-gray-900">
                    {stats.totalDeliveries}
                  </div>
                  <div className="text-sm text-gray-600">Total Today</div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
                  <div className="text-3xl font-bold text-green-600">
                    {stats.completed}
                  </div>
                  <div className="text-sm text-gray-600">Completed</div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
                  <div className="text-3xl font-bold text-blue-600">
                    {stats.inProgress}
                  </div>
                  <div className="text-sm text-gray-600">In Progress</div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
                  <div className="text-3xl font-bold text-orange-600">
                    {stats.todayDeliveries}
                  </div>
                  <div className="text-sm text-gray-600">Assigned Today</div>
                </div>
              </div>

              {/* Warning Banner */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex items-start">
                  <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div className="ml-3">
                    <h3 className="text-sm font-semibold text-red-900">
                      Important: Photo Required for Completion
                    </h3>
                    <p className="text-sm text-red-800 mt-1">
                      📸 You MUST upload a photo with the receiver before
                      marking any order as complete.
                    </p>
                  </div>
                </div>
              </div>

              {/* Deliveries List */}
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Active Deliveries ({activeDeliveries.length})
                  </h2>
                </div>

                {activeDeliveries.length === 0 ? (
                  <div className="p-12 text-center">
                    <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No Active Deliveries
                    </h3>
                    <p className="text-gray-600">
                      All your deliveries have been completed. Great work! 🎉
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {activeDeliveries.map((delivery, index) => (
                      <div
                        key={index}
                        className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => {
                          setCurrentDelivery(delivery);
                          setDeliveryStep("details");
                        }}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              {delivery.orderId}
                            </h3>
                            <p className="text-gray-600">
                              {delivery.customerName}
                            </p>
                          </div>
                          <div>
                            {delivery.isArrived ? (
                              <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                                ✓ Arrived
                              </span>
                            ) : (
                              <span className="inline-block px-3 py-1 bg-orange-100 text-orange-800 text-xs font-semibold rounded-full">
                                En Route
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="flex items-center text-sm text-gray-600">
                            <MapPin className="h-4 w-4 mr-2" />
                            {delivery.deliveryAddress?.area}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Phone className="h-4 w-4 mr-2" />
                            {delivery.customerPhone}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Package className="h-4 w-4 mr-2" />
                            {delivery.totalItems} items
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Clock className="h-4 w-4 mr-2" />
                            {new Date(delivery.deliveryDate).toLocaleTimeString(
                              [],
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </div>
                        </div>

                        {delivery.deliveryPhotos &&
                          delivery.deliveryPhotos.length > 0 && (
                            <div className="mt-3 inline-block px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                              ✓ Photo uploaded
                            </div>
                          )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {/* Delivery Details View */}
          {deliveryStep === "details" && currentDelivery && (
            <div className="max-w-2xl mx-auto">
              <button
                onClick={goBack}
                className="mb-6 flex items-center text-blue-600 hover:text-blue-800 font-medium"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Deliveries
              </button>

              <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {currentDelivery.orderId}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">
                      Customer
                    </h3>
                    <p className="text-lg font-medium text-gray-900">
                      {currentDelivery.customerName}
                    </p>
                    <p className="text-gray-600 flex items-center mt-1">
                      <Phone className="h-4 w-4 mr-2" />
                      {currentDelivery.customerPhone}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">
                      Delivery Address
                    </h3>
                    <p className="text-lg font-medium text-gray-900">
                      {currentDelivery.deliveryAddress?.area}
                    </p>
                    <p className="text-gray-600 flex items-start mt-1">
                      <MapPin className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                      <span>
                        {currentDelivery.deliveryAddress?.fullAddress}
                      </span>
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">
                    Items ({currentDelivery.totalItems})
                  </h3>
                  <div className="space-y-2">
                    {currentDelivery.items?.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center p-2 bg-gray-50 rounded"
                      >
                        <span className="text-gray-900">
                          {item.productName}
                        </span>
                        <span className="text-gray-600">x{item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {!currentDelivery.isArrived ? (
                <button
                  onClick={handleMarkArrived}
                  className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition flex items-center justify-center"
                >
                  <MapPin className="h-5 w-5 mr-2" />
                  Mark as Arrived
                </button>
              ) : (
                <button
                  onClick={() => setDeliveryStep("delivery")}
                  className="w-full py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition flex items-center justify-center"
                >
                  <Camera className="h-5 w-5 mr-2" />
                  Continue to Delivery
                </button>
              )}
            </div>
          )}

          {/* Delivery Completion View */}
          {deliveryStep === "delivery" && currentDelivery && (
            <div className="max-w-3xl mx-auto">
              <button
                onClick={goBack}
                className="mb-6 flex items-center text-blue-600 hover:text-blue-800 font-medium"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Details
              </button>

              {/* Photo Upload - CRITICAL */}
              <div className="bg-red-50 border-2 border-red-300 rounded-lg p-6 mb-6">
                <div className="flex items-start mb-4">
                  <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="ml-3">
                    <h3 className="text-lg font-bold text-red-900">
                      📸 PHOTO UPLOAD REQUIRED
                    </h3>
                    <p className="text-red-800 mt-2">
                      You MUST upload a photo with the customer before
                      completing the delivery. This is mandatory.
                    </p>
                  </div>
                </div>

                <div className="bg-white border-2 border-dashed border-red-300 rounded-lg p-8">
                  {!photoPreview ? (
                    <div className="text-center">
                      <Camera className="h-12 w-12 text-red-600 mx-auto mb-3" />
                      <h4 className="font-semibold text-gray-900 mb-2">
                        Upload Delivery Photo
                      </h4>
                      <p className="text-sm text-gray-600 mb-4">
                        Take a photo with the customer visible
                      </p>
                      <label className="inline-block px-6 py-3 bg-red-600 text-white rounded-lg font-bold cursor-pointer hover:bg-red-700 transition">
                        📷 Choose Photo
                        <input
                          type="file"
                          accept="image/*,video/*"
                          onChange={handlePhotoUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <img
                        src={photoPreview}
                        alt="Delivery"
                        className="w-full h-64 object-cover rounded-lg border-2 border-green-300"
                      />

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Photo Notes (Optional)
                        </label>
                        <textarea
                          value={deliveryNotes}
                          onChange={(e) => setDeliveryNotes(e.target.value)}
                          placeholder="e.g., 'Handed to customer directly'"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          rows="2"
                        />
                      </div>

                      <div className="flex space-x-3">
                        <button
                          onClick={() => {
                            setDeliveryPhoto(null);
                            setPhotoPreview(null);
                          }}
                          className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-400"
                        >
                          Change Photo
                        </button>
                        <button
                          onClick={uploadDeliveryPhoto}
                          disabled={isSubmitting}
                          className={`flex-1 px-4 py-2 text-white rounded-lg font-bold transition flex items-center justify-center ${
                            isSubmitting
                              ? "bg-gray-400 cursor-not-allowed"
                              : "bg-green-600 hover:bg-green-700"
                          }`}
                        >
                          {isSubmitting ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Uploading...
                            </>
                          ) : (
                            <>
                              <Upload className="h-4 w-4 mr-2" />
                              Upload Photo
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Completion Form - Only after photo */}
              {currentDelivery.deliveryPhotos &&
                currentDelivery.deliveryPhotos.length > 0 && (
                  <>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                      <div className="flex items-center">
                        <CheckCircle className="h-6 w-6 text-green-600 mr-3" />
                        <div>
                          <h4 className="font-bold text-green-900">
                            ✓ Photo Uploaded
                          </h4>
                          <p className="text-sm text-green-800">
                            You can now complete the delivery
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-4">
                        Delivery Confirmation
                      </h3>

                      <div className="mb-6">
                        <label className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={customerConfirmed}
                            onChange={(e) =>
                              setCustomerConfirmed(e.target.checked)
                            }
                            className="h-5 w-5 rounded border-gray-300"
                          />
                          <span className="text-base font-medium text-gray-900">
                            Customer has received the delivery
                          </span>
                        </label>
                      </div>

                      <div className="mb-6">
                        <label className="block text-sm font-bold text-gray-900 mb-3">
                          Satisfaction (1-5 stars)
                        </label>
                        <div className="flex space-x-2">
                          {[1, 2, 3, 4, 5].map((rating) => (
                            <button
                              key={rating}
                              onClick={() => setCustomerSatisfaction(rating)}
                              className={`p-2 rounded transition ${
                                rating <= customerSatisfaction
                                  ? "text-yellow-400 bg-yellow-50"
                                  : "text-gray-300 bg-gray-50 hover:text-yellow-300"
                              }`}
                            >
                              <Star className="h-8 w-8 fill-current" />
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Final Notes (Optional)
                        </label>
                        <textarea
                          value={deliveryNotes}
                          onChange={(e) => setDeliveryNotes(e.target.value)}
                          placeholder="Any additional notes..."
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                          rows="2"
                        />
                      </div>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
                      <button
                        onClick={handleCompleteDelivery}
                        disabled={!customerConfirmed || isSubmitting}
                        className={`w-full py-4 text-white font-bold text-lg rounded-lg transition flex items-center justify-center ${
                          customerConfirmed && !isSubmitting
                            ? "bg-green-600 hover:bg-green-700"
                            : "bg-gray-400 cursor-not-allowed"
                        }`}
                      >
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                            Completing...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-6 w-6 mr-2" />
                            Complete Delivery
                          </>
                        )}
                      </button>
                    </div>
                  </>
                )}

              {(!currentDelivery.deliveryPhotos ||
                currentDelivery.deliveryPhotos.length === 0) && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800 font-medium">
                    ⚠️ Upload a photo to continue
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DriverOnDeliveryDashboard;
