
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const { user, logout, isAdmin, isAuthenticated } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-mits-primary text-white p-4 sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <span className="font-bold text-xl md:text-2xl">MITS Marketplace</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/marketplace" className="hover:text-mits-secondary transition-colors">
            Marketplace
          </Link>
          
          {isAuthenticated && (
            <>
              <Link to="/dashboard" className="hover:text-mits-secondary transition-colors">
                Dashboard
              </Link>
              <Link to="/create-listing" className="hover:text-mits-secondary transition-colors">
                Sell/Share
              </Link>
              <Link to="/messages" className="hover:text-mits-secondary transition-colors">
                Messages
              </Link>
            </>
          )}
          
          {isAdmin && (
            <Link to="/admin" className="hover:text-mits-secondary transition-colors">
              Admin
            </Link>
          )}

          {user ? (
            <div className="flex items-center space-x-4">
              <Link to="/profile" className="hover:text-mits-secondary transition-colors">
                {user.name}
              </Link>
              <Button variant="outline" onClick={handleLogout} className="border-white text-black hover:bg-white hover:text-mits-primary">
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Button variant="outline" asChild className="border-white text-black hover:bg-white hover:text-mits-primary">
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild className="bg-mits-secondary hover:bg-orange-500 text-white">
                <Link to="/register">Register</Link>
              </Button>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isMenuOpen && (
        <div className="md:hidden bg-mits-primary py-4">
          <div className="container mx-auto flex flex-col space-y-4">
            <Link
              to="/marketplace"
              className="text-white hover:text-mits-secondary px-4 py-2 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Marketplace
            </Link>
            
            {isAuthenticated && (
              <>
                <Link
                  to="/dashboard"
                  className="text-white hover:text-mits-secondary px-4 py-2 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/create-listing"
                  className="text-white hover:text-mits-secondary px-4 py-2 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sell/Share
                </Link>
                <Link
                  to="/messages"
                  className="text-white hover:text-mits-secondary px-4 py-2 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Messages
                </Link>
              </>
            )}

            {isAdmin && (
              <Link
                to="/admin"
                className="text-white hover:text-mits-secondary px-4 py-2 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Admin
              </Link>
            )}

            {user ? (
              <>
                <Link
                  to="/profile"
                  className="text-white hover:text-mits-secondary px-4 py-2 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {user.name}
                </Link>
                <Button
                  variant="destructive"
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="w-full"
                >
                  Logout
                </Button>
              </>
            ) : (
              <div className="flex flex-col space-y-2">
                <Button
                  variant="outline"
                  asChild
                  className="w-full border-white text-white"
                >
                  <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                    Login
                  </Link>
                </Button>
                <Button asChild className="w-full bg-mits-secondary hover:bg-orange-500">
                  <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                    Register
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
