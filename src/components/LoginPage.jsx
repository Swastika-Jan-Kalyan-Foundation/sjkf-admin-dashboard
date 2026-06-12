import { useState } from "react";

const EyeIcon = ({ open }) =>
  open ? (
    <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M1 1l22 22" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );

const LeafIcon = () => (
  <svg viewBox="0 0 32 32" fill="none" width="28" height="28">
    <path d="M6 26C6 26 8 14 20 10C26 8 28 6 28 6C28 6 28 10 24 16C20 22 14 24 6 26Z" fill="#4ade80" />
    <path d="M6 26C10 20 14 16 20 12" stroke="#166534" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

export default function LoginPage({ onLogin, loading, error, setError }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({ username: false, password: false });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ username: true, password: true });
    if (!username.trim() || !password) return;
    await onLogin(username, password);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap');
        * { font-family: 'Sora', sans-serif; box-sizing: border-box; }

        .login-page {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: #f0fdf4;
        }

        /* ── Hero ── */
        .login-hero {
          position: relative;
          background: linear-gradient(160deg, #092616 0%, #0f3d24 55%, #145c34 100%);
          padding: 56px 24px 120px;
          text-align: center;
          overflow: hidden;
        }

        /* Decorative circles like the site */
        .login-hero::before,
        .login-hero::after {
          content: '';
          position: absolute;
          border-radius: 50%;
          opacity: 0.06;
          background: #4ade80;
          pointer-events: none;
        }
        .login-hero::before { width: 420px; height: 420px; top: -120px; left: -100px; }
        .login-hero::after  { width: 320px; height: 320px; bottom: -60px; right: -60px; }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 999px;
          padding: 6px 18px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #86efac;
          margin-bottom: 28px;
        }
        .hero-badge span {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #4ade80;
          display: inline-block;
        }

        .hero-title {
          font-size: clamp(36px, 6vw, 56px);
          font-weight: 800;
          line-height: 1.1;
          color: #fff;
          margin-bottom: 14px;
          letter-spacing: -0.02em;
        }
        .hero-title em {
          font-style: normal;
          color: #86efac;
        }

        .hero-sub {
          font-size: 15px;
          color: rgba(255,255,255,0.6);
          max-width: 360px;
          margin: 0 auto;
          line-height: 1.7;
          font-weight: 400;
        }

        /* Wave divider — same shape as the site */
        .wave-divider {
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 100%;
          line-height: 0;
        }

        /* ── Card area ── */
        .login-body {
          flex: 1;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding: 0 16px 48px;
          margin-top: -48px;
          position: relative;
          z-index: 2;
        }

        .login-card {
          width: 100%;
          max-width: 460px;
          background: #fff;
          border-radius: 24px;
          box-shadow: 0 20px 60px rgba(15,61,36,0.12), 0 4px 16px rgba(0,0,0,0.06);
          border: 1px solid #dcfce7;
          overflow: hidden;
        }

        .card-head {
          padding: 28px 32px 24px;
          display: flex;
          align-items: center;
          gap: 14px;
          border-bottom: 1px solid #f0fdf4;
        }

        .card-logo {
          width: 48px; height: 48px;
          border-radius: 14px;
          background: linear-gradient(135deg, #0f3d24, #166534);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }

        .card-head-text h2 {
          font-size: 17px;
          font-weight: 700;
          color: #0f3d24;
          margin: 0 0 2px;
        }
        .card-head-text p {
          font-size: 12px;
          color: #6b7280;
          margin: 0;
        }

        .card-body {
          padding: 28px 32px 32px;
        }

        /* ── Fields ── */
        .field { margin-bottom: 20px; }

        .field label {
          display: block;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: #166534;
          margin-bottom: 7px;
        }

        .input-wrap {
          position: relative;
        }

        .input-icon {
          position: absolute;
          left: 13px;
          top: 50%;
          transform: translateY(-50%);
          color: #86efac;
          display: flex;
          pointer-events: none;
        }

        .field input {
          width: 100%;
          padding: 12px 14px 12px 40px;
          border-radius: 12px;
          border: 1.5px solid #bbf7d0;
          background: #f8fffe;
          font-size: 14px;
          color: #1a1a1a;
          outline: none;
          transition: border-color 0.18s, box-shadow 0.18s;
          font-family: 'Sora', sans-serif;
        }
        .field input::placeholder { color: #9ca3af; }
        .field input:focus {
          border-color: #4ade80;
          box-shadow: 0 0 0 3px rgba(74,222,128,0.14);
          background: #fff;
        }
        .field input.error { border-color: #fca5a5; }
        .field input.error:focus { box-shadow: 0 0 0 3px rgba(252,165,165,0.2); }

        .eye-btn {
          position: absolute;
          right: 13px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: #86efac;
          display: flex;
          padding: 4px;
          transition: color 0.15s;
        }
        .eye-btn:hover { color: #4ade80; }

        .field-error {
          font-size: 11px;
          color: #ef4444;
          margin-top: 5px;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        /* ── Auth error ── */
        .auth-error {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #fff1f2;
          border: 1px solid #fecaca;
          border-radius: 12px;
          padding: 12px 14px;
          margin-bottom: 20px;
          font-size: 13px;
          font-weight: 500;
          color: #b91c1c;
        }
        .auth-error-icon {
          width: 20px; height: 20px;
          border-radius: 50%;
          background: #fecaca;
          display: flex; align-items: center; justify-content: center;
          font-size: 11px; font-weight: 700;
          flex-shrink: 0;
        }

        /* ── Submit button ── */
        .submit-btn {
          width: 100%;
          padding: 14px;
          border-radius: 12px;
          border: none;
          cursor: pointer;
          font-family: 'Sora', sans-serif;
          font-size: 14px;
          font-weight: 700;
          color: #fff;
          background: linear-gradient(135deg, #0f3d24, #166534);
          box-shadow: 0 4px 16px rgba(15,61,36,0.28);
          display: flex; align-items: center; justify-content: center; gap: 8px;
          transition: transform 0.15s, box-shadow 0.15s, background 0.15s;
          letter-spacing: 0.01em;
        }
        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(15,61,36,0.38);
          background: linear-gradient(135deg, #145c34, #166534);
        }
        .submit-btn:active:not(:disabled) { transform: translateY(0); }
        .submit-btn:disabled {
          background: #86efac;
          cursor: not-allowed;
          box-shadow: none;
        }

        .spin { animation: spin 0.8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }

        .login-footer {
          text-align: center;
          padding-top: 22px;
          font-size: 11px;
          color: #9ca3af;
          border-top: 1px solid #f0fdf4;
          margin-top: 22px;
        }
        .login-footer strong { color: #6b7280; }

        .page-footer {
          text-align: center;
          padding: 16px;
          font-size: 11px;
          color: #6b7280;
          opacity: 0.7;
        }
      `}</style>

      <div className="login-page">
        {/* ── Hero ── */}
        <div className="login-hero">
          <div className="hero-badge"><span />Admin Access</div>
          <h1 className="hero-title">
            Welcome to<br /><em>Admin</em> Portal
          </h1>
          <p className="hero-sub">
            Secure access for authorised administrators only. Manage your NGO's operations from one place.
          </p>


          <div className="wave-divider">
            <svg viewBox="0 0 1440 72" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style={{ display: "block", width: "100%" }}>
              <path d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,72 L0,72 Z" fill="#f0fdf4" />
            </svg>
          </div>
        </div>

        {/* ── Card ── */}
        <div className="login-body">
          <div className="login-card">
            <div className="card-head">
              <div className="card-logo">
                <LeafIcon />
              </div>
              <div className="card-head-text">
                <h2>Sign in to your admin account</h2>
                <p>Swastika Jan Kalyan Foundation · Admin Panel</p>
              </div>
            </div>

            <div className="card-body">
              <form onSubmit={handleSubmit}>
                {/* Username */}
                <div className="field">
                  <label>Username</label>
                  <div className="input-wrap">
                    <span className="input-icon">
                      <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
                        <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8" />
                        <path d="M4 20v-1a8 8 0 0116 0v1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                      </svg>
                    </span>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => { setUsername(e.target.value); setError(null); }}
                      onBlur={() => setTouched((p) => ({ ...p, username: true }))}
                      placeholder="Enter your username"
                      autoComplete="username"
                      className={touched.username && !username.trim() ? "error" : ""}
                    />
                  </div>
                  {touched.username && !username.trim() && (
                    <p className="field-error">Username is required</p>
                  )}
                </div>

                {/* Password */}
                <div className="field">
                  <label>Password</label>
                  <div className="input-wrap">
                    <span className="input-icon">
                      <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
                        <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="1.8" />
                        <path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                      </svg>
                    </span>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setError(null); }}
                      onBlur={() => setTouched((p) => ({ ...p, password: true }))}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      style={{ paddingRight: "42px" }}
                      className={touched.password && !password ? "error" : ""}
                    />
                    <button type="button" className="eye-btn" onClick={() => setShowPassword((p) => !p)}>
                      <EyeIcon open={showPassword} />
                    </button>
                  </div>
                  {touched.password && !password && (
                    <p className="field-error">Password is required</p>
                  )}
                </div>

                {/* Auth error */}
                {error && (
                  <div className="auth-error">
                    <div className="auth-error-icon">✕</div>
                    {error}
                  </div>
                )}

                {/* Submit */}
                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? (
                    <>
                      <svg viewBox="0 0 24 24" fill="none" width="16" height="16" className="spin">
                        <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeDasharray="31.4" strokeDashoffset="10" />
                      </svg>
                      Signing in…
                    </>
                  ) : (
                    <>
                      <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
                        <rect x="3" y="11" width="18" height="11" rx="2" stroke="white" strokeWidth="1.8" />
                        <path d="M7 11V7a5 5 0 0110 0v4" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
                      </svg>
                      Sign In
                    </>
                  )}
                </button>
              </form>

              <div className="login-footer">
                🔒 Authorised access only &nbsp;·&nbsp; <strong>This portal is private</strong>
              </div>
            </div>
          </div>
        </div>

        <p className="page-footer">Swastika Jan Kalyan Foundation © {new Date().getFullYear()}</p>
      </div>
    </>
  );
}