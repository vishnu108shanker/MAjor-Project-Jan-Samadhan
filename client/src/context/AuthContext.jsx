import { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

// ─── Context ───────────────────────────────────────────────────────────────
const AuthContext = createContext(null);

// ─── Helper: safely decode token from localStorage ─────────────────────────
const getUserFromStorage = () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return null;

    const decoded = jwtDecode(token);

    // Reject expired tokens immediately
    if (decoded.exp * 1000 < Date.now()) {
      localStorage.removeItem('token');
      return null;
    }

    return decoded; // { id, role, name, email, iat, exp }
  } catch {
    localStorage.removeItem('token');
    return null;
  }
};

// ─── Provider ──────────────────────────────────────────────────────────────
export function AuthProvider({ children }) {
  const [user, setUser] = useState(getUserFromStorage);

  // Re-check on first load (handles page refresh)
  useEffect(() => {
    setUser(getUserFromStorage());
  }, []);

  /**
   * Call after a successful POST /api/auth/login.
   * Stores the token and decodes it into state.
   */
  const login = (token) => {
    localStorage.setItem('token', token);
    setUser(jwtDecode(token));
  };

  /**
   * Clears everything and resets user to null.
   */
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ──────────────────────────────────────────────────────────────────
export const useAuth = () => useContext(AuthContext);
