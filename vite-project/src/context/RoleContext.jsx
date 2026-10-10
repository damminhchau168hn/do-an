import { createContext, useContext, useState } from 'react';

const RoleContext = createContext(null);

function readUser() {
  try {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function RoleProvider({ children }) {
  const [user, setUser] = useState(readUser);

  function login(nextUser) {
    setUser(nextUser);
    try { localStorage.setItem('user', JSON.stringify(nextUser)); } catch { /* bỏ qua */ }
  }

  function logout() {
    setUser(null);
    try { localStorage.removeItem('user'); } catch { /* bỏ qua */ }
  }

  const role = user?.role ?? 'guest';

  return (
    <RoleContext.Provider value={{ user, role, login, logout }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  return useContext(RoleContext);
}