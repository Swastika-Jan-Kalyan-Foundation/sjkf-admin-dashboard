import { useState, useEffect, useRef, useCallback } from "react";

/* ══════════════════════════════════════════════════════
   SVG ICONS
══════════════════════════════════════════════════════ */
const IconClose    = ({ size = 16, color = "white" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const IconSend     = ({ color = "white" }) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>;
const IconCheck    = ({ size = 13, color = "white" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
const IconRestart  = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.46"/></svg>;
const IconTrash    = ({ size = 15, color = "white" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>;
const IconSearch   = ({ size = 15, color = "white" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
const IconUsers    = ({ size = 15, color = "white" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const IconCoin     = ({ size = 15, color = "white" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><line x1="12" y1="6" x2="12" y2="8"/><line x1="12" y1="16" x2="12" y2="18"/></svg>;
const IconShield   = ({ size = 22, color = "white" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
const IconWarning  = ({ size = 13 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>;
const IconNext     = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 4 15 12 5 20 5 4"/><line x1="19" y1="5" x2="19" y2="19"/></svg>;
const IconAccept   = ({ size = 13 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
const IconReject   = ({ size = 13 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const IconSpinner  = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ animation: "adminSpin 0.8s linear infinite" }}><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>;
const IconMail     = ({ size = 13 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>;
const IconPhone    = ({ size = 13 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.18 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.96a16 16 0 0 0 6.13 6.13l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>;
const IconCalendar = ({ size = 13 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
const IconPin      = ({ size = 13 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>;
const IconTag      = ({ size = 13 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>;
const IconGrad     = ({ size = 13 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>;
const IconBriefcase= ({ size = 13 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>;
const IconZap      = ({ size = 13 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>;
const IconTeam     = ({ size = 13 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const IconCrown    = ({ size = 13 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 20h20"/><path d="m4 20 2-8 6 4 6-4 2 8"/><circle cx="12" cy="6" r="2"/><circle cx="4" cy="8" r="2"/><circle cx="20" cy="8" r="2"/></svg>;
const IconClip     = ({ size = 13 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>;
const IconThink    = ({ size = 13 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><line x1="9" y1="10" x2="15" y2="10"/><line x1="12" y1="7" x2="12" y2="13"/></svg>;
const IconGender   = ({ size = 13 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="11" r="3"/><path d="M12 3C8.13 3 5 6.13 5 10c0 2.88 1.67 5.38 4.12 6.62L12 21l2.88-4.38A7.47 7.47 0 0 0 19 10c0-3.87-3.13-7-7-7z"/></svg>;
const IconInsta    = ({ size = 13 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>;
const IconUser     = ({ size = 13 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;

/* ══════════════════════════════════════════════════════
   CONSTANTS
══════════════════════════════════════════════════════ */
const API = "https://sjkf-backend-api-production.up.railway.app/api";

const MAIN_MENU = [
  { key: "delete",    label: "Delete Subscriber",   icon: <IconTrash size={14} color="white" />,  grad: "linear-gradient(135deg,#7f1d1d,#dc2626)" },
  { key: "donation",  label: "Monitor Donation",     icon: <IconCoin size={14} color="white" />,   grad: "linear-gradient(135deg,#1e3a5f,#2563eb)" },
  { key: "volunteer", label: "Monitor Volunteer",    icon: <IconUsers size={14} color="white" />,  grad: "linear-gradient(135deg,#14532d,#16a34a)" },
];

/* ══════════════════════════════════════════════════════
   HELPER COMPONENTS
══════════════════════════════════════════════════════ */
function BotText({ text }) {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return (
    <span style={{ whiteSpace: "pre-wrap" }}>
      {parts.map((p, i) =>
        i % 2 === 1
          ? <strong key={i} style={{ fontWeight: 700 }}>{p}</strong>
          : <span key={i}>{p}</span>
      )}
    </span>
  );
}

function InfoRow({ icon, label, value }) {
  if (!value && value !== 0) return null;
  return (
    <div style={{ display: "flex", gap: 8, marginBottom: 7, fontSize: 12, alignItems: "flex-start" }}>
      <span style={{ color: "#64748b", flexShrink: 0, marginTop: 1 }}>{icon}</span>
      <span style={{ color: "#94a3b8", fontWeight: 600, minWidth: 110, flexShrink: 0, textTransform: "uppercase", fontSize: 10, letterSpacing: "0.05em", marginTop: 1 }}>{label}</span>
      <span style={{ color: "#e2e8f0", fontWeight: 500, wordBreak: "break-word", fontSize: 12 }}>{value}</span>
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    pending:  { bg: "#78350f", color: "#fde68a", label: "Pending" },
    accepted: { bg: "#14532d", color: "#86efac", label: "Accepted" },
    rejected: { bg: "#7f1d1d", color: "#fca5a5", label: "Rejected" },
    completed:{ bg: "#1e3a5f", color: "#93c5fd", label: "Completed" },
    verified: { bg: "#14532d", color: "#86efac", label: "Verified" },
    failed:   { bg: "#7f1d1d", color: "#fca5a5", label: "Failed" },
  };
  const s = map[(status || "").toLowerCase()] || { bg: "#1e293b", color: "#94a3b8", label: status || "—" };
  return (
    <span style={{ background: s.bg, color: s.color, borderRadius: 20, padding: "2px 10px", fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>
      {s.label}
    </span>
  );
}

/* ══════════════════════════════════════════════════════
   DONATION CARD
══════════════════════════════════════════════════════ */
function DonationCard({ data }) {
  const d = data?.data || data;
  return (
    <div style={{ background: "linear-gradient(135deg,#0f172a,#1e293b)", borderRadius: 14, padding: "14px 16px", marginTop: 8, border: "1px solid #334155" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, paddingBottom: 10, borderBottom: "1px solid #1e293b" }}>
        <span style={{ color: "#94a3b8", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>Donation Record</span>
        <StatusBadge status={d?.status} />
      </div>
      <InfoRow icon={<IconTag size={13} />}     label="Donor ID"    value={d?.donorId} />
      <InfoRow icon={<IconUser size={13} />}    label="Full Name"   value={d?.fullName} />
      <InfoRow icon={<IconMail size={13} />}    label="Email"       value={d?.email} />
      <InfoRow icon={<IconPhone size={13} />}   label="Phone"       value={d?.phoneNumber} />
      <InfoRow icon={<IconCoin size={13} />}    label="Amount"      value={d?.amount ? `₹${d.amount} ${d.currency || "INR"}` : null} />
      <InfoRow icon={<IconTag size={13} />}     label="Purpose"     value={d?.donationPurpose} />
      <InfoRow icon={<IconTag size={13} />}     label="Txn ID"      value={d?.transactionId} />
      <InfoRow icon={<IconTag size={13} />}     label="Order ID"    value={d?.orderId} />
      <InfoRow icon={<IconCalendar size={13} />} label="Date"       value={d?.createdAt ? new Date(d.createdAt).toLocaleString("en-IN") : null} />
      {d?.message && <InfoRow icon={<IconThink size={13} />} label="Message" value={d.message} />}
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   VOLUNTEER CARD
══════════════════════════════════════════════════════ */
function VolunteerCard({ data, onAccept, onReject, onClose, isActing }) {
  const v = data?.data || data;
  return (
    <div style={{ background: "linear-gradient(135deg,#0f172a,#1e293b)", borderRadius: 14, padding: "14px 16px", marginTop: 8, border: "1px solid #334155" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, paddingBottom: 10, borderBottom: "1px solid #1e293b" }}>
        <span style={{ color: "#94a3b8", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>Volunteer Application</span>
        <StatusBadge status={v?.status} />
      </div>
      <InfoRow icon={<IconTag size={13} />}       label="Applicant ID"   value={v?.applicantId} />
      <InfoRow icon={<IconUser size={13} />}      label="Full Name"      value={v?.name} />
      <InfoRow icon={<IconGender size={13} />}    label="Gender"         value={v?.gender} />
      <InfoRow icon={<IconCalendar size={13} />}  label="Date of Birth"  value={v?.dateOfBirth} />
      <InfoRow icon={<IconPhone size={13} />}     label="Phone"          value={v?.phoneNumber} />
      <InfoRow icon={<IconMail size={13} />}      label="Email"          value={v?.email} />
      <InfoRow icon={<IconInsta size={13} />}     label="Instagram"      value={v?.instagramId} />
      <InfoRow icon={<IconPin size={13} />}       label="Address"        value={v?.address} />
      <InfoRow icon={<IconGrad size={13} />}      label="Education"      value={v?.highestEducationalQualification} />
      <InfoRow icon={<IconBriefcase size={13} />} label="Career"         value={v?.currentCareerStatus} />
      <InfoRow icon={<IconZap size={13} />}       label="Skills"         value={v?.skillsAndInterest} />
      <InfoRow icon={<IconTeam size={13} />}      label="Teams"          value={Array.isArray(v?.interestedTeams) ? v.interestedTeams.join(", ") : v?.interestedTeams} />
      <InfoRow icon={<IconCrown size={13} />}     label="Leadership"     value={v?.leadershipPreference} />
      <InfoRow icon={<IconClip size={13} />}      label="Experience"     value={v?.previousVolunteerExperience} />
      <InfoRow icon={<IconThink size={13} />}     label="Why Join"       value={v?.whyJoinUs} />
      <InfoRow icon={<IconCalendar size={13} />}  label="Applied On"     value={v?.createdAt ? new Date(v.createdAt).toLocaleString("en-IN") : null} />

      {/* Action buttons */}
      <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
        <button
          onClick={onAccept}
          disabled={isActing || v?.status?.toLowerCase() === "accepted"}
          style={{
            background: (isActing || v?.status?.toLowerCase() === "accepted") ? "#1e293b" : "linear-gradient(90deg,#14532d,#16a34a)",
            color: v?.status?.toLowerCase() === "accepted" ? "#86efac" : "white",
            border: v?.status?.toLowerCase() === "accepted" ? "1px solid #16a34a" : "none",
            borderRadius: 20, padding: "8px 16px", fontSize: 12, fontWeight: 700,
            cursor: (isActing || v?.status?.toLowerCase() === "accepted") ? "not-allowed" : "pointer",
            fontFamily: "Sora,sans-serif", display: "flex", alignItems: "center", gap: 6,
            opacity: isActing ? 0.6 : 1, transition: "all 0.18s",
          }}>
          {isActing ? <IconSpinner /> : <IconAccept size={12} color={v?.status?.toLowerCase() === "accepted" ? "#86efac" : "white"} />}
          {v?.status?.toLowerCase() === "accepted" ? "Accepted" : "Accept"}
        </button>

        <button
          onClick={onReject}
          disabled={isActing || v?.status?.toLowerCase() === "rejected"}
          style={{
            background: (isActing || v?.status?.toLowerCase() === "rejected") ? "#1e293b" : "linear-gradient(90deg,#7f1d1d,#dc2626)",
            color: v?.status?.toLowerCase() === "rejected" ? "#fca5a5" : "white",
            border: v?.status?.toLowerCase() === "rejected" ? "1px solid #dc2626" : "none",
            borderRadius: 20, padding: "8px 16px", fontSize: 12, fontWeight: 700,
            cursor: (isActing || v?.status?.toLowerCase() === "rejected") ? "not-allowed" : "pointer",
            fontFamily: "Sora,sans-serif", display: "flex", alignItems: "center", gap: 6,
            opacity: isActing ? 0.6 : 1, transition: "all 0.18s",
          }}>
          {isActing ? <IconSpinner /> : <IconReject size={12} />}
          {v?.status?.toLowerCase() === "rejected" ? "Rejected" : "Reject"}
        </button>

        <button
          onClick={onClose}
          disabled={isActing}
          style={{
            background: "transparent", color: "#64748b", border: "1px solid #334155",
            borderRadius: 20, padding: "8px 14px", fontSize: 12, fontWeight: 600,
            cursor: isActing ? "not-allowed" : "pointer", fontFamily: "Sora,sans-serif",
            display: "flex", alignItems: "center", gap: 5, transition: "all 0.18s",
          }}>
          <IconClose size={11} color="#64748b" /> Close
        </button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════ */
export default function AdminAssistant() {
  const [open, setOpen]             = useState(false);
  const [messages, setMessages]     = useState([]);
  const [inputVal, setInputVal]     = useState("");
  const [inputEnabled, setInputEnabled] = useState(false);
  const [inputPlaceholder, setInputPlaceholder] = useState("Type here…");
  const [isTyping, setIsTyping]     = useState(false);
  const [isActing, setIsActing]     = useState(false);
  const [mode, setMode]             = useState(null);   // "delete" | "donation" | "volunteer"
  const [step, setStep]             = useState(0);
  const [stepData, setStepData]     = useState({});     // { email, donorId, applicantId, volunteerData }
  const [showMenu, setShowMenu]     = useState(false);
  const [phase, setPhase]           = useState("idle"); // idle | menu | flow | done

  const bottomRef = useRef();
  const inputRef  = useRef();

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, showMenu, isTyping]);

  /* ── Greet on open ── */
  useEffect(() => {
    if (!open || messages.length > 0) return;
    setTimeout(() => {
      addBot("Hello, Admin! 👋\n\nI'm your **Admin Control Assistant**.\n\nWhat would you like to do?", () => {
        setShowMenu(true); setPhase("menu");
      });
    }, 350);
  }, [open]);

  /* ── Core message helpers ── */
  const addBot = useCallback((text, onDone, extra = null) => {
    setIsTyping(true); setInputEnabled(false);
    const id = Date.now() + Math.random();
    setMessages(m => [...m, { id, role: "bot", text, extra }]);
    const delay = Math.min(500 + text.length * 10, 2000);
    setTimeout(() => {
      setIsTyping(false); onDone?.();
    }, delay);
  }, []);

  const addUser = (text) =>
    setMessages(m => [...m, { id: Date.now() + Math.random(), role: "user", text }]);

  /* ── Restart ── */
  const handleRestart = () => {
    setMessages([]); setInputVal(""); setInputEnabled(false);
    setMode(null); setStep(0); setStepData({}); setShowMenu(false);
    setPhase("idle"); setIsActing(false);
    setTimeout(() => {
      addBot("Hello, Admin! 👋\n\nI'm your **Admin Control Assistant**.\n\nWhat would you like to do?", () => {
        setShowMenu(true); setPhase("menu");
      });
    }, 300);
  };

  /* ══════════════════════
     DELETE SUBSCRIBER
  ══════════════════════ */
  const startDelete = () => {
    setMode("delete"); setStep(1); setShowMenu(false);
    addBot("Please enter the **email address** of the subscriber you want to delete.", () => {
      setInputPlaceholder("Enter subscriber email…");
      setInputEnabled(true);
      setTimeout(() => inputRef.current?.focus(), 100);
    });
  };

  const handleDeleteEmail = (email) => {
    setStepData({ email });
    addBot(`You want to delete subscriber:\n**${email}**\n\nAre you sure? This action **cannot be undone**.`, () => {
      setStep(2);
    });
  };

  const confirmDelete = async () => {
    const { email } = stepData;
    addUser("Yes, delete this subscriber.");
    setIsActing(true);
    try {
      const res = await fetch(`${API}/subscribers/${encodeURIComponent(email)}`, { method: "DELETE" });
      const result = await res.json();
      setIsActing(false);
      if (res.status === 404 || result?.message?.toLowerCase().includes("not found") || result?.message?.toLowerCase().includes("no subscriber")) {
        addBot(`❌ No subscriber found with email **${email}**.\n\nPlease check the email and try again.`, () => setPhase("done"));
      } else if (!res.ok) {
        addBot(`⚠️ Failed to delete subscriber.\n\n**Error:** ${result?.message || "Unknown error occurred."}`, () => setPhase("done"));
      } else {
        addBot(`✅ Subscriber **${email}** has been successfully deleted from the database.`, () => setPhase("done"));
      }
    } catch (err) {
      setIsActing(false);
      addBot(`⚠️ Network error: **${err.message}**\n\nPlease check your connection and try again.`, () => setPhase("done"));
    }
  };

  const cancelDelete = () => {
    addUser("No, cancel.");
    addBot("Deletion cancelled. The subscriber is safe.", () => setPhase("done"));
  };

  /* ══════════════════════
     MONITOR DONATION
  ══════════════════════ */
  const startDonation = () => {
    setMode("donation"); setStep(1); setShowMenu(false);
    addBot("Please enter the **Donor ID** to look up the donation record.", () => {
      setInputPlaceholder("Enter Donor ID…");
      setInputEnabled(true);
      setTimeout(() => inputRef.current?.focus(), 100);
    });
  };

  const handleDonorId = async (donorId) => {
    setIsActing(true);
    try {
      const res = await fetch(`${API}/donations/${encodeURIComponent(donorId)}`);
      const result = await res.json();
      setIsActing(false);
      if (res.status === 404 || result?.message?.toLowerCase().includes("not found")) {
        addBot(`❌ No donation record found for Donor ID **${donorId}**.\n\nPlease verify the ID and try again.`, () => setPhase("done"));
      } else if (!res.ok) {
        addBot(`⚠️ Could not fetch donation.\n\n**Error:** ${result?.message || "Unknown error occurred."}`, () => setPhase("done"));
      } else {
        addBot("Here is the donation record:", () => {
          setMessages(m => {
            const last = m[m.length - 1];
            return [...m.slice(0, -1), { ...last, extra: { type: "donation", data: result } }];
          });
          setPhase("done");
        });
      }
    } catch (err) {
      setIsActing(false);
      addBot(`⚠️ Network error: **${err.message}**\n\nPlease check your connection and try again.`, () => setPhase("done"));
    }
  };

  /* ══════════════════════
     MONITOR VOLUNTEER
  ══════════════════════ */
  const startVolunteer = () => {
    setMode("volunteer"); setStep(1); setShowMenu(false);
    addBot("Please enter the **Applicant ID** to look up the volunteer application.", () => {
      setInputPlaceholder("Enter Applicant ID…");
      setInputEnabled(true);
      setTimeout(() => inputRef.current?.focus(), 100);
    });
  };

  const handleApplicantId = async (applicantId) => {
    setIsActing(true);
    try {
      const res = await fetch(`${API}/volunteers/${encodeURIComponent(applicantId)}`);
      const result = await res.json();
      setIsActing(false);
      if (res.status === 404 || result?.message?.toLowerCase().includes("not found")) {
        addBot(`❌ No volunteer application found for Applicant ID **${applicantId}**.\n\nPlease verify the ID and try again.`, () => setPhase("done"));
      } else if (!res.ok) {
        addBot(`⚠️ Could not fetch volunteer data.\n\n**Error:** ${result?.message || "Unknown error occurred."}`, () => setPhase("done"));
      } else {
        setStepData({ applicantId, volunteerData: result });
        addBot("Here is the volunteer application:", () => {
          setMessages(m => {
            const last = m[m.length - 1];
            return [...m.slice(0, -1), { ...last, extra: { type: "volunteer", data: result, applicantId } }];
          });
          setPhase("done");
        });
      }
    } catch (err) {
      setIsActing(false);
      addBot(`⚠️ Network error: **${err.message}**\n\nPlease check your connection and try again.`, () => setPhase("done"));
    }
  };

  const handleVolunteerAction = async (applicantId, action) => {
    setIsActing(true);
    addUser(action === "accept" ? "Accept this applicant." : "Reject this applicant.");
    try {
      const res = await fetch(`${API}/volunteers/${encodeURIComponent(applicantId)}/${action}`, { method: "PATCH" });
      const result = await res.json();
      setIsActing(false);
      if (!res.ok) {
        addBot(`⚠️ Could not ${action} volunteer.\n\n**Error:** ${result?.message || "Unknown error."}`, () => setPhase("done"));
      } else {
        const verb = action === "accept" ? "✅ Accepted" : "🚫 Rejected";
        addBot(`${verb}! Volunteer application for **${applicantId}** has been **${action}ed** successfully.`, () => setPhase("done"));
      }
    } catch (err) {
      setIsActing(false);
      addBot(`⚠️ Network error: **${err.message}`, () => setPhase("done"));
    }
  };

  /* ══════════════════════
     INPUT HANDLER
  ══════════════════════ */
  const handleSend = () => {
    const val = inputVal.trim();
    if (!val || !inputEnabled) return;
    setInputVal(""); setInputEnabled(false);
    addUser(val);

    if (mode === "delete" && step === 1) handleDeleteEmail(val);
    else if (mode === "donation" && step === 1) handleDonorId(val);
    else if (mode === "volunteer" && step === 1) handleApplicantId(val);
  };

  /* ══════════════════════
     MENU CLICK
  ══════════════════════ */
  const handleMenu = (key) => {
    setShowMenu(false);
    addUser(MAIN_MENU.find(m => m.key === key)?.label || key);
    if (key === "delete")    startDelete();
    if (key === "donation")  startDonation();
    if (key === "volunteer") startVolunteer();
  };

  /* ══════════════════════════════════════════
     RENDER EXTRA (cards, confirm prompt)
  ══════════════════════════════════════════ */
  const renderExtra = (msg) => {
    if (!msg.extra) return null;
    const { type, data, applicantId } = msg.extra;

    if (type === "donation") return <DonationCard data={data} />;

    if (type === "volunteer") {
      return (
        <VolunteerCard
          data={data}
          isActing={isActing}
          onAccept={() => handleVolunteerAction(applicantId, "accept")}
          onReject={() => handleVolunteerAction(applicantId, "reject")}
          onClose={() => {
            addUser("Close");
            addBot("Volunteer record closed.", () => setPhase("done"));
          }}
        />
      );
    }
    return null;
  };

  /* ══════════════════════════════════════════
     CONFIRM DELETE BUTTONS (inline in chat)
  ══════════════════════════════════════════ */
  const showDeleteConfirm = mode === "delete" && step === 2 && !isTyping && phase !== "done";

  /* ════════════════════════════
     RENDER
  ════════════════════════════ */
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap');
        .sjkf-admin * { box-sizing: border-box; font-family: Sora, sans-serif; }
        @keyframes adminSlideUp  { from{opacity:0;transform:translateY(20px) scale(0.96)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes adminMsgIn    { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes adminDot      { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-5px)} }
        @keyframes adminGlow     { 0%,100%{box-shadow:0 0 0 0 rgba(99,102,241,0.5)} 50%{box-shadow:0 0 0 10px rgba(99,102,241,0)} }
        @keyframes adminSpin     { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        .admin-chat-open { animation: adminSlideUp 0.35s cubic-bezier(.22,1,.36,1) both; }
        .admin-msg-in    { animation: adminMsgIn 0.28s ease both; }
        .admin-menu-btn:hover { filter: brightness(1.12); transform: translateY(-1px); transition: all 0.18s; }
        .admin-send-btn:hover:not(:disabled) { transform: scale(1.07); }
        .admin-send-btn:active:not(:disabled) { transform: scale(0.95); }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-thumb { background: #334155; border-radius: 4px; }
      `}</style>

      <div className="sjkf-admin">

        {/* ── Floating trigger ── */}
        <div
          onClick={() => setOpen(o => !o)}
          style={{
            position: "fixed", bottom: 28, right: 28, zIndex: 9999,
            width: 58, height: 58, borderRadius: "50%",
            background: "linear-gradient(135deg,#312e81,#6366f1)",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", boxShadow: "0 6px 24px rgba(99,102,241,0.45)",
            animation: open ? "none" : "adminGlow 2.5s infinite",
            transition: "transform 0.2s",
          }}
          onMouseEnter={e => e.currentTarget.style.transform = "scale(1.06)"}
          onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
        >
          {open ? <IconClose size={20} /> : <IconShield size={24} />}
        </div>

        {/* ── Chat window ── */}
        {open && (
          <div className="admin-chat-open" style={{
            position: "fixed", bottom: 100, right: 28,
            width: 390, maxWidth: "calc(100vw - 40px)",
            height: 600, maxHeight: "calc(100vh - 120px)",
            background: "#0f172a",
            borderRadius: 22,
            boxShadow: "0 24px 64px rgba(0,0,0,0.6), 0 4px 16px rgba(99,102,241,0.2)",
            display: "flex", flexDirection: "column", overflow: "hidden",
            zIndex: 9998, border: "1px solid #1e293b",
          }}>

            {/* Header */}
            <div style={{
              background: "linear-gradient(135deg,#1e1b4b,#312e81)",
              padding: "14px 18px", display: "flex", alignItems: "center",
              gap: 12, flexShrink: 0, borderBottom: "1px solid #312e81",
            }}>
              <div style={{
                width: 42, height: 42, borderRadius: "50%",
                background: "linear-gradient(135deg,#6366f1,#818cf8)",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                <IconShield size={20} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ color: "white", fontSize: 14, fontWeight: 800, letterSpacing: "-0.01em" }}>Admin Assistant</div>
                <div style={{ color: "#818cf8", fontSize: 10, fontWeight: 500 }}>SJKF Control Panel · Secure</div>
              </div>
              <button onClick={handleRestart} style={{
                background: "rgba(255,255,255,0.08)", border: "none", borderRadius: 20,
                padding: "5px 10px", color: "#a5b4fc", fontSize: 10, fontWeight: 600,
                cursor: "pointer", fontFamily: "Sora,sans-serif",
                display: "flex", alignItems: "center", gap: 5,
              }}>
                <IconRestart /> Restart
              </button>
              <button onClick={() => setOpen(false)} style={{
                background: "rgba(255,255,255,0.08)", border: "none", borderRadius: "50%",
                width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer",
              }}>
                <IconClose size={15} />
              </button>
            </div>

            {/* Messages area */}
            <div style={{
              flex: 1, overflowY: "auto", padding: "16px 14px",
              display: "flex", flexDirection: "column", gap: 10,
              background: "#0f172a",
            }}>
              {messages.map((msg) => (
                <div key={msg.id} className="admin-msg-in" style={{
                  display: "flex",
                  flexDirection: msg.role === "bot" ? "row" : "row-reverse",
                  gap: 8, alignItems: "flex-end",
                }}>
                  {msg.role === "bot" && (
                    <div style={{
                      width: 28, height: 28, borderRadius: "50%",
                      background: "linear-gradient(135deg,#6366f1,#818cf8)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0, marginBottom: 2,
                    }}>
                      <IconShield size={13} />
                    </div>
                  )}
                  <div style={{ maxWidth: "84%", display: "flex", flexDirection: "column" }}>
                    <div style={{
                      background: msg.role === "bot" ? "#1e293b" : "linear-gradient(135deg,#4338ca,#6366f1)",
                      color: msg.role === "bot" ? "#cbd5e1" : "white",
                      borderRadius: msg.role === "bot" ? "16px 16px 16px 4px" : "16px 16px 4px 16px",
                      padding: "10px 13px", fontSize: 13, lineHeight: 1.65,
                      border: msg.role === "bot" ? "1px solid #334155" : "none",
                      boxShadow: msg.role === "bot" ? "none" : "0 3px 12px rgba(99,102,241,0.3)",
                      wordBreak: "break-word",
                    }}>
                      <BotText text={msg.text} />
                    </div>
                    {msg.extra && renderExtra(msg)}
                  </div>
                </div>
              ))}

              {/* Typing / acting indicator */}
              {(isTyping || isActing) && (
                <div className="admin-msg-in" style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: "50%",
                    background: "linear-gradient(135deg,#6366f1,#818cf8)",
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                  }}>
                    <IconShield size={13} />
                  </div>
                  <div style={{
                    background: "#1e293b", borderRadius: "16px 16px 16px 4px",
                    padding: "12px 16px", border: "1px solid #334155",
                    display: "flex", gap: 5, alignItems: "center",
                  }}>
                    {isActing
                      ? <span style={{ fontSize: 12, color: "#818cf8", fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
                          <IconSpinner /> Processing…
                        </span>
                      : [0, 1, 2].map(i => (
                          <div key={i} style={{
                            width: 7, height: 7, borderRadius: "50%", background: "#6366f1",
                            animation: `adminDot 1.2s ease ${i * 0.2}s infinite`,
                          }} />
                        ))
                    }
                  </div>
                </div>
              )}

              {/* Main menu buttons */}
              {showMenu && !isTyping && (
                <div className="admin-msg-in" style={{
                  display: "flex", flexDirection: "column", gap: 8, marginLeft: 36,
                }}>
                  {MAIN_MENU.map(({ key, label, icon, grad }) => (
                    <button key={key} className="admin-menu-btn" onClick={() => handleMenu(key)} style={{
                      background: grad, color: "white", border: "none", borderRadius: 20,
                      padding: "10px 18px", fontSize: 13, fontWeight: 700, cursor: "pointer",
                      fontFamily: "Sora,sans-serif", textAlign: "left",
                      display: "flex", alignItems: "center", gap: 9,
                      boxShadow: "0 3px 12px rgba(0,0,0,0.3)",
                    }}>
                      {icon} {label}
                    </button>
                  ))}
                </div>
              )}

              {/* Delete confirmation buttons */}
              {showDeleteConfirm && (
                <div className="admin-msg-in" style={{
                  display: "flex", gap: 8, marginLeft: 36, flexWrap: "wrap",
                }}>
                  <button onClick={confirmDelete} disabled={isActing} style={{
                    background: isActing ? "#1e293b" : "linear-gradient(90deg,#7f1d1d,#dc2626)",
                    color: "white", border: "none", borderRadius: 20,
                    padding: "9px 18px", fontSize: 12, fontWeight: 700,
                    cursor: isActing ? "wait" : "pointer", fontFamily: "Sora,sans-serif",
                    display: "flex", alignItems: "center", gap: 6, transition: "all 0.18s",
                  }}>
                    {isActing ? <><IconSpinner /> Deleting…</> : <><IconTrash size={12} /> Yes, Delete</>}
                  </button>
                  <button onClick={cancelDelete} disabled={isActing} style={{
                    background: "transparent", color: "#64748b", border: "1px solid #334155",
                    borderRadius: 20, padding: "9px 16px", fontSize: 12, fontWeight: 600,
                    cursor: "pointer", fontFamily: "Sora,sans-serif",
                    display: "flex", alignItems: "center", gap: 5,
                  }}>
                    <IconClose size={10} color="#64748b" /> Cancel
                  </button>
                </div>
              )}

              {/* Back to menu button */}
              {phase === "done" && !isTyping && !isActing && (
                <div className="admin-msg-in" style={{ marginLeft: 36 }}>
                  <button onClick={handleRestart} style={{
                    background: "linear-gradient(90deg,#4338ca,#6366f1)",
                    color: "white", border: "none", borderRadius: 20,
                    padding: "9px 18px", fontSize: 12, fontWeight: 700,
                    cursor: "pointer", fontFamily: "Sora,sans-serif",
                    display: "flex", alignItems: "center", gap: 6,
                    boxShadow: "0 3px 12px rgba(99,102,241,0.4)",
                  }}>
                    <IconRestart /> Back to Menu
                  </button>
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Input bar */}
            <div style={{
              padding: "12px 14px", borderTop: "1px solid #1e293b",
              background: "#0f172a", display: "flex", gap: 8, alignItems: "center", flexShrink: 0,
            }}>
              <input
                ref={inputRef}
                type="text"
                value={inputVal}
                onChange={e => setInputVal(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSend()}
                disabled={!inputEnabled}
                placeholder={inputEnabled ? inputPlaceholder : "Choose an option above ↑"}
                style={{
                  flex: 1, padding: "10px 14px", borderRadius: 20,
                  border: `1.5px solid ${inputEnabled ? "#6366f1" : "#1e293b"}`,
                  background: inputEnabled ? "#1e293b" : "#0f172a",
                  color: "#e2e8f0", fontSize: 13, outline: "none",
                  fontFamily: "Sora,sans-serif",
                  cursor: inputEnabled ? "text" : "not-allowed",
                  opacity: inputEnabled ? 1 : 0.5,
                  transition: "border 0.2s, opacity 0.2s",
                }}
              />
              <button
                className="admin-send-btn"
                onClick={handleSend}
                disabled={!inputEnabled || !inputVal.trim()}
                style={{
                  width: 40, height: 40, borderRadius: "50%", border: "none",
                  background: (inputEnabled && inputVal.trim())
                    ? "linear-gradient(135deg,#4338ca,#6366f1)" : "#1e293b",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: (inputEnabled && inputVal.trim()) ? "pointer" : "default",
                  flexShrink: 0, transition: "all 0.2s",
                  boxShadow: (inputEnabled && inputVal.trim()) ? "0 4px 14px rgba(99,102,241,0.45)" : "none",
                }}>
                <IconSend color={(inputEnabled && inputVal.trim()) ? "white" : "#334155"} />
              </button>
            </div>

          </div>
        )}
      </div>
    </>
  );
}