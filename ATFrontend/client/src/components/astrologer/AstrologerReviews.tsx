import { useState } from "react";
import { Star, ThumbsUp, Clock, Verified } from "lucide-react";
import { Card, CardContent } from "src/components/ui/card";
import { Button } from "src/components/ui/button";
import { Badge } from "src/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "src/components/ui/avatar";

interface Review {
  id: number;
  clientName: string;
  rating: number;
  reviewText: string;
  consultationType: string;
  consultationDate: string;
  isVerified: boolean;
  helpfulCount: number;
  avatar?: string;
}

interface AstrologerReviewsProps {
  astrologerName: string;
  overallRating: number;
  totalReviews: number;
  reviews?: Review[];
}

export default function AstrologerReviews({
  astrologerName,
  overallRating,
  totalReviews,
  reviews = [],
}: AstrologerReviewsProps) {
  const [showAllReviews, setShowAllReviews] = useState(false);

  // Sample reviews for demonstration
  const sampleReviews: Review[] = [
    {
      id: 1,
      clientName: "Priya S.",
      rating: 5,
      reviewText: `Excellent consultation with ${astrologerName}! Very detailed predictions about my career and marriage. The remedies suggested are already showing positive results. Highly recommend for anyone seeking authentic Vedic guidance.`,
      consultationType: "Chat",
      consultationDate: "2 days ago",
      isVerified: true,
      helpfulCount: 12,
    },
    {
      id: 2,
      clientName: "Rajesh M.",
      rating: 5,
      reviewText: `Amazing accuracy in predictions! ${astrologerName} explained my planetary positions clearly and provided practical remedies. The timing predictions for business expansion were spot on.`,
      consultationType: "Call",
      consultationDate: "1 week ago",
      isVerified: true,
      helpfulCount: 8,
    },
    {
      id: 3,
      clientName: "Anita K.",
      rating: 4,
      reviewText: `Very knowledgeable astrologer with deep understanding of Vedic principles. The consultation helped me understand my Dasha periods better. Would definitely consult again.`,
      consultationType: "Chat",
      consultationDate: "2 weeks ago",
      isVerified: true,
      helpfulCount: 6,
    },
    {
      id: 4,
      clientName: "Vikram T.",
      rating: 5,
      reviewText: `Professional and compassionate consultation. ${astrologerName} provided clear insights about health issues and suggested effective remedies. Very satisfied with the service.`,
      consultationType: "Video",
      consultationDate: "3 weeks ago",
      isVerified: true,
      helpfulCount: 9,
    },
  ];

  // Make reviews stateful so we can update helpfulCount
  const [reviewList, setReviewList] = useState<Review[]>(
    reviews.length > 0 ? reviews : sampleReviews,
  );

  const visibleReviews = showAllReviews ? reviewList : reviewList.slice(0, 3);

  const ratingBreakdown = [
    { stars: 5, count: Math.floor(totalReviews * 0.7), percentage: 70 },
    { stars: 4, count: Math.floor(totalReviews * 0.2), percentage: 20 },
    { stars: 3, count: Math.floor(totalReviews * 0.08), percentage: 8 },
    { stars: 2, count: Math.floor(totalReviews * 0.015), percentage: 1.5 },
    { stars: 1, count: Math.floor(totalReviews * 0.005), percentage: 0.5 },
  ];

  // Handle helpful click
  const handleHelpfulClick = (id: number) => {
    setReviewList((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, helpfulCount: r.helpfulCount + 1 } : r,
      ),
    );
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">Client Reviews</h2>
          <div className="flex items-center gap-2">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${i < Math.floor(overallRating) ? "fill-current" : ""}`}
                />
              ))}
            </div>
            <span className="font-bold text-lg">{overallRating}</span>
            <span className="text-gray-600">({totalReviews} reviews)</span>
          </div>
        </div>

        {/* Rating Breakdown */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">
              Rating Breakdown
            </h3>
            <div className="space-y-2">
              {ratingBreakdown.map((item) => (
                <div key={item.stars} className="flex items-center gap-2">
                  <span className="text-sm w-8">{item.stars}⭐</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-12">
                    {item.count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-800 mb-3">
              Popular Consultation Types
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Chat Consultation</span>
                <span className="text-sm font-medium">65%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Call Consultation</span>
                <span className="text-sm font-medium">25%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Video Consultation</span>
                <span className="text-sm font-medium">10%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Individual Reviews */}
        <div className="space-y-4">
          {visibleReviews.map((review) => (
            <div
              key={review.id}
              className="border-l-4 border-purple-200 pl-4 py-3 bg-gray-50 rounded-r-lg"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={review.avatar} />
                    <AvatarFallback className="text-xs bg-purple-100">
                      {review.clientName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-800 text-sm">
                        {review.clientName}
                      </span>
                      {review.isVerified && (
                        <Badge
                          variant="outline"
                          className="text-xs bg-green-50 text-green-700 border-green-200 flex items-center gap-1"
                        >
                          <Verified className="w-3 h-3" />
                          Verified
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${i < review.rating ? "fill-current" : ""}`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-500">
                        {review.consultationType} • {review.consultationDate}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-gray-700 text-sm leading-relaxed mb-3">
                {review.reviewText}
              </p>

              <div className="flex items-center gap-4 text-xs text-gray-500">
                <button
                  onClick={() => handleHelpfulClick(review.id)}
                  className="flex items-center gap-1 hover:text-purple-600 transition-colors"
                >
                  <ThumbsUp className="w-3 h-3" />
                  Helpful ({review.helpfulCount})
                </button>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {review.consultationDate}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Show More/Less Button */}
        {reviewList.length > 3 && (
          <div className="text-center mt-6">
            <Button
              variant="outline"
              onClick={() => setShowAllReviews(!showAllReviews)}
              className="text-purple-600 border-purple-200 hover:bg-purple-50"
            >
              {showAllReviews
                ? `Show Less Reviews`
                : `Show All ${reviewList.length} Reviews`}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
