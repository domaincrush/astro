import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "src/components/ui/card";
import { Button } from "src/components/ui/button";
import { Input } from "src/components/ui/input";
import { Textarea } from "src/components/ui/textarea";
import { Badge } from "src/components/ui/badge";
import { Label } from "src/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "src/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "src/components/ui/dialog";
import { useToast } from "src/hooks/use-toast";
import { Trash2, Edit, Plus, Users, ArrowRight, AlertCircle, CheckCircle, Brain } from "lucide-react";
import { apiRequest } from "src/lib/queryClient";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "src/components/ui/tabs";
import { Phase3Dashboard } from './Phase3Dashboard';

interface Astrologer {
  id: number;
  name: string;
  isOnline: boolean;
  isActive: boolean;
  specializations: string[];
  languages: string[];
  rating: number;
}

interface ChatRouting {
  id: number;
  originalAstrologerId: number;
  assignedAstrologerId: number;
  reason: string;
  priority: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  originalAstrologer?: Astrologer;
  assignedAstrologer?: Astrologer;
}

interface RoutingResponse {
  success: boolean;
  routings: ChatRouting[];
  onlineAstrologers: Astrologer[];
}

export function AdminChatRoutingDashboard() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingRouting, setEditingRouting] = useState<ChatRouting | null>(null);
  const [formData, setFormData] = useState({
    originalAstrologerId: "",
    assignedAstrologerId: "", 
    reason: "",
    priority: 1
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch chat routings and online astrologers
  const { data: routingData, isLoading } = useQuery<RoutingResponse>({
    queryKey: ["/api/admin/chat-routing"],
  });

  // Create routing mutation
  const createRoutingMutation = useMutation({
    mutationFn: (data: any) => apiRequest("/api/admin/chat-routing", {
      method: "POST",
      body: JSON.stringify(data),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/chat-routing"] });
      setIsCreateDialogOpen(false);
      resetForm();
      toast({
        title: "Success",
        description: "Chat routing rule created successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create routing rule",
        variant: "destructive",
      });
    },
  });

  // Update routing mutation
  const updateRoutingMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => 
      apiRequest(`/api/admin/chat-routing/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/chat-routing"] });
      setIsEditDialogOpen(false);
      setEditingRouting(null);
      resetForm();
      toast({
        title: "Success",
        description: "Chat routing rule updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update routing rule",
        variant: "destructive",
      });
    },
  });

  // Delete routing mutation
  const deleteRoutingMutation = useMutation({
    mutationFn: (id: number) => apiRequest(`/api/admin/chat-routing/${id}`, {
      method: "DELETE",
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/chat-routing"] });
      toast({
        title: "Success",
        description: "Chat routing rule deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error", 
        description: error.message || "Failed to delete routing rule",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      originalAstrologerId: "",
      assignedAstrologerId: "",
      reason: "",
      priority: 1
    });
  };

  const handleCreate = () => {
    if (!formData.originalAstrologerId || !formData.assignedAstrologerId) {
      toast({
        title: "Error",
        description: "Please select both original and assigned astrologers",
        variant: "destructive",
      });
      return;
    }

    createRoutingMutation.mutate({
      originalAstrologerId: parseInt(formData.originalAstrologerId),
      assignedAstrologerId: parseInt(formData.assignedAstrologerId),
      reason: formData.reason,
      priority: formData.priority
    });
  };

  const handleEdit = (routing: ChatRouting) => {
    setEditingRouting(routing);
    setFormData({
      originalAstrologerId: routing.originalAstrologerId.toString(),
      assignedAstrologerId: routing.assignedAstrologerId.toString(),
      reason: routing.reason,
      priority: routing.priority
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = () => {
    if (!editingRouting) return;

    updateRoutingMutation.mutate({
      id: editingRouting.id,
      data: {
        assignedAstrologerId: parseInt(formData.assignedAstrologerId),
        reason: formData.reason,
        priority: formData.priority,
        isActive: editingRouting.isActive
      }
    });
  };

  const handleToggleActive = (routing: ChatRouting) => {
    updateRoutingMutation.mutate({
      id: routing.id,
      data: {
        assignedAstrologerId: routing.assignedAstrologerId,
        reason: routing.reason,
        priority: routing.priority,
        isActive: !routing.isActive
      }
    });
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this routing rule?")) {
      deleteRoutingMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  const routings = routingData?.routings || [];
  const onlineAstrologers = routingData?.onlineAstrologers || [];
  const activeRoutings = routings.filter(r => r.isActive);

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Chat Routing Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage astrologer chat assignments transparently</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Create Routing Rule
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create Chat Routing Rule</DialogTitle>
              <DialogDescription>
                Route chats from one astrologer to another transparently
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="originalAstrologer">Original Astrologer</Label>
                <Select value={formData.originalAstrologerId} onValueChange={(value) => 
                  setFormData(prev => ({ ...prev, originalAstrologerId: value }))
                }>
                  <SelectTrigger>
                    <SelectValue placeholder="Select original astrologer" />
                  </SelectTrigger>
                  <SelectContent>
                    {onlineAstrologers.map((astrologer) => (
                      <SelectItem key={astrologer.id} value={astrologer.id.toString()}>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${astrologer.isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
                          {astrologer.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="assignedAstrologer">Assigned Astrologer</Label>
                <Select value={formData.assignedAstrologerId} onValueChange={(value) => 
                  setFormData(prev => ({ ...prev, assignedAstrologerId: value }))
                }>
                  <SelectTrigger>
                    <SelectValue placeholder="Select assigned astrologer" />
                  </SelectTrigger>
                  <SelectContent>
                    {onlineAstrologers
                      .filter(a => a.id.toString() !== formData.originalAstrologerId)
                      .map((astrologer) => (
                      <SelectItem key={astrologer.id} value={astrologer.id.toString()}>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${astrologer.isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
                          {astrologer.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="reason">Reason</Label>
                <Textarea
                  placeholder="Enter reason for routing (e.g., astrologer on break, specialized consultation needed)"
                  value={formData.reason}
                  onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="priority">Priority (1-10)</Label>
                <Input
                  type="number"
                  min="1"
                  max="10"
                  value={formData.priority}
                  onChange={(e) => setFormData(prev => ({ ...prev, priority: parseInt(e.target.value) || 1 }))}
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={handleCreate} disabled={createRoutingMutation.isPending}>
                  {createRoutingMutation.isPending ? "Creating..." : "Create Rule"}
                </Button>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Routings</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeRoutings.length}</div>
            <p className="text-xs text-muted-foreground">Currently active rules</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Online Astrologers</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{onlineAstrologers.filter(a => a.isOnline).length}</div>
            <p className="text-xs text-muted-foreground">Available for routing</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Rules</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{routings.length}</div>
            <p className="text-xs text-muted-foreground">All routing rules</p>
          </CardContent>
        </Card>
      </div>

      {/* Routing Rules */}
      <Card>
        <CardHeader>
          <CardTitle>Chat Routing Rules</CardTitle>
          <CardDescription>
            Manage transparent chat routing between astrologers. Users will see the original astrologer's name.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {routings.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p>No routing rules configured</p>
              <p className="text-sm">Create your first routing rule to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {routings.map((routing) => (
                <div
                  key={routing.id}
                  className={`border rounded-lg p-4 ${routing.isActive ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{routing.originalAstrologer?.name || 'Unknown'}</span>
                        <ArrowRight className="w-4 h-4 text-gray-400" />
                        <span className="font-medium text-blue-600">{routing.assignedAstrologer?.name || 'Unknown'}</span>
                      </div>
                      <Badge variant={routing.isActive ? "default" : "secondary"}>
                        {routing.isActive ? "Active" : "Inactive"}
                      </Badge>
                      <Badge variant="outline">Priority {routing.priority}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleActive(routing)}
                        disabled={updateRoutingMutation.isPending}
                      >
                        {routing.isActive ? "Deactivate" : "Activate"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(routing)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(routing.id)}
                        disabled={deleteRoutingMutation.isPending}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  {routing.reason && (
                    <p className="text-sm text-gray-600 mt-2">{routing.reason}</p>
                  )}
                  <div className="text-xs text-gray-500 mt-2">
                    Created: {new Date(routing.createdAt).toLocaleString()}
                    {routing.updatedAt !== routing.createdAt && (
                      <span> • Updated: {new Date(routing.updatedAt).toLocaleString()}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Chat Routing Rule</DialogTitle>
            <DialogDescription>
              Update routing assignment and settings
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Original Astrologer</Label>
              <Input
                value={editingRouting?.originalAstrologer?.name || ''}
                disabled
                className="bg-gray-100"
              />
            </div>

            <div>
              <Label htmlFor="assignedAstrologer">Assigned Astrologer</Label>
              <Select value={formData.assignedAstrologerId} onValueChange={(value) => 
                setFormData(prev => ({ ...prev, assignedAstrologerId: value }))
              }>
                <SelectTrigger>
                  <SelectValue placeholder="Select assigned astrologer" />
                </SelectTrigger>
                <SelectContent>
                  {onlineAstrologers
                    .filter(a => a.id.toString() !== formData.originalAstrologerId)
                    .map((astrologer) => (
                    <SelectItem key={astrologer.id} value={astrologer.id.toString()}>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${astrologer.isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
                        {astrologer.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="reason">Reason</Label>
              <Textarea
                placeholder="Enter reason for routing"
                value={formData.reason}
                onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="priority">Priority (1-10)</Label>
              <Input
                type="number"
                min="1"
                max="10"
                value={formData.priority}
                onChange={(e) => setFormData(prev => ({ ...prev, priority: parseInt(e.target.value) || 1 }))}
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button onClick={handleUpdate} disabled={updateRoutingMutation.isPending}>
                {updateRoutingMutation.isPending ? "Updating..." : "Update Rule"}
              </Button>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}