
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "@/components/ui/use-toast";

type User = {
  id: string;
  email: string;
  name: string;
  role: "user" | "admin";
  status: "pending" | "approved" | "rejected";
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem("mitsUser");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem("mitsUser");
      }
    }
    setIsLoading(false);
  }, []);

  // Mock login function - in a real app this would call an API
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      // Validate domain
      if (!email.endsWith("@mitsgwl.ac.in")) {
        throw new Error("Only MITS Gwalior email domains are allowed.");
      }

      // Mock API call
      const users = JSON.parse(localStorage.getItem("mitsUsers") || "[]");
      const user = users.find((u: any) => u.email === email);
      
      if (!user) {
        throw new Error("User not found. Please register first.");
      }
      
      if (user.password !== password) {
        throw new Error("Incorrect password.");
      }
      
      if (user.status === "pending") {
        throw new Error("Your account is pending admin approval.");
      }
      
      if (user.status === "rejected") {
        throw new Error("Your registration has been rejected.");
      }

      // Remove password before storing in state
      const { password: _, ...userWithoutPassword } = user;
      
      setUser(userWithoutPassword);
      localStorage.setItem("mitsUser", JSON.stringify(userWithoutPassword));
      toast({
        title: "Login Successful",
        description: `Welcome back, ${user.name}!`,
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: error.message || "An unexpected error occurred",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Mock register function
  const register = async (name: string, email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // Validate domain
      if (!email.endsWith("@mitsgwl.ac.in")) {
        throw new Error("Only MITS Gwalior email domains are allowed.");
      }

      // Mock API call
      const users = JSON.parse(localStorage.getItem("mitsUsers") || "[]");
      
      // Check if user already exists
      if (users.some((u: any) => u.email === email)) {
        throw new Error("Email already registered.");
      }
      
      // Create new user
      const newUser = {
        id: Date.now().toString(),
        name,
        email,
        password,
        role: "user",
        status: "pending"
      };
      
      users.push(newUser);
      localStorage.setItem("mitsUsers", JSON.stringify(users));
      
      toast({
        title: "Registration Successful",
        description: "Your account is pending admin approval. You'll be notified once approved.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: error.message || "An unexpected error occurred",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("mitsUser");
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        isAdmin: user?.role === "admin",
        isAuthenticated: !!user && user.status === "approved",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
