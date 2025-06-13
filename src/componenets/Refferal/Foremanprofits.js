// ForemanReferrals.js
import React, { useState, useEffect } from "react";
import {
  Search,
  Eye,
  Star,
  CheckCircle,
  XCircle,
  User,
  DollarSign,
  Users,
  Calendar,
  Award,
  Phone,
  MapPin,
  CreditCard,
  TrendingUp,
  UserCheck,
} from "lucide-react";
import Sidebar from "../Sidebar/sidebar";

const TABS = [
  { key: "customers", label: "All Customers", icon: User },
  { key: "approved_foreman", label: "Approved Foreman", icon: CheckCircle },
  {
    key: "approved_commission",
    label: "Approved Foreman for Commission",
    icon: CreditCard,
  },
];

export default function ForemanReferrals() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("customers");
  const [search, setSearch] = useState("");
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, [activeTab]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://married-flower-fern.glitch.me/api/foreman-customers?status=${activeTab}`
      );
      const data = await response.json();

      if (data.success) {
        setCustomers(data.customers);
      } else {
        console.error("Failed to fetch customers:", data.message);
      }
    } catch (error) {
      console.error("Error fetching customers:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateForemanStatus = async (customerId, newStatus) => {
    try {
      setUpdating(true);
      const response = await fetch(
        "https://married-flower-fern.glitch.me/api/foreman-customers/update-status",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customerId,
            status: newStatus,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        await fetchCustomers();
        if (selectedCustomer && selectedCustomer._id === customerId) {
          setSelectedCustomer(null);
        }
        alert(`Customer successfully marked as ${newStatus}`);
      } else {
        alert("Failed to update status: " + data.message);
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Error updating status");
    } finally {
      setUpdating(false);
    }
  };

  const markForCommission = async (customerId) => {
    try {
      setUpdating(true);
      const response = await fetch(
        "https://married-flower-fern.glitch.me/api/foreman-customers/mark-commission-approved",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ customerId }),
        }
      );

      const data = await response.json();

      if (data.success) {
        await fetchCustomers();
        alert("Customer approved for commission!");
      } else {
        alert("Failed to approve for commission: " + data.message);
      }
    } catch (error) {
      console.error("Error approving for commission:", error);
      alert("Error approving for commission");
    } finally {
      setUpdating(false);
    }
  };

  const payCommission = async (customerId, amount) => {
    try {
      setUpdating(true);
      const response = await fetch(
        "https://married-flower-fern.glitch.me/api/foreman-customers/pay-commission",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ customerId, amount }),
        }
      );

      const data = await response.json();

      if (data.success) {
        await fetchCustomers();
        alert(`Commission of $${amount} paid successfully!`);
      } else {
        alert("Failed to pay commission: " + data.message);
      }
    } catch (error) {
      console.error("Error paying commission:", error);
      alert("Error paying commission");
    } finally {
      setUpdating(false);
    }
  };

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(search.toLowerCase()) ||
      customer.phoneNumber.includes(search) ||
      customer.referralCode.toLowerCase().includes(search.toLowerCase())
  );

  // Customer Detail Modal
  if (selectedCustomer) {
    return (
      <CustomerDetailView
        customer={selectedCustomer}
        onBack={() => setSelectedCustomer(null)}
        onStatusUpdate={updateForemanStatus}
        onMarkForCommission={markForCommission}
        onPayCommission={payCommission}
        sidebarOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        updating={updating}
      />
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar
        isOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      <div
        className={`transition-all duration-300 ${
          sidebarOpen ? "lg:ml-80" : ""
        } w-full p-6`}
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            155. Foreman Commission Management System
          </h1>
          <p className="text-gray-600">
            Manage foreman approvals, commission tracking, and referral
            performance
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="Search by name, phone, or referral code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Search
              className="absolute left-3 top-1/2 -mt-2 text-gray-400"
              size={20}
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex items-center py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === tab.key
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <Icon size={16} className="mr-2" />
                    {tab.label}
                    <span className="ml-2 bg-gray-100 text-gray-600 py-1 px-2 rounded-full text-xs">
                      {filteredCustomers.length}
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <StatsCard
            title="Total Customers"
            value={customers.length}
            icon={User}
            color="blue"
          />
          <StatsCard
            title="Approved Foreman"
            value={
              customers.filter((c) => c.foremanStatus === "approved").length
            }
            icon={CheckCircle}
            color="green"
          />
          <StatsCard
            title="Commission Approved"
            value={
              customers.filter((c) => c.commissionApproved === true).length
            }
            icon={CreditCard}
            color="purple"
          />
          <StatsCard
            title="Total Commission Paid"
            value={`$${customers
              .reduce((sum, c) => sum + (c.commissionPaid || 0), 0)
              .toFixed(2)}`}
            icon={DollarSign}
            color="yellow"
          />
        </div>

        {/* Customers Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Commission Earned Not Paid
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Paid Commission
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Earned Commission Till Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    # Success Referral
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount Phone Number Given
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-8 text-center">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      <p className="mt-2 text-gray-500">Loading customers...</p>
                    </td>
                  </tr>
                ) : filteredCustomers.length > 0 ? (
                  filteredCustomers.map((customer, index) => (
                    <CustomerRow
                      key={customer._id}
                      customer={customer}
                      index={index}
                      onViewDetails={() => setSelectedCustomer(customer)}
                      onStatusUpdate={updateForemanStatus}
                      onMarkForCommission={markForCommission}
                      onPayCommission={payCommission}
                      activeTab={activeTab}
                      updating={updating}
                    />
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="8"
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      No customers found for "{activeTab}" status
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// Stats Card Component
function StatsCard({ title, value, icon: Icon, color }) {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-600",
    yellow: "bg-yellow-100 text-yellow-600",
    green: "bg-green-100 text-green-600",
    purple: "bg-purple-100 text-purple-600",
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${colorClasses[color]}`}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
}

// Customer Row Component
function CustomerRow({
  customer,
  index,
  onViewDetails,
  onStatusUpdate,
  onMarkForCommission,
  onPayCommission,
  activeTab,
  updating,
}) {
  const getStatusBadge = (status, commissionApproved) => {
    if (commissionApproved) {
      return {
        bg: "bg-purple-100",
        text: "text-purple-800",
        label: "Commission Approved",
      };
    }

    const badges = {
      regular: {
        bg: "bg-gray-100",
        text: "text-gray-800",
        label: "Regular Customer",
      },
      approved: {
        bg: "bg-green-100",
        text: "text-green-800",
        label: "Approved Foreman",
      },
    };
    const badge = badges[status] || badges.regular;
    return badge;
  };

  const badge = getStatusBadge(
    customer.foremanStatus,
    customer.commissionApproved
  );

  const handlePayCommission = () => {
    const amount = prompt("Enter commission amount to pay:");
    if (amount && !isNaN(amount) && parseFloat(amount) > 0) {
      onPayCommission(customer._id, parseFloat(amount));
    }
  };

  return (
    <tr className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
      <td className="px-6 py-4">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10">
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
              <span className="text-white font-semibold">
                {customer.name.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">
              {customer.name}
            </div>
            <div className="text-sm text-gray-500">{customer.phoneNumber}</div>
            <div className="text-xs text-gray-400">{customer.referralCode}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="text-sm font-medium text-red-600">
          $
          {(customer.commissionEarned - customer.commissionPaid || 0).toFixed(
            2
          )}
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="text-sm font-medium text-green-600">
          ${(customer.commissionPaid || 0).toFixed(2)}
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="text-sm font-medium text-blue-600">
          ${(customer.commissionEarned || 0).toFixed(2)}
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="text-sm text-gray-900">
          <div className="flex items-center mb-1">
            <UserCheck size={14} className="mr-1 text-green-500" />
            {customer.successfulReferrals || 0} people
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="text-sm text-gray-900">
          <div className="flex items-center">
            <Phone size={14} className="mr-1 text-blue-500" />
            {customer.totalPhoneNumbersGiven || 0} contacts
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}
        >
          {badge.label}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={onViewDetails}
            className="text-blue-600 hover:text-blue-900 font-medium text-sm"
          >
            <Eye size={16} className="inline mr-1" />
            View Details
          </button>

          {activeTab === "customers" && (
            <button
              onClick={() => onStatusUpdate(customer._id, "approved")}
              disabled={updating}
              className="text-green-600 hover:text-green-900 font-medium text-sm disabled:opacity-50"
            >
              <CheckCircle size={16} className="inline mr-1" />
              Approve Foreman
            </button>
          )}

          {activeTab === "approved_foreman" && !customer.commissionApproved && (
            <button
              onClick={() => onMarkForCommission(customer._id)}
              disabled={updating}
              className="text-purple-600 hover:text-purple-900 font-medium text-sm disabled:opacity-50"
            >
              <CreditCard size={16} className="inline mr-1" />
              Approve Commission
            </button>
          )}

          {activeTab === "approved_commission" &&
            customer.commissionEarned > customer.commissionPaid && (
              <button
                onClick={handlePayCommission}
                disabled={updating}
                className="text-yellow-600 hover:text-yellow-900 font-medium text-sm disabled:opacity-50"
              >
                <DollarSign size={16} className="inline mr-1" />
                Pay Commission
              </button>
            )}
        </div>
      </td>
    </tr>
  );
}

// Customer Detail View Component
function CustomerDetailView({
  customer,
  onBack,
  onStatusUpdate,
  onMarkForCommission,
  onPayCommission,
  sidebarOpen,
  toggleSidebar,
  updating,
}) {
  const [referralDetails, setReferralDetails] = useState({
    successfulReferrals: [],
    allReferredNumbers: [],
    loading: true,
  });

  useEffect(() => {
    fetchReferralDetails();
  }, [customer._id]);

  const fetchReferralDetails = async () => {
    try {
      const response = await fetch(
        `https://married-flower-fern.glitch.me/api/foreman-customers/${customer._id}/referral-details`
      );
      const data = await response.json();

      if (data.success) {
        setReferralDetails({
          successfulReferrals: data.successfulReferrals || [],
          allReferredNumbers: data.allReferredNumbers || [],
          loading: false,
        });
      }
    } catch (error) {
      console.error("Error fetching referral details:", error);
      setReferralDetails((prev) => ({ ...prev, loading: false }));
    }
  };

  const handlePayCommission = () => {
    const amount = prompt("Enter commission amount to pay:");
    if (amount && !isNaN(amount) && parseFloat(amount) > 0) {
      onPayCommission(customer._id, parseFloat(amount));
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div
        className={`transition-all duration-300 ${
          sidebarOpen ? "lg:ml-80" : ""
        } w-full p-6`}
      >
        {/* Header */}
        <div className="flex items-center mb-6">
          <button
            onClick={onBack}
            className="mr-4 p-2 rounded-full hover:bg-gray-200 transition-colors"
          >
            <XCircle size={24} className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {customer.name}
            </h1>
            <p className="text-gray-600">Foreman Commission Overview</p>
          </div>
        </div>

        {/* Customer Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Commission Not Paid
                </p>
                <p className="text-2xl font-bold text-red-600">
                  $
                  {(
                    (customer.commissionEarned || 0) -
                    (customer.commissionPaid || 0)
                  ).toFixed(2)}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-red-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Paid Commission
                </p>
                <p className="text-2xl font-bold text-green-600">
                  ${(customer.commissionPaid || 0).toFixed(2)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Commission Earned
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  ${(customer.commissionEarned || 0).toFixed(2)}
                </p>
              </div>
              <Award className="h-8 w-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Success Referrals
                </p>
                <p className="text-2xl font-bold text-purple-600">
                  {customer.successfulReferrals || 0}
                </p>
              </div>
              <Users className="h-8 w-8 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Contact and Performance Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Contact Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Contact Information
            </h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <Phone size={16} className="text-gray-400 mr-3" />
                <span className="text-gray-600">Phone:</span>
                <span className="ml-2 font-medium">{customer.phoneNumber}</span>
              </div>
              <div className="flex items-center">
                <Award size={16} className="text-gray-400 mr-3" />
                <span className="text-gray-600">Referral Code:</span>
                <span className="ml-2 font-medium text-blue-600">
                  {customer.referralCode}
                </span>
              </div>
              <div className="flex items-center">
                <Calendar size={16} className="text-gray-400 mr-3" />
                <span className="text-gray-600">Member Since:</span>
                <span className="ml-2 font-medium">
                  {new Date(customer.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center">
                <Phone size={16} className="text-gray-400 mr-3" />
                <span className="text-gray-600">Phone Numbers Given:</span>
                <span className="ml-2 font-medium">
                  {customer.totalPhoneNumbersGiven || 0} contacts
                </span>
              </div>
            </div>
          </div>

          {/* Performance Metrics - RED BACKGROUND */}
          <div className="bg-red-100 border border-red-200 rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-red-900 mb-4">
              Performance Metrics
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-red-800">Commission Performance</span>
                  <span className="font-medium text-red-900">
                    {customer.commissionEarned > 100
                      ? "Excellent"
                      : customer.commissionEarned > 50
                      ? "Good"
                      : "Needs Improvement"}
                  </span>
                </div>
                <div className="w-full bg-red-200 rounded-full h-2">
                  <div
                    className="bg-red-600 h-2 rounded-full"
                    style={{
                      width: `${Math.min(
                        100,
                        (customer.commissionEarned || 0) / 2
                      )}%`,
                    }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-red-800">Referral Success Rate</span>
                  <span className="font-medium text-red-900">
                    {customer.successfulReferrals > 5
                      ? "High"
                      : customer.successfulReferrals > 2
                      ? "Medium"
                      : "Low"}
                  </span>
                </div>
                <div className="w-full bg-red-200 rounded-full h-2">
                  <div
                    className="bg-red-600 h-2 rounded-full"
                    style={{
                      width: `${Math.min(
                        100,
                        (customer.successfulReferrals || 0) * 10
                      )}%`,
                    }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-red-800">Network Growth</span>
                  <span className="font-medium text-red-900">
                    {customer.totalPhoneNumbersGiven > 10
                      ? "Excellent"
                      : customer.totalPhoneNumbersGiven > 5
                      ? "Good"
                      : "Low"}
                  </span>
                </div>
                <div className="w-full bg-red-200 rounded-full h-2">
                  <div
                    className="bg-red-600 h-2 rounded-full"
                    style={{
                      width: `${Math.min(
                        100,
                        (customer.totalPhoneNumbersGiven || 0) * 5
                      )}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Successful Referred Customers */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Successful Referred Customers
          </h3>
          {referralDetails.loading ? (
            <div className="text-center py-4">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
              <p className="mt-2 text-gray-500">Loading referral details...</p>
            </div>
          ) : referralDetails.successfulReferrals.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Customer
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Phone
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Amount Ordered (Including Discounted)
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Commission Approved Amount
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Date Referred
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {referralDetails.successfulReferrals.map(
                    (referral, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2 text-sm text-gray-900">
                          {referral.name}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900">
                          {referral.phoneNumber}
                        </td>
                        <td className="px-4 py-2 text-sm text-blue-600 font-medium">
                          ${(referral.totalAmountOrdered || 0).toFixed(2)}
                        </td>
                        <td className="px-4 py-2 text-sm text-green-600 font-medium">
                          ${(referral.commissionApprovedAmount || 0).toFixed(2)}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-500">
                          {new Date(referral.dateReferred).toLocaleDateString()}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">
              No successful referrals found
            </p>
          )}
        </div>

        {/* All Referred Numbers */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            All Referred Phone Numbers
          </h3>
          {referralDetails.loading ? (
            <div className="text-center py-4">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
              <p className="mt-2 text-gray-500">Loading phone numbers...</p>
            </div>
          ) : referralDetails.allReferredNumbers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {referralDetails.allReferredNumbers.map((phoneData, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">
                        {phoneData.name || "Unknown"}
                      </p>
                      <p className="text-sm text-gray-600">
                        {phoneData.phoneNumber}
                      </p>
                      <p className="text-xs text-gray-500">
                        Shared:{" "}
                        {new Date(phoneData.dateShared).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          phoneData.hasOrdered
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {phoneData.hasOrdered ? "Converted" : "Pending"}
                      </span>
                      {phoneData.hasOrdered && (
                        <p className="text-xs text-green-600 mt-1">
                          ${(phoneData.totalSpent || 0).toFixed(2)} spent
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">
              No referred phone numbers found
            </p>
          )}
        </div>

        {/* Commission History */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Commission History
          </h3>
          {customer.commissionHistory &&
          customer.commissionHistory.length > 0 ? (
            <div className="space-y-3">
              {customer.commissionHistory.map((commission, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      {commission.type === "earned"
                        ? "Commission Earned"
                        : "Commission Paid"}
                    </p>
                    <p className="text-sm text-gray-600">
                      {new Date(commission.date).toLocaleString()}
                    </p>
                    {commission.orderId && (
                      <p className="text-xs text-gray-500">
                        Order: {commission.orderId}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <span
                      className={`font-medium ${
                        commission.type === "earned"
                          ? "text-blue-600"
                          : "text-green-600"
                      }`}
                    >
                      ${commission.amount.toFixed(2)}
                    </span>
                    <p className="text-xs text-gray-500">
                      {commission.isPaid ? "Paid" : "Pending"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">
              No commission history found
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          {customer.foremanStatus === "regular" && (
            <button
              onClick={() => onStatusUpdate(customer._id, "approved")}
              disabled={updating}
              className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium disabled:opacity-50 transition-colors"
            >
              {updating ? "Processing..." : "Approve as Foreman"}
            </button>
          )}

          {customer.foremanStatus === "approved" &&
            !customer.commissionApproved && (
              <button
                onClick={() => onMarkForCommission(customer._id)}
                disabled={updating}
                className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium disabled:opacity-50 transition-colors"
              >
                {updating ? "Processing..." : "Approve for Commission"}
              </button>
            )}

          {customer.commissionApproved &&
            (customer.commissionEarned || 0) >
              (customer.commissionPaid || 0) && (
              <button
                onClick={handlePayCommission}
                disabled={updating}
                className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-medium disabled:opacity-50 transition-colors"
              >
                {updating ? "Processing..." : "Pay Commission"}
              </button>
            )}

          {customer.foremanStatus === "approved" && (
            <button
              onClick={() => onStatusUpdate(customer._id, "regular")}
              disabled={updating}
              className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium disabled:opacity-50 transition-colors"
            >
              {updating ? "Processing..." : "Remove Foreman Status"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
