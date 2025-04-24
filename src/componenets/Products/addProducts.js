import React, { useState, useRef, useEffect, useCallback } from "react";
import axios from "axios";
import { PlusIcon, XCircleIcon, SearchIcon, Save } from "lucide-react";

import Sidebar from "../Sidebar/sidebar";
import { toast } from "react-hot-toast";

const API_URL = "http://localhost:5000";

const AddProduct = () => {
  // Product type state
  const [productType, setProductType] = useState("Normal");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [parentProducts, setParentProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchingParents, setIsSearchingParents] = useState(false);
  const [isSearchingSuppliers, setIsSearchingSuppliers] = useState(false);

  // near top of AddProduct()
  const [categoriesList, setCategoriesList] = useState([]);
  useEffect(() => {
    axios
      .get(`${API_URL}/api/categories`)
      .then((res) => setCategoriesList(res.data.data))
      .catch(console.error);
  }, []);

  // Form data state with complete fields from all screens
  const [formData, setFormData] = useState({
    productId: "",
    productName: "",
    subtitle: "",
    brand: "",
    description: "",
    varianceName: "",
    subtitleDescription: "",
    heightCm: "",
    widthCm: "",
    depthCm: "",
    weightKg: "",
    specifications: [
      { height: "", length: "", width: "", depth: "", colours: "", id: 0 },
    ],
    stock: "",
    minimumOrder: 1,
    highestValue: "",
    normalShelvesCount: "",
    stockAmount: "",
    safetyDays: "",
    safetyDaysStock: "",
    // reorder flags:
    useStockAmount: false,
    useSafetyDays: false,
    noReorder: false,
    // yellow fields now readOnly No info:
    deliveryDays: "",
    deliveryTime: "",
    highShelvesCount: "",
    deliveryTime: "",
    reOrderSetting: "2 days average",
    inventoryInDays: "5days",
    deliveryPeriod: "1 days",
    orderTimeBackupInventory: "",
    alternateSupplier: "",
    supplierInformation: "",
    supplierWebsite: "",
    supplierContact: "",
    supplierName: "",
    supplierAddress: "",
    supplierEmail: "",
    anyDiscount: "",
    priceAfterDiscount: "",
    suggestedRetailPrice: "",
    visibility: "Public",
    tags: [],
    categories: "Stores",
    notes: "",
    parentProduct: "",
    globalTradeItemNumber: "",
    k3lNumber: "",
    sniNumber: "", // Add this new field
    stockAmount: "", // New field

    safetyDays: "", // New field

    deliveryDays: "", // Default value

    onceShare: false, // New visibility field

    noChildHideParent: false, // New visibility field

    subCategories: "", // New field

    safetyDaysStock: "", // Field to store calculated safety days stock amount
  });

  // Master images and more images state
  const [masterImages, setMasterImages] = useState([null]);
  const [moreImages, setMoreImages] = useState([
    null,
    null,
    null,
    null,
    null,
    null,
  ]);

  // For the tag selection
  const [selectedTags, setSelectedTags] = useState([]);
  const availableTags = ["Popular", "Sale", "New"];

  // For the suppliers suggestions
  const [suppliers, setSuppliers] = useState([
    { id: 1, name: "Almond", date: "2 Jun 2020", active: "Active" },
    { id: 11, name: "Hornet", date: "2 Jun 2020", active: "Active" },
    { id: 12, name: "Hornet", date: "2 Jun 2020", active: "Active" },
    { id: 13, name: "Hornet", date: "2 Jun 2020", active: "Active" },
  ]);
  const [filteredSuppliers, setFilteredSuppliers] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Refs for image upload
  const masterImageRef = useRef(null);
  const moreImageRefs = useRef([]);

  // New helper to toggle reorder mode:
  const handleReorderMode = (mode) => {
    setFormData((fd) => ({
      ...fd,
      useStockAmount: mode === "stock",
      useSafetyDays: mode === "safety",
    }));
  };
  // Fetch parent products and suppliers on component mount
  useEffect(() => {
    const fetchParentProducts = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/products/parents`);
        if (response.data && response.data.success) {
          setParentProducts(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching parent products:", error);
      }
    };

    const fetchSuppliers = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/suppliers`);
        if (response.data && response.data.success) {
          setSuppliers(response.data.data);
          setFilteredSuppliers(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching suppliers:", error);
      }
    };

    fetchParentProducts();
    fetchSuppliers();
  }, []);

  // right after your fetchParentProducts / fetchSuppliers useEffect:
  useEffect(() => {
    if (productType === "Child" && formData.parentProduct) {
      const parent = parentProducts.find(
        (p) => p.productId === formData.parentProduct
      );
      if (parent) {
        setFormData((fd) => ({
          ...fd,
          supplierName: parent.supplierName,
          supplierContact: parent.supplierContact,
          supplierAddress: parent.supplierAddress,
          supplierEmail: parent.supplierEmail,
        }));
      }
    }
  }, [productType, formData.parentProduct, parentProducts]);

  // Filter suppliers based on search term
  useEffect(() => {
    if (formData.alternateSupplier) {
      const filtered = suppliers.filter((supplier) =>
        supplier.name
          .toLowerCase()
          .includes(formData.alternateSupplier.toLowerCase())
      );
      setFilteredSuppliers(filtered);
    } else {
      setFilteredSuppliers(suppliers);
    }
  }, [formData.alternateSupplier, suppliers]);
  // Replace static suppliers with API fetching

  // Debounced search for suppliers
  const searchSuppliers = useCallback(
    async (term) => {
      if (!term || term.length < 2) {
        setFilteredSuppliers(suppliers.slice(0, 5));
        setShowSuggestions(false);
        return;
      }

      setIsSearchingSuppliers(true);
      try {
        const response = await axios.get(`${API_URL}/api/suppliers/search`, {
          params: { term },
        });

        if (response.data && response.data.success) {
          setFilteredSuppliers(response.data.data);
          setShowSuggestions(true);
        }
      } catch (error) {
        console.error("Error searching suppliers:", error);
        // Fallback to client-side filtering
        const filtered = suppliers.filter((supplier) =>
          supplier.name.toLowerCase().includes(term.toLowerCase())
        );
        setFilteredSuppliers(filtered);
        setShowSuggestions(true);
      } finally {
        setIsSearchingSuppliers(false);
      }
    },
    [suppliers]
  );

  // Use effect to trigger search on input change
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (formData.alternateSupplier) {
        searchSuppliers(formData.alternateSupplier);
      } else {
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [formData.alternateSupplier, searchSuppliers]);

  // Handle product type change
  const handleProductTypeChange = (type) => {
    setProductType(type);
    // Reset certain fields based on product type
    if (type === "Child") {
      setFormData((prev) => ({
        ...prev,
        parentProduct: "",
      }));
    }
  };

  // Add this function to handle success
  const handleSuccess = () => {
    setShowSuccess(true);

    // Auto-dismiss after 5 seconds and refresh page
    setTimeout(() => {
      setShowSuccess(false);
      window.location.reload();
    }, 5000);
  };

  // Update handleSpecChange to handle the new field structure
  const handleSpecChange = (index, field, value) => {
    const updatedSpecs = [...formData.specifications];
    updatedSpecs[index] = { ...updatedSpecs[index], [field]: value };
    setFormData((prev) => ({ ...prev, specifications: updatedSpecs }));
  };

  // Add new specification row
  const addSpecification = () => {
    setFormData((prev) => ({
      ...prev,
      specifications: [
        ...prev.specifications,
        {
          height: "",
          length: "",
          width: "",
          depth: "",
          colours: "",
          unit: "",
          id: prev.specifications.length,
        },
      ],
    }));
  };

  // Remove a specification
  const removeSpecification = (index) => {
    if (formData.specifications.length > 1) {
      const updatedSpecs = [...formData.specifications];
      updatedSpecs.splice(index, 1);
      setFormData((prev) => ({ ...prev, specifications: updatedSpecs }));
    }
  };

  // Handle tag selection
  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }

    // Update formData as well
    setFormData((prev) => {
      const newTags = prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag];
      return { ...prev, tags: newTags };
    });
  };

  // Handle master image upload
  const handleMasterImageUpload = (index, e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const newMasterImages = [...masterImages];
      newMasterImages[index] = {
        file,
        preview: URL.createObjectURL(file),
      };
      setMasterImages(newMasterImages);
    }
  };

  // Handle more images upload
  const handleMoreImageUpload = (index, e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const newMoreImages = [...moreImages];
      newMoreImages[index] = {
        file,
        preview: URL.createObjectURL(file),
      };
      setMoreImages(newMoreImages);
    }
  };

  // Remove master image
  const removeMasterImage = (index) => {
    const newMasterImages = [...masterImages];
    newMasterImages[index] = null;
    setMasterImages(newMasterImages);
  };

  // Remove more image
  const removeMoreImage = (index) => {
    const newMoreImages = [...moreImages];
    newMoreImages[index] = null;
    setMoreImages(newMoreImages);
  };

  // Handle selecting a suggested supplier
  const selectSupplier = (supplier) => {
    setFormData((prev) => ({
      ...prev,
      alternateSupplier: supplier.name,
      supplierName: supplier.name,
      supplierEmail: supplier.email || "",
      supplierAddress: supplier.address || "",
      supplierContact: supplier.contact || "",
      supplierWebsite: supplier.website || "",
    }));
    setShowSuggestions(false);
  };
  // Handle input changes - generic function for all form fields
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Create updated form data
    const updatedFormData = { ...formData, [name]: value };

    // Calculate safety days stock if relevant fields change
    if (name === "stockAmount" || name === "safetyDays") {
      // Simple calculation - multiply safety days by stock amount
      // This formula can be adjusted based on your specific business logic
      if (updatedFormData.stockAmount && updatedFormData.safetyDays) {
        const amount = parseFloat(updatedFormData.stockAmount);
        const days = parseFloat(updatedFormData.safetyDays);

        if (!isNaN(amount) && !isNaN(days)) {
          updatedFormData.safetyDaysStock = (amount * days).toFixed(2);
        }
      }
    }

    setFormData(updatedFormData);
  };

  // Debounced search for parent products
  const searchParentProducts = useCallback(
    async (term) => {
      if (!term || term.length < 2) {
        setSearchResults([]);
        setShowSearchResults(false);
        return;
      }

      setIsSearchingParents(true);
      try {
        // First try via API if available
        try {
          const response = await axios.get(
            `${API_URL}/api/products/parents/search`,
            {
              params: { term },
            }
          );

          if (response.data && response.data.success) {
            setSearchResults(response.data.data);
            setShowSearchResults(true);
            return;
          }
        } catch (apiError) {
          console.log("API endpoint not available, using local search");
        }

        // Fallback to client-side filtering if API fails
        const filtered = parentProducts.filter(
          (product) =>
            product.productName.toLowerCase().includes(term.toLowerCase()) ||
            product.productId?.toLowerCase().includes(term.toLowerCase())
        );

        setSearchResults(filtered);
        setShowSearchResults(true);
      } catch (error) {
        console.error("Error searching parent products:", error);
        toast.error("Failed to search parent products");
      } finally {
        setIsSearchingParents(false);
      }
    },
    [parentProducts]
  ); // Add parentProducts as a dependency
  // Select parent product
  const selectParentProduct = (product) => {
    setFormData((prev) => ({
      ...prev,
      parentProduct: product.productId,
    }));
    setSearchTerm("");
    setShowSearchResults(false);
  };

  const validateForm = () => {
    // Required fields vary based on product type
    const requiredFields = {
      Parent: [
        "productName",
        "brand",
        "description",
        "supplierName",
        "supplierContact",
      ],
      Child: [
        "parentProduct",
        "varianceName",
        "subtitleDescription",
        "supplierName",
        "supplierContact",
      ],
      Normal: [
        "productName",
        "brand",
        "description",
        "supplierName",
        "supplierContact",
      ],
    };

    // Additional required fields for all products
    const additionalRequiredFields = ["categories"];

    // Add fields based on product type
    if (productType !== "Parent") {
      additionalRequiredFields.push("globalTradeItemNumber");
    }

    // Combine the required fields
    const allRequiredFields = [
      ...requiredFields[productType],
      ...additionalRequiredFields,
    ];

    const missingFields = allRequiredFields.filter((field) => !formData[field]);

    if (missingFields.length > 0) {
      toast.error(`Please fill in: ${missingFields.join(", ")}`);
      return false;
    }

    return true;
  };
  // Submit form function with improved error handling
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Create a FormData object to handle file uploads
      const productData = new FormData();

      // Add all form fields to the FormData
      for (const key in formData) {
        if (key === "specifications" || key === "tags") {
          productData.append(key, JSON.stringify(formData[key]));
        } else {
          // Only append if the value is not undefined or null
          if (formData[key] !== undefined && formData[key] !== null) {
            productData.append(key, formData[key]);
          }
        }
      }

      // Add product type
      productData.append("productType", productType);

      // Add master image if it exists
      if (masterImages[0]?.file) {
        productData.append("masterImage", masterImages[0].file);
      }

      // Add more images if they exist
      moreImages.forEach((img, index) => {
        if (img?.file) {
          productData.append(`moreImage${index}`, img.file);
        }
      });

      console.log("Sending data to server...");

      // Debug what's being sent
      const formDataEntries = [...productData.entries()];
      console.log(
        "FormData contents:",
        formDataEntries.map((entry) => ({
          key: entry[0],
          value: entry[0].includes("Image") ? "File object" : entry[1],
        }))
      );

      // Send the data to the server
      const response = await axios.post(
        `${API_URL}/api/products`,
        productData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Server response:", response.data);

      if (response.data && response.data.success) {
        handleSuccess();
      } else {
        alert(response.data.message || "Failed to create product");
      }
    } catch (error) {
      console.error("Error creating product:", error);

      // More detailed error logging
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        console.error("Response headers:", error.response.headers);

        alert(
          `Server error: ${
            error.response.data.message ||
            error.response.statusText ||
            "Unknown error"
          }`
        );
      } else if (error.request) {
        // The request was made but no response was received
        console.error("Request made but no response received:", error.request);
        alert("No response from server. Please check your network connection.");
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error setting up request:", error.message);
        alert(`Error: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <div
        className={`transition-all duration-300 ${
          isSidebarOpen ? "lg:ml-80" : ""
        } w-full bg-gray-50 p-4`}
      >
        {/* Top navigation */}
        <div className="bg-purple-900 text-white p-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="text-sm">
              {productType === "Normal"
                ? "Create new product (stand alone normal product)"
                : productType === "Parent"
                ? "Create new product (parent)"
                : "Create new product (create another child)"}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-white bg-purple-700 px-2 py-1 rounded">
              {formData.parentProduct
                ? `Parent product: ${formData.parentProduct}`
                : ""}
            </span>
          </div>
        </div>

        {/* Form container */}
        <div className="p-4">
          <form onSubmit={handleSubmit}>
            {/* Product type selector */}
            <div className="bg-white p-4 rounded shadow mb-4">
              <div className="mb-4">
                <p className="text-sm mb-2">This product is added as:</p>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => handleProductTypeChange("Parent")}
                    className={`px-4 py-1 text-sm border ${
                      productType === "Parent"
                        ? "bg-purple-100 border-purple-500"
                        : "border-gray-300"
                    }`}
                  >
                    Parent
                  </button>
                  <span>OR</span>
                  <button
                    type="button"
                    onClick={() => handleProductTypeChange("Child")}
                    className={`px-4 py-1 text-sm border ${
                      productType === "Child"
                        ? "bg-purple-100 border-purple-500"
                        : "border-gray-300"
                    }`}
                  >
                    Child
                  </button>
                  <span>OR</span>
                  <button
                    type="button"
                    onClick={() => handleProductTypeChange("Normal")}
                    className={`px-4 py-1 text-sm border ${
                      productType === "Normal"
                        ? "bg-purple-100 border-purple-500"
                        : "border-gray-300"
                    }`}
                  >
                    Be a normal product
                  </button>
                </div>
              </div>

              {formData.parentProduct && (
                <div className="flex justify-end">
                  <div className="bg-gray-200 text-gray-600 px-4 py-1 text-sm rounded">
                    Parent product: {formData.parentProduct}
                  </div>
                </div>
              )}
              {/* Product IDs section */}
              {productType === "Child" ? (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium">
                      Parent ID (auto-generated)
                    </label>
                    <input
                      type="text"
                      disabled
                      value={formData.parentProduct || ""}
                      className="w-full border border-gray-300 p-2 rounded bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">
                      Child ID (auto-generated)
                    </label>
                    <input
                      type="text"
                      disabled
                      className="w-full border border-gray-300 p-2 rounded bg-gray-100"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium">
                    Product ID (auto-generated)
                  </label>
                  <input
                    type="text"
                    disabled
                    className="w-full border border-gray-300 p-2 rounded bg-gray-100"
                  />
                </div>
              )}

              {/* Product type specific content */}
              {productType === "Parent" && (
                <div className="mt-4 space-y-4">
                  <label className="block text-sm font-medium">
                    Product Name/Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="productName"
                    value={formData.productName}
                    onChange={handleChange}
                    className="w-full border border-gray-300 p-2 rounded"
                    required
                  />

                  <div>
                    <label className="block text-sm font-medium">Brand</label>
                    <input
                      type="text"
                      name="brand"
                      value={formData.brand}
                      onChange={handleChange}
                      className="w-full border border-gray-300 p-2 rounded"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium">
                      Product Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      className="w-full border border-gray-300 p-2 rounded"
                      rows="4"
                    ></textarea>
                  </div>
                </div>
              )}

              {productType === "Child" && (
                <div className="mt-4">
                  <div className="border-t border-gray-200 pt-4">
                    <p className="text-sm font-medium">
                      In case of child option, parent for this product
                    </p>
                    <div className="flex items-center mt-2 space-x-2">
                      <input
                        type="text"
                        placeholder="Search parent number or keywords"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="border border-gray-300 p-1 text-sm flex-grow"
                      />
                      <button
                        type="button"
                        className="bg-purple-500 text-white px-2 py-1 text-sm"
                        onClick={() => {
                          if (searchTerm) {
                            searchParentProducts(searchTerm);
                          }
                        }}
                      >
                        <SearchIcon size={14} className="inline mr-1" />
                        Search
                      </button>
                    </div>

                    {/* Search results */}
                    {/* Search results */}
                    {showSearchResults && (
                      <div className="mt-2 max-h-40 overflow-y-auto border border-gray-300 rounded">
                        <div className="p-2 text-sm font-medium border-b border-gray-200 grid grid-cols-3">
                          <div>Product name</div>
                          <div>SKU number</div>
                          <div>Brand</div>
                        </div>
                        {isSearchingParents ? (
                          <div className="p-4 text-center text-sm text-gray-500">
                            Searching...
                          </div>
                        ) : searchResults.length > 0 ? (
                          searchResults.map((product) => (
                            <div
                              key={product.productId}
                              className="p-2 hover:bg-gray-100 cursor-pointer border-b border-gray-200 grid grid-cols-3"
                              onClick={() => selectParentProduct(product)}
                            >
                              <div className="text-sm font-medium">
                                {product.productName}
                              </div>
                              <div className="text-xs text-gray-500">
                                {product.productId}
                              </div>
                              <div className="text-xs text-gray-500">
                                {product.brand || "N/A"}
                              </div>
                            </div>
                          ))
                        ) : searchTerm.length > 0 ? (
                          <div className="p-2 text-sm text-gray-500">
                            No parent products found for "{searchTerm}"
                          </div>
                        ) : (
                          <div className="p-2 text-sm text-gray-500">
                            Start typing to search for parent products
                          </div>
                        )}
                      </div>
                    )}

                    {/* Child-specific fields */}
                    <div className="mt-4 space-y-4">
                      <div>
                        <label className="block text-sm font-medium">
                          Variance Name
                        </label>
                        <input
                          type="text"
                          name="varianceName"
                          value={formData.varianceName}
                          onChange={handleChange}
                          className="w-full border border-gray-300 p-2 rounded"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium">
                          Subtitle Description
                        </label>
                        <textarea
                          name="subtitleDescription"
                          value={formData.subtitleDescription}
                          onChange={handleChange}
                          className="w-full border border-gray-300 p-2 rounded bg-gray-50"
                          rows="6"
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {productType === "Normal" && (
                <div className="mt-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium">
                      Product ID (generated automatically)
                    </label>
                    <input
                      type="text"
                      disabled
                      className="w-full border border-gray-300 p-2 rounded bg-gray-100"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium">
                        Product Name/Title
                      </label>
                      <input
                        type="text"
                        name="productName"
                        value={formData.productName}
                        onChange={handleChange}
                        className="w-full border border-gray-300 p-2 rounded"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium">
                        Product Subtitle
                      </label>
                      <input
                        type="text"
                        name="subtitle"
                        value={formData.subtitle}
                        onChange={handleChange}
                        className="w-full border border-gray-300 p-2 rounded"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium">Brand</label>
                    <input
                      type="text"
                      name="brand"
                      value={formData.brand}
                      onChange={handleChange}
                      className="w-full border border-gray-300 p-2 rounded"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium">
                      Product Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      className="w-full border border-gray-300 p-2 rounded"
                      rows="4"
                    ></textarea>
                  </div>
                </div>
              )}
            </div>

            {/* Only Supplier Information for Parent */}
            <div className="border border-red-300 p-3 rounded-lg mb-4">
              <div className="flex justify-between">
                <div className="text-xs font-medium">Allocate Supplier</div>
                <div className="flex">
                  <div className="text-xs px-2 border-r border-gray-300">
                    Supplier information
                  </div>
                  <div className="text-xs px-2 border-r border-gray-300">
                    Supplier Name
                  </div>
                  <div className="text-xs px-2">Supplier contact</div>
                </div>
              </div>
            </div>

            {/* Supplier details */}
            <div className="mb-4">
              <div className="flex gap-2 text-xs mb-1">
                <span>or use time supplier</span>
                <span className="ml-auto">search supplier</span>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-medium mb-1">
                  Supplier name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="alternateSupplier"
                    value={formData.alternateSupplier}
                    onChange={handleChange}
                    onFocus={() => {
                      if (formData.alternateSupplier) {
                        setShowSuggestions(true);
                      }
                    }}
                    placeholder="Search or enter supplier name"
                    className="w-full border border-gray-300 p-1 rounded text-sm"
                    required
                  />
                  {isSearchingSuppliers && (
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                      <div className="animate-spin h-4 w-4 border-2 border-purple-500 rounded-full border-t-transparent"></div>
                    </div>
                  )}

                  {showSuggestions && filteredSuppliers.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded shadow-lg max-h-40 overflow-y-auto">
                      {filteredSuppliers.map((supplier) => (
                        <div
                          key={supplier._id || supplier.id}
                          className="p-2 hover:bg-purple-50 cursor-pointer border-b border-gray-200"
                          onClick={() => selectSupplier(supplier)}
                        >
                          <div className="font-medium text-sm">
                            {supplier.name}
                          </div>
                          {supplier.email && (
                            <div className="text-xs text-gray-500">
                              {supplier.email}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1">
                    Supplier contact
                  </label>
                  <input
                    type="text"
                    name="supplierContact"
                    value={formData.supplierContact}
                    onChange={handleChange}
                    className="w-full border border-gray-300 p-1 rounded text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1">
                    Supplier address
                  </label>
                  <input
                    type="text"
                    name="supplierAddress"
                    value={formData.supplierAddress}
                    onChange={handleChange}
                    className="w-full border border-gray-300 p-1 rounded text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1">
                    Supplier Email
                  </label>
                  <input
                    type="email"
                    name="supplierEmail"
                    value={formData.supplierEmail}
                    onChange={handleChange}
                    className="w-full border border-gray-300 p-1 rounded text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Add Supplier Button */}
            <div className="flex justify-end mb-4">
              <button
                type="button"
                className="bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center"
              >
                <PlusIcon size={20} />
              </button>
            </div>

            {/* Main content sections - only show for chosen product type */}
            {productType && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Left and middle columns */}
                <div className="lg:col-span-2">
                  <div className="bg-white p-4 rounded shadow">
                    {productType === "Parent" ? (
                      <></>
                    ) : (
                      <>
                        {/* Global Trade Item Number - for non-Parent product types */}
                        <div className="mb-4 grid grid-cols-3 gap-4">
                          <div>
                            <label className="block text-xs font-medium mb-1">
                              Global Trade Item Number (GTIN)
                            </label>
                            <input
                              type="text"
                              name="globalTradeItemNumber"
                              value={formData.globalTradeItemNumber}
                              onChange={handleChange}
                              className="w-full border border-gray-300 p-1 rounded text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium mb-1">
                              K3L NUMBER
                            </label>
                            <input
                              type="text"
                              name="k3lNumber"
                              value={formData.k3lNumber}
                              onChange={handleChange}
                              className="w-full border border-gray-300 p-1 rounded text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium mb-1">
                              SNI NUMBER
                            </label>
                            <input
                              type="text"
                              name="sniNumber"
                              value={formData.sniNumber || ""}
                              onChange={handleChange}
                              className="w-full border border-gray-300 p-1 rounded text-sm"
                            />
                          </div>
                        </div>
                        {/* Specifications */}
                        <div className="mb-4">
                          <h3 className="text-sm font-medium mb-2">
                            Specifications
                          </h3>
                          <div className="border border-gray-300 rounded-lg">
                            <div className="grid grid-cols-5 p-2 bg-gray-100 text-xs font-medium">
                              <div>Height</div>
                              <div>Length</div>
                              <div>Width</div>
                              <div>
                                Unit{" "}
                                <p className="text-lg font-medium  ml-16">
                                  or{" "}
                                </p>
                              </div>

                              <div>Kg</div>
                            </div>

                            {formData.specifications.map((spec, index) => (
                              <div
                                key={`spec-${index}`}
                                className="grid grid-cols-5 p-2 border-t border-gray-300 text-xs"
                              >
                                {/* Height */}
                                <input
                                  type="text"
                                  value={spec.height}
                                  onChange={(e) =>
                                    handleSpecChange(
                                      index,
                                      "height",
                                      e.target.value
                                    )
                                  }
                                  className="border border-gray-300 p-1 rounded"
                                />

                                {/* Length */}
                                <input
                                  type="text"
                                  value={spec.length}
                                  onChange={(e) =>
                                    handleSpecChange(
                                      index,
                                      "length",
                                      e.target.value
                                    )
                                  }
                                  className="border border-gray-300 p-1 rounded"
                                />

                                {/* Depth (was incorrectly bound to length before) */}
                                <input
                                  type="text"
                                  value={spec.depth}
                                  onChange={(e) =>
                                    handleSpecChange(
                                      index,
                                      "depth",
                                      e.target.value
                                    )
                                  }
                                  className="border border-gray-300 p-1 rounded"
                                />

                                {/* Width */}
                                <input
                                  type="text"
                                  value={spec.width}
                                  onChange={(e) =>
                                    handleSpecChange(
                                      index,
                                      "width",
                                      e.target.value
                                    )
                                  }
                                  className="border border-gray-300 p-1 rounded"
                                />

                                {/* “or” placeholder */}
                                <div className="flex items-center">
                                  <input
                                    type="text"
                                    placeholder="or"
                                    className="w-full border border-gray-300 p-1 rounded"
                                  />
                                </div>

                                {/* Colour */}
                                <div className="flex items-center">
                                  <p className="font-medium mr-3">Colour</p>
                                  <input
                                    type="text"
                                    value={spec.colours}
                                    onChange={(e) =>
                                      handleSpecChange(
                                        index,
                                        "colours",
                                        e.target.value
                                      )
                                    }
                                    className="w-3/4 border border-gray-300 p-1 rounded"
                                  />

                                  {index > 0 && (
                                    <button
                                      type="button"
                                      onClick={() => removeSpecification(index)}
                                      className="ml-1 text-red-500"
                                    >
                                      <XCircleIcon size={16} />
                                    </button>
                                  )}
                                </div>
                              </div>
                            ))}
                            <div className="p-2 border-t border-gray-300">
                              <button
                                type="button"
                                onClick={addSpecification}
                                className="bg-red-500 text-white px-4 py-1 text-xs rounded flex items-center"
                              >
                                Small Package
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Inventory section - simplified layout */}
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-3">
                            <p className="text-base font-bold">
                              When send alert massage to make reorder
                            </p>
                            <div className="flex items-center space-x-2">
                              <button
                                type="button"
                                onClick={() =>
                                  setFormData({ ...formData, noReorder: true })
                                }
                                className="bg-black text-white px-2 py-1 rounded"
                              >
                                no reorder
                              </button>
                              <input
                                type="checkbox"
                                name="noReorder"
                                checked={formData.noReorder}
                                onChange={() =>
                                  setFormData({
                                    ...formData,
                                    noReorder: !formData.noReorder,
                                  })
                                }
                              />
                            </div>
                          </div>

                          {/* Amount section */}
                          <div className="mb-4 flex items-center">
                            <input
                              type="checkbox"
                              name="useStockAmount"
                              checked={formData.useStockAmount}
                              onChange={() => handleReorderMode("stock")}
                              className="mr-2"
                            />
                            <input
                              type="text"
                              name="stockAmount"
                              onChange={handleChange}
                              className="w-14 bg-white border border-black border-solid p-1 rounded text-sm mb-2"
                            />
                          </div>
                          <p className="text-xs mb-2 ml-6">
                            if arrive to amount above reorder
                          </p>

                          {/* OR divider */}
                          <div className="mb-4 text-red-600 text-start ml-7">
                            <span className="font-bold">or</span>
                          </div>

                          {/* Safety days section */}
                          <div className="mb-4">
                            <div className="flex items-center mb-2">
                              <input
                                type="checkbox"
                                name="useSafetyDays"
                                checked={formData.useSafetyDays}
                                onChange={() => handleReorderMode("safety")}
                                className="mr-2"
                              />
                              <input
                                type="text"
                                name="safetyDays"
                                onChange={handleChange}
                                className="w-14 bg-white border border-black border-solid p-1 rounded text-xs"
                              />
                            </div>
                            <input
                              type="text"
                              name="safetyDaysStock"
                              value="No info"
                              readOnly
                              className="w-14 bg-yellow-100 border p-1 rounded text-xs mb-2 ml-6"
                            />
                            <p className="text-xs ml-6">
                              Number of amount of stock that safety days
                              represent
                            </p>
                          </div>

                          {/* Delivery time section */}
                          <div className="mb-20 mt-20">
                            <p className="text-xs mb-2 px-1">delivery days</p>
                            <p className="text-xs mb-2 px-1 mb-12">
                              +
                              <input
                                type="text"
                                name="deliveryDays"
                                value="No info"
                                readOnly
                                className="w-14 bg-yellow-100 border border-yellow-100 p-1 rounded text-xs mb-2"
                              />
                            </p>

                            <p className="text-xs mb-2 px-1">
                              order time in days
                            </p>
                            <p className="text-xs mb-2 px-1">
                              =
                              <input
                                type="text"
                                name="deliveryTime"
                                value="No info"
                                readOnly
                                className="w-14 bg-yellow-100 border border-yellow-100 p-1 rounded text-xs mb-2"
                              />
                            </p>

                            <input
                              type="text"
                              name="deliveryTime"
                              value="No info"
                              readOnly
                              className="w-14 bg-yellow-100 ml-3 border border-yellow-100 p-1 rounded text-xs mb-2"
                            />
                            <p className="text-xs mb-2 px-1">
                              Time to make order in amount of number of product
                              in stock
                            </p>
                          </div>
                        </div>

                        {/* immediately after your Inventory section JSX */}
                        {formData.useStockAmount &&
                          +formData.stock <= +formData.stockAmount && (
                            <p className="text-red-600 font-bold">
                              ⚠️ Reorder required: stock has fallen to{" "}
                              {formData.stock}
                            </p>
                          )}
                        {formData.useSafetyDays &&
                          +formData.safetyDaysStock <= +formData.stock && (
                            <p className="text-red-600 font-bold">
                              ⚠️ Reorder required by safety days threshold
                            </p>
                          )}

                        {/* System Calculation */}
                        <div className="mb-4">
                          <p className="text-xs mb-1">
                            At this moment system calculation
                          </p>
                          <p className="text-xs mb-1">
                            Average items per day sales
                          </p>
                          <div className="bg-yellow-100 h-6 w-36 mb-3 flex items-center justify-center text-xs">
                            No info
                          </div>

                          <div className="flex justify-between items-center mb-3">
                            <div>
                              <p className="text-xs mb-1">
                                highest sales per day
                              </p>
                              <div className="bg-yellow-100 h-6 w-32 flex items-center justify-center text-xs">
                                No info
                              </div>
                            </div>
                            <div className="bg-red-500 text-white px-4 py-1 rounded text-xs">
                              sales data
                            </div>
                          </div>

                          <p className="text-xs mb-1">not normal situation</p>
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                              <p className="text-xs mb-1">
                                amount of high sales
                              </p>
                              <div className="flex flex-col gap-1">
                                <div className="bg-yellow-100 h-6 w-36 flex items-center justify-center text-xs">
                                  No info
                                </div>
                                <div className="bg-yellow-100 h-6 w-36 flex items-center justify-center text-xs">
                                  No info
                                </div>
                                <div className="bg-yellow-100 h-6 w-36 flex items-center justify-center text-xs">
                                  No info
                                </div>
                              </div>
                            </div>
                            <div>
                              <p className="text-xs mb-1">dates</p>
                              <div className="flex flex-col gap-1">
                                <div className="bg-yellow-100 h-6 w-36 flex items-center justify-center text-xs">
                                  No info
                                </div>
                                <div className="bg-yellow-100 h-6 w-36 flex items-center justify-center text-xs">
                                  No info
                                </div>
                                <div className="bg-yellow-100 h-6 w-36 flex items-center justify-center text-xs">
                                  No info
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Any Discount */}
                        <div className="mb-4">
                          <div className="flex justify-between">
                            <h3 className="text-xs font-medium mb-1">
                              Any Discount
                            </h3>
                            <span className="text-xs text-red-500">
                              not applicable right now
                            </span>
                          </div>
                          <input
                            type="text"
                            name="anyDiscount"
                            value={formData.anyDiscount}
                            onChange={handleChange}
                            className="w-full border border-gray-300 p-1 rounded text-sm"
                          />
                        </div>

                        {/* Price after discount */}
                        <div className="mb-4">
                          <h3 className="text-xs font-medium mb-1">
                            price after discount( any)
                          </h3>
                          <input
                            type="text"
                            name="priceAfterDiscount"
                            value={formData.priceAfterDiscount}
                            onChange={handleChange}
                            className="w-full border border-gray-300 p-1 rounded text-sm"
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Right sidebar */}
                <div className="bg-white p-4 rounded shadow">
                  {/* Visibility */}
                  <div className="mb-4">
                    <h3 className="text-sm font-medium mb-2">Visibility</h3>
                    <div className="space-y-1">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="public"
                          name="visibility"
                          value="Public"
                          checked={formData.visibility === "Public"}
                          onChange={handleChange}
                          className="mr-2"
                        />
                        <label htmlFor="public" className="text-sm">
                          Publicly visible
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="private"
                          name="visibility"
                          value="Private"
                          checked={formData.visibility === "Private"}
                          onChange={handleChange}
                          className="mr-2"
                        />
                        <label htmlFor="private" className="text-sm">
                          Hidden
                        </label>
                      </div>

                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="once"
                          name="onceShare"
                          checked={formData.onceShare}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              onceShare: e.target.checked,
                            })
                          }
                          className="mr-2"
                        />
                        <label htmlFor="once" className="text-xs text-gray-500">
                          Once there is less than 2 days automatically end make
                          visible when restocked/received
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="noChild"
                          name="noChildHideParent"
                          checked={formData.noChildHideParent}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              noChildHideParent: e.target.checked,
                            })
                          }
                          className="mr-2"
                        />
                        <label
                          htmlFor="noChild"
                          className="text-xs text-gray-500"
                        >
                          If no child, then parent hidden
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Categories */}
                  <div className="mb-4">
                    <h3 className="text-sm font-medium mb-2">Category</h3>
                    <select
                      name="categories"
                      value={formData.categories}
                      onChange={handleChange}
                      className="w-full border p-2 rounded"
                    >
                      <option value="">-- Select category --</option>
                      {categoriesList.map((cat) => (
                        <option key={cat._id} value={cat.name}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Subcategories */}
                  <div className="mb-4">
                    <h3 className="text-sm font-medium mb-2">Subcategory</h3>
                    <select
                      name="subCategories"
                      value={formData.subCategories}
                      onChange={handleChange}
                      className="w-full border p-2 rounded"
                      disabled={!formData.categories}
                    >
                      <option value="">-- Select subcategory --</option>
                      {categoriesList
                        .find((cat) => cat.name === formData.categories)
                        ?.subcategories.map((sub) => (
                          <option key={sub} value={sub}>
                            {sub}
                          </option>
                        ))}
                    </select>
                  </div>

                  {/* Tags */}
                  <div className="mb-4">
                    <h3 className="text-sm font-medium mb-2">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {availableTags.map((tag) => (
                        <button
                          key={`tag-${tag}`}
                          type="button"
                          onClick={() => toggleTag(tag)}
                          className={`px-2 py-1 text-xs border rounded ${
                            selectedTags.includes(tag)
                              ? "bg-purple-100 border-purple-500"
                              : "border-gray-300"
                          }`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Upload Master Image */}
                  <div className="mb-4">
                    <h3 className="text-sm font-medium mb-2">
                      Upload Master Image
                    </h3>
                    <div className="border border-dashed border-gray-300 p-4 rounded flex items-center justify-center h-32">
                      {masterImages[0] ? (
                        <div className="relative w-full h-full">
                          <img
                            src={masterImages[0].preview}
                            alt="Master"
                            className="w-full h-full object-contain"
                          />
                          <button
                            type="button"
                            className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                            onClick={() => removeMasterImage(0)}
                          >
                            ×
                          </button>
                        </div>
                      ) : (
                        <div
                          className="flex flex-col items-center justify-center cursor-pointer w-full h-full"
                          onClick={() => masterImageRef.current.click()}
                        >
                          <PlusIcon className="w-8 h-8 text-gray-400" />
                          <input
                            type="file"
                            ref={masterImageRef}
                            onChange={(e) => handleMasterImageUpload(0, e)}
                            className="hidden"
                            accept="image/*"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Upload More Images */}
                  <div className="mb-4">
                    <h3 className="text-sm font-medium mb-2">
                      Upload More Images
                    </h3>
                    <div className="grid grid-cols-3 gap-2">
                      {moreImages.map((img, index) => (
                        <div
                          key={`more-img-${index}`}
                          className="border border-dashed border-gray-300 p-2 rounded flex items-center justify-center h-16"
                        >
                          {img ? (
                            <div className="relative w-full h-full">
                              <img
                                src={img.preview}
                                alt={`More ${index}`}
                                className="w-full h-full object-contain"
                              />
                              <button
                                type="button"
                                className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs"
                                onClick={() => removeMoreImage(index)}
                              >
                                ×
                              </button>
                            </div>
                          ) : (
                            <div
                              className="flex items-center justify-center cursor-pointer w-full h-full"
                              onClick={() => {
                                if (moreImageRefs.current[index]) {
                                  moreImageRefs.current[index].click();
                                }
                              }}
                            >
                              <PlusIcon className="w-5 h-5 text-gray-400" />
                              <input
                                type="file"
                                ref={(el) =>
                                  (moreImageRefs.current[index] = el)
                                }
                                onChange={(e) =>
                                  handleMoreImageUpload(index, e)
                                }
                                className="hidden"
                                accept="image/*"
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Information about inventory - ONLY for Child and Normal products */}
                  {productType !== "Parent" && (
                    <div className="mb-4">
                      <p className="text-xs mb-2">
                        when we have left 2 days of stock
                      </p>

                      {/* Re-order settings */}
                      <div className="bg-orange-100 p-3 rounded mb-4 space-y-2">
                        <h3 className="text-sm font-medium">
                          re-order setting
                        </h3>
                        <div>
                          <p className="text-sm font-semibold">
                            {formData.reOrderSetting}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs">amount of inventory in days</p>
                          <p className="text-sm font-semibold mb-1">
                            {formData.inventoryInDays}
                          </p>
                          <p className="text-xs text-gray-600">
                            (25 products/items)
                          </p>
                        </div>

                        <div>
                          <p className="text-xs">belived order period</p>
                          <p className="text-sm font-semibold">
                            {formData.deliveryPeriod}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs">
                            order time + backup inventory
                          </p>
                          <input
                            type="text"
                            name="orderTimeBackupInventory"
                            value={formData.orderTimeBackupInventory}
                            onChange={handleChange}
                            className="w-full border border-gray-300 p-1 rounded text-sm mt-1"
                          />
                        </div>
                      </div>

                      {/* Notes */}
                      <div className="mb-4">
                        <h3 className="text-sm font-medium mb-2">
                          Notes for us
                        </h3>
                        <textarea
                          name="notes"
                          value={formData.notes}
                          onChange={handleChange}
                          className="w-full border border-gray-300 p-2 rounded"
                          rows="4"
                        ></textarea>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Submit button */}
            <div className="mt-4 flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className={`${
                  isLoading
                    ? "bg-purple-400"
                    : "bg-purple-600 hover:bg-purple-700"
                } text-white px-6 py-2 rounded-full shadow-md flex items-center justify-center`}
              >
                {isLoading ? (
                  "Saving..."
                ) : (
                  <>
                    <Save size={18} className="mr-1" /> Save
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"></div>
          <div className="relative bg-white rounded-lg shadow-2xl max-w-md w-full p-6 transform transition-all animate-fadeIn">
            <div className="absolute top-3 right-3">
              <button
                onClick={() => {
                  setShowSuccess(false);
                  window.location.reload();
                }}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                <svg
                  className="h-10 w-10 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                Product Added Successfully!
              </h3>
              <p className="text-gray-500 mb-6">
                Your product has been added to the database and is now
                available.
              </p>
              <div className="flex justify-center">
                <button
                  onClick={() => {
                    setShowSuccess(false);
                    window.location.reload();
                  }}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none"
                >
                  Continue
                </button>
              </div>
              <div className="mt-4 text-sm text-gray-500">
                This message will automatically close in 5 seconds
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddProduct;
