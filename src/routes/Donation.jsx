import { useState, useEffect, useCallback } from "react";

const BASE_URL = "https://sjkf-backend-api-production.up.railway.app/api/donations";

/* ── API Helpers ── */
const api = {
  getAll: () => fetch(`${BASE_URL}/`).then(r => r.json()),
  deleteById: (id) => fetch(`${BASE_URL}/${id}`, { method: "DELETE" }).then(r => r.json()),
  deleteAll: () => fetch(`${BASE_URL}/delete-all`, { method: "DELETE" }).then(r => r.json()),
};

/* ── Data Mapper ── */
const mapDonation = (d) => ({
  id: d._id,
  donorName: d.donorName || d.name || "Anonymous",
  donorId: d.donorId || "—",
  transactionId: d.transactionId || d.razorpayPaymentId || "—",
  razorpayOrderId: d.razorpayOrderId || null,
  amount: d.amount != null ? d.amount : 0,           // raw number from DB
  currency: d.currency || "INR",
  method: d.paymentMethod || d.method || "—",
  campaign: d.campaign || d.cause || "General Fund",
  date: d.createdAt ? new Date(d.createdAt).toLocaleDateString("en-IN") : "—",
  email: d.email || "—",
  phone: d.phone || d.phoneNumber || "—",
  message: d.message || d.note || "",
  status: d.status || "Completed",
});

const formatAmount = (amount, currency = "INR") => {
  if (currency === "INR") return `₹${Number(amount).toLocaleString("en-IN")}`;
  return `${currency} ${Number(amount).toLocaleString()}`;
};

/* ── Icons ── */
const HeartIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
    <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402C1 3.314 3.8 1 6.5 1c1.8 0 3.7.9 5.5 2.8C13.8 1.9 15.7 1 17.5 1 20.2 1 23 3.314 23 7.191c0 4.105-5.37 8.863-11 14.402z"
      stroke="#4ade80" strokeWidth="1.8" fill="none"/>
  </svg>
);
const RefreshIcon = ({ spinning }) => (
  <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4"
    style={{ display: "inline-block", animation: spinning ? "spin 0.8s linear infinite" : "none" }}>
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
const CloseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

/* ── Status Badge ── */
function StatusBadge({ status }) {
  const map = {
    completed: { bg: "#dcfce7", text: "#166534", label: "Completed" },
    success:   { bg: "#dcfce7", text: "#166534", label: "Success" },
    pending:   { bg: "#fef9c3", text: "#854d0e", label: "Pending" },
    failed:    { bg: "#fee2e2", text: "#b91c1c", label: "Failed" },
  };
  const key = (status || "").toLowerCase();
  const style = map[key] || map.completed;
  return (
    <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ background: style.bg, color: style.text }}>
      {style.label}
    </span>
  );
}

/* ── Skeleton Row ── */
function SkeletonRow() {
  return (
    <div className="grid grid-cols-12 items-center px-5 py-4 rounded-2xl animate-pulse" style={{ background: "#ffffff", border: "1px solid #bbf7d0" }}>
      <div className="col-span-1"><div className="w-7 h-7 rounded-lg bg-green-100" /></div>
      <div className="col-span-4 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-green-100 flex-shrink-0" />
        <div className="space-y-2"><div className="w-28 h-3 rounded bg-green-100" /><div className="w-20 h-2.5 rounded bg-green-50" /></div>
      </div>
      <div className="col-span-3"><div className="w-24 h-5 rounded-lg bg-green-50" /></div>
      <div className="col-span-3"><div className="w-32 h-3 rounded bg-green-50" /></div>
      <div className="col-span-1" />
    </div>
  );
}

/* ── Error Banner ── */
function ErrorBanner({ message, onRetry }) {
  return (
    <div className="rounded-2xl p-5 flex items-center gap-4" style={{ background: "#fff1f2", border: "1px solid #fecaca" }}>
      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "#fee2e2" }}>
        <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
          <path d="M12 9v4M12 17h.01" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"/>
          <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </div>
      <div className="flex-1">
        <p className="text-sm font-semibold text-red-700">Failed to load donations</p>
        <p className="text-xs text-red-500 mt-0.5">{message}</p>
      </div>
      <button onClick={onRetry} className="px-4 py-2 rounded-xl text-sm font-semibold text-white" style={{ background: "#ef4444" }}>
        Retry
      </button>
    </div>
  );
}

/* ── Toast ── */
function Toast({ toast }) {
  if (!toast) return null;
  const colors = {
    success: { bg: "#f0fdf4", border: "#86efac", text: "#166534", icon: "✓" },
    error:   { bg: "#fff1f2", border: "#fecaca", text: "#b91c1c", icon: "✕" },
    info:    { bg: "#eff6ff", border: "#bfdbfe", text: "#1d4ed8", icon: "ℹ" },
  };
  const c = colors[toast.type] || colors.info;
  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl text-sm font-semibold"
      style={{ background: c.bg, border: `1px solid ${c.border}`, color: c.text }}>
      <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: c.border }}>
        {c.icon}
      </span>
      {toast.message}
    </div>
  );
}

/* ── Donation Detail Modal ── */
function DonationModal({ donation, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)" }}>
      <div className="rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden" style={{ background: "#ffffff", border: "1px solid #bbf7d0" }}>
        {/* Header */}
        <div className="px-7 py-5 flex items-center justify-between" style={{ background: "linear-gradient(135deg, #0f3d24, #145c34)" }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(255,255,255,0.15)" }}>
              <HeartIcon />
            </div>
            <div>
              <h2 className="text-white font-bold text-lg" style={{ fontFamily: "'Sora', sans-serif" }}>Donation Details</h2>
              <p className="text-green-300 text-xs font-mono">{donation.transactionId}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/60 hover:text-white transition-colors"><CloseIcon /></button>
        </div>

        {/* Amount Banner */}
        <div className="px-7 py-4 flex items-center justify-between" style={{ background: "#f0fdf4", borderBottom: "1px solid #bbf7d0" }}>
          <div>
            <span className="text-xs text-green-600 font-semibold uppercase tracking-wider">Donation Amount</span>
            {donation.campaign && donation.campaign !== "General Fund" && (
              <p className="text-xs text-green-700 mt-0.5">{donation.campaign}</p>
            )}
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold" style={{ color: "#166534", fontFamily: "'Sora', sans-serif" }}>
              {formatAmount(donation.amount, donation.currency)}
            </span>
            <div className="mt-1"><StatusBadge status={donation.status} /></div>
          </div>
        </div>

        {/* Body */}
        <div className="px-7 py-5 grid grid-cols-2 gap-4 max-h-80 overflow-y-auto">
          {[
            { label: "Donor Name",      value: donation.donorName },
            { label: "Donor ID",        value: donation.donorId },
            { label: "Email",           value: donation.email },
            { label: "Phone",           value: donation.phone },
            { label: "Payment Method",  value: donation.method },
            { label: "Date",            value: donation.date },
          ].map((field) => (
            <div key={field.label}>
              <p className="text-xs text-green-600 font-semibold uppercase tracking-wider mb-1">{field.label}</p>
              <p className="text-sm font-medium text-gray-700 break-all">{field.value || "—"}</p>
            </div>
          ))}

          {donation.razorpayOrderId && (
            <div className="col-span-2">
              <p className="text-xs text-green-600 font-semibold uppercase tracking-wider mb-1">Razorpay Order ID</p>
              <p className="text-xs font-mono text-gray-500 break-all">{donation.razorpayOrderId}</p>
            </div>
          )}

          {donation.message && (
            <div className="col-span-2">
              <p className="text-xs text-green-600 font-semibold uppercase tracking-wider mb-1">Message</p>
              <div className="rounded-xl p-3 text-sm text-gray-600 italic" style={{ background: "#f0fdf4", border: "1px solid #bbf7d0" }}>
                "{donation.message}"
              </div>
            </div>
          )}
        </div>

        <div className="px-7 pb-6">
          <button onClick={onClose} className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all"
            style={{ background: "linear-gradient(135deg, #166534, #15803d)" }}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Delete Modal ── */
function DeleteModal({ target, onConfirm, onCancel, loading }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}>
      <div className="rounded-2xl p-8 max-w-sm w-full mx-4 shadow-2xl" style={{ background: "#fff", border: "1px solid #bbf7d0" }}>
        <div className="flex flex-col items-center text-center gap-4">
          <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: "#fee2e2" }}>
            <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8">
              <path d="M12 9v4M12 17h.01" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"/>
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800" style={{ fontFamily: "'Sora', sans-serif" }}>Confirm Deletion</h3>
            <p className="text-gray-500 text-sm mt-1">
              Delete donation record for <span className="font-semibold text-gray-700">{target}</span>? This cannot be undone.
            </p>
          </div>
          <div className="flex gap-3 w-full mt-2">
            <button onClick={onCancel} disabled={loading} className="flex-1 py-2.5 rounded-xl text-sm font-medium border border-gray-200 text-gray-600 hover:bg-gray-50">
              Cancel
            </button>
            <button onClick={onConfirm} disabled={loading}
              className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2"
              style={{ background: "linear-gradient(135deg,#dc2626,#b91c1c)", opacity: loading ? 0.7 : 1 }}>
              {loading && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" />}
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Delete All Modal ── */
function DeleteAllModal({ count, onConfirm, onCancel, loading }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}>
      <div className="rounded-2xl p-8 max-w-sm w-full mx-4 shadow-2xl" style={{ background: "#fff", border: "1px solid #fecaca" }}>
        <div className="flex flex-col items-center text-center gap-4">
          <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: "#fee2e2" }}>
            <TrashIcon />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">Delete ALL {count} Records?</h3>
            <p className="text-gray-500 text-sm mt-1">
              This will permanently erase every donation record. This action <span className="font-bold text-red-600">cannot be undone</span>.
            </p>
          </div>
          <div className="flex gap-3 w-full mt-2">
            <button onClick={onCancel} disabled={loading} className="flex-1 py-2.5 rounded-xl text-sm font-medium border border-gray-200 text-gray-600 hover:bg-gray-50">
              Cancel
            </button>
            <button onClick={onConfirm} disabled={loading}
              className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2"
              style={{ background: "linear-gradient(135deg,#dc2626,#b91c1c)", opacity: loading ? 0.7 : 1 }}>
              {loading && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" />}
              Delete All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Main ── */
export const Donation = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [spinning, setSpinning] = useState(false);

  const [selectedDonation, setSelectedDonation] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null); // { id, name }
  const [showDeleteAll, setShowDeleteAll] = useState(false);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchDonations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getAll();
      setDonations((res.data || []).map(mapDonation));
    } catch (e) {
      setError(e.message || "Network error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchDonations(); }, [fetchDonations]);

  const handleRefresh = async () => {
    setSpinning(true);
    await fetchDonations();
    setSpinning(false);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setActionLoading(true);
    try {
      await api.deleteById(deleteTarget.id);
      setDonations(prev => prev.filter(d => d.id !== deleteTarget.id));
      showToast(`Donation record for ${deleteTarget.name} deleted.`, "success");
    } catch (e) {
      showToast("Delete failed. Please try again.", "error");
    } finally {
      setActionLoading(false);
      setDeleteTarget(null);
    }
  };

  const handleDeleteAll = async () => {
    setActionLoading(true);
    try {
      await api.deleteAll();
      setDonations([]);
      setShowDeleteAll(false);
      showToast("All donation records deleted.", "success");
    } catch (e) {
      showToast("Failed to delete all records.", "error");
    } finally {
      setActionLoading(false);
    }
  };

  // Stats derived from real data
  const totalAmount = donations.reduce((acc, d) => acc + Number(d.amount || 0), 0);
  const completedCount = donations.filter(d => ["completed", "success"].includes((d.status || "").toLowerCase())).length;
  const pendingCount = donations.filter(d => (d.status || "").toLowerCase() === "pending").length;

  const filtered = donations.filter(
    (d) =>
      d.donorName.toLowerCase().includes(search.toLowerCase()) ||
      d.donorId.toLowerCase().includes(search.toLowerCase()) ||
      d.transactionId.toLowerCase().includes(search.toLowerCase()) ||
      d.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen p-8" style={{ background: "#f0fdf4", fontFamily: "'Sora', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap'); * { font-family: 'Sora', sans-serif; }`}</style>
      <style>{`@keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }`}</style>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <HeartIcon />
          <span className="text-xs font-semibold tracking-widest uppercase text-green-600">Finance</span>
        </div>
        <h1 className="text-3xl font-bold text-green-950" style={{ fontFamily: "'Sora', sans-serif" }}>Donation Records</h1>
        <p className="text-green-700 text-sm mt-1">Click any row to view full donation details</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Donations",   value: loading ? "—" : donations.length,                                     color: "#166534", sub: "all records" },
          { label: "Total Raised",      value: loading ? "—" : formatAmount(totalAmount),                            color: "#15803d", sub: "combined amount" },
          { label: "Completed",         value: loading ? "—" : completedCount,                                       color: "#166534", sub: "successful payments" },
          { label: "Pending",           value: loading ? "—" : pendingCount,                                         color: "#92400e", sub: "awaiting confirmation" },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl p-5 shadow-sm" style={{ background: "#ffffff", border: "1px solid #bbf7d0" }}>
            <div className="text-3xl font-bold truncate" style={{ color: s.color, fontFamily: "'Sora', sans-serif" }}>{s.value}</div>
            <div className="text-sm text-gray-700 mt-1 font-semibold">{s.label}</div>
            <div className="text-xs text-gray-400 mt-0.5">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl" style={{ background: "#ffffff", border: "1px solid #bbf7d0" }}>
          <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-green-600">
            <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
            <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search donor, ID or transaction..."
            className="bg-transparent text-sm text-green-900 outline-none w-56 placeholder-green-400"
          />
        </div>
        <div className="flex items-center gap-3">
          {donations.length > 0 && (
            <button
              onClick={() => setShowDeleteAll(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-red-600 border border-red-200 hover:bg-red-50 transition-colors">
              <TrashIcon /> Delete All
            </button>
          )}
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
            style={{ background: "#ffffff", color: "#166534", border: "1px solid #bbf7d0" }}>
            <RefreshIcon spinning={spinning} /> Refresh
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="grid gap-3">
        {/* Column Header */}
        <div className="grid grid-cols-12 px-5 py-2">
          <span className="col-span-1 text-xs text-green-600 font-semibold uppercase tracking-wider">#</span>
          <span className="col-span-4 text-xs text-green-600 font-semibold uppercase tracking-wider">Donor</span>
          <span className="col-span-2 text-xs text-green-600 font-semibold uppercase tracking-wider">Donor ID</span>
          <span className="col-span-3 text-xs text-green-600 font-semibold uppercase tracking-wider">Transaction ID</span>
          <span className="col-span-1 text-xs text-green-600 font-semibold uppercase tracking-wider">Status</span>
          <span className="col-span-1 text-xs text-green-600 font-semibold uppercase tracking-wider">Del</span>
        </div>

        {loading ? (
          Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
        ) : error ? (
          <ErrorBanner message={error} onRetry={fetchDonations} />
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center rounded-2xl" style={{ background: "#ffffff", border: "1px solid #bbf7d0" }}>
            <div className="text-4xl mb-3">💚</div>
            <p className="text-gray-500 font-semibold">No donation records found</p>
            <p className="text-gray-400 text-sm mt-1">
              {search ? "Try a different search term" : "Donations will appear here once received"}
            </p>
          </div>
        ) : (
          filtered.map((donation, i) => (
            <div
              key={donation.id}
              onClick={() => setSelectedDonation(donation)}
              className="grid grid-cols-12 items-center px-5 py-4 rounded-2xl cursor-pointer transition-all duration-200 shadow-sm group"
              style={{ background: "#ffffff", border: "1px solid #bbf7d0" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 8px 30px rgba(22,101,52,0.12)";
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.borderColor = "#86efac";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.05)";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.borderColor = "#bbf7d0";
              }}
            >
              {/* Index */}
              <div className="col-span-1">
                <span className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-green-700" style={{ background: "#f0fdf4" }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>

              {/* Donor */}
              <div className="col-span-4 flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                  style={{ background: `linear-gradient(135deg, hsl(${(i * 47) % 360}, 60%, 35%), hsl(${(i * 47 + 40) % 360}, 60%, 50%))` }}>
                  {donation.donorName[0]}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{donation.donorName}</p>
                  <p className="text-xs text-gray-400">{formatAmount(donation.amount, donation.currency)} · {donation.method}</p>
                </div>
              </div>

              {/* Donor ID */}
              <div className="col-span-2">
                <span className="text-xs font-mono font-medium px-2.5 py-1 rounded-lg" style={{ background: "#f0fdf4", color: "#166534" }}>
                  {donation.donorId}
                </span>
              </div>

              {/* Transaction ID */}
              <div className="col-span-3">
                <span className="text-xs font-mono text-gray-500 truncate block max-w-[180px]">{donation.transactionId}</span>
                <span className="text-xs text-gray-300">{donation.date}</span>
              </div>

              {/* Status */}
              <div className="col-span-1">
                <StatusBadge status={donation.status} />
              </div>

              {/* Delete */}
              <div className="col-span-1 flex justify-end">
                <button
                  onClick={(e) => { e.stopPropagation(); setDeleteTarget({ id: donation.id, name: donation.donorName }); }}
                  className="p-2 rounded-lg transition-colors text-gray-300 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100">
                  <TrashIcon />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modals */}
      {selectedDonation && (
        <DonationModal donation={selectedDonation} onClose={() => setSelectedDonation(null)} />
      )}
      {deleteTarget && (
        <DeleteModal
          target={deleteTarget.name}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
          loading={actionLoading}
        />
      )}
      {showDeleteAll && (
        <DeleteAllModal
          count={donations.length}
          onConfirm={handleDeleteAll}
          onCancel={() => setShowDeleteAll(false)}
          loading={actionLoading}
        />
      )}

      <Toast toast={toast} />
    </div>
  );
};