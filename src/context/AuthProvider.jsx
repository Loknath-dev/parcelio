import { useEffect, useState } from "react";
import authApi from "../backend/Api/authApi";
import { AuthContext } from "./AuthContext";

export default function AuthProvider({ children }) {
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const verifyUser = async () => {
      try {
        const response = {
          status: true,
          user: {
            name: "Bijay Das",
            phone: "+918116672284",
          },
        };
        // await authApi("/session_verification");

        if (!mounted) return;

        if (response?.status === true && response?.user) {
          setUser(response.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        if (!mounted) return;

        console.error("User verification failed:", error);
        setUser(null);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    verifyUser();

    return () => {
      mounted = false;
    };
  }, []);

  const login = async (name, phone) => {
    try {
      const response = await authApi("/signin", {
        name: name.trim(),
        phone: phone.trim(),
      });
      if (response?.status === true && response?.user) {
        setUser(response.user);
      }
      return response;
    } catch (error) {
      console.error("Login failed:", error);
      return {
        status: false,
        message: "Unable to sign in",
      };
    }
  };

  const logout = async () => {
    try {
      const response = await authApi("/signOut");
      console.log(response);
    } finally {
      setUser(null);
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
