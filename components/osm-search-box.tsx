import React, { useState, useEffect, useRef } from 'react';
import debounce from 'lodash/debounce';

interface Place {
  formatted_address: string;
  geometry: {
    location: {
      lat: () => number;
      lng: () => number;
    };
  };
}

interface StandaloneSearchBoxProps {
  onPlaceChanged: (place: Place) => void;
}

export const useOsmApiLoader = () => {
  const [isLoaded, setIsLoaded] = useState(true);
  return { isLoaded };
};

export const StandaloneSearchBox: React.FC<StandaloneSearchBoxProps> = ({ onPlaceChanged }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<Place[]>([]);
  const searchRef = useRef<HTMLInputElement>(null);

  const fetchSuggestions = async (query: string) => {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
    const data = await response.json();
    return data.map((item: any) => ({
      formatted_address: item.display_name,
      geometry: {
        location: {
          lat: () => parseFloat(item.lat),
          lng: () => parseFloat(item.lon),
        },
      },
    }));
  };

  const debouncedFetchSuggestions = debounce(async (query: string) => {
    if (query.length > 2) {
      const results = await fetchSuggestions(query);
      setSuggestions(results);
    } else {
      setSuggestions([]);
    }
  }, 300);

  useEffect(() => {
    debouncedFetchSuggestions(searchTerm);
  }, [searchTerm]);

  const handleSelectPlace = (place: Place) => {
    setSearchTerm(place.formatted_address);
    setSuggestions([]);
    onPlaceChanged(place);
  };

  return (
    <div className="relative">
      <input
        ref={searchRef}
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300"
        placeholder="Enter location"
      />
      {suggestions.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-xl mt-1 max-h-60 overflow-y-auto">
          {suggestions.map((place, index) => (
            <li
              key={index}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSelectPlace(place)}
            >
              {place.formatted_address}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};