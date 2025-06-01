import React, { useState, useEffect } from "react";
import {
  Bell,
  Search as SearchIcon,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  Settings,
  TrendingUp,
} from "lucide-react";
import Sidebar from "../Sidebar/sidebar";

export default function FillingInventory() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [fillingQuantities, setFillingQuantities] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalProducts, setTotalProducts] = useState(0);
  const [successMessage, setSuccessMessage] = useState("");
  const [confirmationDialog, setConfirmationDialog] = useState({
    show: false,
    productId: null,
    productName: "",
    quantity: 0,
  });

  // Fetch products from API
  const fetchProducts = async () => {
    try {
      setLoading(true);

      // Try different possible API endpoints
      const possibleEndpoints = [
        "/api/products",
        "/api/product",
        "http://localhost:5000/api/products",
        "http://localhost:3001/api/products",
        "http://localhost:8000/api/products",
      ];

      let response;
      let workingEndpoint = null;

      for (const endpoint of possibleEndpoints) {
        try {
          console.log(`Trying endpoint: ${endpoint}`);
          response = await fetch(endpoint);

          if (response.ok) {
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
              workingEndpoint = endpoint;
              break;
            }
          }
        } catch (endpointError) {
          console.log(`Failed to reach ${endpoint}:`, endpointError.message);
          continue;
        }
      }

      if (!workingEndpoint) {
        setError("API not connected - Please check your server connection");
        setProducts([]);
        return;
      }

      console.log(`Using endpoint: ${workingEndpoint}`);
      const data = await response.json();

      if (data.success) {
        // Transform data to include threshold calculations
        const transformedProducts = data.data.map((product) => {
          // Calculate the effective reorder threshold for this product
          let reorderThreshold = 5; // Default fallback
          let thresholdSource = "default";

          if (
            product.useAmountStockmintoReorder &&
            product.AmountStockmintoReorder
          ) {
            reorderThreshold = product.AmountStockmintoReorder;
            thresholdSource = "custom";
          } else if (product.AmountStockmintoReorder) {
            reorderThreshold = product.AmountStockmintoReorder;
            thresholdSource = "minimum";
          }

          return {
            ...product,
            reorderThreshold,
            thresholdSource,
          };
        });

        setProducts(transformedProducts);
        setTotalProducts(transformedProducts.length);

        // Initialize filling quantities
        const initialQuantities = {};
        transformedProducts.forEach((product) => {
          initialQuantities[product._id] = 0;
        });
        setFillingQuantities(initialQuantities);
        setError(""); // Clear any previous errors
      } else {
        setError(data.message || "Failed to fetch products");
        setProducts([]);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError(`Error fetching products: ${err.message}`);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter products based on search term
  const filteredProducts = products.filter(
    (product) =>
      product.productId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.categories?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Paginate filtered products
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Handle quantity changes
  const increaseQuantity = (productId) => {
    setFillingQuantities((prev) => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1,
    }));
  };

  const decreaseQuantity = (productId) => {
    setFillingQuantities((prev) => ({
      ...prev,
      [productId]: Math.max((prev[productId] || 0) - 1, 0),
    }));
  };

  const handleQuantityInputChange = (productId, value) => {
    const numValue = parseInt(value) || 0;
    setFillingQuantities((prev) => ({
      ...prev,
      [productId]: Math.max(numValue, 0),
    }));
  };

  // Show confirmation dialog
  const showConfirmation = (productId, productName) => {
    const quantity = fillingQuantities[productId] || 0;
    if (quantity > 0) {
      setConfirmationDialog({
        show: true,
        productId,
        productName,
        quantity,
      });
    }
  };

  // Update inventory
  const updateInventory = async () => {
    const { productId, quantity } = confirmationDialog;

    try {
      // Try different possible API endpoints for inventory update
      const possibleEndpoints = [
        `/api/products/fill-inventory/${productId}`,
        `/api/product/fill-inventory/${productId}`,
        `http://localhost:5000/api/products/fill-inventory/${productId}`,
        `http://localhost:3001/api/products/fill-inventory/${productId}`,
        `http://localhost:8000/api/products/fill-inventory/${productId}`,
      ];

      let response;
      let workingEndpoint = null;

      for (const endpoint of possibleEndpoints) {
        try {
          console.log(`Trying update endpoint: ${endpoint}`);
          response = await fetch(endpoint, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ fillQuantity: quantity }),
          });

          if (response.ok) {
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
              workingEndpoint = endpoint;
              break;
            }
          }
        } catch (endpointError) {
          console.log(`Failed to reach ${endpoint}:`, endpointError.message);
          continue;
        }
      }

      if (!workingEndpoint) {
        // Fallback: Simulate successful update for development
        console.log("API not available, simulating update...");

        // Update the product in local state (simulation)
        setProducts((prev) =>
          prev.map((product) =>
            product._id === productId
              ? { ...product, Stock: (product.Stock || 0) + quantity }
              : product
          )
        );

        // Reset filling quantity for this product
        setFillingQuantities((prev) => ({
          ...prev,
          [productId]: 0,
        }));

        // Show success message
        const productName = confirmationDialog.productName;
        const newStock =
          (products.find((p) => p._id === productId)?.Stock || 0) + quantity;
        setSuccessMessage(
          `Successfully filled ${quantity} units for ${productName}. New Stock: ${newStock} (Simulated - API not connected)`
        );
        setTimeout(() => setSuccessMessage(""), 5000);

        setConfirmationDialog({
          show: false,
          productId: null,
          productName: "",
          quantity: 0,
        });
        return;
      }

      const data = await response.json();

      if (data.success) {
        // Update the product in local state
        setProducts((prev) =>
          prev.map((product) =>
            product._id === productId
              ? { ...product, Stock: data.data.Stock }
              : product
          )
        );

        // Reset filling quantity for this product
        setFillingQuantities((prev) => ({
          ...prev,
          [productId]: 0,
        }));

        // Show success message
        setSuccessMessage(
          `Successfully filled ${quantity} units for ${confirmationDialog.productName}. New Stock: ${data.data.Stock}`
        );
        setTimeout(() => setSuccessMessage(""), 5000);
      } else {
        setError(data.message || "Failed to update inventory");
        setTimeout(() => setError(""), 5000);
      }
    } catch (err) {
      console.error("Update error:", err);
      setError("Error updating inventory: " + err.message);
      setTimeout(() => setError(""), 5000);
    } finally {
      setConfirmationDialog({
        show: false,
        productId: null,
        productName: "",
        quantity: 0,
      });
    }
  };

  // Calculate Stock after fill
  const getStockAfterFill = (productId, currentStock) => {
    const fillingQuantity = fillingQuantities[productId] || 0;
    return (currentStock || 0) + fillingQuantity;
  };

  // Check if product is low on Stock using reorderThreshold
  const getStockStatus = (product) => {
    const currentStock = product.Stock || 0;
    const reorderThreshold = product.reorderThreshold || 5;
    const criticalThreshold = Math.ceil(reorderThreshold * 0.5);

    if (currentStock === 0) {
      return {
        status: "Out of Stock",
        color: "text-red-700",
        bg: "bg-red-100",
        priority: "critical",
        icon: AlertCircle,
      };
    }

    if (currentStock <= criticalThreshold) {
      return {
        status: "Critical Low",
        color: "text-red-600",
        bg: "bg-red-50",
        priority: "critical",
        icon: AlertCircle,
      };
    }

    if (currentStock <= reorderThreshold) {
      return {
        status: "Low Stock",
        color: "text-orange-600",
        bg: "bg-orange-50",
        priority: "warning",
        icon: AlertCircle,
      };
    }

    return {
      status: "Good Stock",
      color: "text-green-600",
      bg: "bg-green-50",
      priority: "good",
      icon: CheckCircle,
    };
  };

  // Get fill recommendation based on threshold
  const getFillRecommendation = (product) => {
    const currentStock = product.Stock || 0;
    const reorderThreshold = product.reorderThreshold || 5;
    const idealStock = reorderThreshold * 2;

    if (currentStock < reorderThreshold) {
      const recommended = Math.max(idealStock - currentStock, reorderThreshold);
      return {
        recommended,
        message: `Recommended: ${recommended} units`,
        urgency: currentStock === 0 ? "critical" : "warning",
      };
    }

    return {
      recommended: 0,
      message: "Stock adequate",
      urgency: "good",
    };
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">Loading products...</div>
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
        {/* Success/Error Messages */}
        {successMessage && (
          <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded flex items-center">
            <CheckCircle className="mr-2" size={20} />
            {successMessage}
          </div>
        )}

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded flex items-center">
            <AlertCircle className="mr-2" size={20} />
            {error}
          </div>
        )}

        {/* Page Header */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-semibold">
              Filling Inventory ({totalProducts} Products)
            </h2>
            <p className="text-sm text-blue-600 mt-1">
              <Settings className="inline mr-1" size={14} />
              Using smart reorder thresholds for stock recommendations
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Bell className="cursor-pointer" size={20} />
            <div className="w-8 h-8 bg-purple-500 rounded-full" />
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-4 gap-4">
          <div className="flex flex-1 max-w-md items-center gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search by ID, name, or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-4 pr-10 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <SearchIcon className="absolute right-3 top-1/2 -mt-2 text-gray-400" />
            </div>
          </div>

          <div className="text-lg font-medium">
            Showing {filteredProducts.length} of {totalProducts} products
          </div>
        </div>

        {/* Table */}
        <div className="relative overflow-x-auto bg-white rounded shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {[
                  "Product ID",
                  "Product Name",
                  "Category",
                  "Price/Unit",
                  "Current Stock",
                  "Reorder Threshold",
                  "Filling Stock",
                  "Stock After Fill",
                  "Stock Status",
                  "Fill Recommendation",
                  "Action",
                ].map((col) => (
                  <th
                    key={col}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider whitespace-nowrap"
                  >
                    {col}
                  </th>
                ))}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider whitespace-nowrap sticky right-0 bg-gray-50">
                  Fill Quantity
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {paginatedProducts.map((product) => {
                const currentStock = product.Stock || 0;
                const fillingStock = fillingQuantities[product._id] || 0;
                const stockAfterFill = getStockAfterFill(
                  product._id,
                  currentStock
                );
                const stockStatus = getStockStatus(product);
                const fillRec = getFillRecommendation(product);
                const reorderThreshold = product.reorderThreshold || 5;

                return (
                  <tr key={product._id} className={stockStatus.bg}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">
                      <div className="flex items-center gap-2">
                        {product.productId || "N/A"}
                        {product.thresholdSource === "custom" && (
                          <span className="text-xs bg-blue-100 text-blue-600 px-1 rounded">
                            Custom
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {product.productName || "Unnamed Product"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {product.categories || "Uncategorized"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      ${(product.NormalPrice || 0).toLocaleString()}
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${stockStatus.color}`}
                    >
                      <div className="flex items-center gap-2">
                        <span>{currentStock} units</span>
                        {stockStatus.priority === "critical" && (
                          <AlertCircle
                            size={14}
                            className="text-red-500 animate-pulse"
                          />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-600 font-medium">
                      <div className="flex items-center gap-1">
                        <Settings size={12} />
                        <span>{reorderThreshold}</span>
                        <span className="text-xs text-gray-500">
                          (
                          {product.thresholdSource === "custom"
                            ? "Custom"
                            : "Default"}
                          )
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 font-medium">
                      <div className="flex items-center gap-1">
                        <TrendingUp size={14} />+{fillingStock} units
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                      {stockAfterFill} units
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-1">
                        <stockStatus.icon
                          size={16}
                          className={stockStatus.color}
                        />
                        <span className={stockStatus.color}>
                          {stockStatus.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div
                        className={`${
                          fillRec.urgency === "critical"
                            ? "text-red-600 font-medium"
                            : fillRec.urgency === "warning"
                            ? "text-orange-600"
                            : "text-green-600"
                        }`}
                      >
                        {fillRec.message}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() =>
                          showConfirmation(product._id, product.productName)
                        }
                        disabled={fillingStock === 0}
                        className={`px-4 py-2 rounded text-white font-medium ${
                          fillingStock > 0
                            ? "bg-green-500 hover:bg-green-600 cursor-pointer"
                            : "bg-gray-300 cursor-not-allowed"
                        }`}
                      >
                        Fill Stock
                      </button>
                    </td>

                    {/* Sticky Quantity Column */}
                    <td className="px-6 py-4 whitespace-nowrap sticky right-0 bg-white">
                      <div className="flex flex-col items-center space-y-2">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => decreaseQuantity(product._id)}
                            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                          >
                            −
                          </button>
                          <input
                            type="number"
                            min="0"
                            value={fillingQuantities[product._id] || 0}
                            onChange={(e) =>
                              handleQuantityInputChange(
                                product._id,
                                e.target.value
                              )
                            }
                            className="w-16 text-center border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <button
                            onClick={() => increaseQuantity(product._id)}
                            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                          >
                            +
                          </button>
                        </div>
                        {fillRec.recommended > 0 && (
                          <button
                            onClick={() =>
                              setFillingQuantities((prev) => ({
                                ...prev,
                                [product._id]: fillRec.recommended,
                              }))
                            }
                            className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded hover:bg-blue-200"
                          >
                            Use Recommended
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col md:flex-row items-center justify-between mt-4 text-sm text-gray-600">
          <div className="flex items-center mb-2 md:mb-0">
            <span>Showing</span>
            <select
              className="mx-2 border rounded px-2 py-1"
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              {[10, 20, 30, 50].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
            <span>of {filteredProducts.length} filtered products</span>
          </div>

          <div className="flex items-center space-x-1">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-1 rounded hover:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-400"
            >
              <ChevronLeft size={20} />
            </button>

            {[...Array(Math.ceil(filteredProducts.length / itemsPerPage))].map(
              (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-8 h-8 flex items-center justify-center rounded ${
                    currentPage === i + 1
                      ? "bg-blue-500 text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {i + 1}
                </button>
              )
            )}

            <button
              onClick={() =>
                setCurrentPage((prev) =>
                  Math.min(
                    prev + 1,
                    Math.ceil(filteredProducts.length / itemsPerPage)
                  )
                )
              }
              disabled={
                currentPage ===
                Math.ceil(filteredProducts.length / itemsPerPage)
              }
              className="p-1 rounded hover:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-400"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Confirmation Dialog */}
        {confirmationDialog.show && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
              <div className="flex items-center mb-4">
                <AlertCircle className="text-orange-500 mr-3" size={24} />
                <h3 className="text-lg font-semibold">
                  Confirm Inventory Fill
                </h3>
              </div>

              <div className="mb-4">
                <p className="text-gray-700 mb-2">
                  Are you sure you want to fill inventory for:
                </p>
                <div className="bg-gray-100 p-3 rounded">
                  <p>
                    <strong>Product:</strong> {confirmationDialog.productName}
                  </p>
                  <p>
                    <strong>Fill Quantity:</strong> +
                    {confirmationDialog.quantity} units
                  </p>
                  <p>
                    <strong>Current Stock:</strong>{" "}
                    {products.find(
                      (p) => p._id === confirmationDialog.productId
                    )?.Stock || 0}{" "}
                    units
                  </p>
                  <p>
                    <strong>New Stock:</strong>{" "}
                    {(products.find(
                      (p) => p._id === confirmationDialog.productId
                    )?.Stock || 0) + confirmationDialog.quantity}{" "}
                    units
                  </p>
                  <p>
                    <strong>Reorder Threshold:</strong>{" "}
                    {products.find(
                      (p) => p._id === confirmationDialog.productId
                    )?.reorderThreshold || 5}{" "}
                    units
                  </p>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() =>
                    setConfirmationDialog({
                      show: false,
                      productId: null,
                      productName: "",
                      quantity: 0,
                    })
                  }
                  className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={updateInventory}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Confirm Fill
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
