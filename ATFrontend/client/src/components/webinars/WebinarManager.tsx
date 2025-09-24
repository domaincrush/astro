import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "src/components/ui/card";
import { Button } from "src/components/ui/button";
import { Input } from "src/components/ui/input";
import { Label } from "src/components/ui/label";
import { Textarea } from "src/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "src/components/ui/select";
import { Badge } from "src/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "src/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "src/components/ui/avatar";
import { 
  Video, 
  Users, 
  Calendar, 
  Clock, 
  Play,
  StopCircle,
  Plus,
  Edit,
  Eye
} from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "src/lib/queryClient";
import { useToast } from "src/hooks/use-toast";

interface Webinar {
  id: number;
  title: string;
  description: string;
  hostId: number;
  hostName: string;
  hostImage?: string;
  scheduledDate: string;
  duration: number;
  maxParticipants?: number;
  price: number;
  status: 'scheduled' | 'live' | 'completed' | 'cancelled';
  meetingUrl?: string;
  recordingUrl?: string;
  language: string;
  registeredCount: number;
  attendedCount?: number;
}

interface WebinarForm {
  title: string;
  description: string;
  scheduledDate: string;
  duration: number;
  maxParticipants?: number;
  price: number;
  language: string;
}

export default function WebinarManager() {
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);
  const [webinarForm, setWebinarForm] = useState<WebinarForm>({
    title: "",
    description: "",
    scheduledDate: "",
    duration: 60,
    price: 0,
    language: "en"
  });

  const { data: webinars, isLoading } = useQuery<Webinar[]>({
    queryKey: ["/api/webinars"],
    retry: false,
  });

  const createWebinarMutation = useMutation({
    mutationFn: async (webinar: WebinarForm) => {
      return await apiRequest("/api/webinars", "POST", webinar);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/webinars"] });
      toast({
        title: "Webinar created successfully",
        description: "Your webinar has been scheduled.",
      });
      setIsCreating(false);
      resetForm();
    },
    onError: () => {
      toast({
        title: "Error creating webinar",
        description: "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setWebinarForm({
      title: "",
      description: "",
      scheduledDate: "",
      duration: 60,
      price: 0,
      language: "en"
    });
  };

  const handleCreateWebinar = () => {
    createWebinarMutation.mutate(webinarForm);
  };

  const getStatusColor = (status: Webinar['status']) => {
    const colors = {
      scheduled: "bg-blue-100 text-blue-800",
      live: "bg-green-100 text-green-800",
      completed: "bg-gray-100 text-gray-800",
      cancelled: "bg-red-100 text-red-800"
    };
    return colors[status];
  };

  const formatPrice = (price: number) => {
    return price === 0 ? "Free" : `₹${(price / 100).toFixed(0)}`;
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Webinar Manager</h1>
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Schedule Webinar
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Webinars</p>
                <p className="text-2xl font-bold">{webinars?.length || 0}</p>
              </div>
              <Video className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Live Now</p>
                <p className="text-2xl font-bold">
                  {webinars?.filter(w => w.status === 'live').length || 0}
                </p>
              </div>
              <Play className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Registrations</p>
                <p className="text-2xl font-bold">
                  {webinars?.reduce((sum, w) => sum + w.registeredCount, 0) || 0}
                </p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Upcoming</p>
                <p className="text-2xl font-bold">
                  {webinars?.filter(w => w.status === 'scheduled').length || 0}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create Form */}
      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>Schedule New Webinar</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="webinar-title">Webinar Title</Label>
                <Input
                  id="webinar-title"
                  value={webinarForm.title}
                  onChange={(e) => setWebinarForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter webinar title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="scheduled-date">Scheduled Date & Time</Label>
                <Input
                  id="scheduled-date"
                  type="datetime-local"
                  value={webinarForm.scheduledDate}
                  onChange={(e) => setWebinarForm(prev => ({ ...prev, scheduledDate: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={webinarForm.description}
                onChange={(e) => setWebinarForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe your webinar content..."
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={webinarForm.duration}
                  onChange={(e) => setWebinarForm(prev => ({ ...prev, duration: parseInt(e.target.value) || 60 }))}
                  min="15"
                  max="480"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="max-participants">Max Participants</Label>
                <Input
                  id="max-participants"
                  type="number"
                  value={webinarForm.maxParticipants || ""}
                  onChange={(e) => setWebinarForm(prev => ({ ...prev, maxParticipants: parseInt(e.target.value) || undefined }))}
                  placeholder="Leave empty for unlimited"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price (₹)</Label>
                <Input
                  id="price"
                  type="number"
                  value={webinarForm.price / 100}
                  onChange={(e) => setWebinarForm(prev => ({ ...prev, price: (parseFloat(e.target.value) || 0) * 100 }))}
                  min="0"
                  step="0.01"
                  placeholder="0 for free"
                />
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Button variant="outline" onClick={() => {
                setIsCreating(false);
                resetForm();
              }}>
                Cancel
              </Button>
              <Button 
                onClick={handleCreateWebinar}
                disabled={createWebinarMutation.isPending}
              >
                {createWebinarMutation.isPending ? "Scheduling..." : "Schedule Webinar"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Webinars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {webinars?.map((webinar) => (
          <Card key={webinar.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="aspect-video bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                <Video className="h-12 w-12 text-white" />
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <Badge className={getStatusColor(webinar.status)}>
                    {webinar.status}
                  </Badge>
                  <span className="text-sm font-semibold text-green-600">
                    {formatPrice(webinar.price)}
                  </span>
                </div>
                
                <h3 className="font-semibold text-lg mb-2">{webinar.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{webinar.description}</p>
                
                <div className="space-y-2 text-xs text-gray-500 mb-4">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-5 w-5">
                      <AvatarImage src={webinar.hostImage} />
                      <AvatarFallback className="text-xs">
                        {webinar.hostName.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span>{webinar.hostName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{webinar.duration} minutes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>{webinar.registeredCount} registered</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  {webinar.status === 'scheduled' && (
                    <Button size="sm" className="flex-1">
                      <Play className="h-4 w-4 mr-1" />
                      Start
                    </Button>
                  )}
                  
                  {webinar.status === 'live' && (
                    <Button size="sm" variant="destructive" className="flex-1">
                      <StopCircle className="h-4 w-4 mr-1" />
                      End
                    </Button>
                  )}

                  <Button size="sm" variant="outline">
                    <Eye className="h-4 w-4" />
                  </Button>

                  <Button size="sm" variant="outline">
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {!webinars?.length && (
          <div className="col-span-full text-center py-12">
            <Video className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold mb-2">No webinars scheduled</h3>
            <p className="text-gray-600 mb-6">Create your first webinar to start engaging with your audience.</p>
            <Button onClick={() => setIsCreating(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Schedule Your First Webinar
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}