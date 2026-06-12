import { useState, useEffect, useCallback } from "react";

const BASE_URL = "https://sjkf-backend-api-production.up.railway.app/api/certificate";

/* ── API Helpers ── */
const apiCall = (url, options) =>
  fetch(url, options).then(async (r) => {
    const data = await r.json();
    if (!r.ok) throw new Error(data.message || "Request failed");
    return data;
  });

const api = {
  getCertificates: () => apiCall(`${BASE_URL}`),
  issueCertificate: (body) =>
    apiCall(`${BASE_URL}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
};

/* ── Icons ── */
const CertIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
    <rect x="3" y="4" width="18" height="14" rx="2" stroke="#4ade80" strokeWidth="1.8" />
    <path d="M7 8h10M7 12h6" stroke="#4ade80" strokeWidth="1.8" strokeLinecap="round" />
    <circle cx="17" cy="17" r="3" stroke="#4ade80" strokeWidth="1.8" />
    <path d="M15.5 20.5L14 23l3-1 3 1-1.5-2.5" stroke="#4ade80" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const RefreshIcon = ({ spinning }) => (
  <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" style={{ display: "inline-block", animation: spinning ? "spin 0.8s linear infinite" : "none" }}>
    <path d="M23 4v6h-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M20.49 15a9 9 0 11-2.12-9.36L23 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const PlusIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
    <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
  </svg>
);

const SealIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
    <path d="M12 2l2.4 4.8L20 8l-4 3.6 1 5.4-5-2.8-5 2.8 1-5.4L4 8l5.6-1.2z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
  </svg>
);

/* ── Toast ── */
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
      <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: c.border }}>
        {c.icon}
      </span>
      {toast.message}
    </div>
  );
}

/* ── Skeleton Card ── */
function SkeletonCard() {
  return (
    <div className="rounded-2xl p-5 animate-pulse" style={{ background: "#ffffff", border: "1px solid #bbf7d0" }}>
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-green-100 flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="w-48 h-4 rounded bg-green-100" />
          <div className="w-72 h-3 rounded bg-green-50" />
          <div className="w-32 h-3 rounded bg-green-50" />
        </div>
        <div className="flex gap-4">
          <div className="w-20 h-6 rounded-lg bg-green-100" />
          <div className="w-20 h-6 rounded-lg bg-green-50" />
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
        <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
          <path d="M12 9v4M12 17h.01" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
          <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
        </svg>
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

/* ── Custom Dropdown ── */
function CustomDropdown({ value, onChange, options, placeholder, icon }) {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200"
        style={{
          background: "#f8fffe",
          border: `1.5px solid ${open ? "#4ade80" : "#bbf7d0"}`,
          color: selected ? "#166534" : "#9ca3af",
          boxShadow: open ? "0 0 0 3px rgba(74,222,128,0.12)" : "none",
        }}
      >
        <span className="flex items-center gap-2">
          {icon && <span className="text-green-500">{icon}</span>}
          {selected ? selected.label : placeholder}
        </span>
        <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-green-400 flex-shrink-0"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div className="absolute z-30 mt-1.5 w-full rounded-2xl overflow-hidden shadow-xl"
          style={{ background: "#ffffff", border: "1.5px solid #bbf7d0" }}>
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => { onChange(opt.value); setOpen(false); }}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-left transition-all duration-150"
              style={{
                background: value === opt.value ? "#f0fdf4" : "transparent",
                color: value === opt.value ? "#166534" : "#374151",
              }}
              onMouseEnter={(e) => { if (value !== opt.value) e.currentTarget.style.background = "#f8fffe"; }}
              onMouseLeave={(e) => { if (value !== opt.value) e.currentTarget.style.background = "transparent"; }}
            >
              {opt.icon && <span>{opt.icon}</span>}
              <span>{opt.label}</span>
              {value === opt.value && (
                <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 ml-auto text-green-600">
                  <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Issue Certificate Modal ── */
function IssueCertificateModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({
    issuedTo: "",
    certificateTitle: "",
    certificateSummary: "",
    modeOfIssue: "",
    physicalCopy: "",
    signingAuthority: "",
    recommender: "",
    issueDate: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const modeOptions = [
    { value: "Online with DSC", label: "Online with DSC", icon: "🔐" },
    { value: "Online with Scan Signature", label: "Online with Scan Signature", icon: "✍️" },
    { value: "Offline with Physical Sign", label: "Offline with Physical Sign", icon: "✍️" },
    { value: "Hybrid", label: "Hybrid", icon: "🔄" },
  ];

  const physicalOptions = [
    { value: "Yes", label: "Yes — Physical Copy Provided", icon: "📄" },
    { value: "No", label: "No — Digital Only", icon: "💻" },
  ];

  const validate = () => {
    const e = {};
    if (!form.issuedTo.trim()) e.issuedTo = "Required";
    if (!form.certificateTitle.trim()) e.certificateTitle = "Required";
    if (!form.certificateSummary.trim()) e.certificateSummary = "Required";
    if (!form.modeOfIssue) e.modeOfIssue = "Required";
    if (!form.physicalCopy) e.physicalCopy = "Required";
    if (!form.signingAuthority.trim()) e.signingAuthority = "Required";
    if (!form.recommender.trim()) e.recommender = "Required";
    if (!form.issueDate) e.issueDate = "Required";
    else if (!/^\d{4}-\d{2}-\d{2}$/.test(form.issueDate)) e.issueDate = "Must be in YYYY-MM-DD format";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await api.issueCertificate(form);
      onSuccess();
      onClose();
    } catch (err) {
      setErrors({ submit: err.message || "Failed to issue certificate. Try again." });
    } finally {
      setLoading(false);
    }
  };

  const set = (key) => (val) => {
    setForm((p) => ({ ...p, [key]: val }));
    setErrors((p) => ({ ...p, [key]: undefined }));
  };

  const fieldClass = (key) => ({
    background: "#f8fffe",
    border: `1.5px solid ${errors[key] ? "#fca5a5" : "#bbf7d0"}`,
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)" }}>
      <div className="rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden" style={{ background: "#ffffff", border: "1px solid #bbf7d0", maxHeight: "95vh", display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <div className="px-7 py-5 flex items-center justify-between flex-shrink-0" style={{ background: "linear-gradient(135deg, #0f3d24, #145c34)" }}>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: "rgba(255,255,255,0.15)" }}>
              <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
                <rect x="3" y="4" width="18" height="14" rx="2" stroke="white" strokeWidth="1.8" />
                <path d="M7 8h10M7 12h6" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
                <circle cx="17" cy="17" r="3" stroke="#4ade80" strokeWidth="1.8" />
                <path d="M15.8 20.5L14.5 23l2.5-1 2.5 1-1.3-2.5" stroke="#4ade80" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <h2 className="text-white font-bold text-lg" style={{ fontFamily: "'Sora', sans-serif" }}>Issue New Certificate</h2>
              <p className="text-green-300 text-xs">Fill in the details to generate and record a certificate</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/60 hover:text-white transition-colors p-1">
            <CloseIcon />
          </button>
        </div>

        {/* Body */}
        <div className="px-7 py-6 overflow-y-auto flex-1" style={{ fontFamily: "'Sora', sans-serif" }}>
          <div className="space-y-5">
            {/* Issued To */}
            <div>
              <label className="text-xs text-green-600 font-semibold uppercase tracking-wider mb-1.5 block">
                Issued To <span className="text-red-400">*</span>
              </label>
              <input
                value={form.issuedTo}
                onChange={(e) => set("issuedTo")(e.target.value)}
                placeholder="Full name of the recipient"
                className="w-full px-4 py-3 rounded-xl text-sm text-gray-800 placeholder-gray-400"
                style={fieldClass("issuedTo")}
                onFocus={(e) => { e.target.style.boxShadow = "0 0 0 3px rgba(74,222,128,0.12)"; e.target.style.borderColor = "#4ade80"; }}
                onBlur={(e) => { e.target.style.boxShadow = "none"; e.target.style.borderColor = errors.issuedTo ? "#fca5a5" : "#bbf7d0"; }}
              />
              {errors.issuedTo && <p className="text-xs text-red-500 mt-1">{errors.issuedTo}</p>}
            </div>

            {/* Certificate Title */}
            <div>
              <label className="text-xs text-green-600 font-semibold uppercase tracking-wider mb-1.5 block">
                Certificate Title <span className="text-red-400">*</span>
              </label>
              <input
                value={form.certificateTitle}
                onChange={(e) => set("certificateTitle")(e.target.value)}
                placeholder="e.g. Certificate of Excellence in Community Service"
                className="w-full px-4 py-3 rounded-xl text-sm text-gray-800 placeholder-gray-400"
                style={fieldClass("certificateTitle")}
                onFocus={(e) => { e.target.style.boxShadow = "0 0 0 3px rgba(74,222,128,0.12)"; e.target.style.borderColor = "#4ade80"; }}
                onBlur={(e) => { e.target.style.boxShadow = "none"; e.target.style.borderColor = errors.certificateTitle ? "#fca5a5" : "#bbf7d0"; }}
              />
              {errors.certificateTitle && <p className="text-xs text-red-500 mt-1">{errors.certificateTitle}</p>}
            </div>

            {/* Certificate Summary */}
            <div>
              <label className="text-xs text-green-600 font-semibold uppercase tracking-wider mb-1.5 block">
                Certificate Summary <span className="text-red-400">*</span>
              </label>
              <textarea
                value={form.certificateSummary}
                onChange={(e) => set("certificateSummary")(e.target.value)}
                placeholder="Describe the purpose and context of this certificate…"
                rows={4}
                className="w-full px-4 py-3 rounded-xl text-sm text-gray-800 placeholder-gray-400 resize-none"
                style={fieldClass("certificateSummary")}
                onFocus={(e) => { e.target.style.boxShadow = "0 0 0 3px rgba(74,222,128,0.12)"; e.target.style.borderColor = "#4ade80"; }}
                onBlur={(e) => { e.target.style.boxShadow = "none"; e.target.style.borderColor = errors.certificateSummary ? "#fca5a5" : "#bbf7d0"; }}
              />
              {errors.certificateSummary && <p className="text-xs text-red-500 mt-1">{errors.certificateSummary}</p>}
            </div>

            {/* Mode of Issue + Physical Copy */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-green-600 font-semibold uppercase tracking-wider mb-1.5 block">
                  Mode of Issue <span className="text-red-400">*</span>
                </label>
                <CustomDropdown
                  value={form.modeOfIssue}
                  onChange={set("modeOfIssue")}
                  options={modeOptions}
                  placeholder="Select mode…"
                />
                {errors.modeOfIssue && <p className="text-xs text-red-500 mt-1">{errors.modeOfIssue}</p>}
              </div>
              <div>
                <label className="text-xs text-green-600 font-semibold uppercase tracking-wider mb-1.5 block">
                  Physical Copy <span className="text-red-400">*</span>
                </label>
                <CustomDropdown
                  value={form.physicalCopy}
                  onChange={set("physicalCopy")}
                  options={physicalOptions}
                  placeholder="Select option…"
                />
                {errors.physicalCopy && <p className="text-xs text-red-500 mt-1">{errors.physicalCopy}</p>}
              </div>
            </div>

            {/* Signing Authority */}
            <div>
              <label className="text-xs text-green-600 font-semibold uppercase tracking-wider mb-1.5 block">
                Signing Authority <span className="text-red-400">*</span>
              </label>
              <input
                value={form.signingAuthority}
                onChange={(e) => set("signingAuthority")(e.target.value)}
                placeholder="Name & designation"
                className="w-full px-4 py-3 rounded-xl text-sm text-gray-800 placeholder-gray-400"
                style={fieldClass("signingAuthority")}
                onFocus={(e) => { e.target.style.boxShadow = "0 0 0 3px rgba(74,222,128,0.12)"; e.target.style.borderColor = "#4ade80"; }}
                onBlur={(e) => { e.target.style.boxShadow = "none"; e.target.style.borderColor = errors.signingAuthority ? "#fca5a5" : "#bbf7d0"; }}
              />
              {errors.signingAuthority && <p className="text-xs text-red-500 mt-1">{errors.signingAuthority}</p>}
            </div>

            {/* Recommender + Issue Date */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-green-600 font-semibold uppercase tracking-wider mb-1.5 block">
                  Recommender <span className="text-red-400">*</span>
                </label>
                <input
                  value={form.recommender}
                  onChange={(e) => set("recommender")(e.target.value)}
                  placeholder="Name of recommender"
                  className="w-full px-4 py-3 rounded-xl text-sm text-gray-800 placeholder-gray-400"
                  style={fieldClass("recommender")}
                  onFocus={(e) => { e.target.style.boxShadow = "0 0 0 3px rgba(74,222,128,0.12)"; e.target.style.borderColor = "#4ade80"; }}
                  onBlur={(e) => { e.target.style.boxShadow = "none"; e.target.style.borderColor = errors.recommender ? "#fca5a5" : "#bbf7d0"; }}
                />
                {errors.recommender && <p className="text-xs text-red-500 mt-1">{errors.recommender}</p>}
              </div>
              <div>
                <label className="text-xs text-green-600 font-semibold uppercase tracking-wider mb-1.5 block">
                  Issue Date <span className="text-red-400">*</span>
                </label>
                <input
                  type="date"
                  value={form.issueDate}
                  onChange={(e) => set("issueDate")(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl text-sm text-gray-800"
                  style={{ ...fieldClass("issueDate"), colorScheme: "light" }}
                  onFocus={(e) => { e.target.style.boxShadow = "0 0 0 3px rgba(74,222,128,0.12)"; e.target.style.borderColor = "#4ade80"; }}
                  onBlur={(e) => { e.target.style.boxShadow = "none"; e.target.style.borderColor = errors.issueDate ? "#fca5a5" : "#bbf7d0"; }}
                />
                {errors.issueDate && <p className="text-xs text-red-500 mt-1">{errors.issueDate}</p>}
              </div>
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <div className="rounded-xl px-4 py-3 text-sm text-red-700 font-medium" style={{ background: "#fff1f2", border: "1px solid #fecaca" }}>
                {errors.submit}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-7 pb-6 pt-2 flex gap-3 flex-shrink-0">
          <button onClick={onClose} className="flex-1 py-3 rounded-xl text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 py-3 rounded-xl text-sm font-bold text-white transition-all flex items-center justify-center gap-2"
            style={{ background: loading ? "#86efac" : "linear-gradient(135deg, #0f3d24, #166534)", cursor: loading ? "not-allowed" : "pointer" }}
          >
            {loading ? (
              <>
                <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 animate-spin">
                  <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeDasharray="31.4" strokeDashoffset="10" />
                </svg>
                Issuing…
              </>
            ) : (
              <>
                <SealIcon />
                Issue Certificate
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Certificate Detail Modal ── */
function CertificateModal({ cert, onClose }) {
  const modeBadge = {
    "Online with DSC": { bg: "#dbeafe", color: "#1e40af", icon: "🔐" },
    "Offline with Physical Sign": { bg: "#fef9c3", color: "#92400e", icon: "✍️" },
    Hybrid: { bg: "#f3e8ff", color: "#6b21a8", icon: "🔄" },
  };
  const m = modeBadge[cert.modeOfIssue] || { bg: "#f0fdf4", color: "#166534", icon: "📜" };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)" }}>
      <div className="rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden" style={{ background: "#ffffff", border: "1px solid #bbf7d0" }}>
        {/* Header */}
        <div className="px-7 py-5 flex items-center justify-between" style={{ background: "linear-gradient(135deg, #0f3d24, #145c34)" }}>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-bold text-white"
              style={{ background: "rgba(255,255,255,0.15)" }}>
              📜
            </div>
            <div>
              <h2 className="text-white font-bold text-base leading-tight" style={{ fontFamily: "'Sora', sans-serif" }}>
                {cert.certificateTitle}
              </h2>
              <p className="text-green-300 text-xs mt-0.5">Issued to {cert.issuedTo}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/60 hover:text-white transition-colors"><CloseIcon /></button>
        </div>

        {/* Body */}
        <div className="px-7 py-5 space-y-4 max-h-[65vh] overflow-y-auto">
          {/* Mode + Physical Badge Row */}
          <div className="flex gap-2 flex-wrap">
            <span className="text-xs px-3 py-1.5 rounded-full font-semibold" style={{ background: m.bg, color: m.color }}>
              {m.icon} {cert.modeOfIssue}
            </span>
            <span className="text-xs px-3 py-1.5 rounded-full font-semibold"
              style={{ background: cert.physicalCopy === "Yes" ? "#dcfce7" : "#f3f4f6", color: cert.physicalCopy === "Yes" ? "#166534" : "#6b7280" }}>
              {cert.physicalCopy === "Yes" ? "📄 Physical Copy" : "💻 Digital Only"}
            </span>
          </div>

          {/* Summary */}
          {cert.certificateSummary && (
            <div>
              <p className="text-xs text-green-600 font-semibold uppercase tracking-wider mb-1">Summary</p>
              <div className="rounded-xl p-3 text-sm text-gray-600" style={{ background: "#f0fdf4", border: "1px solid #bbf7d0" }}>
                {cert.certificateSummary}
              </div>
            </div>
          )}

          {/* Certificate ID */}
          {cert.certificateId && (
            <div className="rounded-xl px-4 py-3 flex items-center justify-between gap-3" style={{ background: "#f0fdf4", border: "1.5px solid #86efac" }}>
              <div>
                <p className="text-xs text-green-600 font-semibold uppercase tracking-wider mb-0.5">Certificate ID</p>
                <p className="text-sm font-bold text-green-900" style={{ fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.03em" }}>{cert.certificateId}</p>
              </div>
              <span className="text-lg">🪪</span>
            </div>
          )}

          {/* Fields grid */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Signing Authority", value: cert.signingAutority || "—" },
              { label: "Recommender", value: cert.recommender || "—" },
              { label: "Issued On", value: cert.issueDate ? new Date(cert.issueDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "—" },
              { label: "Physical Copy", value: cert.physicalCopy || "—" },
            ].map((f) => (
              <div key={f.label}>
                <p className="text-xs text-green-600 font-semibold uppercase tracking-wider mb-1">{f.label}</p>
                <p className="text-sm font-medium text-gray-700">{f.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-7 pb-6">
          <button onClick={onClose} className="w-full py-3 rounded-xl text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Main Certificate Page ── */
const Certificate = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [spinning, setSpinning] = useState(false);
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [selectedCert, setSelectedCert] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchCertificates = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getCertificates();
      const list = Array.isArray(data) ? data : data.certificates || data.data || [];
      setCertificates(list);
    } catch (e) {
      setError(e.message || "Failed to fetch certificates");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCertificates(); }, [fetchCertificates]);

  const handleRefresh = async () => {
    setSpinning(true);
    await fetchCertificates();
    setTimeout(() => setSpinning(false), 600);
    showToast("Certificates refreshed", "info");
  };

  const handleIssueSuccess = () => {
    showToast("Certificate issued successfully!", "success");
    fetchCertificates();
  };

  const modeBadge = (mode) => {
    const map = {
      "Online with DSC": { bg: "#dbeafe", color: "#1e40af", label: "Online · DSC" },
      "Offline with Physical Sign": { bg: "#fef9c3", color: "#92400e", label: "Offline · Sign" },
      Hybrid: { bg: "#f3e8ff", color: "#6b21a8", label: "Hybrid" },
    };
    return map[mode] || { bg: "#f0fdf4", color: "#166534", label: mode || "—" };
  };

  const filtered = certificates.filter((c) => {
    const q = search.toLowerCase();
    return (
      c.issuedTo?.toLowerCase().includes(q) ||
      c.certificateTitle?.toLowerCase().includes(q) ||
      c.signingAuthority?.toLowerCase().includes(q) ||
      c.recommender?.toLowerCase().includes(q)
    );
  });

  const gradients = [
    "linear-gradient(135deg, #0f3d24, #166534)",
    "linear-gradient(135deg, #1e3a5f, #1e40af)",
    "linear-gradient(135deg, #4a1942, #7e22ce)",
    "linear-gradient(135deg, #7c2d12, #b45309)",
    "linear-gradient(135deg, #134e4a, #0f766e)",
    "linear-gradient(135deg, #3b0764, #6d28d9)",
  ];

  return (
    <div className="min-h-screen p-8" style={{ background: "#f0fdf4", fontFamily: "'Sora', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap'); * { font-family: 'Sora', sans-serif; }`}</style>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>

      {/* Page Header */}
      <div className="mb-8 flex items-start justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <CertIcon />
            <span className="text-xs font-semibold tracking-widest uppercase text-green-600">Recognition</span>
          </div>
          <h1 className="text-3xl font-bold text-green-950" style={{ fontFamily: "'Sora', sans-serif" }}>Certificate Management</h1>
          <p className="text-green-700 text-sm mt-1">Issue and manage all certificates awarded by your organisation</p>
        </div>
        <button
          onClick={() => setShowIssueModal(true)}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold text-white shadow-lg transition-all duration-200"
          style={{ background: "linear-gradient(135deg, #0f3d24, #166534)" }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 8px 25px rgba(15,61,36,0.35)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
        >
          <PlusIcon />
          Issue Certificate
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "Total Certificates", value: loading ? "—" : certificates.length, sub: "all time issued" },
          {
            label: "With Physical Copy",
            value: loading ? "—" : certificates.filter((c) => c.physicalCopy === "Yes").length,
            sub: "hard copies issued",
          },
          {
            label: "Online via DSC",
            value: loading ? "—" : certificates.filter((c) => c.modeOfIssue?.includes("DSC")).length,
            sub: "digitally signed",
          },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl p-5 shadow-sm" style={{ background: "#ffffff", border: "1px solid #bbf7d0" }}>
            <div className="text-3xl font-bold" style={{ color: "#166534", fontFamily: "'Sora', sans-serif" }}>{s.value}</div>
            <div className="text-sm text-gray-700 mt-1 font-semibold">{s.label}</div>
            <div className="text-xs text-gray-400 mt-0.5">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl" style={{ background: "#ffffff", border: "1px solid #bbf7d0" }}>
          <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-green-600">
            <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
            <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search certificates…"
            className="bg-transparent text-sm text-green-900 outline-none w-52 placeholder-green-400"
          />
        </div>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium"
          style={{ background: "#ffffff", color: "#166534", border: "1px solid #bbf7d0" }}
        >
          <RefreshIcon spinning={spinning} /> Refresh
        </button>
      </div>

      {/* Certificate List */}
      {loading ? (
        <div className="grid gap-4">{Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}</div>
      ) : error ? (
        <ErrorBanner message={error} onRetry={fetchCertificates} />
      ) : filtered.length === 0 ? (
        <div className="py-24 text-center rounded-2xl" style={{ background: "#ffffff", border: "1px solid #bbf7d0" }}>
          <div className="text-5xl mb-3">📜</div>
          <p className="text-gray-600 font-semibold text-base">{search ? "No certificates match your search" : "No certificates issued yet"}</p>
          <p className="text-gray-400 text-sm mt-1">{search ? "Try a different search term" : "Click 'Issue Certificate' to get started"}</p>
          {!search && (
            <button
              onClick={() => setShowIssueModal(true)}
              className="mt-5 flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white mx-auto"
              style={{ background: "linear-gradient(135deg, #0f3d24, #166534)" }}
            >
              <PlusIcon /> Issue First Certificate
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-4">
          {filtered.map((cert, i) => {
            const badge = modeBadge(cert.modeOfIssue);
            const grad = gradients[i % gradients.length];
            const issuedDate = cert.issueDate
              ? new Date(cert.issueDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
              : "—";

            return (
              <div
                key={cert._id || i}
                onClick={() => setSelectedCert(cert)}
                className="rounded-2xl shadow-sm transition-all duration-200 cursor-pointer group overflow-hidden"
                style={{ background: "#ffffff", border: "1px solid #bbf7d0" }}
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 8px 30px rgba(22,101,52,0.1)"; e.currentTarget.style.borderColor = "#86efac"; }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.05)"; e.currentTarget.style.borderColor = "#bbf7d0"; }}
              >
                <div className="flex items-start gap-4 p-5">
                  {/* Icon / Avatar */}
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-bold text-white flex-shrink-0"
                    style={{ background: grad }}>
                    {cert.issuedTo?.[0]?.toUpperCase() || "C"}
                  </div>

                  {/* Main info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-3 flex-wrap mb-1">
                      <h3 className="text-base font-bold text-gray-800 leading-snug" style={{ fontFamily: "'Sora', sans-serif" }}>
                        {cert.certificateTitle}
                      </h3>
                      <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold flex-shrink-0" style={{ background: badge.bg, color: badge.color }}>
                        {badge.label}
                      </span>
                      {cert.physicalCopy === "Yes" && (
                        <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold flex-shrink-0" style={{ background: "#dcfce7", color: "#166534" }}>
                          📄 Physical
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">
                      Issued to <span className="font-semibold text-gray-700">{cert.issuedTo}</span>
                    </p>
                    {cert.certificateSummary && (
                      <p className="text-xs text-gray-400 mt-1 line-clamp-1 max-w-lg">{cert.certificateSummary}</p>
                    )}
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-400 flex-wrap">
                      {cert.signingAutority && (
                        <span className="flex items-center gap-1">
                          <svg viewBox="0 0 24 24" fill="none" className="w-3 h-3"><path d="M12 2l2.4 4.8L20 8l-4 3.6 1 5.4-5-2.8-5 2.8 1-5.4L4 8l5.6-1.2z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" /></svg>
                          {cert.signingAutority}
                        </span>
                      )}
                      {cert.recommender && (
                        <span className="flex items-center gap-1">
                          <svg viewBox="0 0 24 24" fill="none" className="w-3 h-3"><circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.8"/><path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
                          Rec: {cert.recommender}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Date */}
                  <div className="flex-shrink-0 text-right">
                    <div className="text-sm font-bold" style={{ color: "#166534" }}>{issuedDate}</div>
                    <div className="text-xs text-gray-400 mt-0.5">Issued</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modals */}
      {showIssueModal && (
        <IssueCertificateModal
          onClose={() => setShowIssueModal(false)}
          onSuccess={handleIssueSuccess}
        />
      )}
      {selectedCert && (
        <CertificateModal cert={selectedCert} onClose={() => setSelectedCert(null)} />
      )}

      <Toast toast={toast} />
    </div>
  );
};

export default Certificate;