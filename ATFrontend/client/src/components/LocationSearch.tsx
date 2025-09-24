import React, { useState, useEffect, useRef } from 'react';
import { Input } from 'src/components/ui/input';
import { MapPin, Loader2 } from 'lucide-react';

interface LocationSearchProps {
  value?: string;
  defaultValue?: string;
  onChange?: (location: string, latitude?: number, longitude?: number) => void;
  onLocationSelect?: (location: { place: string; place_name: string; latitude: number; longitude: number }) => void;
  placeholder?: string;
  className?: string;
}

interface LocationData {
  name: string;
  country: string;
  state?: string;
  latitude: number;
  longitude: number;
  timezone: string;
  display: string;
}

export const LocationSearch: React.FC<LocationSearchProps> = ({
  value = "",
  onChange,
  onLocationSelect,
  placeholder = "Enter birth place",
  className = ""
}) => {
  const [locations, setLocations] = useState<LocationData[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const [isLoading, setIsLoading] = useState(false);
  const debounceTimer = useRef<NodeJS.Timeout>();

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const searchLocations = async (query: string) => {
    if (query.length < 2) {
      setLocations([]);
      setShowSuggestions(false);
      return;
    }

    setIsLoading(true);
    try {
      console.log('Route handler called with query:', query);
      const response = await fetch(`/api/locations/search?query=${encodeURIComponent(query)}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('API response:', data);
        
        if (data.success && data.locations) {
          setLocations(data.locations);
          setShowSuggestions(true);
        } else {
          setLocations([]);
          setShowSuggestions(false);
        }
      } else {
        console.error('Search API failed:', response.status);
        setLocations([]);
        setShowSuggestions(false);
      }
    } catch (error) {
      console.error('Location search error:', error);
      setLocations([]);
      setShowSuggestions(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setInputValue(query);
    
    // Clear previous debounce timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    
    // Debounce API calls by 300ms
    debounceTimer.current = setTimeout(() => {
      searchLocations(query);
    }, 300);
    
    // Call appropriate callback with just the text value when typing
    if (onChange) {
      onChange(query);
    }
  };

  const handleLocationClick = (location: LocationData) => {
    console.log('Location clicked:', location);
    console.log('Setting input value to:', location.display);
    setInputValue(location.display);
    setShowSuggestions(false);
    
    // Call both callback formats for compatibility
    if (onChange) {
      console.log('Calling onChange with:', location.display, location.latitude, location.longitude);
      onChange(location.display, location.latitude, location.longitude);
    }
    
    if (onLocationSelect) {
      console.log('Calling onLocationSelect with:', location);
      onLocationSelect({
        place: location.display,
        place_name: location.display,
        latitude: location.latitude,
        longitude: location.longitude
      });
    }
  };

  const handleInputBlur = () => {
    // Delay hiding suggestions to allow for clicks
    setTimeout(() => setShowSuggestions(false), 300);
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onFocus={() => locations.length > 0 && setShowSuggestions(true)}
          placeholder={placeholder}
          className="pr-10"
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
          ) : (
            <MapPin className="h-4 w-4 text-gray-400" />
          )}
        </div>
      </div>
      
      {showSuggestions && locations.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
          {locations.map((location, index) => (
            <div
              key={index}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
              onMouseDown={(e) => {
                e.preventDefault(); // Prevent input blur
                handleLocationClick(location);
              }}
              onClick={() => handleLocationClick(location)}
            >
              <MapPin className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 truncate">
                  {location.name}
                </div>
                <div className="text-xs text-gray-500 truncate">
                  {location.display}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {showSuggestions && locations.length === 0 && !isLoading && inputValue.length >= 2 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
          <div className="px-4 py-2 text-sm text-gray-500">
            No locations found. Try a different search term.
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationSearch;