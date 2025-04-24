
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
};

type Listing = {
  id: string;
  title: string;
  price: number;
  type: "sell" | "rent" | "share";
  userId: string;
  createdAt: string;
};

const AdminDashboard = () => {
  const [pendingUsers, setPendingUsers] = useState<User[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load users from localStorage
    const loadData = () => {
      const users = JSON.parse(localStorage.getItem("mitsUsers") || "[]");
      const pendingUsers = users.filter((user: User) => user.status === "pending");
      setAllUsers(users.filter((user: User) => user.role !== "admin"));
      setPendingUsers(pendingUsers);

      // Load listings
      const listings = JSON.parse(localStorage.getItem("mitsListings") || "[]");
      setListings(listings);
      
      setLoading(false);
    };

    loadData();
  }, []);

  const handleApprove = (userId: string) => {
    const users = JSON.parse(localStorage.getItem("mitsUsers") || "[]");
    const updatedUsers = users.map((user: User) => {
      if (user.id === userId) {
        return { ...user, status: "approved" };
      }
      return user;
    });

    localStorage.setItem("mitsUsers", JSON.stringify(updatedUsers));
    
    // Update state
    setPendingUsers(pendingUsers.filter(user => user.id !== userId));
    setAllUsers(prevUsers => {
      const updatedUserList = prevUsers.map(user => {
        if (user.id === userId) {
          return { ...user, status: "approved" };
        }
        return user;
      });
      return updatedUserList;
    });

    toast({
      title: "User Approved",
      description: "The user registration has been approved.",
    });
  };

  const handleReject = (userId: string) => {
    const users = JSON.parse(localStorage.getItem("mitsUsers") || "[]");
    const updatedUsers = users.map((user: User) => {
      if (user.id === userId) {
        return { ...user, status: "rejected" };
      }
      return user;
    });

    localStorage.setItem("mitsUsers", JSON.stringify(updatedUsers));
    
    // Update state
    setPendingUsers(pendingUsers.filter(user => user.id !== userId));
    setAllUsers(prevUsers => {
      const updatedUserList = prevUsers.map(user => {
        if (user.id === userId) {
          return { ...user, status: "rejected" };
        }
        return user;
      });
      return updatedUserList;
    });

    toast({
      title: "User Rejected",
      description: "The user registration has been rejected.",
      variant: "destructive",
    });
  };

  const handleDeleteListing = (listingId: string) => {
    const updatedListings = listings.filter(listing => listing.id !== listingId);
    localStorage.setItem("mitsListings", JSON.stringify(updatedListings));
    setListings(updatedListings);

    toast({
      title: "Listing Deleted",
      description: "The listing has been deleted successfully.",
      variant: "destructive",
    });
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <Tabs defaultValue="pending">
        <TabsList className="mb-4">
          <TabsTrigger value="pending">
            Pending Approvals {pendingUsers.length > 0 && `(${pendingUsers.length})`}
          </TabsTrigger>
          <TabsTrigger value="users">All Users</TabsTrigger>
          <TabsTrigger value="listings">Listings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle>Pending User Approvals</CardTitle>
              <CardDescription>
                Review and approve/reject new user registrations
              </CardDescription>
            </CardHeader>
            <CardContent>
              {pendingUsers.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No pending approvals
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="py-2 px-4 text-left">Name</th>
                        <th className="py-2 px-4 text-left">Email</th>
                        <th className="py-2 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingUsers.map((user) => (
                        <tr key={user.id} className="border-b">
                          <td className="py-4 px-4">{user.name}</td>
                          <td className="py-4 px-4">{user.email}</td>
                          <td className="py-4 px-4 text-right">
                            <div className="flex justify-end gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleApprove(user.id)}
                              >
                                Approve
                              </Button>
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => handleReject(user.id)}
                              >
                                Reject
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>All Users</CardTitle>
              <CardDescription>Manage registered users</CardDescription>
            </CardHeader>
            <CardContent>
              {allUsers.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No users found
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="py-2 px-4 text-left">Name</th>
                        <th className="py-2 px-4 text-left">Email</th>
                        <th className="py-2 px-4 text-left">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allUsers.map((user) => (
                        <tr key={user.id} className="border-b">
                          <td className="py-4 px-4">{user.name}</td>
                          <td className="py-4 px-4">{user.email}</td>
                          <td className="py-4 px-4">
                            <span
                              className={`inline-block px-2 py-1 rounded-full text-xs ${
                                user.status === "approved"
                                  ? "bg-green-100 text-green-800"
                                  : user.status === "rejected"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {user.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="listings">
          <Card>
            <CardHeader>
              <CardTitle>All Listings</CardTitle>
              <CardDescription>View and manage marketplace listings</CardDescription>
            </CardHeader>
            <CardContent>
              {listings.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No listings found
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="py-2 px-4 text-left">Title</th>
                        <th className="py-2 px-4 text-left">Type</th>
                        <th className="py-2 px-4 text-left">Price</th>
                        <th className="py-2 px-4 text-left">Date</th>
                        <th className="py-2 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {listings.map((listing) => (
                        <tr key={listing.id} className="border-b">
                          <td className="py-4 px-4">{listing.title}</td>
                          <td className="py-4 px-4 capitalize">{listing.type}</td>
                          <td className="py-4 px-4">
                            {listing.price > 0 ? `₹${listing.price}` : 'Free'}
                          </td>
                          <td className="py-4 px-4">
                            {new Date(listing.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-4 px-4 text-right">
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => handleDeleteListing(listing.id)}
                            >
                              Delete
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
