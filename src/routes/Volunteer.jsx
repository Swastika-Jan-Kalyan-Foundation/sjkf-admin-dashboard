import { useState, useEffect, useCallback } from "react";

const BASE_URL = "https://sjkf-backend-api-production.up.railway.app/api/volunteers";

/* ── API Helpers ── */
const apiCall = (url, options) =>
  fetch(url, options).then(async r => {
    const data = await r.json();
    if (!r.ok) throw new Error(data.message || "Request failed");
    return data;
  });

const api = {
  getApplications: () => apiCall(`${BASE_URL}/`),
  getAccepted:     () => apiCall(`${BASE_URL}/accepted`),
  acceptVolunteer: (id) => apiCall(`${BASE_URL}/${id}/accept`, { method: "POST" }),
  rejectVolunteer: (id) => apiCall(`${BASE_URL}/${id}/reject`, { method: "POST" }),
  deleteVolunteer: (id) => apiCall(`${BASE_URL}/${id}`, { method: "DELETE" }),
  deleteAll:       () => apiCall(`${BASE_URL}/delete-all`, { method: "DELETE" }),
};

/* ── Data Mappers ── */
const mapApplication = (v) => ({
  id: v._id,
  applicantName: v.name,
  gender: v.gender,
  dateOfBirth: v.dateOfBirth,
  email: v.email,
  phone: v.phoneNumber,
  address: v.address,
  instagram: v.instagramId,
  education: v.highestEducationalQualification,
  careerStatus: v.currentCareerStatus,
  skills: Array.isArray(v.skillsAndInterest)
    ? v.skillsAndInterest
    : v.skillsAndInterest?.split(",").map(s => s.trim()).filter(Boolean) || [],
  interestedTeams: Array.isArray(v.interestedTeams)
    ? v.interestedTeams
    : v.interestedTeams?.split(",").map(s => s.trim()).filter(Boolean) || [],
  leadership: v.leadershipPreference,
  experience: v.previousVolunteerExperience,
  motivation: v.whyJoinUs,
  appliedOn: v.createdAt ? new Date(v.createdAt).toLocaleDateString("en-IN") : "—",
});

const mapAccepted = (v) => ({
  id: v._id,
  name: v.name,
  gender: v.gender,
  email: v.email,
  phone: v.phoneNumber,
  address: v.address,
  skills: Array.isArray(v.skillsAndInterest)
    ? v.skillsAndInterest
    : v.skillsAndInterest?.split(",").map(s => s.trim()).filter(Boolean) || [],
  interestedTeams: Array.isArray(v.interestedTeams)
    ? v.interestedTeams
    : v.interestedTeams?.split(",").map(s => s.trim()).filter(Boolean) || [],
  joinedOn: v.createdAt ? new Date(v.createdAt).toLocaleDateString("en-IN") : "—",
  education: v.highestEducationalQualification,
  careerStatus: v.currentCareerStatus,
  leadership: v.leadershipPreference,
  experience: v.previousVolunteerExperience,
  motivation: v.whyJoinUs,
});

/* ── Icons ── */
const VolIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
    <circle cx="9" cy="7" r="4" stroke="#4ade80" strokeWidth="1.8"/>
    <path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" stroke="#4ade80" strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M16 11l2 2 4-4" stroke="#4ade80" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const RefreshIcon = ({ spinning }) => (
  <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" style={{ display: "inline-block", animation: spinning ? "spin 0.8s linear infinite" : "none" }}>
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
const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
    <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const XIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
  </svg>
);

/* ── Skeleton Loader ── */
function SkeletonRow() {
  return (
    <div className="grid grid-cols-12 items-center px-6 py-4 animate-pulse">
      <div className="col-span-1"><div className="w-7 h-7 rounded-lg bg-green-100" /></div>
      <div className="col-span-5 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-green-100 flex-shrink-0" />
        <div className="space-y-2">
          <div className="w-28 h-3 rounded bg-green-100" />
          <div className="w-20 h-2.5 rounded bg-green-50" />
        </div>
      </div>
      <div className="col-span-3"><div className="w-20 h-5 rounded-lg bg-green-50" /></div>
      <div className="col-span-2"><div className="w-16 h-3 rounded bg-green-50" /></div>
      <div className="col-span-1" />
    </div>
  );
}
function SkeletonCard() {
  return (
    <div className="rounded-2xl p-5 animate-pulse" style={{ background: "#ffffff", border: "1px solid #bbf7d0" }}>
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-green-100 flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="w-36 h-4 rounded bg-green-100" />
          <div className="w-56 h-3 rounded bg-green-50" />
        </div>
        <div className="flex gap-6 mr-4">
          <div className="text-center space-y-1"><div className="w-10 h-7 rounded bg-green-100 mx-auto" /><div className="w-14 h-2.5 rounded bg-green-50" /></div>
          <div className="w-px h-10 bg-green-100" />
          <div className="text-center space-y-1"><div className="w-10 h-7 rounded bg-green-100 mx-auto" /><div className="w-10 h-2.5 rounded bg-green-50" /></div>
        </div>
      </div>
    </div>
  );
}

/* ── Error Banner ── */
function ErrorBanner({ message, onRetry }) {
  return (
    <div className="rounded-2xl p-5 flex items-center gap-4" style={{ background: "#fff1f2", border: "1px solid #fecaca" }}>
      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "#fee2e2" }}>
        <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5"><path d="M12 9v4M12 17h.01" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"/><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"/></svg>
      </div>
      <div className="flex-1">
        <p className="text-sm font-semibold text-red-700">Failed to load data</p>
        <p className="text-xs text-red-500 mt-0.5">{message}</p>
      </div>
      <button onClick={onRetry} className="px-4 py-2 rounded-xl text-sm font-semibold text-white" style={{ background: "#ef4444" }}>
        Retry
      </button>
    </div>
  );
}

/* ── Toast Notification ── */
function Toast({ toast }) {
  if (!toast) return null;
  const colors = {
    success: { bg: "#f0fdf4", border: "#86efac", text: "#166534", icon: "✓" },
    error: { bg: "#fff1f2", border: "#fecaca", text: "#b91c1c", icon: "✕" },
    info: { bg: "#eff6ff", border: "#bfdbfe", text: "#1d4ed8", icon: "ℹ" },
  };
  const c = colors[toast.type] || colors.info;
  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl text-sm font-semibold"
      style={{ background: c.bg, border: `1px solid ${c.border}`, color: c.text }}>
      <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
        style={{ background: c.border }}>{c.icon}</span>
      {toast.message}
    </div>
  );
}

/* ── Application Detail Modal ── */
function ApplicationModal({ app, onClose, onAccept, onReject, loading }) {
  const age = app.dateOfBirth
    ? Math.floor((Date.now() - new Date(app.dateOfBirth)) / (365.25 * 24 * 3600 * 1000))
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)" }}>
      <div className="rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden" style={{ background: "#ffffff", border: "1px solid #bbf7d0" }}>
        {/* Header */}
        <div className="px-7 py-5 flex items-center justify-between" style={{ background: "linear-gradient(135deg, #0f3d24, #145c34)" }}>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-bold text-white"
              style={{ background: "rgba(255,255,255,0.2)" }}>
              {app.applicantName?.[0] || "?"}
            </div>
            <div>
              <h2 className="text-white font-bold text-lg" style={{ fontFamily: "'Sora', sans-serif" }}>
                {app.applicantName}
              </h2>
              <p className="text-green-300 text-xs">Applied on {app.appliedOn}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/60 hover:text-white transition-colors"><CloseIcon /></button>
        </div>

        {/* Body */}
        <div className="px-7 py-5 space-y-4 max-h-[65vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Age", value: age ? `${age} yrs` : "—" },
              { label: "Gender", value: app.gender || "—" },
              { label: "Email", value: app.email || "—" },
              { label: "Phone", value: app.phone || "—" },
              { label: "Education", value: app.education || "—" },
              { label: "Career Status", value: app.careerStatus || "—" },
              { label: "Leadership Pref.", value: app.leadership || "—" },
              { label: "Instagram", value: app.instagram ? `@${app.instagram}` : "—" },
            ].map((f) => (
              <div key={f.label}>
                <p className="text-xs text-green-600 font-semibold uppercase tracking-wider mb-1">{f.label}</p>
                <p className="text-sm font-medium text-gray-700">{f.value}</p>
              </div>
            ))}
          </div>

          {app.address && (
            <div>
              <p className="text-xs text-green-600 font-semibold uppercase tracking-wider mb-1">Address</p>
              <p className="text-sm text-gray-600">{app.address}</p>
            </div>
          )}

          {/* Skills */}
          {app.skills?.length > 0 && (
            <div>
              <p className="text-xs text-green-600 font-semibold uppercase tracking-wider mb-2">Skills & Interests</p>
              <div className="flex flex-wrap gap-2">
                {app.skills.map((skill) => (
                  <span key={skill} className="px-3 py-1 rounded-full text-xs font-semibold" style={{ background: "#dcfce7", color: "#166534" }}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Interested Teams */}
          {app.interestedTeams?.length > 0 && (
            <div>
              <p className="text-xs text-green-600 font-semibold uppercase tracking-wider mb-2">Interested Teams</p>
              <div className="flex flex-wrap gap-2">
                {app.interestedTeams.map((team) => (
                  <span key={team} className="px-3 py-1 rounded-full text-xs font-semibold" style={{ background: "#dbeafe", color: "#1e40af" }}>
                    {team}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Experience */}
          {app.experience && (
            <div>
              <p className="text-xs text-green-600 font-semibold uppercase tracking-wider mb-1">Previous Experience</p>
              <p className="text-sm text-gray-600">{app.experience}</p>
            </div>
          )}

          {/* Motivation */}
          {app.motivation && (
            <div>
              <p className="text-xs text-green-600 font-semibold uppercase tracking-wider mb-1">Why Join Us</p>
              <div className="rounded-xl p-3 text-sm text-gray-600 italic" style={{ background: "#f0fdf4", border: "1px solid #bbf7d0" }}>
                "{app.motivation}"
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-7 pb-6 flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 rounded-xl text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
            Close
          </button>
          <button
            onClick={() => onReject(app)}
            disabled={loading}
            className="flex-1 py-3 rounded-xl text-sm font-bold text-white transition-all flex items-center justify-center gap-2"
            style={{ background: "linear-gradient(135deg, #dc2626, #b91c1c)", opacity: loading ? 0.7 : 1 }}
          >
            <XIcon /> Reject
          </button>
          <button
            onClick={() => onAccept(app)}
            disabled={loading}
            className="flex-1 py-3 rounded-xl text-sm font-bold text-white transition-all flex items-center justify-center gap-2"
            style={{ background: "linear-gradient(135deg, #166534, #15803d)", opacity: loading ? 0.7 : 1 }}
          >
            <CheckIcon /> Accept Volunteer
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Accepted Volunteer Detail Modal ── */
function AcceptedModal({ vol, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)" }}>
      <div className="rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden" style={{ background: "#ffffff", border: "1px solid #bbf7d0" }}>
        <div className="px-7 py-5 flex items-center justify-between" style={{ background: "linear-gradient(135deg, #0f3d24, #145c34)" }}>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-bold text-white" style={{ background: "rgba(255,255,255,0.2)" }}>
              {vol.name?.[0] || "?"}
            </div>
            <div>
              <h2 className="text-white font-bold text-lg" style={{ fontFamily: "'Sora', sans-serif" }}>{vol.name}</h2>
              <p className="text-green-300 text-xs">Accepted Volunteer · Joined {vol.joinedOn}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/60 hover:text-white"><CloseIcon /></button>
        </div>
        <div className="px-7 py-5 space-y-4 max-h-[60vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Email", value: vol.email || "—" },
              { label: "Phone", value: vol.phone || "—" },
              { label: "Education", value: vol.education || "—" },
              { label: "Career Status", value: vol.careerStatus || "—" },
              { label: "Leadership", value: vol.leadership || "—" },
              { label: "Joined On", value: vol.joinedOn },
            ].map(f => (
              <div key={f.label}>
                <p className="text-xs text-green-600 font-semibold uppercase tracking-wider mb-1">{f.label}</p>
                <p className="text-sm font-medium text-gray-700">{f.value}</p>
              </div>
            ))}
          </div>
          {vol.skills?.length > 0 && (
            <div>
              <p className="text-xs text-green-600 font-semibold uppercase tracking-wider mb-2">Skills</p>
              <div className="flex flex-wrap gap-2">
                {vol.skills.map(s => <span key={s} className="px-3 py-1 rounded-full text-xs font-semibold" style={{ background: "#dcfce7", color: "#166534" }}>{s}</span>)}
              </div>
            </div>
          )}
          {vol.interestedTeams?.length > 0 && (
            <div>
              <p className="text-xs text-green-600 font-semibold uppercase tracking-wider mb-2">Teams</p>
              <div className="flex flex-wrap gap-2">
                {vol.interestedTeams.map(t => <span key={t} className="px-3 py-1 rounded-full text-xs font-semibold" style={{ background: "#dbeafe", color: "#1e40af" }}>{t}</span>)}
              </div>
            </div>
          )}
          {vol.experience && (
            <div>
              <p className="text-xs text-green-600 font-semibold uppercase tracking-wider mb-1">Experience</p>
              <p className="text-sm text-gray-600">{vol.experience}</p>
            </div>
          )}
          {vol.motivation && (
            <div>
              <p className="text-xs text-green-600 font-semibold uppercase tracking-wider mb-1">Why Join Us</p>
              <div className="rounded-xl p-3 text-sm text-gray-600 italic" style={{ background: "#f0fdf4", border: "1px solid #bbf7d0" }}>
                "{vol.motivation}"
              </div>
            </div>
          )}
        </div>
        <div className="px-7 pb-6">
          <button onClick={onClose} className="w-full py-3 rounded-xl text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">Close</button>
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
            <p className="text-gray-500 text-sm mt-1">Remove <span className="font-semibold text-gray-700">{target}</span>? This cannot be undone.</p>
          </div>
          <div className="flex gap-3 w-full mt-2">
            <button onClick={onCancel} disabled={loading} className="flex-1 py-2.5 rounded-xl text-sm font-medium border border-gray-200 text-gray-600 hover:bg-gray-50">Cancel</button>
            <button onClick={onConfirm} disabled={loading} className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2"
              style={{ background: "linear-gradient(135deg,#dc2626,#b91c1c)", opacity: loading ? 0.7 : 1 }}>
              {loading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" /> : null}
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Delete All Modal ── */
function DeleteAllModal({ onConfirm, onCancel, loading }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}>
      <div className="rounded-2xl p-8 max-w-sm w-full mx-4 shadow-2xl" style={{ background: "#fff", border: "1px solid #fecaca" }}>
        <div className="flex flex-col items-center text-center gap-4">
          <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: "#fee2e2" }}>
            <TrashIcon />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">Delete ALL Applications?</h3>
            <p className="text-gray-500 text-sm mt-1">This will permanently remove every pending volunteer application. This action <span className="font-bold text-red-600">cannot be undone</span>.</p>
          </div>
          <div className="flex gap-3 w-full mt-2">
            <button onClick={onCancel} disabled={loading} className="flex-1 py-2.5 rounded-xl text-sm font-medium border border-gray-200 text-gray-600 hover:bg-gray-50">Cancel</button>
            <button onClick={onConfirm} disabled={loading} className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2"
              style={{ background: "linear-gradient(135deg,#dc2626,#b91c1c)", opacity: loading ? 0.7 : 1 }}>
              {loading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" /> : null}
              Delete All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Main ── */
export const Volunteer = () => {
  const [applications, setApplications] = useState([]);
  const [accepted, setAccepted] = useState([]);
  const [loadingApps, setLoadingApps] = useState(true);
  const [loadingAccepted, setLoadingAccepted] = useState(true);
  const [errorApps, setErrorApps] = useState(null);
  const [errorAccepted, setErrorAccepted] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const [selectedApp, setSelectedApp] = useState(null);
  const [selectedVol, setSelectedVol] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null); // { id, name, type: 'app'|'vol' }
  const [showDeleteAll, setShowDeleteAll] = useState(false);
  const [spinning1, setSpinning1] = useState(false);
  const [spinning2, setSpinning2] = useState(false);
  const [appSearch, setAppSearch] = useState("");
  const [volSearch, setVolSearch] = useState("");
  const [activeTab, setActiveTab] = useState("applications");
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchApplications = useCallback(async () => {
    setLoadingApps(true);
    setErrorApps(null);
    try {
      const res = await api.getApplications();
      setApplications((res.data || []).map(mapApplication));
    } catch (e) {
      setErrorApps(e.message || "Network error");
    } finally {
      setLoadingApps(false);
    }
  }, []);

  const fetchAccepted = useCallback(async () => {
    setLoadingAccepted(true);
    setErrorAccepted(null);
    try {
      const res = await api.getAccepted();
      setAccepted((res.data || []).map(mapAccepted));
    } catch (e) {
      setErrorAccepted(e.message || "Network error");
    } finally {
      setLoadingAccepted(false);
    }
  }, []);

  useEffect(() => { fetchApplications(); }, [fetchApplications]);
  useEffect(() => { fetchAccepted(); }, [fetchAccepted]);

  const handleRefreshApps = async () => {
    setSpinning1(true);
    await fetchApplications();
    setSpinning1(false);
  };

  const handleRefreshAccepted = async () => {
    setSpinning2(true);
    await fetchAccepted();
    setSpinning2(false);
  };

  const handleAccept = async (app) => {
    setActionLoading(true);
    try {
      await api.acceptVolunteer(app.id);
      setApplications(prev => prev.filter(a => a.id !== app.id));
      await fetchAccepted();
      setSelectedApp(null);
      showToast(`${app.applicantName} accepted as a volunteer!`, "success");
    } catch (e) {
      showToast("Failed to accept volunteer. Try again.", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (app) => {
    setActionLoading(true);
    try {
      await api.rejectVolunteer(app.id);
      setApplications(prev => prev.filter(a => a.id !== app.id));
      setSelectedApp(null);
      showToast(`Application from ${app.applicantName} rejected.`, "info");
    } catch (e) {
      showToast("Failed to reject. Try again.", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setActionLoading(true);
    try {
      await api.deleteVolunteer(deleteTarget.id);
      if (deleteTarget.type === "app") {
        setApplications(prev => prev.filter(a => a.id !== deleteTarget.id));
      } else {
        setAccepted(prev => prev.filter(v => v.id !== deleteTarget.id));
      }
      showToast(`${deleteTarget.name} removed successfully.`, "success");
    } catch (e) {
      showToast("Delete failed. Try again.", "error");
    } finally {
      setActionLoading(false);
      setDeleteTarget(null);
    }
  };

  const handleDeleteAll = async () => {
    setActionLoading(true);
    try {
      await api.deleteAll();
      setApplications([]);
      setShowDeleteAll(false);
      showToast("All applications deleted.", "success");
    } catch (e) {
      showToast("Failed to delete all. Try again.", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const filteredApps = applications.filter(
    (a) => a.applicantName?.toLowerCase().includes(appSearch.toLowerCase())
  );

  const filteredVols = accepted.filter(
    (v) => v.name?.toLowerCase().includes(volSearch.toLowerCase()) ||
      v.email?.toLowerCase().includes(volSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen p-8" style={{ background: "#f0fdf4", fontFamily: "'Sora', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap'); * { font-family: 'Sora', sans-serif; }`}</style>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}} @keyframes spin-inf{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>

      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <VolIcon />
          <span className="text-xs font-semibold tracking-widest uppercase text-green-600">Community</span>
        </div>
        <h1 className="text-3xl font-bold text-green-950" style={{ fontFamily: "'Sora', sans-serif" }}>Volunteer Management</h1>
        <p className="text-green-700 text-sm mt-1">Review applications and manage your volunteer force</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "Pending Applications", value: loadingApps ? "—" : applications.length, color: "#166534", sub: "awaiting review" },
          { label: "Active Volunteers", value: loadingAccepted ? "—" : accepted.length, color: "#166534", sub: "accepted & active" },
          { label: "Total Processed", value: (loadingApps || loadingAccepted) ? "—" : applications.length + accepted.length, color: "#15803d", sub: "all time" },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl p-5 shadow-sm" style={{ background: "#ffffff", border: "1px solid #bbf7d0" }}>
            <div className="text-3xl font-bold" style={{ color: s.color, fontFamily: "'Sora', sans-serif" }}>{s.value}</div>
            <div className="text-sm text-gray-700 mt-1 font-semibold">{s.label}</div>
            <div className="text-xs text-gray-400 mt-0.5">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 p-1 rounded-2xl w-fit" style={{ background: "#ffffff", border: "1px solid #bbf7d0" }}>
        {[
          { id: "applications", label: "Applications", count: applications.length },
          { id: "accepted", label: "Accepted Volunteers", count: accepted.length },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
            style={
              activeTab === tab.id
                ? { background: "linear-gradient(135deg, #0f3d24, #166534)", color: "#fff" }
                : { color: "#166534" }
            }
          >
            {tab.label}
            <span className="text-xs px-2 py-0.5 rounded-full"
              style={activeTab === tab.id ? { background: "rgba(255,255,255,0.2)" } : { background: "#f0fdf4" }}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* ── Applications Tab ── */}
      {activeTab === "applications" && (
        <div className="rounded-2xl overflow-hidden shadow-sm" style={{ background: "#ffffff", border: "1px solid #bbf7d0" }}>
          {/* Toolbar */}
          <div className="px-6 py-4 border-b border-green-100 flex items-center justify-between flex-wrap gap-3" style={{ background: "#f8fffe" }}>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl" style={{ background: "#f0fdf4", border: "1px solid #bbf7d0" }}>
              <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-green-600"><circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/><path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
              <input value={appSearch} onChange={(e) => setAppSearch(e.target.value)} placeholder="Search applicant..."
                className="bg-transparent text-sm text-green-900 outline-none w-48 placeholder-green-400" />
            </div>
            <div className="flex items-center gap-2">
              {applications.length > 0 && (
                <button onClick={() => setShowDeleteAll(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-red-600 border border-red-200 hover:bg-red-50 transition-colors">
                  <TrashIcon /> Delete All
                </button>
              )}
              <button onClick={handleRefreshApps}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium"
                style={{ background: "#f0fdf4", color: "#166534", border: "1px solid #bbf7d0" }}>
                <RefreshIcon spinning={spinning1} /> Refresh
              </button>
            </div>
          </div>

          {/* Header Row */}
          <div className="grid grid-cols-12 px-6 py-3" style={{ background: "#f0fdf4" }}>
            <span className="col-span-1 text-xs text-green-600 font-semibold uppercase tracking-wider">#</span>
            <span className="col-span-5 text-xs text-green-600 font-semibold uppercase tracking-wider">Applicant</span>
            <span className="col-span-3 text-xs text-green-600 font-semibold uppercase tracking-wider">Contact</span>
            <span className="col-span-2 text-xs text-green-600 font-semibold uppercase tracking-wider">Applied On</span>
            <span className="col-span-1 text-xs text-green-600 font-semibold uppercase tracking-wider">Del</span>
          </div>

          <div className="divide-y divide-green-50">
            {loadingApps ? (
              Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} />)
            ) : errorApps ? (
              <div className="p-6"><ErrorBanner message={errorApps} onRetry={fetchApplications} /></div>
            ) : filteredApps.length === 0 ? (
              <div className="py-16 text-center">
                <div className="text-4xl mb-3">📋</div>
                <p className="text-gray-500 font-semibold">No applications found</p>
                <p className="text-gray-400 text-sm mt-1">New submissions will appear here</p>
              </div>
            ) : (
              filteredApps.map((app, i) => (
                <div
                  key={app.id}
                  onClick={() => setSelectedApp(app)}
                  className="grid grid-cols-12 items-center px-6 py-4 cursor-pointer transition-all duration-150 group"
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#f0fdf4")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "")}
                >
                  <div className="col-span-1">
                    <span className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-green-700" style={{ background: "#dcfce7" }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <div className="col-span-5 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                      style={{ background: `linear-gradient(135deg, hsl(${(i * 53) % 360},55%,35%), hsl(${(i * 53 + 40) % 360},55%,50%))` }}>
                      {app.applicantName?.[0] || "?"}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{app.applicantName}</p>
                      <p className="text-xs text-gray-400">{app.gender} {app.careerStatus ? `· ${app.careerStatus}` : ""}</p>
                    </div>
                  </div>
                  <div className="col-span-3">
                    <p className="text-xs text-gray-600 truncate max-w-[160px]">{app.email}</p>
                    <p className="text-xs text-gray-400">{app.phone}</p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-xs text-gray-500">{app.appliedOn}</span>
                  </div>
                  <div className="col-span-1 flex justify-end">
                    <button
                      onClick={(e) => { e.stopPropagation(); setDeleteTarget({ id: app.id, name: app.applicantName, type: "app" }); }}
                      className="p-2 rounded-lg transition-colors text-gray-300 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100">
                      <TrashIcon />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ── Accepted Volunteers Tab ── */}
      {activeTab === "accepted" && (
        <div>
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl" style={{ background: "#ffffff", border: "1px solid #bbf7d0" }}>
              <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-green-600"><circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/><path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
              <input value={volSearch} onChange={(e) => setVolSearch(e.target.value)} placeholder="Search volunteer..."
                className="bg-transparent text-sm text-green-900 outline-none w-48 placeholder-green-400" />
            </div>
            <button onClick={handleRefreshAccepted}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium"
              style={{ background: "#ffffff", color: "#166534", border: "1px solid #bbf7d0" }}>
              <RefreshIcon spinning={spinning2} /> Refresh
            </button>
          </div>

          {loadingAccepted ? (
            <div className="grid gap-4">{Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}</div>
          ) : errorAccepted ? (
            <ErrorBanner message={errorAccepted} onRetry={fetchAccepted} />
          ) : filteredVols.length === 0 ? (
            <div className="py-20 text-center rounded-2xl" style={{ background: "#ffffff", border: "1px solid #bbf7d0" }}>
              <div className="text-4xl mb-3">🌿</div>
              <p className="text-gray-500 font-semibold">No accepted volunteers yet</p>
              <p className="text-gray-400 text-sm mt-1">Accept applications to build your volunteer team</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredVols.map((vol, i) => (
                <div
                  key={vol.id}
                  onClick={() => setSelectedVol(vol)}
                  className="rounded-2xl p-5 shadow-sm transition-all duration-200 group cursor-pointer"
                  style={{ background: "#ffffff", border: "1px solid #bbf7d0" }}
                  onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 8px 30px rgba(22,101,52,0.1)"; e.currentTarget.style.borderColor = "#86efac"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.05)"; e.currentTarget.style.borderColor = "#bbf7d0"; }}
                >
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold text-white flex-shrink-0"
                      style={{ background: `linear-gradient(135deg, hsl(${(i * 61) % 360},60%,30%), hsl(${(i * 61 + 50) % 360},60%,50%))` }}>
                      {vol.name?.[0] || "?"}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-base font-bold text-gray-800" style={{ fontFamily: "'Sora', sans-serif" }}>{vol.name}</h3>
                        <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold flex-shrink-0" style={{ background: "#dcfce7", color: "#166534" }}>Active</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-500 flex-wrap">
                        <span className="truncate max-w-[200px]">{vol.email}</span>
                        {vol.interestedTeams?.[0] && <><span>·</span><span>{vol.interestedTeams[0]}</span></>}
                        {vol.careerStatus && <><span>·</span><span>{vol.careerStatus}</span></>}
                      </div>
                      {/* Skills preview */}
                      {vol.skills?.length > 0 && (
                        <div className="flex gap-1.5 mt-2 flex-wrap">
                          {vol.skills.slice(0, 3).map(s => (
                            <span key={s} className="text-xs px-2 py-0.5 rounded-full" style={{ background: "#f0fdf4", color: "#166534", border: "1px solid #bbf7d0" }}>{s}</span>
                          ))}
                          {vol.skills.length > 3 && <span className="text-xs text-gray-400">+{vol.skills.length - 3} more</span>}
                        </div>
                      )}
                    </div>

                    {/* Joined + leadership */}
                    <div className="flex items-center gap-6 mr-4 flex-shrink-0">
                      <div className="text-center">
                        <div className="text-sm font-bold" style={{ color: "#166534" }}>{vol.joinedOn}</div>
                        <div className="text-xs text-gray-400 mt-0.5">Joined</div>
                      </div>
                      {vol.leadership && (
                        <>
                          <div className="w-px h-10" style={{ background: "#bbf7d0" }} />
                          <div className="text-center">
                            <div className="text-sm font-semibold text-gray-600 max-w-[90px] truncate">{vol.leadership}</div>
                            <div className="text-xs text-gray-400 mt-0.5">Leadership</div>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Delete */}
                    <button
                      onClick={(e) => { e.stopPropagation(); setDeleteTarget({ id: vol.id, name: vol.name, type: "vol" }); }}
                      className="p-2 rounded-lg transition-colors text-gray-300 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 flex-shrink-0">
                      <TrashIcon />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Modals ── */}
      {selectedApp && (
        <ApplicationModal
          app={selectedApp}
          onClose={() => setSelectedApp(null)}
          onAccept={handleAccept}
          onReject={handleReject}
          loading={actionLoading}
        />
      )}
      {selectedVol && (
        <AcceptedModal vol={selectedVol} onClose={() => setSelectedVol(null)} />
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
          onConfirm={handleDeleteAll}
          onCancel={() => setShowDeleteAll(false)}
          loading={actionLoading}
        />
      )}

      <Toast toast={toast} />
    </div>
  );
};