
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Tag, BookOpen, Smartphone, Briefcase, Sofa, Award, Shirt, BookMarked, Calculator, Home } from 'lucide-react';
const categories = [
  { name: "Textbooks", icon: <BookOpen size={24} /> },
  { name: "Notes", icon: <BookMarked size={24} /> },
  { name: "Electronics", icon: <Smartphone size={24} /> },
  { name: "Stationery", icon: <Briefcase size={24} /> },
  { name: "Lab Equipment", icon: <Calculator size={24} /> },
  { name: "Furniture", icon: <Sofa size={24} /> },
  { name: "Sports Gear", icon: <Award size={24} /> },
  { name: "Clothing", icon: <Shirt size={24} /> },
  { name: "Project Materials", icon: <Tag size={24} /> },
  { name: "Study Guides", icon: <BookOpen size={24} /> },
  { name: "Calculators", icon: <Calculator size={24} /> },
  { name: "Room Essentials", icon: <Home size={24} /> },
];

const LandingPage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-mits-primary text-white py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
            MITS Student Marketplace
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto animate-fade-in">
            Buy, sell, and share resources with your fellow MITS Gwalior students.
            From textbooks to electronics, find everything you need within your campus community.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              asChild
              className="bg-mits-secondary hover:bg-orange-500 text-white text-lg py-6 px-8"
            >
              <Link to="/marketplace">Browse Marketplace</Link>
            </Button>
            {isAuthenticated ? (
              <Button
                asChild
                variant="outline"
                className="text-white border-white hover:bg-white hover:text-mits-primary text-lg py-6 px-8"
              >
                <Link to="/create-listing">Sell or Share Item</Link>
              </Button>
            ) : (
              <Button
                asChild
                variant="outline"
                className="text-black border-white hover:bg-white hover:text-mits-primary text-lg py-6 px-8"
              >
                <Link to="/register">Join Now</Link>
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-mits-dark">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="bg-mits-primary text-white w-12 h-12 rounded-full flex items-center justify-center mb-4 mx-auto">
                1
              </div>
              <h3 className="text-xl font-semibold mb-4 text-center">Register</h3>
              <p className="text-gray-600 text-center">
                Sign up with your MITS email address (@mitsgwl.ac.in) and wait for admin approval.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="bg-mits-primary text-white w-12 h-12 rounded-full flex items-center justify-center mb-4 mx-auto">
                2
              </div>
              <h3 className="text-xl font-semibold mb-4 text-center">List Items</h3>
              <p className="text-gray-600 text-center">
                Create listings for items you want to sell, rent, or share with other students.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="bg-mits-primary text-white w-12 h-12 rounded-full flex items-center justify-center mb-4 mx-auto">
                3
              </div>
              <h3 className="text-xl font-semibold mb-4 text-center">Connect</h3>
              <p className="text-gray-600 text-center">
                Chat with fellow students, negotiate, and exchange resources safely on campus.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 px-4 bg-gray-50">
      <div className="container mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-mits-dark mb-2">Popular Categories</h2>
          <p className="text-gray-600">Find what you need from our wide selection</p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
          {categories.map((category) => (
            <Link
              key={category.name}
              to={`/marketplace?category=${category.name.toLowerCase()}`}
              className="flex flex-col items-center bg-white rounded-xl p-6 shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 border border-gray-100"
            >
              <div className="mb-3 text-mits-dark">
                {category.icon}
              </div>
              <span className="font-medium text-sm">{category.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-mits-secondary text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join the MITS Marketplace today and start sharing resources with your campus community.
          </p>
          {!isAuthenticated && (
            <Button
              asChild
              className="bg-white text-mits-secondary hover:bg-gray-100 text-lg py-6 px-8"
            >
              <Link to="/register">Register Now</Link>
            </Button>
          )}
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
