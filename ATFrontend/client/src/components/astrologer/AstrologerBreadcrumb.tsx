import { ChevronRight, Home, Users } from "lucide-react";
import { Link } from "wouter";

interface AstrologerBreadcrumbProps {
  astrologerName: string;
  specialization?: string;
}

export default function AstrologerBreadcrumb({ astrologerName, specialization }: AstrologerBreadcrumbProps) {
  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
      <Link href="/" className="flex items-center hover:text-purple-600 transition-colors">
        <Home className="w-4 h-4 mr-1" />
        Home
      </Link>
      <ChevronRight className="w-4 h-4" />
      <Link href="/astrologers" className="flex items-center hover:text-purple-600 transition-colors">
        <Users className="w-4 h-4 mr-1" />
        Astrologers
      </Link>
      <ChevronRight className="w-4 h-4" />
      {specialization && (
        <>
          <span className="text-gray-500">{specialization}</span>
          <ChevronRight className="w-4 h-4" />
        </>
      )}
      <span className="text-purple-600 font-medium">{astrologerName}</span>
    </nav>
  );
}