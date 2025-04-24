
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/use-toast";

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

const ListingDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const allListings = JSON.parse(localStorage.getItem("mitsListings") || "[]");
    const foundListing = allListings.find((l: Listing) => l.id === id);
    
    if (foundListing) {
      setListing(foundListing);
    }
    
    setLoading(false);
  }, [id]);

  const handleSendMessage = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please login to contact the seller.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    if (!message.trim()) {
      toast({
        title: "Empty Message",
        description: "Please enter a message to send.",
        variant: "destructive",
      });
      return;
    }

    setIsSendingMessage(true);

    // Create new message
    const newMessage = {
      id: Date.now().toString(),
      senderId: user?.id,
      senderName: user?.name,
      receiverId: listing?.userId,
      receiverName: listing?.userName,
      listingId: listing?.id,
      listingTitle: listing?.title,
      content: message,
      timestamp: new Date().toISOString(),
      read: false,
    };

    // Save to localStorage
    const messages = JSON.parse(localStorage.getItem("mitsMessages") || "[]");
    messages.push(newMessage);
    localStorage.setItem("mitsMessages", JSON.stringify(messages));

    setIsSendingMessage(false);
    setMessage("");
    
    toast({
      title: "Message Sent",
      description: "Your message has been sent to the seller.",
    });
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!listing) {
    return (
      <div className="container mx-auto p-4 text-center py-16">
        <h1 className="text-2xl font-bold mb-4">Listing Not Found</h1>
        <p className="text-gray-600 mb-6">The listing you're looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <a href="/marketplace">Back to Marketplace</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4 text-sm breadcrumbs">
        <ul className="flex space-x-2">
          <li><a href="/" className="text-mits-primary hover:underline">Home</a></li>
          <li>&gt;</li>
          <li><a href="/marketplace" className="text-mits-primary hover:underline">Marketplace</a></li>
          <li>&gt;</li>
          <li className="text-gray-600">{listing.title}</li>
        </ul>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Listing Details */}
        <div className="lg:col-span-2">
          <Card>
            <div className="aspect-[16/9] overflow-hidden">
              {listing.image ? (
                <img 
                  src={listing.image} 
                  alt={listing.title} 
                  className="w-full h-full object-contain bg-gray-100" 
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">No image available</span>
                </div>
              )}
            </div>
            
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl">{listing.title}</CardTitle>
                  <CardDescription>
                    Posted by {listing.userName} on {new Date(listing.createdAt).toLocaleDateString()}
                  </CardDescription>
                </div>
                <Badge className={`${
                  listing.type === "share" ? "bg-green-100 text-green-800 hover:bg-green-200" : 
                  listing.type === "rent" ? "bg-blue-100 text-blue-800 hover:bg-blue-200" : 
                  "bg-orange-100 text-orange-800 hover:bg-orange-200"
                }`}>
                  {listing.type === "share" ? "Free Resource" : 
                   listing.type === "rent" ? "For Rent" : 
                   "For Sale"}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Price</h3>
                <p className="text-2xl font-bold">
                  {listing.price > 0 ? `₹${listing.price}` : 'Free'}
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{listing.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-500">Category</h3>
                  <p>{listing.category}</p>
                </div>
                
                {listing.condition && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500">Condition</h3>
                    <p>{listing.condition}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Contact Seller */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Contact {listing.userName}</CardTitle>
              <CardDescription>
                Send a message about this listing
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              {listing.userId === user?.id ? (
                <div className="text-center p-4 bg-gray-50 rounded-md">
                  <p className="text-gray-600">This is your listing</p>
                </div>
              ) : isAuthenticated ? (
                <div className="space-y-4">
                  <Textarea
                    placeholder={`Hi, I'm interested in your "${listing.title}". Is it still available?`}
                    className="min-h-[100px]"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                  <Button 
                    className="w-full" 
                    onClick={handleSendMessage}
                    disabled={isSendingMessage}
                  >
                    {isSendingMessage ? "Sending..." : "Send Message"}
                  </Button>
                </div>
              ) : (
                <div className="text-center space-y-4">
                  <p className="text-gray-600">
                    You need to be logged in to contact the seller
                  </p>
                  <Button asChild className="w-full">
                    <a href="/login">Login to Continue</a>
                  </Button>
                </div>
              )}
            </CardContent>
            
            <CardFooter className="flex-col items-start">
              <p className="text-sm text-gray-500">
                Please be respectful and follow community guidelines when contacting other users.
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ListingDetails;
