
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/use-toast";

const categories = [
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

const conditions = [
  "New",
  "Like New",
  "Good",
  "Fair",
  "Poor",
];

const CreateListing = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [type, setType] = useState<"sell" | "rent" | "share">("sell");
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("");
  const [image, setImage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const newListing = {
      id: Date.now().toString(),
      title,
      description,
      price: parseFloat(price) || 0,
      type,
      category,
      condition: type !== "share" ? condition : undefined,
      userId: user?.id,
      userName: user?.name,
      createdAt: new Date().toISOString(),
      image,
    };

    // Save to localStorage
    const listings = JSON.parse(localStorage.getItem("mitsListings") || "[]");
    listings.push(newListing);
    localStorage.setItem("mitsListings", JSON.stringify(listings));

    setIsLoading(false);
    toast({
      title: "Listing Created",
      description: "Your listing has been created successfully.",
    });

    // Redirect to user dashboard
    navigate("/dashboard");
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Create New Listing</h1>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Item Details</CardTitle>
          <CardDescription>
            Provide information about the item you want to sell, rent, or share
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="type">Listing Type</Label>
              <RadioGroup
                id="type"
                value={type}
                onValueChange={(value) => setType(value as "sell" | "rent" | "share")}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="sell" id="sell" />
                  <Label htmlFor="sell">Sell</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="rent" id="rent" />
                  <Label htmlFor="rent">Rent</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="share" id="share" />
                  <Label htmlFor="share">Share</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Item Title</Label>
              <Input
                id="title"
                placeholder="e.g., Data Structures Textbook"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Provide details about your item..."
                className="min-h-[100px]"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={category}
                onValueChange={setCategory}
                required
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price (₹)</Label>
              <Input
                id="price"
                type="number"
                placeholder={type === "share" ? "0 for free items" : "Enter price"}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                min="0"
                step="0.01"
              />
              {type === "rent" && (
                <p className="text-xs text-gray-500">For rental items, specify the price per day/week/month in the description</p>
              )}
            </div>

            {type !== "share" && (
              <div className="space-y-2">
                <Label htmlFor="condition">Condition</Label>
                <Select
                  value={condition}
                  onValueChange={setCondition}
                  required
                >
                  <SelectTrigger id="condition">
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    {conditions.map((cond) => (
                      <SelectItem key={cond} value={cond}>
                        {cond}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="image">Image (Optional)</Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              {image && (
                <div className="mt-2">
                  <p className="text-sm text-gray-500 mb-2">Preview:</p>
                  <img
                    src={image}
                    alt="Preview"
                    className="max-h-[200px] rounded-md"
                  />
                </div>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Listing"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-between flex-col sm:flex-row gap-4">
          <p className="text-sm text-gray-500">
            Your contact information from your profile will be shared with interested users.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CreateListing;
