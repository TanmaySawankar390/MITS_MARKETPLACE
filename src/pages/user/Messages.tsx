
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/use-toast";

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

type Conversation = {
  userId: string;
  userName: string;
  listingId: string;
  listingTitle: string;
  lastMessageTime: string;
  unreadCount: number;
};

const Messages = () => {
  const { user } = useAuth();
  const [receivedMessages, setReceivedMessages] = useState<Message[]>([]);
  const [sentMessages, setSentMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [conversationMessages, setConversationMessages] = useState<Message[]>([]);
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const allMessages = JSON.parse(localStorage.getItem("mitsMessages") || "[]");
      
      // Get received and sent messages
      const received = allMessages.filter((msg: Message) => msg.receiverId === user.id);
      const sent = allMessages.filter((msg: Message) => msg.senderId === user.id);
      
      setReceivedMessages(received);
      setSentMessages(sent);
      
      // Mark received messages as read
      const updatedMessages = allMessages.map((msg: Message) => {
        if (msg.receiverId === user.id && !msg.read) {
          return { ...msg, read: true };
        }
        return msg;
      });
      
      localStorage.setItem("mitsMessages", JSON.stringify(updatedMessages));
      
      // Build conversations
      buildConversations(received, sent);
      
      setLoading(false);
    }
  }, [user]);

  // Build list of conversations from messages
  const buildConversations = (received: Message[], sent: Message[]) => {
    const conversationsMap = new Map<string, Conversation>();
    
    // Process received messages
    received.forEach((msg) => {
      const key = `${msg.senderId}-${msg.listingId}`;
      const existing = conversationsMap.get(key);
      
      if (existing) {
        // Update existing conversation
        conversationsMap.set(key, {
          ...existing,
          lastMessageTime: new Date(msg.timestamp) > new Date(existing.lastMessageTime) 
            ? msg.timestamp 
            : existing.lastMessageTime,
          unreadCount: existing.unreadCount + (msg.read ? 0 : 1)
        });
      } else {
        // Create new conversation
        conversationsMap.set(key, {
          userId: msg.senderId,
          userName: msg.senderName,
          listingId: msg.listingId,
          listingTitle: msg.listingTitle,
          lastMessageTime: msg.timestamp,
          unreadCount: msg.read ? 0 : 1
        });
      }
    });
    
    // Process sent messages
    sent.forEach((msg) => {
      const key = `${msg.receiverId}-${msg.listingId}`;
      const existing = conversationsMap.get(key);
      
      if (existing) {
        // Update existing conversation if message is newer
        if (new Date(msg.timestamp) > new Date(existing.lastMessageTime)) {
          conversationsMap.set(key, {
            ...existing,
            lastMessageTime: msg.timestamp
          });
        }
      } else {
        // Create new conversation
        conversationsMap.set(key, {
          userId: msg.receiverId,
          userName: msg.receiverName,
          listingId: msg.listingId,
          listingTitle: msg.listingTitle,
          lastMessageTime: msg.timestamp,
          unreadCount: 0
        });
      }
    });
    
    // Convert map to array and sort by last message time (newest first)
    const conversationsArray = Array.from(conversationsMap.values())
      .sort((a, b) => new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime());
    
    setConversations(conversationsArray);
  };

  // Select a conversation to view
  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    
    // Get messages for this conversation
    const allMessages = JSON.parse(localStorage.getItem("mitsMessages") || "[]");
    const conversationMessages = allMessages.filter((msg: Message) => 
      (msg.senderId === user?.id && msg.receiverId === conversation.userId && msg.listingId === conversation.listingId) ||
      (msg.receiverId === user?.id && msg.senderId === conversation.userId && msg.listingId === conversation.listingId)
    ).sort((a: Message, b: Message) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    
    setConversationMessages(conversationMessages);
    
    // Mark messages as read
    const updatedMessages = allMessages.map((msg: Message) => {
      if (msg.receiverId === user?.id && msg.senderId === conversation.userId && 
          msg.listingId === conversation.listingId && !msg.read) {
        return { ...msg, read: true };
      }
      return msg;
    });
    
    localStorage.setItem("mitsMessages", JSON.stringify(updatedMessages));
    
    // Update unread count in conversations
    setConversations(conversations.map(conv => {
      if (conv.userId === conversation.userId && conv.listingId === conversation.listingId) {
        return { ...conv, unreadCount: 0 };
      }
      return conv;
    }));
  };

  // Send a reply message
  const handleSendReply = () => {
    if (!selectedConversation || !reply.trim()) return;
    
    // Create new message
    const newMessage = {
      id: Date.now().toString(),
      senderId: user?.id,
      senderName: user?.name,
      receiverId: selectedConversation.userId,
      receiverName: selectedConversation.userName,
      listingId: selectedConversation.listingId,
      listingTitle: selectedConversation.listingTitle,
      content: reply,
      timestamp: new Date().toISOString(),
      read: false,
    };
    
    // Update local state
    setConversationMessages([...conversationMessages, newMessage]);
    setSentMessages([...sentMessages, newMessage]);
    
    // Update in localStorage
    const allMessages = JSON.parse(localStorage.getItem("mitsMessages") || "[]");
    allMessages.push(newMessage);
    localStorage.setItem("mitsMessages", JSON.stringify(allMessages));
    
    // Clear reply field
    setReply("");
    
    toast({
      title: "Message Sent",
      description: "Your message has been sent successfully.",
    });
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Messages</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Conversations List */}
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle>Conversations</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {conversations.length === 0 ? (
                <div className="px-4 py-8 text-center text-gray-500">
                  No conversations yet
                </div>
              ) : (
                <ul className="divide-y">
                  {conversations.map((conversation, index) => (
                    <li 
                      key={`${conversation.userId}-${conversation.listingId}`}
                      className={`p-4 cursor-pointer hover:bg-gray-50 ${
                        selectedConversation && 
                        selectedConversation.userId === conversation.userId && 
                        selectedConversation.listingId === conversation.listingId ? 
                          'bg-gray-100' : ''
                      }`}
                      onClick={() => handleSelectConversation(conversation)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{conversation.userName}</p>
                          <p className="text-xs text-gray-500 truncate">
                            {conversation.listingTitle}
                          </p>
                        </div>
                        {conversation.unreadCount > 0 && (
                          <span className="bg-mits-primary text-white text-xs rounded-full px-2 py-1">
                            {conversation.unreadCount}
                          </span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Message Thread */}
        <div className="lg:col-span-3">
          <Card className="h-full flex flex-col">
            {selectedConversation ? (
              <>
                <CardHeader className="pb-2 border-b">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>{selectedConversation.userName}</CardTitle>
                      <CardDescription>
                        Regarding:{" "}
                        <Link 
                          to={`/marketplace/${selectedConversation.listingId}`} 
                          className="text-mits-primary hover:underline"
                        >
                          {selectedConversation.listingTitle}
                        </Link>
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="flex-grow overflow-y-auto p-4 max-h-[500px]">
                  {conversationMessages.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No messages in this conversation yet
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {conversationMessages.map((message) => (
                        <div 
                          key={message.id}
                          className={`max-w-[80%] p-3 rounded-lg ${
                            message.senderId === user?.id ? 
                            'ml-auto bg-mits-primary text-white' : 
                            'mr-auto bg-gray-100'
                          }`}
                        >
                          <p>{message.content}</p>
                          <p className={`text-xs mt-1 ${
                            message.senderId === user?.id ? 
                            'text-white/70' : 'text-gray-500'
                          }`}>
                            {new Date(message.timestamp).toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
                
                <CardFooter className="border-t p-4">
                  <div className="flex w-full space-x-2">
                    <Textarea
                      placeholder="Type your message..."
                      value={reply}
                      onChange={(e) => setReply(e.target.value)}
                      className="flex-grow resize-none"
                    />
                    <Button onClick={handleSendReply} disabled={!reply.trim()}>
                      Send
                    </Button>
                  </div>
                </CardFooter>
              </>
            ) : (
              <div className="flex items-center justify-center h-[500px] text-gray-500">
                Select a conversation to view messages
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Messages;
