
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-mits-dark text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">MITS Marketplace</h3>
            <p className="text-gray-300">
              A resource sharing platform exclusively for MITS Gwalior students.
              Buy, sell, or rent resources with your college community.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-mits-secondary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/marketplace" className="text-gray-300 hover:text-mits-secondary transition-colors">
                  Marketplace
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-300 hover:text-mits-secondary transition-colors">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-gray-300 hover:text-mits-secondary transition-colors">
                  Register
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">Contact</h3>
            <p className="text-gray-300">Madhav Institute of Technology & Science</p>
            <p className="text-gray-300">Race Course Road, Gwalior - 474005</p>
            <p className="text-gray-300">Madhya Pradesh, India</p>
            <p className="text-gray-300 mt-2">Email: info@mitsgwl.ac.in</p>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-4 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} MITS Marketplace. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
