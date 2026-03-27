import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

export type UserRole = "admin" | "teacher" | "security" | "student";

interface AuthUser {
  username: string;
  role: UserRole;
  regNo?: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  login: (
    username: string,
    password: string,
  ) => { success: boolean; error?: string };
  logout: () => void;
}

const CREDENTIALS: Record<
  string,
  { password: string; role: UserRole; regNo?: string }
> = {
  admin: { password: "admin123", role: "admin" },
  teacher: { password: "teacher123", role: "teacher" },
  security: { password: "security123", role: "security" },
  student: { password: "student123", role: "student", regNo: "ST001" },
};

const AuthContext = createContext<AuthContextValue>(null!);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const stored = localStorage.getItem("cms_user");
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    if (user) localStorage.setItem("cms_user", JSON.stringify(user));
    else localStorage.removeItem("cms_user");
  }, [user]);

  const login = (username: string, password: string) => {
    const cred = CREDENTIALS[username.toLowerCase()];
    if (!cred || cred.password !== password) {
      return { success: false, error: "Invalid username or password" };
    }
    setUser({
      username: username.toLowerCase(),
      role: cred.role,
      regNo: cred.regNo,
    });
    return { success: true };
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
