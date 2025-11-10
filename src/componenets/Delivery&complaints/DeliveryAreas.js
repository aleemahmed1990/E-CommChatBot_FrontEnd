import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Save, X, Home } from "lucide-react";
import Sidebar from "../Sidebar/sidebar";

const AreasManagement = () => {
  const [areas, setAreas] = useState([]);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [newArea, setNewArea] = useState({
    name: "",
    displayName: "",
    truckPrice: 0,
    scooterPrice: 0,
  });

  // Fetch areas from API
  const fetchAreas = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://e-commchatbot-backend-4.onrender.com/api/areas"
      );

      if (response.ok) {
        const areasData = await response.json();
        setAreas(areasData);
      } else {
        console.error("Failed to fetch areas");
        // If API fails, maintain existing areas
      }
    } catch (error) {
      console.error("Error fetching areas:", error);
      // If API fails, maintain existing areas
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAreas();
  }, []);

  const formatRupiah = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleAddArea = async () => {
    if (!newArea.name || !newArea.displayName) {
      alert("Please fill in required fields");
      return;
    }

    try {
      const response = await fetch(
        "https://e-commchatbot-backend-4.onrender.com/api/areas",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...newArea,
            name: newArea.name.toLowerCase(),
            isActive: true,
          }),
        }
      );

      if (response.ok) {
        const addedArea = await response.json();

        // Update state with the new area from API response
        setAreas((prevAreas) => [...prevAreas, addedArea]);

        // Reset form
        setNewArea({
          name: "",
          displayName: "",
          truckPrice: 0,
          scooterPrice: 0,
        });
        setIsAddingNew(false);

        // Show success message
        alert("Area added successfully!");
      } else {
        const errorData = await response.json();
        alert(`Failed to add area: ${errorData.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error adding area:", error);

      // Fallback: Add locally if API fails
      const tempArea = {
        _id: Date.now().toString(),
        ...newArea,
        name: newArea.name.toLowerCase(),
        isActive: true,
        createdAt: new Date().toISOString(),
      };

      setAreas((prevAreas) => [...prevAreas, tempArea]);
      setNewArea({
        name: "",
        displayName: "",
        truckPrice: 0,
        scooterPrice: 0,
      });
      setIsAddingNew(false);
      alert("Area added locally (API unavailable)");
    }
  };

  const handleUpdateArea = async (id, updatedData) => {
    try {
      const response = await fetch(
        `https://e-commchatbot-backend-4.onrender.com/api/areas/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedData),
        }
      );

      if (response.ok) {
        const updatedArea = await response.json();

        // Update the specific area in state
        setAreas((prevAreas) =>
          prevAreas.map((area) => (area._id === id ? updatedArea : area))
        );
        setEditingId(null);
        alert("Area updated successfully!");
      } else {
        const errorData = await response.json();
        alert(`Failed to update area: ${errorData.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error updating area:", error);

      // Fallback: Update locally if API fails
      setAreas((prevAreas) =>
        prevAreas.map((area) =>
          area._id === id ? { ...area, ...updatedData } : area
        )
      );
      setEditingId(null);
      alert("Area updated locally (API unavailable)");
    }
  };

  const handleDeleteArea = async (id) => {
    if (!window.confirm("Are you sure you want to delete this area?")) return;

    try {
      const response = await fetch(
        `https://e-commchatbot-backend-4.onrender.com/api/areas/${id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        // Remove from state only after successful API call
        setAreas((prevAreas) => prevAreas.filter((area) => area._id !== id));
        alert("Area deleted successfully!");
      } else {
        const errorData = await response.json();
        alert(`Failed to delete area: ${errorData.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error deleting area:", error);

      // Fallback: Delete locally if API fails
      setAreas((prevAreas) => prevAreas.filter((area) => area._id !== id));
      alert("Area deleted locally (API unavailable)");
    }
  };

  const toggleAreaStatus = async (id) => {
    const area = areas.find((a) => a._id === id);
    const newStatus = !area.isActive;

    await handleUpdateArea(id, { isActive: newStatus });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen">
        <Sidebar
          isOpen={isSidebarOpen}
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />
        <div
          className={`transition-all duration-300 ${
            isSidebarOpen ? "lg:ml-80" : ""
          } w-full bg-gray-50 p-4`}
        >
          <div className="bg-purple-900 text-white p-4 flex items-center">
            <Home className="mr-2" size={20} />
            <h1 className="text-xl font-semibold">Areas Management</h1>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 mt-4">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded mb-4"></div>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-20 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <div
        className={`transition-all duration-300 ${
          isSidebarOpen ? "lg:ml-80" : ""
        } w-full bg-gray-50 p-4`}
      >
        <div className="bg-purple-900 text-white p-4 flex items-center">
          <Home className="mr-2" size={20} />
          <h1 className="text-xl font-semibold">Areas Management</h1>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mt-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Delivery Areas ({areas.length})
            </h2>
            <button
              onClick={() => setIsAddingNew(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus size={20} />
              Add New Area
            </button>
          </div>

          {/* Add New Area Form */}
          {isAddingNew && (
            <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
              <h3 className="text-lg font-semibold mb-4">Add New Area</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Area Code *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., seminyak"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={newArea.name}
                    onChange={(e) =>
                      setNewArea({ ...newArea, name: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Display Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Seminyak"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={newArea.displayName}
                    onChange={(e) =>
                      setNewArea({ ...newArea, displayName: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Truck Price (IDR)
                  </label>
                  <input
                    type="number"
                    placeholder="Truck delivery price"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={newArea.truckPrice}
                    onChange={(e) =>
                      setNewArea({
                        ...newArea,
                        truckPrice: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Scooter Price (IDR)
                  </label>
                  <input
                    type="number"
                    placeholder="Scooter delivery price"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={newArea.scooterPrice}
                    onChange={(e) =>
                      setNewArea({
                        ...newArea,
                        scooterPrice: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={handleAddArea}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Save size={16} />
                  Save Area
                </button>
                <button
                  onClick={() => {
                    setIsAddingNew(false);
                    setNewArea({
                      name: "",
                      displayName: "",
                      truckPrice: 0,
                      scooterPrice: 0,
                    });
                  }}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <X size={16} />
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Areas List */}
          <div className="space-y-4">
            {areas.map((area) => (
              <AreaCard
                key={area._id}
                area={area}
                isEditing={editingId === area._id}
                onEdit={() => setEditingId(area._id)}
                onSave={(updatedData) =>
                  handleUpdateArea(area._id, updatedData)
                }
                onCancel={() => setEditingId(null)}
                onDelete={() => handleDeleteArea(area._id)}
                onToggleStatus={() => toggleAreaStatus(area._id)}
                formatRupiah={formatRupiah}
              />
            ))}
          </div>

          {areas.length === 0 && !isAddingNew && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                No areas found. Add your first area to get started!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const AreaCard = ({
  area,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  onToggleStatus,
  formatRupiah,
}) => {
  const [editData, setEditData] = useState(area);

  useEffect(() => {
    setEditData(area);
  }, [area]);

  const handleSave = () => {
    if (!editData.name || !editData.displayName) {
      alert("Please fill in required fields");
      return;
    }
    onSave(editData);
  };

  if (isEditing) {
    return (
      <div className="border border-gray-200 rounded-lg p-4 bg-blue-50">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Area Code
            </label>
            <input
              type="text"
              value={editData.name}
              onChange={(e) =>
                setEditData({ ...editData, name: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Area name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Display Name
            </label>
            <input
              type="text"
              value={editData.displayName}
              onChange={(e) =>
                setEditData({ ...editData, displayName: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Display name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Truck Price
            </label>
            <input
              type="number"
              value={editData.truckPrice}
              onChange={(e) =>
                setEditData({
                  ...editData,
                  truckPrice: parseInt(e.target.value) || 0,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Truck price"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Scooter Price
            </label>
            <input
              type="number"
              value={editData.scooterPrice}
              onChange={(e) =>
                setEditData({
                  ...editData,
                  scooterPrice: parseInt(e.target.value) || 0,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Scooter price"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Save size={16} />
            Save
          </button>
          <button
            onClick={onCancel}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <X size={16} />
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`border border-gray-200 rounded-lg p-4 ${
        !area.isActive ? "bg-gray-100 opacity-75" : "bg-white"
      }`}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-800">
              {area.displayName}
            </h3>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                area.isActive
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {area.isActive ? "Active" : "Inactive"}
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-1">Area code: {area.name}</p>
          <p className="text-sm text-gray-600 mb-1">
            Truck price:{" "}
            <span className="font-medium">{formatRupiah(area.truckPrice)}</span>
          </p>
          <p className="text-sm text-gray-600 mb-1">
            Scooter price:{" "}
            <span className="font-medium">
              {formatRupiah(area.scooterPrice)}
            </span>
          </p>
          {area.createdAt && (
            <p className="text-xs text-gray-500 mt-2">
              Added: {new Date(area.createdAt).toLocaleDateString()}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={onToggleStatus}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              area.isActive
                ? "bg-red-100 text-red-700 hover:bg-red-200"
                : "bg-green-100 text-green-700 hover:bg-green-200"
            }`}
          >
            {area.isActive ? "Deactivate" : "Activate"}
          </button>
          <button
            onClick={onEdit}
            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AreasManagement;
