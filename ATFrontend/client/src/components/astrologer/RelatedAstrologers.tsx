import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { Card, CardContent } from "src/components/ui/card";
import { Button } from "src/components/ui/button";
// Use local Astrologer interface to match the current data structure
interface Astrologer {
  id: number;
  name: string;
  image?: string;
  experience: number;
  rating: number;
  specializations: string[];
  languages: string[];
  totalConsultations: number;
  ratePerMinute: number;
  isOnline: boolean;
}
import AstrologerCard from "./AstrologerCard";

interface RelatedAstrologersProps {
  currentAstrologer: Astrologer;
  limit?: number;
}

export default function RelatedAstrologers({ currentAstrologer, limit = 3 }: RelatedAstrologersProps) {
  const [relatedAstrologers, setRelatedAstrologers] = useState<Astrologer[]>([]);

  const { data: allAstrologers = [] } = useQuery({
    queryKey: ["/api/astrologers"],
  });

  useEffect(() => {
    if (allAstrologers.length > 0) {
      // Find astrologers with similar specializations
      const related = allAstrologers
        .filter(astrologer => 
          astrologer.id !== currentAstrologer.id && // Exclude current astrologer
          astrologer.specializations.some(spec => 
            currentAstrologer.specializations.includes(spec)
          )
        )
        .sort((a, b) => {
          // Sort by rating and online status
          if (a.isOnline && !b.isOnline) return -1;
          if (!a.isOnline && b.isOnline) return 1;
          return b.rating - a.rating;
        })
        .slice(0, limit);

      // If not enough related astrologers, fill with top-rated online astrologers
      if (related.length < limit) {
        const additional = allAstrologers
          .filter(astrologer => 
            astrologer.id !== currentAstrologer.id &&
            !related.some(r => r.id === astrologer.id)
          )
          .sort((a, b) => {
            if (a.isOnline && !b.isOnline) return -1;
            if (!a.isOnline && b.isOnline) return 1;
            return b.rating - a.rating;
          })
          .slice(0, limit - related.length);

        setRelatedAstrologers([...related, ...additional]);
      } else {
        setRelatedAstrologers(related);
      }
    }
  }, [allAstrologers, currentAstrologer.id, currentAstrologer.specializations, limit]);

  if (relatedAstrologers.length === 0) {
    return null;
  }

  const commonSpecializations = currentAstrologer.specializations.slice(0, 2);

  return (
    <div className="mt-12">
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                Similar Astrologers
              </h2>
              <p className="text-gray-600 text-sm mt-1">
                Other experts in {commonSpecializations.join(" & ")}
              </p>
            </div>
            <Button
              variant="outline"
              className="text-purple-600 border-purple-200 hover:bg-purple-50"
              onClick={() => window.location.href = `/astrologers?specialization=${encodeURIComponent(commonSpecializations[0])}`}
            >
              View All
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedAstrologers.map((astrologer) => (
              <AstrologerCard 
                key={astrologer.id} 
                astrologer={astrologer}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}