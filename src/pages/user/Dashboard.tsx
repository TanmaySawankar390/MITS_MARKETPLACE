
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

type Message = {
  id: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  receiverName: string;
  listingId: string;
  listingTitle: string;
  content: string;
  timestamp: string;
  read: boolean;
};

const UserDashboard = () => {
  const { user } = useAuth();
  const [myListings, setMyListings] = useState<Listing[]>([]);
  const [unreadMessages, setUnreadMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      // Load user's listings
      const allListings = JSON.parse(localStorage.getItem("mitsListings") || "[]");
      const userListings = allListings.filter((listing: Listing) => listing.userId === user.id);
      setMyListings(userListings);

      // Load unread messages
      const allMessages = JSON.parse(localStorage.getItem("mitsMessages") || "[]");
      const userUnreadMessages = allMessages.filter(
        (msg: Message) => msg.receiverId === user.id && !msg.read
      );
      setUnreadMessages(userUnreadMessages);
      
      setLoading(false);
    }
  }, [user]);

  const handleDeleteListing = (listingId: string) => {
    const allListings = JSON.parse(localStorage.getItem("mitsListings") || "[]");
    const updatedListings = allListings.filter((listing: Listing) => listing.id !== listingId);
    localStorage.setItem("mitsListings", JSON.stringify(updatedListings));
    
    setMyListings(myListings.filter(listing => listing.id !== listingId));
    
    toast({
      title: "Listing Deleted",
      description: "Your listing has been deleted successfully.",
    });
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
      <p className="text-gray-600 mb-8">Welcome back, {user?.name}</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>My Listings</CardTitle>
            <CardDescription>Items you're selling or sharing</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{myListings.length}</div>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full">
              <Link to="/create-listing">Create New Listing</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Unread Messages</CardTitle>
            <CardDescription>Messages awaiting your response</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{unreadMessages.length}</div>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full">
              <Link to="/messages">View Messages</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Account Status</CardTitle>
            <CardDescription>Your current account status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <span 
                className={`inline-block px-2 py-1 rounded-full text-xs mr-2 ${
                  user?.status === "approved" 
                    ? "bg-green-100 text-green-800" 
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {user?.status}
              </span>
              <span className="text-sm text-gray-600">
                {user?.status === "approved" 
                  ? "Your account is active" 
                  : "Waiting for admin approval"}
              </span>
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full">
              <Link to="/profile">View Profile</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Tabs defaultValue="listings">
        <TabsList className="mb-4">
          <TabsTrigger value="listings">My Listings</TabsTrigger>
          <TabsTrigger value="messages">
            Recent Messages {unreadMessages.length > 0 && `(${unreadMessages.length})`}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="listings">
          {myListings.length === 0 ? (
            <div className="text-center py-16">
              <h3 className="text-lg font-medium mb-2">No listings yet</h3>
              <p className="text-gray-500 mb-4">
                You haven't created any listings yet.
              </p>
              <Button asChild>
                <Link to="/create-listing">Create Your First Listing</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myListings.map((listing) => (
                <Card key={listing.id}>
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
                  <CardHeader>
                    <CardTitle>{listing.title}</CardTitle>
                    <CardDescription>
                      {listing.type === "sell" ? "For Sale" : listing.type === "rent" ? "For Rent" : "Shared Resource"} • {listing.category}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="font-bold text-lg">
                      {listing.price > 0 ? `₹${listing.price}` : 'Free'}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {listing.description}
                    </p>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button asChild variant="outline" size="sm">
                      <Link to={`/marketplace/${listing.id}`}>View</Link>
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleDeleteListing(listing.id)}
                    >
                      Delete
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="messages">
          {unreadMessages.length === 0 ? (
            <div className="text-center py-16">
              <h3 className="text-lg font-medium mb-2">No unread messages</h3>
              <p className="text-gray-500">
                You have no unread messages at this time.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {unreadMessages.map((message) => (
                <Card key={message.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">Message from {message.senderName}</CardTitle>
                    <CardDescription>
                      Regarding: {message.listingTitle}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">{message.content}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(message.timestamp).toLocaleString()}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button asChild className="w-full">
                      <Link to="/messages">Reply</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserDashboard;
