import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from 'src/components/ui/card';
import { Badge } from 'src/components/ui/badge';
import { Button } from 'src/components/ui/button';
import { Mail, RefreshCw, CheckCircle, XCircle, Clock } from 'lucide-react';

interface EmailDeliveryData {
  id: number;
  responseType: string;
  referenceId: number;
  emailSent: boolean;
  respondedBy: string;
  createdAt: string;
  userEmail: string;
  userName: string;
  deliveryStatus: string;
  deliveryColor: string;
}

interface EmailDeliveryResponse {
  success: boolean;
  data: {
    responses: EmailDeliveryData[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export default function EmailDeliveryStatus() {
  const [page, setPage] = useState(1);

  const { data, isLoading, refetch, isRefetching } = useQuery<EmailDeliveryResponse>({
    queryKey: ['/api/admin/email-delivery-status', page],
    refetchInterval: 30000, // Auto-refresh every 30 seconds
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Sent':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'Failed':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variant = status === 'Sent' ? 'default' : 'destructive';
    return (
      <Badge variant={variant} className="flex items-center gap-1">
        {getStatusIcon(status)}
        {status}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Delivery Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <RefreshCw className="h-6 w-6 animate-spin" />
            <span className="ml-2">Loading email delivery status...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const responses = data?.data?.responses || [];
  const pagination = data?.data?.pagination;

  // Calculate delivery statistics
  const totalEmails = responses.length;
  const successfulDeliveries = responses.filter(r => r.emailSent).length;
  const failedDeliveries = totalEmails - successfulDeliveries;
  const deliveryRate = totalEmails > 0 ? ((successfulDeliveries / totalEmails) * 100).toFixed(1) : '0';

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Delivery Status
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isRefetching}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isRefetching ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Delivery Statistics */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{totalEmails}</div>
            <div className="text-sm text-gray-600">Total Emails</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{successfulDeliveries}</div>
            <div className="text-sm text-gray-600">Delivered</div>
          </div>
          <div className="text-center p-3 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">{failedDeliveries}</div>
            <div className="text-sm text-gray-600">Failed</div>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{deliveryRate}%</div>
            <div className="text-sm text-gray-600">Success Rate</div>
          </div>
        </div>

        {/* Email Delivery Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3 font-medium">Type</th>
                <th className="text-left p-3 font-medium">Recipient</th>
                <th className="text-left p-3 font-medium">Email</th>
                <th className="text-left p-3 font-medium">Status</th>
                <th className="text-left p-3 font-medium">Responded By</th>
                <th className="text-left p-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {responses.map((response) => (
                <tr key={response.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    <Badge variant="outline">
                      {response.responseType.toUpperCase()}
                    </Badge>
                  </td>
                  <td className="p-3 font-medium">{response.userName}</td>
                  <td className="p-3 text-blue-600">{response.userEmail}</td>
                  <td className="p-3">{getStatusBadge(response.deliveryStatus)}</td>
                  <td className="p-3">{response.respondedBy}</td>
                  <td className="p-3 text-sm text-gray-600">
                    {formatDate(response.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-600">
              Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
              {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
              {pagination.total} entries
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={pagination.page <= 1}
              >
                Previous
              </Button>
              <span className="text-sm">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => p + 1)}
                disabled={pagination.page >= pagination.totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}

        {responses.length === 0 && (
          <div className="text-center py-8">
            <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Email Records</h3>
            <p className="text-gray-600">No email delivery records found.</p>
          </div>
        )}

        {/* Email Delivery Tips */}
        {failedDeliveries > 0 && (
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h4 className="font-medium text-yellow-800 mb-2">📧 Email Delivery Tips</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Check if emails are going to spam/junk folders</li>
              <li>• Ask users to whitelist support@astrotick.com</li>
              <li>• Verify email addresses are correct</li>
              <li>• Corporate firewalls may block emails</li>
              <li>• Gmail may have delivery delays during peak hours</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}