
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";

type Listing = {
  id: string;
  title: string;
  description: string;
  price: number;
  type: "sell" | "rent" | "share";
  category: string;
  userId: string;
  userName: string;
  createdAt: string;
  image: string;
  condition?: string;
};

const categories = [
  "All Categories",
  "Textbooks",
  "Notes",
  "Electronics",
  "Stationery",
  "Lab Equipment",
  "Furniture",
  "Sports Gear",
  "Clothing",
  "Project Materials",
  "Study Guides",
  "Calculators",
  "Room Essentials",
  "Other",
];

const Marketplace = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [filteredListings, setFilteredListings] = useState<Listing[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedType, setSelectedType] = useState("all");
  const [loading, setLoading] = useState(true);
  
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const categoryParam = queryParams.get("category");
  
  // Load all listings
  useEffect(() => {
    const allListings = JSON.parse(localStorage.getItem("mitsListings") || "[]");
    setListings(allListings);
    setFilteredListings(allListings);
    setLoading(false);
    
    // Set initial category from URL params
    if (categoryParam && categories.includes(categoryParam)) {
      setSelectedCategory(categoryParam);
    }
  }, [categoryParam]);
  
  // Apply filters when any filter changes
  useEffect(() => {
    let result = [...listings];
    
    // Filter by search term
    if (searchTerm.trim()) {
      result = result.filter(
        listing => 
          listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          listing.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by category
    if (selectedCategory !== "All Categories") {
      result = result.filter(listing => listing.category === selectedCategory);
    }
    
    // Filter by type
    if (selectedType !== "all") {
      result = result.filter(listing => listing.type === selectedType);
    }
    
    setFilteredListings(result);
  }, [searchTerm, selectedCategory, selectedType, listings]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Marketplace</h1>
      
      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <Input
              placeholder="Search listings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div>
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex space-x-2">
            <Tabs 
              value={selectedType} 
              onValueChange={setSelectedType}
              className="w-full"
            >
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="sell">Buy</TabsTrigger>
                <TabsTrigger value="rent">Rent</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </div>
      
      {/* Listings */}
      {loading ? (
        <div className="text-center py-16">
          <p className="text-lg">Loading listings...</p>
        </div>
      ) : filteredListings.length === 0 ? (
        <div className="text-center py-16">
          <h3 className="text-lg font-medium mb-2">No listings found</h3>
          <p className="text-gray-500 mb-4">
            Try adjusting your filters or search terms
          </p>
          <Button
            onClick={() => {
              setSearchTerm("");
              setSelectedCategory("All Categories");
              setSelectedType("all");
            }}
          >
            Clear Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredListings.map((listing) => (
            <Link to={`/marketplace/${listing.id}`} key={listing.id}>
              <Card className="h-full hover:shadow-md transition-shadow">
                <div className="aspect-[4/3] overflow-hidden">
                  {listing.image ? (
                    <img 
                      src={listing.image} 
                      alt={listing.title} 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500">No image</span>
                    </div>
                  )}
                </div>
                <CardHeader className="py-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg line-clamp-1">{listing.title}</CardTitle>
                      <CardDescription>
                        {listing.type === "sell" ? "For Sale" : listing.type === "rent" ? "For Rent" : "Shared Resource"}
                      </CardDescription>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      listing.type === "share" ? "bg-green-100 text-green-800" : 
                      listing.type === "rent" ? "bg-blue-100 text-blue-800" : 
                      "bg-orange-100 text-orange-800"
                    }`}>
                      {listing.type === "share" ? "Free" : 
                       listing.type === "rent" ? "Rent" : 
                       "Sale"}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="py-2">
                  <p className="font-bold text-lg">
                    {listing.price > 0 ? `₹${listing.price}` : 'Free'}
                  </p>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                    {listing.description}
                  </p>
                </CardContent>
                <CardFooter className="pt-2 pb-4 text-xs text-gray-500 flex justify-between items-center">
                  <span>{listing.userName}</span>
                  <span>{new Date(listing.createdAt).toLocaleDateString()}</span>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Marketplace;
