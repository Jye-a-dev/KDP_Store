"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";

// ─── Types ──────────────────────────────────────────────────────────────────
export interface AuthUser {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  avatar_url?: string;
  role: "customer" | "admin";
  is_active: boolean;
}

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    full_name: string,
    email: string,
    password: string,
    phone?: string
  ) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  updateProfile: (updatedUser: Partial<AuthUser>) => void;
}

// ─── Context ─────────────────────────────────────────────────────────────────
const AuthContext = createContext<AuthContextValue | null>(null);

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";
const TOKEN_KEY = "kdp_access_token";
const USER_KEY = "kdp_user";

// ─── Provider ────────────────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem(TOKEN_KEY);
      const storedUser = localStorage.getItem(USER_KEY);
      if (storedToken && storedUser) {
        const parsedUser = JSON.parse(storedUser) as AuthUser;
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setToken(storedToken);
        setUser(parsedUser);
        // Re-sync cookies so proxy guard can read them after a hard refresh
        document.cookie = `kdp_token=${storedToken}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
        document.cookie = `kdp_role=${parsedUser.role}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
      }
    } catch {
      // ignore parse errors
    } finally {
      setIsLoading(false);
    }
  }, []);

  const _persist = (t: string, u: AuthUser) => {
    localStorage.setItem(TOKEN_KEY, t);
    localStorage.setItem(USER_KEY, JSON.stringify(u));
    // Mirror to cookie for Next.js middleware auth guard
    document.cookie = `kdp_token=${t}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
    document.cookie = `kdp_role=${u.role}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
    setToken(t);
    setUser(u);
  };

  const _clear = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    // Clear the cookie
    document.cookie = "kdp_token=; path=/; max-age=0; SameSite=Lax";
    document.cookie = "kdp_role=; path=/; max-age=0; SameSite=Lax";
    setToken(null);
    setUser(null);
  };

  // ── login ──────────────────────────────────────────────────────────────────
  const login = useCallback(async (email: string, password: string) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const data = (await res.json()) as { message?: string };
      throw new Error(data.message ?? "Đăng nhập thất bại");
    }

    const data = (await res.json()) as { access_token: string; user: AuthUser };
    _persist(data.access_token, data.user);
  }, []);

  // ── register ───────────────────────────────────────────────────────────────
  const register = useCallback(
    async (
      full_name: string,
      email: string,
      password: string,
      phone?: string
    ) => {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ full_name, email, password, phone }),
      });

      if (!res.ok) {
        const data = (await res.json()) as { message?: string };
        throw new Error(data.message ?? "Đăng ký thất bại");
      }

      const data = (await res.json()) as {
        access_token: string;
        user: AuthUser;
      };
      _persist(data.access_token, data.user);
    },
    []
  );

  // ── logout ─────────────────────────────────────────────────────────────────
  const logout = useCallback(() => {
    _clear();
  }, []);

  const updateProfile = useCallback((updatedUser: Partial<AuthUser>) => {
    setUser((prev) => {
      if (!prev) return null;
      const newUser = { ...prev, ...updatedUser };
      localStorage.setItem(USER_KEY, JSON.stringify(newUser));
      return newUser;
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        logout,
        isAuthenticated: !!token && !!user,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
