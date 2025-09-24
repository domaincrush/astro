import React from "react";
import { Card, CardContent } from "src/components/ui/card";
import { Badge } from "src/components/ui/badge";
import {
  User,
  Mail,
  Phone,
  MessageSquare,
  AlertCircle,
  Download,
} from "lucide-react";

interface FAQTableProps {
  faqQuestions: any[];
  responses: any[];
  isLoading: boolean;
  error: any;
}

export function FAQTable({
  faqQuestions,
  responses,
  isLoading,
  error,
}: FAQTableProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getResponsesForQuestion = (questionId: number) => {
    return responses.filter(
      (response: any) =>
        response.responseType === "faq" && response.referenceId === questionId,
    );
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-32 mx-auto"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-6 text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-700">
            Error Loading FAQ Data
          </h3>
          <p className="text-red-600 mt-2">
            Unable to fetch FAQ questions and responses
          </p>
        </CardContent>
      </Card>
    );
  }

  const pendingQuestions = faqQuestions.filter((q) => q.status === "pending");
  const answeredQuestions = faqQuestions.filter((q) => q.status === "answered");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            FAQ Management
          </h2>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">
            User questions with responses in table format
          </p>
        </div>
        <div className="flex gap-2 sm:gap-4 text-sm flex-wrap">
          <div className="bg-yellow-100 px-3 py-2 rounded-lg">
            <span className="text-yellow-800 font-medium">
              Pending: {pendingQuestions.length}
            </span>
          </div>
          <div className="bg-green-100 px-3 py-2 rounded-lg">
            <span className="text-green-800 font-medium">
              Answered: {answeredQuestions.length}
            </span>
          </div>
        </div>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto w-full">
            <table className="w-full min-w-[800px] text-sm">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left p-3 sm:p-4 font-medium text-gray-700">
                    User Name
                  </th>
                  <th className="text-left p-3 sm:p-4 font-medium text-gray-700">
                    Email
                  </th>
                  <th className="text-left p-3 sm:p-4 font-medium text-gray-700">
                    Phone Number
                  </th>
                  <th className="text-left p-3 sm:p-4 font-medium text-gray-700">
                    Free Question
                  </th>
                  <th className="text-left p-3 sm:p-4 font-medium text-gray-700">
                    Paid Questions
                  </th>
                  <th className="text-left p-3 sm:p-4 font-medium text-gray-700">
                    Responses
                  </th>
                </tr>
              </thead>
              <tbody>
                {faqQuestions.map((question: any) => {
                  const userResponses = getResponsesForQuestion(question.id);
                  const paidQuestions: string[] = [];
                  if (question.additionalQuestion1)
                    paidQuestions.push(question.additionalQuestion1);
                  if (question.additionalQuestion2)
                    paidQuestions.push(question.additionalQuestion2);

                  return (
                    <tr
                      key={question.id}
                      className={`border-b hover:bg-gray-50 ${
                        question.status === "answered" ? "bg-green-50" : ""
                      }`}
                    >
                      {/* User */}
                      <td className="p-3 sm:p-4">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-500 shrink-0" />
                          <span className="font-medium break-words">
                            {question.name || "N/A"}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {formatDate(question.createdAt)}
                        </div>
                      </td>

                      {/* Email */}
                      <td className="p-3 sm:p-4">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-gray-500 shrink-0" />
                          <span className="text-sm break-words">
                            {question.email || "N/A"}
                          </span>
                        </div>
                      </td>

                      {/* Phone */}
                      <td className="p-3 sm:p-4">
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-gray-500 shrink-0" />
                          <span className="text-sm">
                            {question.phone || "N/A"}
                          </span>
                        </div>
                      </td>

                      {/* Free Question */}
                      <td className="p-3 sm:p-4 max-w-xs">
                        <div
                          className="text-sm text-gray-800 line-clamp-3 break-words"
                          title={question.freeQuestion}
                        >
                          {question.freeQuestion || "N/A"}
                        </div>
                      </td>

                      {/* Paid Questions */}
                      <td className="p-3 sm:p-4 max-w-3xl">
                        {paidQuestions.length > 0 ? (
                          <div className="space-y-1">
                            {paidQuestions.map((q, idx) => (
                              <div
                                key={idx}
                                className="text-sm text-blue-800 bg-blue-100 p-2 rounded line-clamp-2 break-words"
                                title={q}
                              >
                                Q{idx + 1}: {q}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-gray-500 text-sm">
                            No paid questions
                          </span>
                        )}
                      </td>

                      {/* Responses */}
                      <td className="p-3 sm:p-4">
                        {userResponses.length > 0 ? (
                          <div className="space-y-2">
                            {userResponses.map((response: any) => (
                              <div
                                key={response.id}
                                className="bg-green-100 p-2 rounded text-sm"
                              >
                                <div className="font-medium text-green-800 mb-1">
                                  {response.responderName || "Admin"}
                                </div>
                                <div
                                  className="text-gray-700 line-clamp-2 break-words max-w-xs"
                                  title={response.responseText}
                                >
                                  {response.responseText}
                                </div>
                                <div className="text-xs text-green-600 mt-1">
                                  {formatDate(response.createdAt)}
                                </div>
                                {response.attachments &&
                                  response.attachments.length > 0 && (
                                    <div className="mt-1">
                                      <Badge
                                        variant="outline"
                                        className="text-xs"
                                      >
                                        <Download className="h-3 w-3 mr-1" />
                                        PDF
                                      </Badge>
                                    </div>
                                  )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <Badge variant="outline" className="text-yellow-600">
                            No Response
                          </Badge>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Empty State */}
            {faqQuestions.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No FAQ questions found</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
