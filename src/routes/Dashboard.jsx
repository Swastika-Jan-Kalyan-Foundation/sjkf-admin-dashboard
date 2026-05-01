import { useState, useEffect } from "react";
import { Donation } from "./Donation";
import {Subscriber} from './Subscriber'
import { Volunteer } from "./Volunteer";
/* ═══════════════════════════════════════════
   SVG ICONS
═══════════════════════════════════════════ */
const LeafIcon = () => (
  <svg viewBox="0 0 32 32" fill="none" className="w-7 h-7">
    <path d="M6 26C6 26 8 14 20 10C26 8 28 6 28 6C28 6 28 10 24 16C20 22 14 24 6 26Z" fill="#4ade80" />
    <path d="M6 26C10 20 14 16 20 12" stroke="#166534" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const icons = {
  dashboard: (
    <svg viewBox="0 0 24 24" fill="none" className="w-[18px] h-[18px]">
      <rect x="3" y="3" width="7" height="7" rx="2" fill="currentColor" />
      <rect x="14" y="3" width="7" height="7" rx="2" fill="currentColor" opacity="0.5" />
      <rect x="3" y="14" width="7" height="7" rx="2" fill="currentColor" opacity="0.5" />
      <rect x="14" y="14" width="7" height="7" rx="2" fill="currentColor" />
    </svg>
  ),
  subscribers: (
    <svg viewBox="0 0 24 24" fill="none" className="w-[18px] h-[18px]">
      <path d="M20 4H4C2.9 4 2 4.9 2 6v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z" stroke="currentColor" strokeWidth="1.8" />
      <path d="M22 6l-10 7L2 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ),
  donations: (
    <svg viewBox="0 0 24 24" fill="none" className="w-[18px] h-[18px]">
      <path d="M12 21C12 21 3 15 3 9a5 5 0 019-3 5 5 0 019 3c0 6-9 12-9 12z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  ),
  volunteers: (
    <svg viewBox="0 0 24 24" fill="none" className="w-[18px] h-[18px]">
      <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.8" />
      <path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M16 11l2 2 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  chevronRight: (
    <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
      <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  chevronLeft: (
    <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
      <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  trend: (
    <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
      <path d="M23 6l-9.5 9.5-5-5L1 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M17 6h6v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  logout: (
    <svg viewBox="0 0 24 24" fill="none" className="w-[18px] h-[18px]">
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};

/* ═══════════════════════════════════════════
   API ENDPOINTS
═══════════════════════════════════════════ */
const API = {
  newsletter:         "https://sjkf-backend-api-production.up.railway.app/api/newsletter",
  donations:          "https://sjkf-backend-api-production.up.railway.app/api/donations",
  volunteers:         "https://sjkf-backend-api-production.up.railway.app/api/volunteers",
  volunteersAccepted: "https://sjkf-backend-api-production.up.railway.app/api/volunteers/accepted",
};

const NAV = [
  { id: "dashboard", label: "Dashboard" },
  { id: "subscribers", label: "Subscribers" },
  { id: "donations", label: "Donations" },
  { id: "volunteers", label: "Volunteers" },
];

/* ═══════════════════════════════════════════
   SIDEBAR
═══════════════════════════════════════════ */
function Sidebar({ active, setActive, collapsed, setCollapsed }) {
  return (
    <aside
      className="h-screen flex flex-col sticky top-0 flex-shrink-0 transition-all duration-300 relative"
      style={{
        width: collapsed ? 68 : 228,
        background: "linear-gradient(175deg, #092616 0%, #0f3d24 45%, #145c34 100%)",
        boxShadow: "6px 0 32px rgba(0,0,0,0.22)",
        zIndex: 20,
      }}
    >
      {/* Floating toggle tab — always visible on the right edge */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        title={collapsed ? "Open sidebar" : "Close sidebar"}
        className="absolute -right-3.5 top-1/2 -translate-y-1/2 w-7 h-14 rounded-r-2xl flex items-center justify-center transition-all duration-200 z-30"
        style={{
          background: "linear-gradient(175deg, #0f3d24, #145c34)",
          border: "1px solid rgba(74,222,128,0.25)",
          borderLeft: "none",
          boxShadow: "4px 0 16px rgba(0,0,0,0.25)",
          color: "rgba(255,255,255,0.6)",
        }}
        onMouseEnter={e => {
          e.currentTarget.style.color = "#4ade80";
          e.currentTarget.style.background = "linear-gradient(175deg, #145c34, #166534)";
        }}
        onMouseLeave={e => {
          e.currentTarget.style.color = "rgba(255,255,255,0.6)";
          e.currentTarget.style.background = "linear-gradient(175deg, #0f3d24, #145c34)";
        }}
      >
        <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5" style={{ transition: "transform 0.3s", transform: collapsed ? "rotate(0deg)" : "rotate(180deg)" }}>
          <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)" }}>
          <LeafIcon />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <div className="text-white font-bold text-[15px] leading-tight tracking-tight">GreenRoot</div>
            <div className="text-green-400 text-[10px] font-semibold tracking-[0.18em] uppercase mt-0.5">Admin Panel</div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-5 flex flex-col gap-1">
        {!collapsed && (
          <p className="text-[9px] font-bold tracking-[0.2em] uppercase mb-3 px-2" style={{ color: "rgba(255,255,255,0.25)" }}>
            Navigation
          </p>
        )}
        {NAV.map((item) => {
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActive(item.id)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 relative group w-full text-left"
              style={{
                background: isActive ? "rgba(74,222,128,0.15)" : "transparent",
                color: isActive ? "#4ade80" : "rgba(255,255,255,0.5)",
                border: isActive ? "1px solid rgba(74,222,128,0.2)" : "1px solid transparent",
              }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
            >
              {isActive && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-r-full" style={{ background: "#4ade80" }} />}
              <span className="flex-shrink-0">{icons[item.id]}</span>
              {!collapsed && <span className="text-[13px] font-semibold tracking-wide">{item.label}</span>}
              {!collapsed && isActive && <span className="ml-auto">{icons.chevronRight}</span>}
            </button>
          );
        })}
      </nav>

      {/* User */}
      <div className="px-3 py-4" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
            style={{ background: "linear-gradient(135deg,#4ade80,#166534)" }}>
            A
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-bold truncate">Administrator</p>
              <p className="text-green-400 text-[10px] truncate">Full Access</p>
            </div>
          )}
          {!collapsed && (
            <button className="flex-shrink-0 transition-colors" style={{ color: "rgba(255,255,255,0.3)" }}
              onMouseEnter={e => e.currentTarget.style.color = "#f87171"}
              onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.3)"}>
              {icons.logout}
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}

/* ═══════════════════════════════════════════
   TOPBAR
═══════════════════════════════════════════ */
function Topbar({ screen }) {
  const labels = { dashboard: "Overview Dashboard", subscribers: "Subscribers", donations: "Donations", volunteers: "Volunteers" };
  const subs = {
    dashboard: "Here's everything happening across your NGO today.",
    subscribers: "Manage your newsletter community.",
    donations: "Track and monitor all donation records.",
    volunteers: "Review applications and manage your team.",
  };
  const now = new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  return (
    <div className="flex items-center justify-between px-8 py-5" style={{ borderBottom: "1px solid #dcfce7", background: "#fff" }}>
      <div>
        <h1 className="text-xl font-bold text-green-950">{labels[screen]}</h1>
        <p className="text-green-600 text-xs mt-0.5 font-medium">{subs[screen]}</p>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-xs font-semibold text-gray-400">{now}</p>
          <p className="text-[10px] text-green-500 font-bold tracking-widest uppercase mt-0.5">Live Data</p>
        </div>
        <div className="w-px h-8" style={{ background: "#dcfce7" }} />
        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold text-white"
          style={{ background: "linear-gradient(135deg,#0f3d24,#4ade80)" }}>A</div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   STAT CARD
═══════════════════════════════════════════ */
function StatCard({ label, value, sub, icon, accent }) {
  return (
    <div className="rounded-2xl p-5 flex flex-col gap-3 shadow-sm relative overflow-hidden"
      style={{ background: "#fff", border: "1px solid #dcfce7" }}>
      <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-[0.04]" style={{ background: accent }} />
      <div className="flex items-start justify-between">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: `${accent}18`, color: accent }}>
          {icon}
        </div>
        <div className="flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full"
          style={{ background: "#f0fdf4", color: "#15803d" }}>
          {icons.trend} +12%
        </div>
      </div>
      <div>
        <div className="text-3xl font-bold text-green-950" style={{ letterSpacing: "-0.02em" }}>{value}</div>
        <div className="text-[11px] font-semibold text-gray-400 mt-0.5 uppercase tracking-wider">{label}</div>
      </div>
      <p className="text-[11px] text-green-600 font-medium">{sub}</p>
    </div>
  );
}

/* ═══════════════════════════════════════════
   SECTION WRAPPER (overview cards)
═══════════════════════════════════════════ */
function SectionCard({ title, icon, count, accent, children, onNavigate, navLabel }) {
  return (
    <div className="rounded-2xl overflow-hidden shadow-sm" style={{ background: "#fff", border: "1px solid #dcfce7" }}>
      <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid #f0fdf4" }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `${accent}18`, color: accent }}>
            {icon}
          </div>
          <div>
            <h3 className="text-sm font-bold text-green-950">{title}</h3>
            <p className="text-[10px] text-gray-400 font-medium">{count} records total</p>
          </div>
        </div>
        <button
          onClick={onNavigate}
          className="flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-lg transition-all"
          style={{ background: "#f0fdf4", color: "#166534", border: "1px solid #dcfce7" }}
          onMouseEnter={e => { e.currentTarget.style.background = "#dcfce7"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "#f0fdf4"; }}
        >
          {navLabel} {icons.chevronRight}
        </button>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   SHARED UI HELPERS
═══════════════════════════════════════════ */

// Skeleton shimmer row
function SkeletonRow() {
  return (
    <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl" style={{ background: "#f8fffe" }}>
      <div className="w-7 h-7 rounded-lg flex-shrink-0" style={{ background: "linear-gradient(90deg,#dcfce7,#bbf7d0,#dcfce7)", backgroundSize: "200%", animation: "shimmer 1.4s infinite" }} />
      <div className="flex-1 space-y-1.5">
        <div className="h-2.5 rounded-full w-2/3" style={{ background: "linear-gradient(90deg,#dcfce7,#bbf7d0,#dcfce7)", backgroundSize: "200%", animation: "shimmer 1.4s infinite" }} />
        <div className="h-2 rounded-full w-1/3" style={{ background: "linear-gradient(90deg,#f0fdf4,#dcfce7,#f0fdf4)", backgroundSize: "200%", animation: "shimmer 1.4s infinite" }} />
      </div>
    </div>
  );
}

// Empty state
function EmptyState({ message }) {
  return (
    <div className="flex flex-col items-center justify-center py-8 gap-3">
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: "#f0fdf4", border: "2px dashed #bbf7d0" }}>
        <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-green-300">
          <path d="M17 8C8 10 5.9 16.17 3.82 19.34L5.71 21l1-1C8 18.5 10 17 12 17c2 0 4 1 6 1 2-4-1-9-1-10z" fill="#bbf7d0" />
        </svg>
      </div>
      <p className="text-[12px] font-semibold text-gray-400">{message}</p>
    </div>
  );
}

// Error state
function ErrorState({ onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-8 gap-3">
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: "#fef2f2", border: "2px dashed #fecaca" }}>
        <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5"><path d="M12 9v4M12 17h.01" stroke="#f87171" strokeWidth="2" strokeLinecap="round"/><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="#f87171" strokeWidth="2"/></svg>
      </div>
      <p className="text-[12px] font-semibold text-gray-400">Failed to load data</p>
      <button onClick={onRetry} className="text-[11px] font-bold px-3 py-1.5 rounded-lg transition-all"
        style={{ background: "#f0fdf4", color: "#166534", border: "1px solid #dcfce7" }}>
        Retry
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════
   DASHBOARD OVERVIEW CONTENT
═══════════════════════════════════════════ */
function DashboardView({ setActive }) {
  const [data, setData] = useState({
    subscribers: [], donations: [], volunteers: [], accepted: [],
  });
  const [loading, setLoading] = useState({
    subscribers: true, donations: true, volunteers: true, accepted: true,
  });
  const [error, setError] = useState({
    subscribers: false, donations: false, volunteers: false, accepted: false,
  });

  const fetchOne = async (key, url) => {
    setLoading(p => ({ ...p, [key]: true }));
    setError(p => ({ ...p, [key]: false }));
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error("Network error");
      const json = await res.json();
      // handle both array response and { data: [] } response shapes
      const arr = Array.isArray(json) ? json : (json.data ?? json.volunteers ?? json.subscribers ?? json.donations ?? []);
      setData(p => ({ ...p, [key]: arr }));
    } catch {
      setError(p => ({ ...p, [key]: true }));
    } finally {
      setLoading(p => ({ ...p, [key]: false }));
    }
  };

  useEffect(() => {
    fetchOne("subscribers", API.newsletter);
    fetchOne("donations",   API.donations);
    fetchOne("volunteers",  API.volunteers);
    fetchOne("accepted",    API.volunteersAccepted);
  }, []);

  // ── derived stats ──
  const totalRaised = data.donations.reduce((a, d) => {
    const raw = d.amount ?? d.donationAmount ?? d.totalAmount ?? 0;
    const num = typeof raw === "number" ? raw : parseInt(String(raw).replace(/[^0-9]/g, "")) || 0;
    return a + num;
  }, 0);

  const fmtAmount = (n) => n >= 100000 ? `₹${(n / 100000).toFixed(1)}L` : n >= 1000 ? `₹${(n / 1000).toFixed(0)}K` : `₹${n}`;

  const getName = (item) =>
    item.donorName ?? item.name ?? item.fullName ?? item.applicantName ?? "—";

  const getEmail = (item) => item.email ?? item.emailAddress ?? "—";

  const getVolName = (item) =>
    item.name ?? item.fullName ?? item.applicantName ?? item.volunteerName ?? "—";

  const getRole = (item) =>
    item.role ?? item.position ?? (Array.isArray(item.skills) ? item.skills[0] : item.skills) ?? "Volunteer";

  const getCity = (item) => item.city ?? item.location ?? "—";

  const getTxnId = (item) =>
    item.transactionId ?? item.txnId ?? item.razorpay_payment_id ?? item._id ?? "—";

  const getAmtDisplay = (item) => {
    const raw = item.amount ?? item.donationAmount ?? item.totalAmount ?? 0;
    const num = typeof raw === "number" ? raw : parseInt(String(raw).replace(/[^0-9]/g, "")) || 0;
    return num ? fmtAmount(num) : "—";
  };

  const allLoading = Object.values(loading).every(Boolean);

  return (
    <div className="p-8 space-y-8">
      <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard
          label="Subscribers" accent="#166534"
          value={loading.subscribers ? "—" : data.subscribers.length}
          sub={loading.subscribers ? "Loading..." : error.subscribers ? "Error loading" : `${data.subscribers.length} total emails`}
          icon={<svg viewBox="0 0 24 24" fill="none" className="w-5 h-5"><path d="M20 4H4C2.9 4 2 4.9 2 6v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z" stroke="currentColor" strokeWidth="1.8"/><path d="M22 6l-10 7L2 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>}
        />
        <StatCard
          label="Total Raised" accent="#15803d"
          value={loading.donations ? "—" : fmtAmount(totalRaised)}
          sub={loading.donations ? "Loading..." : error.donations ? "Error loading" : `${data.donations.length} donations`}
          icon={<svg viewBox="0 0 24 24" fill="none" className="w-5 h-5"><path d="M12 21C12 21 3 15 3 9a5 5 0 019-3 5 5 0 019 3c0 6-9 12-9 12z" stroke="currentColor" strokeWidth="1.8"/></svg>}
        />
        <StatCard
          label="Applications" accent="#065f46"
          value={loading.volunteers ? "—" : data.volunteers.length}
          sub={loading.volunteers ? "Loading..." : error.volunteers ? "Error loading" : "Pending review"}
          icon={<svg viewBox="0 0 24 24" fill="none" className="w-5 h-5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" strokeWidth="1.8"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>}
        />
        <StatCard
          label="Active Volunteers" accent="#14532d"
          value={loading.accepted ? "—" : data.accepted.length}
          sub={loading.accepted ? "Loading..." : error.accepted ? "Error loading" : "Accepted & onboarded"}
          icon={<svg viewBox="0 0 24 24" fill="none" className="w-5 h-5"><circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.8"/><path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><path d="M16 11l2 2 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
        />
      </div>

      {/* ── Row 1: Subscribers + Donations ── */}
      <div className="grid grid-cols-2 gap-6">

        {/* Subscribers */}
        <SectionCard title="Recent Subscribers" icon={icons.subscribers} count={data.subscribers.length} accent="#166534"
          onNavigate={() => setActive("subscribers")} navLabel="View All">
          {loading.subscribers ? (
            <div className="space-y-2">{[...Array(5)].map((_, i) => <SkeletonRow key={i} />)}</div>
          ) : error.subscribers ? (
            <ErrorState onRetry={() => fetchOne("subscribers", API.newsletter)} />
          ) : data.subscribers.length === 0 ? (
            <EmptyState message="No subscribers yet" />
          ) : (
            <div className="space-y-2">
              {data.subscribers.slice(0, 5).map((sub, i) => {
                const email = getEmail(sub);
                return (
                  <div key={sub._id ?? sub.id ?? i} className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
                    style={{ background: i % 2 === 0 ? "#f8fffe" : "#fff" }}>
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0"
                      style={{ background: `linear-gradient(135deg,hsl(${i*43+130},60%,30%),hsl(${i*43+160},60%,45%))` }}>
                      {email[0]?.toUpperCase() ?? "?"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-semibold text-gray-700 truncate">{email}</p>
                      <p className="text-[10px] text-gray-400">
                        {sub.subscribedAt ?? sub.createdAt ? new Date(sub.subscribedAt ?? sub.createdAt).toLocaleDateString("en-IN") : "—"}
                      </p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0"
                      style={{ background: "#dcfce7", color: "#166534" }}>
                      Active
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </SectionCard>

        {/* Donations */}
        <SectionCard title="Recent Donations" icon={icons.donations} count={data.donations.length} accent="#15803d"
          onNavigate={() => setActive("donations")} navLabel="View All">
          {loading.donations ? (
            <div className="space-y-2">{[...Array(5)].map((_, i) => <SkeletonRow key={i} />)}</div>
          ) : error.donations ? (
            <ErrorState onRetry={() => fetchOne("donations", API.donations)} />
          ) : data.donations.length === 0 ? (
            <EmptyState message="No donations recorded yet" />
          ) : (
            <div className="space-y-2">
              {data.donations.slice(0, 5).map((d, i) => {
                const name = getName(d);
                return (
                  <div key={d._id ?? d.id ?? i} className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
                    style={{ background: i % 2 === 0 ? "#f8fffe" : "#fff" }}>
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0"
                      style={{ background: `linear-gradient(135deg,hsl(${i*51+120},55%,28%),hsl(${i*51+150},55%,44%))` }}>
                      {name[0]?.toUpperCase() ?? "?"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-semibold text-gray-700 truncate">{name}</p>
                      <p className="text-[10px] text-gray-400 font-mono truncate">{getTxnId(d)}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-[13px] font-bold text-green-800">{getAmtDisplay(d)}</p>
                      <p className="text-[10px] text-gray-400">{d.paymentMethod ?? d.method ?? "—"}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </SectionCard>
      </div>

      {/* ── Row 2: Volunteer Applications + Accepted ── */}
      <div className="grid grid-cols-2 gap-6">

        {/* Applications */}
        <SectionCard title="Volunteer Applications" icon={icons.volunteers} count={data.volunteers.length} accent="#065f46"
          onNavigate={() => setActive("volunteers")} navLabel="Review">
          {loading.volunteers ? (
            <div className="space-y-2">{[...Array(5)].map((_, i) => <SkeletonRow key={i} />)}</div>
          ) : error.volunteers ? (
            <ErrorState onRetry={() => fetchOne("volunteers", API.volunteers)} />
          ) : data.volunteers.length === 0 ? (
            <EmptyState message="No applications received yet" />
          ) : (
            <div className="space-y-2">
              {data.volunteers.slice(0, 5).map((app, i) => {
                const name = getVolName(app);
                const skills = Array.isArray(app.skills) ? app.skills : app.skills ? [app.skills] : [];
                return (
                  <div key={app._id ?? app.id ?? i} className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
                    style={{ background: i % 2 === 0 ? "#f8fffe" : "#fff" }}>
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0"
                      style={{ background: `linear-gradient(135deg,hsl(${i*59+140},60%,28%),hsl(${i*59+170},60%,42%))` }}>
                      {name[0]?.toUpperCase() ?? "?"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-semibold text-gray-700 truncate">{name}</p>
                      <p className="text-[10px] text-gray-400 truncate">{getCity(app)} · {app.availability ?? "—"}</p>
                    </div>
                    {skills[0] && (
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full flex-shrink-0"
                        style={{ background: "#f0fdf4", color: "#166534" }}>{skills[0]}</span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </SectionCard>

        {/* Accepted Volunteers */}
        <SectionCard title="Active Volunteers" icon={icons.volunteers} count={data.accepted.length} accent="#14532d"
          onNavigate={() => setActive("volunteers")} navLabel="Manage">
          {loading.accepted ? (
            <div className="space-y-2">{[...Array(5)].map((_, i) => <SkeletonRow key={i} />)}</div>
          ) : error.accepted ? (
            <ErrorState onRetry={() => fetchOne("accepted", API.volunteersAccepted)} />
          ) : data.accepted.length === 0 ? (
            <EmptyState message="No volunteers accepted yet" />
          ) : (
            <div className="space-y-2">
              {data.accepted.slice(0, 5).map((vol, i) => {
                const name = getVolName(vol);
                return (
                  <div key={vol._id ?? vol.id ?? i} className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
                    style={{ background: i % 2 === 0 ? "#f8fffe" : "#fff" }}>
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0"
                      style={{ background: `linear-gradient(135deg,hsl(${i*67+125},58%,27%),hsl(${i*67+155},58%,43%))` }}>
                      {name[0]?.toUpperCase() ?? "?"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-semibold text-gray-700 truncate">{name}</p>
                      <p className="text-[10px] text-gray-400 truncate">{getRole(vol)}</p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0"
                      style={{ background: "#dcfce7", color: "#166534" }}>
                      Active
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </SectionCard>
      </div>
    </div>
  );
}




export const Dashboard = () => {
  const [active, setActive] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap');
        * { font-family: 'Sora', sans-serif; box-sizing: border-box; }
        ::-webkit-scrollbar { width: 5px; } 
        ::-webkit-scrollbar-track { background: #f0fdf4; }
        ::-webkit-scrollbar-thumb { background: #bbf7d0; border-radius: 99px; }
      `}</style>

      <div className="flex h-screen overflow-hidden" style={{ background: "#f0fdf4" }}>
        <Sidebar active={active} setActive={setActive} collapsed={collapsed} setCollapsed={setCollapsed} />

        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <Topbar screen={active} />

          <main className="flex-1 overflow-y-auto">
            {active === "dashboard" && <DashboardView setActive={setActive} />}
            {active === "subscribers" && <Subscriber label="Subscribers" />}
            {active === "donations" && <Donation label="Donations" />}
            {active === "volunteers" && <Volunteer label="Volunteers" />}
          </main>
        </div>
      </div>
    </>
  );
}