
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useEffect } from "react";

const Layout = () => {
  // Add default admin user if not exists
  useEffect(() => {
    const users = JSON.parse(localStorage.getItem("mitsUsers") || "[]");
    const adminExists = users.some((user: any) => user.role === "admin");
    
    if (!adminExists) {
      const adminUser = {
        id: "admin-1",
        name: "Admin User",
        email: "admin@mitsgwl.ac.in",
        password: "admin123",
        role: "admin",
        status: "approved"
      };
      
      users.push(adminUser);
      localStorage.setItem("mitsUsers", JSON.stringify(users));
      console.log("Default admin user created");
    }
    
    // Initialize listings if not exists
    if (!localStorage.getItem("mitsListings")) {
      localStorage.setItem("mitsListings", JSON.stringify([]));
    }
    
    // Initialize messages if not exists
    if (!localStorage.getItem("mitsMessages")) {
      localStorage.setItem("mitsMessages", JSON.stringify([]));
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
