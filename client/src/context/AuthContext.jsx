import { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

// use this only after review , 21/04/2026
// import { useMemo } from 'react';


// This file creates:

// AuthContext (global storage)
//    ↓
// AuthProvider (wraps whole app)
//    ↓
// Any component → useAuth() → gets user, login, logout

// So instead of passing props everywhere, you do:

// const { user } = useAuth();




// ─── Context ───────────────────────────────────────────────────────────────

// This is like:
// “I am creating a global box where auth data will live”
const AuthContext = createContext(null);

// ─── Helper: safely decode token from localStorage ─────────────────────────
const getUserFromStorage = () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return null;

    const decoded = jwtDecode(token);


      // checks if token expired
      // Why *1000?
      // JWT exp is in seconds
      // JS Date is in milliseconds
    if (decoded.exp * 1000 < Date.now()) {
      // If expired → force logout
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
  

  // use this only after review , 21/04/2026
// // inside AuthProvider:
// const value = useMemo(() => ({ user, login, logout }), [user]);

// return (
//   <AuthContext.Provider value={value}>
//     {children}
//   </AuthContext.Provider>
// );

  const [user, setUser] = useState(getUserFromStorage);


  // ?? Fix on 21/04/2026: This causes a flash of logged-out state on page refresh, even if token is valid. Why? Because getUserFromStorage runs only once on initial render, and localStorage might not be ready yet? Or maybe because of how React batches state updates? Need to investigate further.
  // // Re-check on first load (handles page refresh)
  // useEffect(() => {
  //   setUser(getUserFromStorage());
  // }, []);

  /**
   * Call after a successful POST /api/auth/login.
   * Stores the token and decodes it into state.
   * This is called after backend login API
   */
  const login = (token) => {
    localStorage.setItem('token', token);
    setUser(jwtDecode(token));
  };

  // logout function   Clears everything → user becomes logged out
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

// Provider (MOST IMPORTANT)
//   This exposes:
      // user
      // login()
      // logout()
      // to entire app via <AuthProvider> in main.jsx , so that any component can call useAuth() to get these values/functions
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

//Custom hook to easily access auth context in any component
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);





// MERN flow:

// User logs in → backend returns JWT
// You call:
// login(response.data.token);
// This:
// stores token
// sets user globally
// Now anywhere:
// const { user } = useAuth();

// You can access:

// user.role → for admin check
// user.id → for API
// user.email → UI