import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "src/components/ui/card";
import { Button } from "src/components/ui/button";
import { Input } from "src/components/ui/input";
import { Label } from "src/components/ui/label";
import { Textarea } from "src/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "src/components/ui/select";
import { Badge } from "src/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "src/components/ui/tabs";
import { 
  Mail, 
  Send, 
  Users, 
  Eye, 
  MousePointer, 
  Plus,
  Edit,
  Trash2,
  Play,
  Pause
} from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "src/lib/queryClient";
import { useToast } from "src/hooks/use-toast";

interface EmailCampaign {
  id: number;
  name: string;
  subject: string;
  content: string;
  status: 'draft' | 'sending' | 'sent' | 'paused';
  recipientCount: number;
  openRate: number;
  clickRate: number;
  scheduledAt?: string;
  sentAt?: string;
  createdAt: string;
}

interface CampaignForm {
  name: string;
  subject: string;
  content: string;
  recipientFilter: {
    engagement?: 'high' | 'medium' | 'low' | 'all';
  };
}

export default function EmailCampaignManager() {
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);
  const [campaignForm, setCampaignForm] = useState<CampaignForm>({
    name: "",
    subject: "",
    content: "",
    recipientFilter: { engagement: 'all' }
  });

  const { data: campaigns, isLoading } = useQuery<EmailCampaign[]>({
    queryKey: ["/api/email/campaigns"],
    retry: false,
  });

  const createCampaignMutation = useMutation({
    mutationFn: async (campaign: CampaignForm) => {
      return await apiRequest("/api/email/campaigns", "POST", campaign);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/email/campaigns"] });
      toast({
        title: "Campaign created successfully",
        description: "Your email campaign has been created.",
      });
      setIsCreating(false);
      resetForm();
    },
    onError: () => {
      toast({
        title: "Error creating campaign",
        description: "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setCampaignForm({
      name: "",
      subject: "",
      content: "",
      recipientFilter: { engagement: 'all' }
    });
  };

  const handleCreateCampaign = () => {
    createCampaignMutation.mutate(campaignForm);
  };

  const getStatusColor = (status: EmailCampaign['status']) => {
    const colors = {
      draft: "bg-gray-100 text-gray-800",
      sending: "bg-blue-100 text-blue-800",
      sent: "bg-green-100 text-green-800",
      paused: "bg-yellow-100 text-yellow-800"
    };
    return colors[status];
  };

  const formatPercentage = (num: number) => `${num.toFixed(1)}%`;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
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
        <h1 className="text-3xl font-bold">Email Campaign Manager</h1>
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Campaign
        </Button>
      </div>

      {/* Campaign Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Campaigns</p>
                <p className="text-2xl font-bold">{campaigns?.length || 0}</p>
              </div>
              <Mail className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Sent This Month</p>
                <p className="text-2xl font-bold">
                  {campaigns?.filter(c => c.status === 'sent').length || 0}
                </p>
              </div>
              <Send className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg. Open Rate</p>
                <p className="text-2xl font-bold">
                  {campaigns?.length ? formatPercentage(
                    campaigns.reduce((sum, c) => sum + c.openRate, 0) / campaigns.length
                  ) : '0%'}
                </p>
              </div>
              <Eye className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg. Click Rate</p>
                <p className="text-2xl font-bold">
                  {campaigns?.length ? formatPercentage(
                    campaigns.reduce((sum, c) => sum + c.clickRate, 0) / campaigns.length
                  ) : '0%'}
                </p>
              </div>
              <MousePointer className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create Campaign Form */}
      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Campaign</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="campaign-name">Campaign Name</Label>
                <Input
                  id="campaign-name"
                  value={campaignForm.name}
                  onChange={(e) => setCampaignForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter campaign name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email-subject">Email Subject</Label>
                <Input
                  id="email-subject"
                  value={campaignForm.subject}
                  onChange={(e) => setCampaignForm(prev => ({ ...prev, subject: e.target.value }))}
                  placeholder="Enter email subject"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email-content">Email Content</Label>
              <Textarea
                id="email-content"
                value={campaignForm.content}
                onChange={(e) => setCampaignForm(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Enter your email content here..."
                rows={8}
              />
            </div>

            <div className="space-y-2">
              <Label>Target Audience</Label>
              <Select
                value={campaignForm.recipientFilter.engagement || 'all'}
                onValueChange={(value) => setCampaignForm(prev => ({
                  ...prev,
                  recipientFilter: { ...prev.recipientFilter, engagement: value as any }
                }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="high">High Engagement Users</SelectItem>
                  <SelectItem value="medium">Medium Engagement Users</SelectItem>
                  <SelectItem value="low">Low Engagement Users</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end gap-4">
              <Button variant="outline" onClick={() => {
                setIsCreating(false);
                resetForm();
              }}>
                Cancel
              </Button>
              <Button 
                onClick={handleCreateCampaign}
                disabled={createCampaignMutation.isPending}
              >
                {createCampaignMutation.isPending ? "Creating..." : "Create Campaign"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Campaigns List */}
      <Card>
        <CardHeader>
          <CardTitle>Email Campaigns</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {campaigns?.map((campaign) => (
              <div key={campaign.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold">{campaign.name}</h3>
                    <Badge className={getStatusColor(campaign.status)}>
                      {campaign.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{campaign.subject}</p>
                  <div className="flex items-center gap-6 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {campaign.recipientCount} recipients
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {formatPercentage(campaign.openRate)} open
                    </span>
                    <span className="flex items-center gap-1">
                      <MousePointer className="h-3 w-3" />
                      {formatPercentage(campaign.clickRate)} click
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            
            {!campaigns?.length && (
              <div className="text-center py-12">
                <Mail className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold mb-2">No campaigns yet</h3>
                <p className="text-gray-600 mb-6">Create your first email campaign to engage with your audience.</p>
                <Button onClick={() => setIsCreating(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Campaign
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}