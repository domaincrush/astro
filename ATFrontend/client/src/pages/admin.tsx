import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "src/components/ui/card";
import { Button } from "src/components/ui/button";
import { Badge } from "src/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "src/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "src/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "src/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "src/components/ui/form";
import { Input } from "src/components/ui/input";
import { Textarea } from "src/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "src/components/ui/select";
import { useToast } from "src/hooks/use-toast";
import { apiRequest } from "src/lib/queryClient";
import { formatDate, formatPrice } from "src/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertAstrologerSchema } from "@shared/schema";
import type { Astrologer, ArticleWithAuthor, Category } from "@shared/schema";
import { z } from "zod";
import { 
  Users, 
  Star, 
  UserCheck, 
  Shield, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  UserX,
  BarChart3,
  TrendingUp,
  DollarSign,
  Award,
  Clock,
  Calendar,
  ToggleLeft,
  ToggleRight,
  FileText,
  User
} from "lucide-react";

import AstroTickHeader from "src/components/layout/AstroTickHeader";

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}



type AstrologerFormData = {
  name: string;
  email: string;
  experience: number;
  specializations: string;
  languages: string;
  description: string;
  ratePerMinute: number;
  image: string;
  availableFrom?: string;
  availableTo?: string;
};

export default function Admin() {
  const [activeTab, setActiveTab] = useState("users");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingAstrologer, setEditingAstrologer] = useState<Astrologer | null>(null);
  const [viewingStats, setViewingStats] = useState<number | null>(null);
  const [isCreateArticleOpen, setIsCreateArticleOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<ArticleWithAuthor | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<AstrologerFormData>({
    defaultValues: {
      name: "",
      email: "",
      experience: 0,
      specializations: "",
      languages: "",
      description: "",
      ratePerMinute: 0,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      availableFrom: "",
      availableTo: "",
    },
  });

  // Check if user is admin
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  if (currentUser.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-red-600">Access Denied</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-gray-600">
              You don't have permission to access this page.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ["/api/admin/users"],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/admin/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch users");
      return response.json();
    },
  });

  const { data: pendingAstrologers, isLoading: astrologersLoading } = useQuery({
    queryKey: ["/api/admin/astrologers/pending"],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/admin/astrologers/pending", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch pending astrologers");
      return response.json();
    },
  });

  const { data: allAstrologers, isLoading: allAstrologersLoading } = useQuery({
    queryKey: ["/api/admin/astrologers"],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/admin/astrologers", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch astrologers");
      return response.json();
    },
  });

  const { data: astrologerStats } = useQuery({
    queryKey: ["/api/admin/astrologers", viewingStats, "stats"],
    queryFn: async () => {
      if (!viewingStats) return null;
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/admin/astrologers/${viewingStats}/stats`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch astrologer stats");
      return response.json();
    },
    enabled: !!viewingStats,
  });

  const updateUserStatusMutation = useMutation({
    mutationFn: async ({ userId, isActive }: { userId: number; isActive: boolean }) => {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/admin/users/${userId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isActive }),
      });
      if (!response.ok) throw new Error("Failed to update user status");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({
        title: "User status updated",
        description: "User status has been successfully updated.",
      });
    },
    onError: () => {
      toast({
        title: "Update failed",
        description: "Failed to update user status.",
        variant: "destructive",
      });
    },
  });

  const approveAstrologerMutation = useMutation({
    mutationFn: async (astrologerId: number) => {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/admin/astrologers/${astrologerId}/approve`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to approve astrologer");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/astrologers/pending"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/astrologers"] });
      toast({
        title: "Astrologer approved",
        description: "Astrologer has been successfully approved.",
      });
    },
    onError: () => {
      toast({
        title: "Approval failed",
        description: "Failed to approve astrologer.",
        variant: "destructive",
      });
    },
  });

  const rejectAstrologerMutation = useMutation({
    mutationFn: async (astrologerId: number) => {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/admin/astrologers/${astrologerId}/reject`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to reject astrologer");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/astrologers/pending"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/astrologers"] });
      toast({
        title: "Astrologer rejected",
        description: "Astrologer has been rejected.",
      });
    },
    onError: () => {
      toast({
        title: "Rejection failed",
        description: "Failed to reject astrologer.",
        variant: "destructive",
      });
    },
  });

  const createAstrologerMutation = useMutation({
    mutationFn: async (data: AstrologerFormData) => {
      const token = localStorage.getItem("token");
      const astrologerData = {
        ...data,
        specializations: data.specializations.split(',').map(s => s.trim()),
        languages: data.languages.split(',').map(s => s.trim()),
      };
      const response = await fetch("/api/admin/astrologers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(astrologerData),
      });
      if (!response.ok) throw new Error("Failed to create astrologer");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/astrologers"] });
      setIsCreateDialogOpen(false);
      form.reset();
      toast({
        title: "Astrologer created",
        description: "New astrologer has been successfully created.",
      });
    },
    onError: () => {
      toast({
        title: "Creation failed",
        description: "Failed to create astrologer.",
        variant: "destructive",
      });
    },
  });

  const updateAstrologerMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<AstrologerFormData> }) => {
      const token = localStorage.getItem("token");
      const astrologerData = {
        ...data,
        ...(data.specializations && {
          specializations: data.specializations.split(',').map(s => s.trim()),
        }),
        ...(data.languages && {
          languages: data.languages.split(',').map(s => s.trim()),
        }),
      };
      const response = await fetch(`/api/admin/astrologers/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(astrologerData),
      });
      if (!response.ok) throw new Error("Failed to update astrologer");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/astrologers"] });
      setEditingAstrologer(null);
      form.reset();
      toast({
        title: "Astrologer updated",
        description: "Astrologer has been successfully updated.",
      });
    },
    onError: () => {
      toast({
        title: "Update failed",
        description: "Failed to update astrologer.",
        variant: "destructive",
      });
    },
  });

  const deleteAstrologerMutation = useMutation({
    mutationFn: async (astrologerId: number) => {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/admin/astrologers/${astrologerId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to delete astrologer");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/astrologers"] });
      toast({
        title: "Astrologer deleted",
        description: "Astrologer has been successfully deleted.",
      });
    },
    onError: () => {
      toast({
        title: "Deletion failed",
        description: "Failed to delete astrologer.",
        variant: "destructive",
      });
    },
  });

  const updateAstrologerStatusMutation = useMutation({
    mutationFn: async ({ astrologerId, isOnline }: { astrologerId: number; isOnline: boolean }) => {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/admin/astrologers/${astrologerId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isOnline }),
      });
      if (!response.ok) throw new Error("Failed to update astrologer status");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/astrologers"] });
      toast({
        title: "Status updated",
        description: "Astrologer status has been successfully updated.",
      });
    },
    onError: () => {
      toast({
        title: "Update failed",
        description: "Failed to update astrologer status.",
        variant: "destructive",
      });
    },
  });

  const handleUserStatusToggle = (userId: number, currentStatus: boolean) => {
    updateUserStatusMutation.mutate({ userId, isActive: !currentStatus });
  };

  const handleApproveAstrologer = (astrologerId: number) => {
    approveAstrologerMutation.mutate(astrologerId);
  };

  const handleRejectAstrologer = (astrologerId: number) => {
    rejectAstrologerMutation.mutate(astrologerId);
  };

  const handleCreateAstrologer = (data: AstrologerFormData) => {
    createAstrologerMutation.mutate(data);
  };

  const handleEditAstrologer = (astrologer: Astrologer) => {
    setEditingAstrologer(astrologer);
    form.reset({
      name: astrologer.name,
      email: astrologer.email || "",
      experience: astrologer.experience,
      specializations: astrologer.specializations.join(', '),
      languages: astrologer.languages.join(', '),
      description: astrologer.description,
      ratePerMinute: astrologer.ratePerMinute,
      image: astrologer.image,
      availableFrom: astrologer.availableFrom || "",
      availableTo: astrologer.availableTo || "",
    });
  };

  const handleUpdateAstrologer = (data: AstrologerFormData) => {
    if (editingAstrologer) {
      updateAstrologerMutation.mutate({ id: editingAstrologer.id, data });
    }
  };

  const handleDeleteAstrologer = (astrologerId: number) => {
    if (confirm("Are you sure you want to delete this astrologer? This action cannot be undone.")) {
      deleteAstrologerMutation.mutate(astrologerId);
    }
  };

  const handleViewStats = (astrologerId: number) => {
    setViewingStats(astrologerId);
  };

  const handleAstrologerStatusToggle = (astrologerId: number, currentStatus: boolean) => {
    updateAstrologerStatusMutation.mutate({ astrologerId, isOnline: !currentStatus });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <AstroTickHeader />
      {/* Header Section */}
      {/*
      <section className="bg-gradient-to-br from-orange-600 via-amber-600 to-yellow-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-purple-100">Manage users and astrologers</p>
        </div>
      </section>
      */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users?.length || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {users?.filter((u: User) => u.isActive).length || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingAstrologers?.length || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Admin Users</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {users?.filter((u: User) => u.role === "admin").length || 0}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="astrologers">All Astrologers</TabsTrigger>
            <TabsTrigger value="pending">Pending Approvals</TabsTrigger>
            <TabsTrigger value="articles">Articles</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
              </CardHeader>
              <CardContent>
                {usersLoading ? (
                  <div className="text-center py-8">Loading users...</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Username</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users?.map((user: User) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.username}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                              {user.role}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Badge variant={user.isActive ? "default" : "destructive"}>
                                {user.isActive ? "Active" : "Inactive"}
                              </Badge>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleUserStatusToggle(user.id, user.isActive)}
                                disabled={updateUserStatusMutation.isPending}
                                className="h-6 px-2"
                              >
                                {user.isActive ? (
                                  <ToggleRight className="h-4 w-4 text-green-600" />
                                ) : (
                                  <ToggleLeft className="h-4 w-4 text-gray-400" />
                                )}
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell>{formatDate(new Date(user.createdAt))}</TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUserStatusToggle(user.id, user.isActive)}
                              disabled={updateUserStatusMutation.isPending}
                            >
                              {user.isActive ? "Deactivate" : "Activate"}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="astrologers">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Astrologer Management</CardTitle>
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="gap-2">
                      <Plus className="h-4 w-4" />
                      Add Astrologer
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Create New Astrologer</DialogTitle>
                      <DialogDescription>
                        Add a new astrologer to the platform. Fill in all required fields to create the profile.
                      </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(handleCreateAstrologer)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                  <Input type="email" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="experience"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Experience (years)</FormLabel>
                                <FormControl>
                                  <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="ratePerMinute"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Rate per Minute (₹)</FormLabel>
                                <FormControl>
                                  <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <FormField
                          control={form.control}
                          name="specializations"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Specializations (comma-separated)</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Vedic Astrology, Tarot Reading, Numerology" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="languages"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Languages (comma-separated)</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Hindi, English, Bengali" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Description</FormLabel>
                              <FormControl>
                                <Textarea {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="availableFrom"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Available From</FormLabel>
                                <FormControl>
                                  <Input type="time" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="availableTo"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Available To</FormLabel>
                                <FormControl>
                                  <Input type="time" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button type="submit" disabled={createAstrologerMutation.isPending}>
                            Create Astrologer
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                {allAstrologersLoading ? (
                  <div className="text-center py-8">Loading astrologers...</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Astrologer</TableHead>
                        <TableHead>Experience</TableHead>
                        <TableHead>Rating</TableHead>
                        <TableHead>Rate</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Consultations</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {allAstrologers?.map((astrologer: Astrologer) => (
                        <TableRow key={astrologer.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <img
                                src={astrologer.image}
                                alt={astrologer.name}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                              <div>
                                <div className="font-medium">{astrologer.name}</div>
                                <div className="text-sm text-gray-500">
                                  {astrologer.specializations.slice(0, 2).join(', ')}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{astrologer.experience} years</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span>{astrologer.rating}</span>
                            </div>
                          </TableCell>
                          <TableCell>₹{astrologer.ratePerMinute}/min</TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-2">
                              <Badge variant={astrologer.isApproved ? "default" : "secondary"}>
                                {astrologer.isApproved ? "Approved" : "Pending"}
                              </Badge>
                              <div className="flex items-center gap-2">
                                <Badge variant={astrologer.isOnline ? "default" : "outline"}>
                                  {astrologer.isOnline ? "Online" : "Offline"}
                                </Badge>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleAstrologerStatusToggle(astrologer.id, astrologer.isOnline)}
                                  disabled={updateAstrologerStatusMutation.isPending}
                                  className="h-6 px-2 text-xs"
                                >
                                  {astrologer.isOnline ? "Set Offline" : "Set Online"}
                                </Button>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{astrologer.totalConsultations}</TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewStats(astrologer.id)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditAstrologer(astrologer)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteAstrologer(astrologer.id)}
                                disabled={deleteAstrologerMutation.isPending}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>

            {/* Edit Astrologer Dialog */}
            <Dialog open={!!editingAstrologer} onOpenChange={() => setEditingAstrologer(null)}>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Edit Astrologer</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleUpdateAstrologer)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="experience"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Experience (years)</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="ratePerMinute"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Rate per Minute (₹)</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex justify-end gap-2">
                      <Button type="button" variant="outline" onClick={() => setEditingAstrologer(null)}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={updateAstrologerMutation.isPending}>
                        Update Astrologer
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>

            {/* Stats Dialog */}
            <Dialog open={!!viewingStats} onOpenChange={() => setViewingStats(null)}>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>Astrologer Performance Analytics</DialogTitle>
                </DialogHeader>
                {astrologerStats && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm text-gray-600">Total Consultations</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{astrologerStats.totalConsultations}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm text-gray-600">Total Revenue</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{formatPrice(astrologerStats.totalRevenue)}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm text-gray-600">Average Rating</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{astrologerStats.averageRating.toFixed(1)}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm text-gray-600">Avg Session (min)</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{Math.round(astrologerStats.averageSessionDuration)}</div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </TabsContent>

          <TabsContent value="pending">
            <Card>
              <CardHeader>
                <CardTitle>Pending Astrologer Approvals</CardTitle>
              </CardHeader>
              <CardContent>
                {astrologersLoading ? (
                  <div className="text-center py-8">Loading astrologers...</div>
                ) : pendingAstrologers?.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No pending astrologer approvals
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Experience</TableHead>
                        <TableHead>Rating</TableHead>
                        <TableHead>Reviews</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pendingAstrologers?.map((astrologer: Astrologer) => (
                        <TableRow key={astrologer.id}>
                          <TableCell className="font-medium">{astrologer.name}</TableCell>
                          <TableCell>{astrologer.experience} years</TableCell>
                          <TableCell>{astrologer.rating}</TableCell>
                          <TableCell>{astrologer.reviewCount}</TableCell>
                          <TableCell>{formatDate(new Date(astrologer.createdAt))}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                onClick={() => handleApproveAstrologer(astrologer.id)}
                                disabled={approveAstrologerMutation.isPending}
                                size="sm"
                              >
                                <UserCheck className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() => handleRejectAstrologer(astrologer.id)}
                                disabled={rejectAstrologerMutation.isPending}
                                size="sm"
                              >
                                <UserX className="h-4 w-4 mr-1" />
                                Reject
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid gap-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Astrologers</CardTitle>
                    <Award className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{allAstrologers?.length || 0}</div>
                    <p className="text-xs text-muted-foreground">
                      +{allAstrologers?.filter((a: Astrologer) => a.isApproved).length || 0} approved
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Online Now</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {allAstrologers?.filter((a: Astrologer) => a.isOnline).length || 0}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Available for consultations
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
                    <Star className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {allAstrologers?.length ? 
                        (allAstrologers.reduce((sum: number, a: Astrologer) => sum + parseFloat(a.rating), 0) / allAstrologers.length).toFixed(1) : 
                        '0.0'
                      }
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Platform average
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Top Performing Astrologers</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Rank</TableHead>
                        <TableHead>Astrologer</TableHead>
                        <TableHead>Consultations</TableHead>
                        <TableHead>Rating</TableHead>
                        <TableHead>Earnings</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {allAstrologers
                        ?.filter((a: Astrologer) => a.isApproved)
                        ?.sort((a: Astrologer, b: Astrologer) => b.totalConsultations - a.totalConsultations)
                        ?.slice(0, 5)
                        ?.map((astrologer: Astrologer, index: number) => (
                          <TableRow key={astrologer.id}>
                            <TableCell>#{index + 1}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <img
                                  src={astrologer.image}
                                  alt={astrologer.name}
                                  className="w-8 h-8 rounded-full object-cover"
                                />
                                {astrologer.name}
                              </div>
                            </TableCell>
                            <TableCell>{astrologer.totalConsultations}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                {astrologer.rating}
                              </div>
                            </TableCell>
                            <TableCell>{formatPrice(astrologer.totalEarnings)}</TableCell>
                          </TableRow>
                        )) || (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                            No astrologer data available
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="articles">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Article Management</CardTitle>
                  <Button onClick={() => window.open('/admin-articles', '_blank')} className="bg-purple-600 hover:bg-purple-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Manage Articles
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Article Management</h3>
                  <p className="text-gray-600 mb-4">Create and manage SEO-optimized blog articles to drive organic traffic</p>
                  <Button onClick={() => window.open('/admin-articles', '_blank')} className="bg-purple-600 hover:bg-purple-700">
                    Open Article Manager
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}