import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Save, Settings, Users, Clock, MessageCircle, IndianRupee, Search, Plus } from "lucide-react";
import { Button } from "src/components/ui/button";
import { Input } from "src/components/ui/input";
import { Label } from "src/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "src/components/ui/card";
import { Badge } from "src/components/ui/badge";
import { Separator } from "src/components/ui/separator";
import { Switch } from "src/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "src/components/ui/tabs";
import { apiRequest } from "src/lib/queryClient";
import { useToast } from "src/hooks/use-toast";
import { useLocation } from "wouter";
import AstroTickHeader from "src/components/layout/AstroTickHeader";

interface AdminSetting {
  id: number;
  key: string;
  value: string;
  description: string;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

export default function AdminSettings() {
  const [, setLocation] = useLocation();
  const [pendingChanges, setPendingChanges] = useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [balanceAmount, setBalanceAmount] = useState("");
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Get current user
  const { data: user } = useQuery({
    queryKey: ["/api/auth/me"],
  });

  // Get all admin settings
  const { data: settings = [], isLoading } = useQuery<AdminSetting[]>({
    queryKey: ["/api/admin/settings"],
    enabled: (user as any)?.role === 'admin',
  });

  // Get all users for balance management
  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ["/api/admin/users"],
    enabled: (user as any)?.role === 'admin',
  });

  // Update setting mutation
  const updateSettingMutation = useMutation({
    mutationFn: async ({ key, value }: { key: string; value: string }) => {
      const response = await apiRequest("PUT", `/api/admin/settings/${key}`, { value });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Settings Updated",
        description: "Admin settings have been saved successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/settings"] });
      setPendingChanges({});
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update settings.",
        variant: "destructive",
      });
    },
  });

  // Add balance to user mutation
  const addBalanceMutation = useMutation({
    mutationFn: async ({ userId, amount }: { userId: number; amount: number }) => {
      const response = await apiRequest("PUT", `/api/admin/users/${userId}/balance`, { amount });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Balance Updated",
        description: "User balance has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      setSelectedUserId(null);
      setBalanceAmount("");
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update user balance.",
        variant: "destructive",
      });
    },
  });

  const handleSettingChange = (key: string, value: string) => {
    setPendingChanges(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleAddBalance = () => {
    if (!selectedUserId || !balanceAmount) return;

    const amount = parseFloat(balanceAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid positive amount.",
        variant: "destructive",
      });
      return;
    }

    addBalanceMutation.mutate({ userId: selectedUserId, amount: amount * 100 }); // Convert to paise
  };

  const saveAllChanges = () => {
    Object.entries(pendingChanges).forEach(([key, value]) => {
      updateSettingMutation.mutate({ key, value });
    });
  };

  const getSettingValue = (key: string) => {
    if (pendingChanges[key] !== undefined) {
      return pendingChanges[key];
    }
    const setting = settings.find(s => s.key === key);
    return setting?.value || '';
  };

  const getSettingDescription = (key: string) => {
    const setting = settings.find(s => s.key === key);
    return setting?.description || '';
  };

  if ((user as any)?.role !== 'admin') {
    return (
      <div className="flex items-center justify-center h-screen">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
          <p>This page is only available for administrators.</p>
          <Button onClick={() => setLocation("/")} className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Home
          </Button>
        </Card>
      </div>
    );
  }

  // Filter users based on search query
  const filteredUsers = users.filter((user: any) => 
    user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const chatSettings = settings.filter(s => s.category === 'chat');
  const hasChanges = Object.keys(pendingChanges).length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <AstroTickHeader />

      <div className="max-w-7xl mx-auto p-6">
        <Tabs defaultValue="chat" className="space-y-6">
          <TabsList>
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              Chat Settings
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              User Management
            </TabsTrigger>
            <TabsTrigger value="general" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              General
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Multi-User Chat Configuration
                </CardTitle>
                <CardDescription>
                  Configure how many users astrologers can chat with simultaneously
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Global Maximum Users */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="max_concurrent_users_global">
                      Global Maximum Concurrent Users
                    </Label>
                    <Input
                      id="max_concurrent_users_global"
                      type="number"
                      min="1"
                      max="5"
                      value={getSettingValue('max_concurrent_users_global')}
                      onChange={(e) => handleSettingChange('max_concurrent_users_global', e.target.value)}
                    />
                    <p className="text-sm text-muted-foreground">
                      {getSettingDescription('max_concurrent_users_global')}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="chat_session_timeout">
                      Chat Session Timeout (seconds)
                    </Label>
                    <Input
                      id="chat_session_timeout"
                      type="number"
                      min="600"
                      max="7200"
                      value={getSettingValue('chat_session_timeout')}
                      onChange={(e) => handleSettingChange('chat_session_timeout', e.target.value)}
                    />
                    <p className="text-sm text-muted-foreground">
                      {getSettingDescription('chat_session_timeout')}
                    </p>
                  </div>
                </div>

                <Separator />

                {/* Enable Multi-Chat */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Multi-User Chat</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow astrologers to handle multiple consultations simultaneously
                    </p>
                  </div>
                  <Switch
                    checked={getSettingValue('enable_multi_chat') === 'true'}
                    onCheckedChange={(checked) => 
                      handleSettingChange('enable_multi_chat', checked.toString())
                    }
                  />
                </div>

                <Separator />

                {/* Current Settings Summary */}
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-medium mb-3">Current Configuration</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-blue-500" />
                      <span>Max Users: {getSettingValue('max_concurrent_users_global')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-green-500" />
                      <span>Timeout: {Math.floor(parseInt(getSettingValue('chat_session_timeout')) / 60)}min</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageCircle className="h-4 w-4 text-purple-500" />
                      <span>Multi-Chat: {getSettingValue('enable_multi_chat') === 'true' ? 'Enabled' : 'Disabled'}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Astrologer Limits */}
            <Card>
              <CardHeader>
                <CardTitle>Individual Astrologer Limits</CardTitle>
                <CardDescription>
                  Note: Individual astrologers can have custom limits set in their profiles. 
                  The global setting serves as the maximum allowed limit.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  <p>• Each astrologer can be assigned a custom concurrent user limit (1-{getSettingValue('max_concurrent_users_global')})</p>
                  <p>• If no custom limit is set, they default to the global maximum</p>
                  <p>• Astrologers cannot exceed the global maximum regardless of their individual setting</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  User Balance Management
                </CardTitle>
                <CardDescription>
                  Add balance to user accounts for consultations and services
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Search Users */}
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users by username or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Users List */}
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {usersLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full" />
                    </div>
                  ) : filteredUsers.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      {searchQuery ? 'No users found matching your search.' : 'No users found.'}
                    </div>
                  ) : (
                    filteredUsers.map((user: any) => (
                      <div
                        key={user.id}
                        className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedUserId === user.id 
                            ? 'border-primary bg-primary/5' 
                            : 'border-border hover:border-primary/50'
                        }`}
                        onClick={() => setSelectedUserId(user.id)}
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-full">
                              <Users className="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                              <h3 className="font-medium">{user.username}</h3>
                              <p className="text-sm text-muted-foreground">{user.email}</p>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-2 text-emerald-600 font-medium">
                            <IndianRupee className="h-4 w-4" />
                            {((user.balance || 0) / 100).toFixed(2)}
                          </div>
                          <p className="text-xs text-muted-foreground">Current Balance</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Add Balance Form */}
                {selectedUserId && (
                  <div className="border-t pt-6">
                    <h3 className="font-medium mb-4">Add Balance to Selected User</h3>
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <Label htmlFor="balance-amount">Amount (₹)</Label>
                        <Input
                          id="balance-amount"
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="Enter amount to add"
                          value={balanceAmount}
                          onChange={(e) => setBalanceAmount(e.target.value)}
                        />
                      </div>
                      <div className="flex items-end">
                        <Button
                          onClick={handleAddBalance}
                          disabled={addBalanceMutation.isPending || !balanceAmount}
                          className="flex items-center gap-2"
                        >
                          <Plus className="h-4 w-4" />
                          {addBalanceMutation.isPending ? 'Adding...' : 'Add Balance'}
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Selected user: {filteredUsers.find((u: any) => u.id === selectedUserId)?.username}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>
                  Other platform-wide settings and configurations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center text-muted-foreground py-8">
                  <Settings className="h-12 w-12 mx-auto mb-4" />
                  <p>Additional general settings will be available here in future updates.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}