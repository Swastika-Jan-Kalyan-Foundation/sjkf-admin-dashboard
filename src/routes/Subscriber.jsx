import { useState, useEffect, useCallback } from "react";

const API_BASE = "https://sjkf-backend-api-production.up.railway.app/api/newsletter";

/* ── SVG Icons ── */
const MailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
    <path d="M20 4H4C2.9 4 2 4.9 2 6v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z" stroke="#4ade80" strokeWidth="1.8"/>
    <path d="M22 6l-10 7L2 6" stroke="#4ade80" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);

const RefreshIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
    <path d="M23 4v6h-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M20.49 15a9 9 0 11-2.12-9.36L23 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const TrashIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
    <polyline points="3 6 5 6 21 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M19 6l-1 14H6L5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10 11v6M14 11v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M9 6V4h6v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-green-600">
    <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
    <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

/* ── Delete Confirmation Modal ── */
function DeleteModal({ target, onConfirm, onCancel, isDeleting }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}>
      <div className="rounded-2xl p-8 max-w-sm w-full mx-4 shadow-2xl" style={{ background: "#fff", border: "1px solid #bbf7d0" }}>
        <div className="flex flex-col items-center text-center gap-4">
          <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: "#fee2e2" }}>
            <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 text-red-500">
              <path d="M12 9v4M12 17h.01" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"/>
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800" style={{ fontFamily: "'Sora', sans-serif" }}>
              Confirm Deletion
            </h3>
            <p className="text-gray-500 text-sm mt-1">
              Are you sure you want to delete <span className="font-semibold text-gray-700">{target}</span>? This action cannot be undone.
            </p>
          </div>
          <div className="flex gap-3 w-full mt-2">
            <button
              onClick={onCancel}
              disabled={isDeleting}
              className="flex-1 py-2.5 rounded-xl text-sm font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isDeleting}
              className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-60 flex items-center justify-center gap-2"
              style={{ background: "linear-gradient(135deg,#dc2626,#b91c1c)" }}
            >
              {isDeleting ? (
                <>
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeDasharray="31.4" strokeDashoffset="10"/>
                  </svg>
                  Deleting...
                </>
              ) : "Delete"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Toast Notification ── */
function Toast({ message, type }) {
  return (
    <div
      className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-medium text-white flex items-center gap-2"
      style={{ background: type === "success" ? "#166534" : "#dc2626", fontFamily: "'Sora', sans-serif" }}
    >
      {type === "success" ? "✓" : "✕"} {message}
    </div>
  );
}

/* ── Main Component ── */
export const Subscriber = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [spinning, setSpinning] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  /* ── Fetch subscribers from backend ── */
  const fetchSubscribers = useCallback(async (withSpinner = false) => {
    if (withSpinner) setSpinning(true);
    setError(null);
    try {
      const res = await fetch(API_BASE);
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      // Normalise: backend may return array directly or { subscribers: [] }
      const list = Array.isArray(data) ? data : (data.subscribers ?? data.data ?? []);
      setSubscribers(list);
    } catch (err) {
      setError(err.message || "Failed to load subscribers");
    } finally {
      setLoading(false);
      if (withSpinner) setTimeout(() => setSpinning(false), 400);
    }
  }, []);

  useEffect(() => {
    fetchSubscribers();
  }, [fetchSubscribers]);

  const handleRefresh = () => fetchSubscribers(true);

  /* ── Delete a single subscriber via API ── */
  const deleteSingleFromAPI = async (email) => {
    const res = await fetch(API_BASE, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Failed to delete ${email}`);
    }
  };

  /* ── Confirm delete (single or bulk) ── */
  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      if (deleteTarget === "SELECTED") {
        const emailsToDelete = subscribers
          .filter((s) => selected.includes(getId(s)))
          .map((s) => s.email);

        await Promise.all(emailsToDelete.map(deleteSingleFromAPI));

        setSubscribers((prev) => prev.filter((s) => !selected.includes(getId(s))));
        setSelected([]);
        showToast(`${emailsToDelete.length} subscriber(s) deleted`);
      } else {
        await deleteSingleFromAPI(deleteTarget.email);
        setSubscribers((prev) => prev.filter((s) => s.email !== deleteTarget.email));
        setSelected((prev) => prev.filter((x) => x !== getId(deleteTarget)));
        showToast(`${deleteTarget.email} removed`);
      }
      setDeleteTarget(null);
    } catch (err) {
      showToast(err.message || "Delete failed", "error");
      setDeleteTarget(null);
    } finally {
      setIsDeleting(false);
    }
  };

  /* ── Helpers ── */
  const getId = (s) => s._id ?? s.id ?? s.email;

  const filtered = subscribers.filter(
    (s) =>
      s.email?.toLowerCase().includes(search.toLowerCase()) ||
      (s._id ?? s.id ?? "").toString().toLowerCase().includes(search.toLowerCase())
  );

  const toggleSelect = (key) =>
    setSelected((prev) => (prev.includes(key) ? prev.filter((x) => x !== key) : [...prev, key]));

  const toggleAll = () =>
    setSelected(selected.length === filtered.length ? [] : filtered.map(getId));

  const activeCount = subscribers.filter((s) => !s.status || s.status === "Active").length;

  return (
    <div className="min-h-screen p-8" style={{ background: "#f0fdf4", fontFamily: "'Sora', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap');
        * { font-family: 'Sora', sans-serif; }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        .animate-spin { animation: spin 0.8s linear infinite; }
      `}</style>

      {toast && <Toast message={toast.message} type={toast.type} />}

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <MailIcon />
          <span className="text-xs font-semibold tracking-widest uppercase text-green-600">Newsletter</span>
        </div>
        <h1 className="text-3xl font-bold text-green-950">Subscribed Emails</h1>
        <p className="text-green-700 text-sm mt-1">Monitor and manage your newsletter community</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "Total Subscribers", value: subscribers.length, color: "#166534" },
          { label: "Active", value: activeCount, color: "#15803d" },
          { label: "Unsubscribed", value: subscribers.length - activeCount, color: "#854d0e" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-2xl p-5 shadow-sm" style={{ background: "#ffffff", border: "1px solid #bbf7d0" }}>
            <div className="text-3xl font-bold" style={{ color: stat.color }}>
              {loading ? "—" : stat.value}
            </div>
            <div className="text-sm text-gray-500 mt-1 font-medium">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Table Card */}
      <div className="rounded-2xl shadow-sm overflow-hidden" style={{ background: "#ffffff", border: "1px solid #bbf7d0" }}>

        {/* Toolbar */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-green-100" style={{ background: "#f0fdf4" }}>
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-green-100">
            <SearchIcon />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search email or ID..."
              className="bg-transparent text-sm text-green-900 outline-none w-48 placeholder-green-400"
            />
          </div>
          <div className="flex items-center gap-3">
            {selected.length > 0 && (
              <span className="text-xs font-medium text-green-700 bg-green-100 px-3 py-1 rounded-full">
                {selected.length} selected
              </span>
            )}
            <button
              onClick={handleRefresh}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all"
              style={{ background: "#f0fdf4", color: "#166534", border: "1px solid #bbf7d0" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#dcfce7")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#f0fdf4")}
            >
              <span style={{ display: "inline-block", animation: spinning ? "spin 0.8s linear infinite" : "none" }}>
                <RefreshIcon />
              </span>
              Refresh
            </button>
            <button
              onClick={() => selected.length > 0 && setDeleteTarget("SELECTED")}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all"
              style={{
                background: selected.length > 0 ? "#fef2f2" : "#f9fafb",
                color: selected.length > 0 ? "#dc2626" : "#9ca3af",
                border: `1px solid ${selected.length > 0 ? "#fecaca" : "#e5e7eb"}`,
                cursor: selected.length > 0 ? "pointer" : "not-allowed",
              }}
            >
              <TrashIcon />
              Delete Selected
            </button>
          </div>
        </div>

        {/* Loading state */}
        {loading ? (
          <div className="py-20 text-center">
            <svg className="w-8 h-8 animate-spin mx-auto text-green-400" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="31.4" strokeDashoffset="10"/>
            </svg>
            <p className="text-green-600 text-sm mt-3 font-medium">Loading subscribers…</p>
          </div>
        ) : error ? (
          <div className="py-20 text-center">
            <p className="text-red-500 text-sm font-medium">{error}</p>
            <button onClick={handleRefresh} className="mt-3 text-xs text-green-700 underline">
              Try again
            </button>
          </div>
        ) : (
          <>
            <table className="w-full">
              <thead>
                <tr style={{ background: "#f0fdf4" }}>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={filtered.length > 0 && selected.length === filtered.length}
                      onChange={toggleAll}
                      className="w-4 h-4 accent-green-600 cursor-pointer"
                    />
                  </th>
                  {["Subscriber ID", "Email Address", "Subscribed On", "Status", "Action"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-widest text-green-700">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((sub, i) => {
                  const key = getId(sub);
                  const isSelected = selected.includes(key);
                  return (
                    <tr
                      key={key}
                      className="border-t border-green-50 transition-colors"
                      style={{ background: isSelected ? "#f0fdf4" : i % 2 === 0 ? "#ffffff" : "#fafffe" }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#f0fdf4")}
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = isSelected ? "#f0fdf4" : i % 2 === 0 ? "#ffffff" : "#fafffe")
                      }
                    >
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelect(key)}
                          className="w-4 h-4 accent-green-600 cursor-pointer"
                        />
                      </td>
                      <td className="px-4 py-4 text-xs font-mono text-green-600 font-medium">
                        {(sub._id ?? sub.id ?? "—").toString().slice(-8).toUpperCase()}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                            style={{ background: "linear-gradient(135deg, #4ade80, #166534)" }}
                          >
                            {sub.email?.[0]?.toUpperCase() ?? "?"}
                          </div>
                          <span className="text-sm text-gray-700 font-medium">{sub.email}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500">
                        {(sub.subscribedOn ?? sub.createdAt)
                          ? new Date(sub.subscribedOn ?? sub.createdAt).toLocaleDateString("en-IN", {
                              year: "numeric", month: "short", day: "2-digit",
                            })
                          : "—"}
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className="px-3 py-1 rounded-full text-xs font-semibold"
                          style={
                            (sub.status ?? "Active") === "Active"
                              ? { background: "#dcfce7", color: "#166534" }
                              : { background: "#fee2e2", color: "#dc2626" }
                          }
                        >
                          {sub.status ?? "Active"}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <button
                          onClick={() => setDeleteTarget({ email: sub.email, _id: sub._id, id: sub.id })}
                          className="p-2 rounded-lg transition-colors text-gray-400 hover:text-red-500 hover:bg-red-50"
                          title="Delete subscriber"
                        >
                          <TrashIcon />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {filtered.length === 0 && (
              <div className="py-16 text-center">
                <div className="flex justify-center text-green-200 mb-3">
                  <MailIcon />
                </div>
                <p className="text-gray-400 text-sm">No subscribers found</p>
              </div>
            )}
          </>
        )}

        {/* Footer */}
        <div className="px-6 py-3 border-t border-green-100 flex items-center justify-between" style={{ background: "#f0fdf4" }}>
          <span className="text-xs text-green-600 font-medium">
            Showing {filtered.length} of {subscribers.length} subscribers
          </span>
        </div>
      </div>

      {/* Delete Modal */}
      {deleteTarget && (
        <DeleteModal
          target={deleteTarget === "SELECTED" ? `${selected.length} subscriber(s)` : deleteTarget.email}
          onConfirm={handleDeleteConfirm}
          onCancel={() => !isDeleting && setDeleteTarget(null)}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
};