// CreateDiscount.js
import React, { useState } from "react";
import { Lock, Search, ChevronDown, Bell } from "lucide-react";
import Sidebar from "../Sidebar/sidebar";

const dummyProducts = [
  { id: "P001", name: "Product A" },
  { id: "P002", name: "Product B" },
  { id: "P003", name: "Product C" },
];

const discountTypes = [
  "clearance",
  "new product",
  "general discount",
  "discount specific amount",
  "above amount (discount)",
  "above amount (for free delivery)",
];

const forWhoOptions = [
  "public",
  "public referral",
  "forman",
  "forman referral",
  "forman earnings mlm",
];

export default function CreateDiscount() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [product, setProduct] = useState("");
  const [status, setStatus] = useState("Enabled");
  const [discountType, setDiscountType] = useState("");
  const [forWho, setForWho] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [oldPrice, setOldPrice] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [amount, setAmount] = useState("");
  const [discountId, setDiscountId] = useState("");
  const [discountTitle, setDiscountTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSave = () => {
    console.log({
      product,
      status,
      discountType,
      forWho,
      originalPrice,
      oldPrice,
      newPrice,
      startDate,
      endDate,
      amount,
      discountId,
      discountTitle,
      description,
    });
    alert("Saved!");
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {/* Main Content */}
      <div
        className={`transition-all duration-300 ${
          isSidebarOpen ? "lg:ml-80" : ""
        } w-full bg-purple-50 p-6`}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6 bg-purple-800 p-4 rounded">
          <div className="flex items-center text-white space-x-2">
            <Lock size={20} />
            <h1 className="text-lg font-semibold">
              71 Create Discount (discount is applied to one product at a time)
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <Bell className="text-white cursor-pointer" size={20} />
            <div className="w-8 h-8 bg-purple-400 rounded-full flex items-center justify-center text-white text-xs">
              JM
            </div>
            <button
              onClick={handleSave}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded"
            >
              Save
            </button>
          </div>
        </div>

        {/* Select a product */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="font-medium mb-4">Select a product</h2>
          <div className="relative">
            <input
              list="products"
              placeholder="Search product"
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              className="w-full border rounded p-2 pr-10"
            />
            <datalist id="products">
              {dummyProducts.map((p) => (
                <option key={p.id} value={`${p.name} (#${p.id})`} />
              ))}
            </datalist>
            <Search className="absolute right-3 top-1/2 -mt-2 text-gray-400" />
          </div>
        </div>

        {/* Discount type & Status */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          {/* Discount types */}
          <div className="flex-1 bg-white p-6 rounded-lg shadow">
            <h2 className="font-medium mb-4">Select discount type</h2>
            {discountTypes.map((type) => (
              <label key={type} className="flex items-center mb-2">
                <input
                  type="radio"
                  name="discountType"
                  value={type}
                  checked={discountType === type}
                  onChange={() => setDiscountType(type)}
                  className="mr-2"
                />
                {type}
              </label>
            ))}
          </div>

          {/* Status */}
          <div className="w-full md:w-1/3 bg-white p-6 rounded-lg shadow">
            <h3 className="font-medium mb-4">Status</h3>
            {["Enabled", "Disabled"].map((st) => (
              <label key={st} className="flex items-center mb-2">
                <input
                  type="radio"
                  name="status"
                  value={st}
                  checked={status === st}
                  onChange={() => setStatus(st)}
                  className="mr-2"
                />
                {st}
              </label>
            ))}
          </div>
        </div>

        {/* For who? */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="font-medium mb-4">For who?</h2>
          {forWhoOptions.map((opt) => (
            <label key={opt} className="flex items-center mb-2">
              <input
                type="radio"
                name="forWho"
                value={opt}
                checked={forWho === opt}
                onChange={() => setForWho(opt)}
                className="mr-2"
              />
              {opt}
            </label>
          ))}
        </div>

        {/* Discount value */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="font-medium mb-4">Discount value</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Original price</label>
              <input
                type="text"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
                className="w-full border rounded p-2"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Old price</label>
              <input
                type="text"
                value={oldPrice}
                onChange={(e) => setOldPrice(e.target.value)}
                className="w-full border rounded p-2"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">New price</label>
              <input
                type="text"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                className="w-full border rounded p-2"
              />
            </div>
          </div>
        </div>

        {/* Schedule */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="font-medium mb-4">Schedule</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm mb-1">Start date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full border rounded p-2"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">
                <span className="text-red-500">when it ends</span> End date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full border rounded p-2"
              />
            </div>
            <div className="flex flex-col">
              <label className="block text-sm mb-1">or amount</label>
              <input
                type="text"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full border rounded p-2"
              />
            </div>
          </div>
        </div>

        {/* Discount basic info */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="font-medium mb-4">Discount basic info</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Discount ID</label>
              <input
                type="text"
                value={discountId}
                onChange={(e) => setDiscountId(e.target.value)}
                className="w-full border rounded p-2"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Discount title</label>
              <input
                type="text"
                value={discountTitle}
                onChange={(e) => setDiscountTitle(e.target.value)}
                className="w-full border rounded p-2"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Small description</label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border rounded p-2 resize-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
