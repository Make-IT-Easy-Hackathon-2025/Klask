import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "../firebase";
import { IUser } from "../utils/types/dataTypes";
import { getUserByEmail, registerUser } from "../api";

interface AuthContextType {
  user: IUser | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // Register function
  const register = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      const registerResponse = await createUserWithEmailAndPassword(auth, email, password);
      if(registerResponse){
        await registerUser(email, name);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error during registration", error);
      throw error;
    }
  };

  // Login function
  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const loginResponse = await signInWithEmailAndPassword(auth, email, password);
      if(loginResponse.user){
        const response = await getUserByEmail(email);
        console.log(response)
        if(response){
          const newUser: IUser = { 
              _id: response._id,
              name: response.name,
              email: email,
              desc: response.desc,
              profilePicture: response.profilePicture,
              groups: response.groups,
          }
          setUser(newUser);
          localStorage.setItem("user", JSON.stringify(newUser));
          setIsAuthenticated(true);
          setLoading(false);

        }
      }
    } catch (error) {
      setIsAuthenticated(false);
      setLoading(false);
      console.error("Error during login", error);
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      setUser(null);
      localStorage.removeItem("user");
      setIsAuthenticated(false);
      await signOut(auth);
    } catch (error) {
      console.error("Error during logout", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
