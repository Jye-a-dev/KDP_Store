import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { StorageService, StorageUser } from '../../../core/services/storage_service';
import { API_ENDPOINTS } from '../../../core/constants/api_config';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AuthContextValue {
  user: StorageUser | null;
  token: string | null;
  isLoading: boolean;
  hasCompletedOnboarding: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (fullName: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  completeOnboarding: () => Promise<void>;
  updateProfile: (updatedFields: Partial<StorageUser>) => Promise<void>;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Extract the most useful error message from a fetch response */
async function extractErrorMessage(res: Response, fallback: string): Promise<string> {
  try {
    const json = await res.json();
    // NestJS returns { message: string | string[] }
    if (Array.isArray(json.message)) return json.message[0];
    if (typeof json.message === 'string') return json.message;
    if (typeof json.error === 'string') return json.error;
  } catch {/* ignore parse error */}
  return fallback;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<StorageUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Hydrate from AsyncStorage on mount
  useEffect(() => {
    (async () => {
      try {
        // Uncomment the line below to reset onboarding state for testing:
        // await StorageService.setOnboardingCompleted(false);

        const [onboarded, storedToken, storedUser] = await Promise.all([
          StorageService.getOnboardingCompleted(),
          StorageService.getAuthToken(),
          StorageService.getAuthUser(),
        ]);
        setHasCompletedOnboarding(onboarded);
        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(storedUser);
        }
      } catch (e) {
        console.error('[Auth] Hydrate error:', e);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  // ─── login ──────────────────────────────────────────────────────────────────
  const login = useCallback(async (email: string, password: string) => {
    const res = await fetch(API_ENDPOINTS.login, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const msg = await extractErrorMessage(res, 'Sai email hoặc mật khẩu.');
      throw new Error(msg);
    }

    const data: { access_token: string; user: StorageUser } = await res.json();
    await Promise.all([
      StorageService.setAuthToken(data.access_token),
      StorageService.setAuthUser(data.user),
    ]);
    setToken(data.access_token);
    setUser(data.user);
  }, []);

  // ─── register ───────────────────────────────────────────────────────────────
  const register = useCallback(async (fullName: string, email: string, password: string) => {
    const res = await fetch(API_ENDPOINTS.register, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ full_name: fullName, email, password }),
    });

    if (!res.ok) {
      const msg = await extractErrorMessage(res, 'Đăng ký thất bại. Email có thể đã tồn tại.');
      throw new Error(msg);
    }

    const data: { access_token: string; user: StorageUser } = await res.json();
    await Promise.all([
      StorageService.setAuthToken(data.access_token),
      StorageService.setAuthUser(data.user),
    ]);
    setToken(data.access_token);
    setUser(data.user);
  }, []);

  // ─── logout ─────────────────────────────────────────────────────────────────
  const logout = useCallback(async () => {
    await StorageService.clearAuth();
    setToken(null);
    setUser(null);
  }, []);

  // ─── completeOnboarding ─────────────────────────────────────────────────────
  const completeOnboarding = useCallback(async () => {
    await StorageService.setOnboardingCompleted(true);
    setHasCompletedOnboarding(true);
  }, []);

  // ─── updateProfile ──────────────────────────────────────────────────────────
  const updateProfile = useCallback(async (updatedFields: Partial<StorageUser>) => {
    setUser((prev) => {
      if (!prev) return null;
      const updatedUser = { ...prev, ...updatedFields };
      StorageService.setAuthUser(updatedUser).catch((e) =>
        console.error('[Auth] setAuthUser error:', e)
      );
      return updatedUser;
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        hasCompletedOnboarding,
        isAuthenticated: !!token && !!user,
        login,
        register,
        logout,
        completeOnboarding,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
