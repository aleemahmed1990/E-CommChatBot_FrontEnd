import React, { useState, useEffect, useRef } from "react";
import {
  AlertTriangle,
  MessageCircle,
  CheckCircle,
  Clock,
  X,
  FileText,
} from "lucide-react";

const API_BASE_URL = "https://e-commchatbot-backend-4.onrender.com";

const ComplaintManagement = ({ selectedRole = "Complaint Manager" }) => {
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [complaintDetails, setComplaintDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    open: 0,
    inProgress: 0,
    resolved: 0,
    escalated: 0,
  });
  const [resolution, setResolution] = useState("");
  const [internalNotes, setInternalNotes] = useState("");
  const [priority, setPriority] = useState("medium");
  const updateTimeoutRef = useRef(null);

  const isBeforeDelivery = selectedRole?.includes("on Delivery");

  useEffect(() => {
    fetchComplaints();
    fetchStats();

    const interval = setInterval(() => {
      fetchComplaintsQuiet();
      fetchStatsQuiet();
      if (selectedComplaint) {
        fetchComplaintDetailsQuiet(selectedComplaint);
      }
    }, 5000);

    return () => {
      clearInterval(interval);
      if (updateTimeoutRef.current) clearTimeout(updateTimeoutRef.current);
    };
  }, [selectedComplaint, isBeforeDelivery]);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const endpoint = isBeforeDelivery
        ? `${API_BASE_URL}/api/complaints/before-delivery`
        : `${API_BASE_URL}/api/complaints/after-delivery`;
      const response = await fetch(endpoint);
      const data = await response.json();
      setComplaints(data || []);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchComplaintsQuiet = async () => {
    try {
      const endpoint = isBeforeDelivery
        ? `${API_BASE_URL}/api/complaints/before-delivery`
        : `${API_BASE_URL}/api/complaints/after-delivery`;
      const response = await fetch(endpoint);
      const data = await response.json();
      setComplaints((prev) => {
        if (JSON.stringify(prev) !== JSON.stringify(data)) {
          return data || [];
        }
        return prev;
      });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchStats = async () => {
    try {
      const endpoint = isBeforeDelivery
        ? `${API_BASE_URL}/api/complaints/stats/before-delivery`
        : `${API_BASE_URL}/api/complaints/stats/after-delivery`;
      const response = await fetch(endpoint);
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchStatsQuiet = async () => {
    try {
      const endpoint = isBeforeDelivery
        ? `${API_BASE_URL}/api/complaints/stats/before-delivery`
        : `${API_BASE_URL}/api/complaints/stats/after-delivery`;
      const response = await fetch(endpoint);
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchComplaintDetails = async (complaintId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/complaints/${complaintId}`
      );
      const data = await response.json();
      setComplaintDetails(data);
      setSelectedComplaint(complaintId);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchComplaintDetailsQuiet = async (complaintId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/complaints/${complaintId}`
      );
      const data = await response.json();
      setComplaintDetails((prev) => {
        if (JSON.stringify(prev) !== JSON.stringify(data)) {
          return data;
        }
        return prev;
      });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const updateComplaintStatus = async (newStatus) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/complaints/${selectedComplaint}/status`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: newStatus,
            internalNotes: internalNotes,
            resolution: resolution,
            priority: priority,
            updatedAt: new Date(),
          }),
        }
      );

      if (response.ok) {
        alert(`Status updated to ${newStatus}`);
        setInternalNotes("");
        setResolution("");
        setPriority("medium");
        fetchComplaints();
        fetchComplaintDetails(selectedComplaint);
        fetchStats();
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to update complaint");
    }
  };

  const resolveComplaint = async () => {
    if (!resolution.trim()) {
      alert("Enter resolution details");
      return;
    }
    await updateComplaintStatus("resolved");
  };

  const escalateComplaint = async () => {
    await updateComplaintStatus("escalated");
  };

  return (
    <div className="space-y-6">
      {/* Mode */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-900">
          {isBeforeDelivery
            ? "Managing complaints during delivery process"
            : "Managing complaints after delivery"}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-red-600 rounded-lg p-4 text-white">
          <p className="text-sm opacity-90">Open</p>
          <p className="text-3xl font-bold mt-1">{stats.open}</p>
        </div>
        <div className="bg-yellow-600 rounded-lg p-4 text-white">
          <p className="text-sm opacity-90">In Progress</p>
          <p className="text-3xl font-bold mt-1">{stats.inProgress}</p>
        </div>
        <div className="bg-green-600 rounded-lg p-4 text-white">
          <p className="text-sm opacity-90">Resolved</p>
          <p className="text-3xl font-bold mt-1">{stats.resolved}</p>
        </div>
        <div className="bg-purple-600 rounded-lg p-4 text-white">
          <p className="text-sm opacity-90">Escalated</p>
          <p className="text-3xl font-bold mt-1">{stats.escalated}</p>
        </div>
      </div>

      {/* Main */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* List */}
        <div className="bg-white rounded-lg shadow">
          <div className="bg-gray-800 text-white p-4 flex items-center space-x-2 rounded-t-lg">
            <MessageCircle className="h-5 w-5" />
            <h3 className="font-bold">Complaints</h3>
          </div>

          {loading ? (
            <div className="p-8 text-center text-gray-500">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : complaints.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p>No complaints</p>
            </div>
          ) : (
            <div className="divide-y max-h-96 overflow-y-auto">
              {complaints.map((complaint) => (
                <div
                  key={complaint._id}
                  onClick={() => fetchComplaintDetails(complaint._id)}
                  className={`p-4 cursor-pointer hover:bg-gray-50 transition ${
                    selectedComplaint === complaint._id
                      ? "bg-blue-50 border-l-4 border-blue-500"
                      : ""
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    <AlertTriangle
                      className={`h-4 w-4 mt-1 flex-shrink-0 ${
                        complaint.priority === "urgent"
                          ? "text-red-500"
                          : complaint.priority === "high"
                          ? "text-orange-500"
                          : "text-yellow-500"
                      }`}
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 text-sm">
                        {complaint.complaintId}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        {complaint.complaintCategory}
                      </p>
                      <span
                        className={`inline-block mt-2 px-2 py-1 text-xs font-semibold rounded ${
                          complaint.status === "open"
                            ? "bg-red-100 text-red-800"
                            : complaint.status === "in_progress"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {complaint.status?.replace(/_/g, " ")}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="lg:col-span-2">
          {selectedComplaint && complaintDetails ? (
            <div className="bg-white rounded-lg shadow p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {complaintDetails.complaintId}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {complaintDetails.complaintCategory}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedComplaint(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Info */}
              <div className="bg-gray-50 p-4 rounded">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600 font-semibold">Status</p>
                    <p className="text-gray-900">
                      {complaintDetails.status?.replace(/_/g, " ")}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 font-semibold">Priority</p>
                    <p className="text-gray-900">
                      {complaintDetails.priority?.toUpperCase()}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 font-semibold">Order ID</p>
                    <p className="text-gray-900">{complaintDetails.orderId}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 font-semibold">Submitted</p>
                    <p className="text-gray-900 text-xs">
                      {new Date(complaintDetails.submittedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div className="border-t pt-4">
                <h4 className="font-bold text-gray-900 mb-2">
                  Complaint Details
                </h4>
                <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                  {complaintDetails.textSummary || "No summary provided"}
                </p>
              </div>

              {/* Priority & Notes */}
              {complaintDetails.status !== "resolved" && (
                <>
                  <div className="border-t pt-4">
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Priority
                    </label>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Internal Notes
                    </label>
                    <textarea
                      value={internalNotes}
                      onChange={(e) => setInternalNotes(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows="2"
                      placeholder="Internal notes for team..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Resolution
                    </label>
                    <textarea
                      value={resolution}
                      onChange={(e) => setResolution(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows="2"
                      placeholder="How will this be resolved?"
                    />
                  </div>
                </>
              )}

              {/* Actions */}
              {complaintDetails.status !== "resolved" && (
                <div className="border-t pt-4 flex flex-col space-y-2">
                  <button
                    onClick={() => updateComplaintStatus("in_progress")}
                    className="flex items-center justify-center space-x-2 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                  >
                    <Clock className="h-4 w-4" />
                    <span>Mark In Progress</span>
                  </button>
                  <button
                    onClick={resolveComplaint}
                    disabled={!resolution.trim()}
                    className="flex items-center justify-center space-x-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    <CheckCircle className="h-4 w-4" />
                    <span>Resolve</span>
                  </button>
                  <button
                    onClick={escalateComplaint}
                    className="flex items-center justify-center space-x-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    <AlertTriangle className="h-4 w-4" />
                    <span>Escalate</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Select a complaint to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComplaintManagement;
