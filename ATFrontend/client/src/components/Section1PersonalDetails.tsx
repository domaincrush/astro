import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'src/components/ui/card';
import { Badge } from 'src/components/ui/badge';
import { User, Star, Calendar, Globe } from 'lucide-react';

interface Section1Props {
  sectionData: {
    section_number: number;
    title: string;
    icon: string;
    color: string;
    category: string;
    subsections: Array<{
      title: string;
      icon: string;
      content: Record<string, any>;
    }>;
  };
}

const Section1PersonalDetails: React.FC<Section1Props> = ({ sectionData }) => {
  const getIcon = (iconName: string) => {
    const icons = {
      'User': User,
      'Star': Star,
      'Calendar': Calendar,
      'Globe': Globe
    };
    const IconComponent = icons[iconName as keyof typeof icons] || User;
    return <IconComponent className="h-5 w-5" />;
  };

  const formatValue = (key: string, value: any): string => {
    if (typeof value === 'object' && value !== null) {
      return JSON.stringify(value);
    }
    return String(value || 'Not available');
  };

  const formatFieldName = (key: string): string => {
    return key.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 flex items-center justify-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            {getIcon(sectionData.icon)}
          </div>
          Section {sectionData.section_number}: {sectionData.title}
        </h2>
        <p className="text-gray-600 mt-2">Comprehensive birth details and astrological identity</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
        {sectionData.subsections.map((subsection, index) => (
          <Card key={index} className="shadow-lg border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                {getIcon(subsection.icon)}
                {subsection.title}
              </CardTitle>
              <CardDescription>
                Essential {subsection.title.toLowerCase()} information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {Object.entries(subsection.content).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                  <span className="font-medium text-gray-700 text-sm">
                    {formatFieldName(key)}:
                  </span>
                  <span className="text-gray-900 text-sm font-semibold text-right max-w-40 truncate">
                    {formatValue(key, value)}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary Card */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <Star className="h-5 w-5" />
            Quick Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {sectionData.subsections.map((subsection, index) => (
              <div key={index} className="text-center">
                <Badge variant="secondary" className="mb-2">
                  {subsection.title}
                </Badge>
                <p className="text-sm text-gray-600">
                  {Object.keys(subsection.content).length} details included
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Section1PersonalDetails;