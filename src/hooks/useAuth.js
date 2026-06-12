import { useState, useEffect, useCallback } from "react";
import { AUTH_CONFIG } from "./authConfig";


async function sha256(text) {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

function getSession() {
  try {
    const raw = sessionStorage.getItem(AUTH_CONFIG.sessionKey);
    if (!raw) return null;
    const session = JSON.parse(raw);
    if (Date.now() > session.expiresAt) {
      sessionStorage.removeItem(AUTH_CONFIG.sessionKey);
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!getSession());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Re-check session on mount (handles tab refresh)
  useEffect(() => {
    setIsAuthenticated(!!getSession());
  }, []);

  const login = useCallback(async (username, password) => {
    setLoading(true);
    setError(null);
    try {
      const [userHash, passHash] = await Promise.all([
        sha256(username.trim()),
        sha256(password),
      ]);

      if (
        userHash === AUTH_CONFIG.usernameHash &&
        passHash === AUTH_CONFIG.passwordHash
      ) {
        const session = {
          loggedInAt: Date.now(),
          expiresAt: Date.now() + AUTH_CONFIG.sessionDuration,
        };
        sessionStorage.setItem(AUTH_CONFIG.sessionKey, JSON.stringify(session));
        setIsAuthenticated(true);
        return true;
      } else {
        setError("Invalid username or password.");
        return false;
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(AUTH_CONFIG.sessionKey);
    setIsAuthenticated(false);
  }, []);

  return { isAuthenticated, login, logout, loading, error, setError };
}