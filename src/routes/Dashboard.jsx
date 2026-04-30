import { useState } from "react";
import sjkflogo from '../assets/logo.png'
import { Subscriber } from "./Subscriber";
import { Donation } from "./Donation";
import { Volunteer } from "./Volunteer";
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
   DUMMY DATA
═══════════════════════════════════════════ */
const SUBSCRIBERS = [
    { id: "SUB001", email: "arjun.sharma@gmail.com", source: "Homepage", status: "Active", date: "2025-01-12" },
    { id: "SUB002", email: "priya.nair@outlook.com", source: "Donation Page", status: "Active", date: "2025-01-20" },
    { id: "SUB003", email: "rohit.verma@yahoo.com", source: "Volunteer Page", status: "Active", date: "2025-02-05" },
    { id: "SUB004", email: "sneha.patel@gmail.com", source: "Social Media", status: "Unsubscribed", date: "2025-02-18" },
    { id: "SUB005", email: "ananya.iyer@gmail.com", source: "Homepage", status: "Active", date: "2025-03-01" },
];

const DONATIONS = [
    { id: "DON001", donorName: "Arjun Sharma", donorId: "USR4821", transactionId: "TXN-9A4F82B1", amount: "₹5,000", method: "UPI", campaign: "Tree Plantation", date: "2025-01-12", status: "Completed" },
    { id: "DON002", donorName: "Priya Nair", donorId: "USR3317", transactionId: "TXN-2C7D91F4", amount: "₹2,500", method: "Net Banking", campaign: "School Supplies", date: "2025-01-20", status: "Completed" },
    { id: "DON003", donorName: "Karan Mehta", donorId: "USR5541", transactionId: "TXN-7A9E66B3", amount: "₹25,000", method: "NEFT", campaign: "General Fund", date: "2025-03-14", status: "Completed" },
    { id: "DON004", donorName: "Sneha Patel", donorId: "USR7789", transactionId: "TXN-8B1F44D2", amount: "₹1,000", method: "UPI", campaign: "Women Empowerment", date: "2025-02-18", status: "Pending" },
];

const APPLICATIONS = [
    { id: "APP001", applicantId: "VOL8821", applicantName: "Divya Krishnan", city: "Bengaluru", skills: ["Teaching", "Event Mgmt"], availability: "Weekends", appliedOn: "2025-02-14" },
    { id: "APP002", applicantId: "VOL5543", applicantName: "Vikram Joshi", city: "Pune", skills: ["Photography", "Content Writing"], availability: "Full-time", appliedOn: "2025-02-22" },
    { id: "APP003", applicantId: "VOL3312", applicantName: "Meera Sundaram", city: "Chennai", skills: ["Medical Support"], availability: "Weekdays", appliedOn: "2025-03-01" },
];

const ACCEPTED_VOLS = [
    { id: "VOL001", volunteerId: "VOL2291", name: "Ananya Kapoor", role: "Community Educator", joinedOn: "2024-08-15", tasksCompleted: 24, hoursLogged: 186 },
    { id: "VOL002", volunteerId: "VOL4437", name: "Sameer Bhat", role: "Field Coordinator", joinedOn: "2024-09-01", tasksCompleted: 31, hoursLogged: 240 },
    { id: "VOL003", volunteerId: "VOL6612", name: "Lakshmi Narayanan", role: "Media & Outreach", joinedOn: "2024-10-20", tasksCompleted: 18, hoursLogged: 142 },
];

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
                    <img src={sjkflogo} />
                </div>
                {!collapsed && (
                    <div className="overflow-hidden">
                        <div className="text-white font-bold text-[15px] leading-tight tracking-tight">Swastika</div>
                        <div className="text-green-400 text-[10px] font-semibold tracking-[0.18em] uppercase mt-0.5">jan kalyan foundation</div>
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
   DASHBOARD OVERVIEW CONTENT
═══════════════════════════════════════════ */
function DashboardView({ setActive }) {
    const totalRaised = DONATIONS.reduce((a, d) => a + parseInt(d.amount.replace(/[₹,]/g, "")), 0);
    const totalHours = ACCEPTED_VOLS.reduce((a, v) => a + v.hoursLogged, 0);

    return (
        <div className="p-8 space-y-8">
            {/* Big Stats */}
            <div className="grid grid-cols-4 gap-4">
                <StatCard label="Subscribers" value={SUBSCRIBERS.length} sub={`${SUBSCRIBERS.filter(s => s.status === "Active").length} active`} accent="#166534"
                    icon={<svg viewBox="0 0 24 24" fill="none" className="w-5 h-5"><path d="M20 4H4C2.9 4 2 4.9 2 6v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z" stroke="currentColor" strokeWidth="1.8" /><path d="M22 6l-10 7L2 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>} />
                <StatCard label="Total Raised" value={`₹${(totalRaised / 1000).toFixed(0)}K`} sub={`${DONATIONS.length} donations`} accent="#15803d"
                    icon={<svg viewBox="0 0 24 24" fill="none" className="w-5 h-5"><path d="M12 21C12 21 3 15 3 9a5 5 0 019-3 5 5 0 019 3c0 6-9 12-9 12z" stroke="currentColor" strokeWidth="1.8" /></svg>} />
                <StatCard label="Applications" value={APPLICATIONS.length} sub="Pending review" accent="#065f46"
                    icon={<svg viewBox="0 0 24 24" fill="none" className="w-5 h-5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" strokeWidth="1.8" /><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>} />
                <StatCard label="Volunteers" value={ACCEPTED_VOLS.length} sub={`${totalHours} hrs logged`} accent="#14532d"
                    icon={<svg viewBox="0 0 24 24" fill="none" className="w-5 h-5"><circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.8" /><path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /><path d="M16 11l2 2 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>} />
            </div>

            {/* Top Row: Subscribers + Donations */}
            <div className="grid grid-cols-2 gap-6">
                {/* Subscribers Preview */}
                <SectionCard title="Recent Subscribers" icon={icons.subscribers} count={SUBSCRIBERS.length} accent="#166534" onNavigate={() => setActive("subscribers")} navLabel="View All">
                    <div className="space-y-2">
                        {SUBSCRIBERS.slice(0, 4).map((sub, i) => (
                            <div key={sub.id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors"
                                style={{ background: i % 2 === 0 ? "#f8fffe" : "#fff" }}>
                                <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0"
                                    style={{ background: `linear-gradient(135deg, hsl(${i * 43 + 130},60%,30%), hsl(${i * 43 + 160},60%,45%))` }}>
                                    {sub.email[0].toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[12px] font-semibold text-gray-700 truncate">{sub.email}</p>
                                    <p className="text-[10px] text-gray-400">{sub.source} · {sub.date}</p>
                                </div>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0"
                                    style={sub.status === "Active" ? { background: "#dcfce7", color: "#166534" } : { background: "#fee2e2", color: "#dc2626" }}>
                                    {sub.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </SectionCard>

                {/* Donations Preview */}
                <SectionCard title="Recent Donations" icon={icons.donations} count={DONATIONS.length} accent="#15803d" onNavigate={() => setActive("donations")} navLabel="View All">
                    <div className="space-y-2">
                        {DONATIONS.map((d, i) => (
                            <div key={d.id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
                                style={{ background: i % 2 === 0 ? "#f8fffe" : "#fff" }}>
                                <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0"
                                    style={{ background: `linear-gradient(135deg, hsl(${i * 51 + 120},55%,28%), hsl(${i * 51 + 150},55%,44%))` }}>
                                    {d.donorName[0]}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[12px] font-semibold text-gray-700">{d.donorName}</p>
                                    <p className="text-[10px] text-gray-400 font-mono">{d.transactionId}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[13px] font-bold text-green-800">{d.amount}</p>
                                    <p className="text-[10px] text-gray-400">{d.method}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </SectionCard>
            </div>

            {/* Bottom Row: Vol Applications + Accepted Volunteers */}
            <div className="grid grid-cols-2 gap-6">
                {/* Applications Preview */}
                <SectionCard title="Volunteer Applications" icon={icons.volunteers} count={APPLICATIONS.length} accent="#065f46" onNavigate={() => setActive("volunteers")} navLabel="Review">
                    <div className="space-y-2">
                        {APPLICATIONS.map((app, i) => (
                            <div key={app.id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
                                style={{ background: i % 2 === 0 ? "#f8fffe" : "#fff" }}>
                                <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0"
                                    style={{ background: `linear-gradient(135deg, hsl(${i * 59 + 140},60%,28%), hsl(${i * 59 + 170},60%,42%))` }}>
                                    {app.applicantName[0]}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[12px] font-semibold text-gray-700">{app.applicantName}</p>
                                    <p className="text-[10px] text-gray-400">{app.city} · {app.availability}</p>
                                </div>
                                <div className="flex flex-wrap gap-1 justify-end max-w-[120px]">
                                    {app.skills.slice(0, 1).map(s => (
                                        <span key={s} className="text-[9px] font-bold px-2 py-0.5 rounded-full"
                                            style={{ background: "#f0fdf4", color: "#166534" }}>{s}</span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </SectionCard>

                {/* Accepted Vols Preview */}
                <SectionCard title="Active Volunteers" icon={icons.volunteers} count={ACCEPTED_VOLS.length} accent="#14532d" onNavigate={() => setActive("volunteers")} navLabel="Manage">
                    <div className="space-y-2">
                        {ACCEPTED_VOLS.map((vol, i) => (
                            <div key={vol.id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
                                style={{ background: i % 2 === 0 ? "#f8fffe" : "#fff" }}>
                                <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0"
                                    style={{ background: `linear-gradient(135deg, hsl(${i * 67 + 125},58%,27%), hsl(${i * 67 + 155},58%,43%))` }}>
                                    {vol.name[0]}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[12px] font-semibold text-gray-700">{vol.name}</p>
                                    <p className="text-[10px] text-gray-400">{vol.role}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="text-center">
                                        <p className="text-[13px] font-bold text-green-800">{vol.tasksCompleted}</p>
                                        <p className="text-[9px] text-gray-400">Tasks</p>
                                    </div>
                                    <div className="w-px h-6" style={{ background: "#dcfce7" }} />
                                    <div className="text-center">
                                        <p className="text-[13px] font-bold text-green-800">{vol.hoursLogged}</p>
                                        <p className="text-[9px] text-gray-400">Hrs</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </SectionCard>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════
   PLACEHOLDER VIEWS (for nav switching)
═══════════════════════════════════════════ */
function PlaceholderView({ label }) {
    return (
        <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center">
                <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: "#f0fdf4", border: "2px dashed #bbf7d0" }}>
                    <LeafIcon />
                </div>
                <h2 className="text-xl font-bold text-green-950 mb-1">{label}</h2>
                <p className="text-green-600 text-sm">Import your <span className="font-semibold">{label}.jsx</span> screen here.</p>
                <p className="text-gray-400 text-xs mt-2">Replace this placeholder by rendering your existing screen component.</p>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════
   ROOT ADMIN COMPONENT
═══════════════════════════════════════════ */
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
                        {active === "subscribers" && <Subscriber />}
                        {active === "donations" && <Donation />}
                        {active === "volunteers" && <Volunteer />}
                    </main>
                </div>
            </div>
        </>
    );
}