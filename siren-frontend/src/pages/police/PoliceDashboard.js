import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

const PoliceDashboard = () => {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending");
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const policeName = localStorage.getItem("username");

  const isVideo = (fileUrl) => {
    return fileUrl && (fileUrl.endsWith(".mp4") || fileUrl.includes("video"));
  };

  const fetchIncidents = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/accidents/assigned-police/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setIncidents(data);
    } catch (err) {
      console.error("Error fetching incidents:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await fetch(`http://localhost:8000/api/accidents/${id}/status/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
    } catch (err) {
      console.error("Status update error:", err);
    }
  };

  const handleAccept = async (id) => {
    await updateStatus(id, "accepted");
    setIncidents((prev) =>
      prev.map((incident) =>
        incident.id === id ? { ...incident, status: "accepted" } : incident
      )
    );
    setNotifications((prev) => [
      {
        id: Date.now(),
        title: "Incident Accepted",
        message: `You accepted incident #${id}`,
        timestamp: new Date().toISOString(),
        isRead: false,
      },
      ...prev,
    ]);
  };

  const handleReject = async (id) => {
    await updateStatus(id, "rejected");
    setIncidents((prev) => prev.filter((incident) => incident.id !== id));
  };

  const filteredIncidents = incidents.filter(
    (incident) => incident.status === filter
  );

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  useEffect(() => {
    fetchIncidents();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notificationRef.current && !notificationRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">Police Dashboard</h1>
        <div className="flex items-center gap-4">
          <div className="relative" ref={notificationRef}>
            <button onClick={() => setShowNotifications(!showNotifications)} className="relative">
              🔔
              {notifications.some((n) => !n.isRead) && (
                <span className="absolute top-0 right-0 bg-red-500 w-2 h-2 rounded-full" />
              )}
            </button>
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded border z-10 max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="p-4 text-gray-500">No notifications</p>
                ) : (
                  notifications.map((n) => (
                    <div key={n.id} className="p-3 border-b hover:bg-gray-100">
                      <p className="font-semibold">{n.title}</p>
                      <p className="text-sm">{n.message}</p>
                      <p className="text-xs text-gray-400">{new Date(n.timestamp).toLocaleString()}</p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
          <div className="relative group">
            <button className="flex items-center gap-1 px-3 py-1 border rounded">
              {policeName} ⏷
            </button>
            <div className="absolute hidden group-hover:block right-0 bg-white shadow-md rounded border mt-2 z-10">
              <button onClick={handleLogout} className="block px-4 py-2 text-left hover:bg-gray-100 w-full">
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Filters */}
      <div className="p-4 flex gap-2">
        <button
          onClick={() => setFilter("pending")}
          className={`px-4 py-2 rounded ${filter === "pending" ? "bg-blue-500 text-white" : "bg-gray-300"}`}
        >
          Pending
        </button>
        <button
          onClick={() => setFilter("accepted")}
          className={`px-4 py-2 rounded ${filter === "accepted" ? "bg-blue-500 text-white" : "bg-gray-300"}`}
        >
          Accepted
        </button>
      </div>

      {/* Incident List */}
      <div className="p-4 grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <p>Loading...</p>
        ) : filteredIncidents.length === 0 ? (
          <p>No incidents found.</p>
        ) : (
          filteredIncidents.map((incident) => (
            <div
              key={incident.id}
              className="bg-white p-4 rounded shadow hover:shadow-lg cursor-pointer"
              onClick={() => setSelectedIncident(incident)}
            >
              <h2 className="font-semibold text-lg">#{incident.id} - {incident.address}</h2>
              {incident.image && (
                isVideo(incident.image) ? (
                  <video src={incident.image} controls className="w-full h-48 object-cover mt-2 rounded" />
                ) : (
                  <img src={incident.image} alt="Scene" className="w-full h-48 object-cover mt-2 rounded" />
                )
              )}
              <p className="text-gray-600 mt-2">Severity: {incident.severity}</p>
            </div>
          ))
        )}
      </div>

      {/* Incident Detail Modal */}
      {selectedIncident && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
          <div className="bg-white p-6 rounded shadow-md max-w-lg w-full relative">
            <button
              onClick={() => setSelectedIncident(null)}
              className="absolute top-2 right-2 text-gray-500"
            >
              ✖
            </button>
            <h2 className="text-xl font-bold mb-2">Incident #{selectedIncident.id}</h2>
            <p><strong>Address:</strong> {selectedIncident.address}</p>
            <p><strong>Time:</strong> {new Date(selectedIncident.timestamp).toLocaleString()}</p>
            <p><strong>Severity:</strong> {selectedIncident.severity}</p>
            <p><strong>Description:</strong> {selectedIncident.description}</p>
            {selectedIncident.image && (
              isVideo(selectedIncident.image) ? (
                <video src={selectedIncident.image} controls className="w-full mt-4 rounded" />
              ) : (
                <img src={selectedIncident.image} alt="Scene" className="w-full mt-4 rounded" />
              )
            )}
            {selectedIncident.status === "pending" && (
              <div className="mt-4 flex justify-end gap-2">
                <button
                  onClick={() => {
                    handleAccept(selectedIncident.id);
                    setSelectedIncident(null);
                  }}
                  className="px-4 py-2 bg-green-500 text-white rounded"
                >
                  Accept
                </button>
                <button
                  onClick={() => {
                    handleReject(selectedIncident.id);
                    setSelectedIncident(null);
                  }}
                  className="px-4 py-2 bg-red-500 text-white rounded"
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PoliceDashboard;
