import { createContext, useContext, useState, ReactNode } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  type: "student" | "driver" | "admin";
  studentId?: string;
  busNumber?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, userType: "student" | "driver" | "admin") => void;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (email: string, password: string, userType: "student" | "driver" | "admin") => {
    // Mock login - in production, this would call an API
    const mockUser: User = {
      id: "1",
      name: userType === "admin" ? "Admin User" : userType === "driver" ? "Driver #101" : "John Smith",
      email: email,
      type: userType,
      studentId: userType === "student" ? "STU-2026-001234" : undefined,
      busNumber: userType === "driver" ? "BUS-101" : undefined,
    };
    setUser(mockUser);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.type === "admin",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
