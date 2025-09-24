import { useState, useEffect } from "react";
import { Search, X, Calendar, User, Tag } from "lucide-react";
import { Input } from "src/components/ui/input";
import { Button } from "src/components/ui/button";
import { Card, CardContent } from "src/components/ui/card";
import { Badge } from "src/components/ui/badge";
import { ChatMessageWithSender } from "@shared/schema";
import { formatTime, formatDate } from "src/lib/utils";

interface MessageSearchProps {
  messages: ChatMessageWithSender[];
  onMessageSelect: (messageId: number) => void;
  isOpen: boolean;
  onClose: () => void;
}

interface SearchResult {
  message: ChatMessageWithSender;
  matchType: 'content' | 'sender' | 'date';
  snippet: string;
}

export default function MessageSearch({
  messages,
  onMessageSelect,
  isOpen,
  onClose
}: MessageSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchFilters, setSearchFilters] = useState({
    dateRange: 'all',
    sender: 'all',
    messageType: 'all'
  });

  useEffect(() => {
    if (searchQuery.trim()) {
      performSearch(searchQuery);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, messages]);

  const performSearch = (query: string) => {
    const lowercaseQuery = query.toLowerCase();
    const results: SearchResult[] = [];

    messages.forEach(message => {
      const contentMatch = message.message.toLowerCase().includes(lowercaseQuery);
      const senderMatch = message.senderName.toLowerCase().includes(lowercaseQuery);
      
      if (contentMatch || senderMatch) {
        const snippet = getMessageSnippet(message.message, lowercaseQuery);
        
        results.push({
          message,
          matchType: contentMatch ? 'content' : 'sender',
          snippet
        });
      }
    });

    // Sort by relevance (exact matches first, then partial matches)
    results.sort((a, b) => {
      const aExact = a.message.message.toLowerCase() === lowercaseQuery;
      const bExact = b.message.message.toLowerCase() === lowercaseQuery;
      
      if (aExact && !bExact) return -1;
      if (!aExact && bExact) return 1;
      
      // Sort by timestamp (newest first)
      return new Date(b.message.timestamp).getTime() - new Date(a.message.timestamp).getTime();
    });

    setSearchResults(results);
  };

  const getMessageSnippet = (content: string, query: string): string => {
    const index = content.toLowerCase().indexOf(query.toLowerCase());
    if (index === -1) return content.substring(0, 100) + '...';
    
    const start = Math.max(0, index - 30);
    const end = Math.min(content.length, index + query.length + 30);
    
    let snippet = content.substring(start, end);
    if (start > 0) snippet = '...' + snippet;
    if (end < content.length) snippet = snippet + '...';
    
    return snippet;
  };

  const highlightText = (text: string, query: string): string => {
    if (!query.trim()) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark class="bg-yellow-200 px-1 rounded">$1</mark>');
  };

  const getCommonTopics = () => {
    const topics = [
      'career', 'love', 'marriage', 'health', 'finance', 'education',
      'business', 'family', 'travel', 'spiritual', 'gemstone', 'remedy'
    ];
    
    return topics.filter(topic => 
      messages.some(msg => 
        msg.message.toLowerCase().includes(topic)
      )
    );
  };

  const searchByTopic = (topic: string) => {
    setSearchQuery(topic);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-20">
      <Card className="w-full max-w-2xl max-h-[80vh] overflow-hidden">
        <CardContent className="p-0">
          {/* Search Header */}
          <div className="p-4 border-b">
            <div className="flex items-center space-x-2 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search messages, predictions, advice..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  autoFocus
                />
              </div>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Quick Topic Filters */}
            <div className="flex flex-wrap gap-2">
              {getCommonTopics().map(topic => (
                <Badge
                  key={topic}
                  variant="outline"
                  className="cursor-pointer hover:bg-primary/10"
                  onClick={() => searchByTopic(topic)}
                >
                  <Tag className="w-3 h-3 mr-1" />
                  {topic}
                </Badge>
              ))}
            </div>
          </div>

          {/* Search Results */}
          <div className="max-h-96 overflow-y-auto">
            {searchQuery.trim() && (
              <div className="p-4">
                <div className="text-sm text-gray-600 mb-4">
                  {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} found
                </div>

                {searchResults.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Search className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No messages found for "{searchQuery}"</p>
                    <p className="text-sm mt-2">Try searching for topics like "career", "love", or "health"</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {searchResults.map((result) => (
                      <Card
                        key={result.message.id}
                        className="cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => {
                          onMessageSelect(result.message.id);
                          onClose();
                        }}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <User className="w-4 h-4 text-gray-400" />
                              <span className="font-medium text-sm">
                                {result.message.senderName}
                              </span>
                              <Badge variant="outline">
                                {result.matchType}
                              </Badge>
                            </div>
                            <div className="flex items-center space-x-2 text-xs text-gray-500">
                              <Calendar className="w-3 h-3" />
                              {formatDate(new Date(result.message.timestamp))}
                              <span>{formatTime(new Date(result.message.timestamp))}</span>
                            </div>
                          </div>
                          
                          <p 
                            className="text-sm text-gray-700 leading-relaxed"
                            dangerouslySetInnerHTML={{
                              __html: highlightText(result.snippet, searchQuery)
                            }}
                          />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {!searchQuery.trim() && (
              <div className="p-8 text-center text-gray-500">
                <Search className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Search through your consultation history</p>
                <p className="text-sm mt-2">Find specific advice, predictions, or topics discussed</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}