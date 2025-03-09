import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Cross2Icon } from '@radix-ui/react-icons';
import { searchContent } from '@/lib/services/tmdb';
import { ContentType, TMDbSearchResult, SelectedContent } from '@/types';
import { getImageUrl } from '@/lib/services/tmdb';
import { Badge } from '@/components/ui/badge';

interface SearchBarProps {
  contentType: ContentType;
  onSelectContent: (content: SelectedContent) => void;
}

export function SearchBar({ contentType, onSelectContent }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<TMDbSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Handle clicks outside of the search results
    const handleClickOutside = (event: MouseEvent) => {
      if (
        resultsRef.current && 
        !resultsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (query.trim() !== '') {
        setLoading(true);
        const searchResults = await searchContent(query, contentType);
        setResults(searchResults);
        setLoading(false);
        setShowResults(true);
      } else {
        setResults([]);
        setShowResults(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [query, contentType]);

  const handleSelect = (item: TMDbSearchResult) => {
    const selectedContent: SelectedContent = {
      id: item.id,
      title: item.title || item.name || 'Unknown Title',
      type: contentType,
      posterPath: item.poster_path,
      overview: item.overview,
      releaseDate: item.release_date || item.first_air_date
    };
    
    onSelectContent(selectedContent);
    setShowResults(false);
    setQuery(''); // Clear search after selection
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setShowResults(false);
  };

  return (
    <div className="relative w-full max-w-lg">
      <div className="relative">
        <Input
          ref={inputRef}
          type="text"
          placeholder={`Search for ${contentType === 'movie' ? 'movies' : 'TV shows'}...`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onClick={() => query.trim() !== '' && setShowResults(true)}
          className="w-full pr-10"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            <Cross2Icon className="h-4 w-4" />
          </button>
        )}
      </div>

      {showResults && (
        <div 
          ref={resultsRef}
          className="absolute z-50 mt-1 w-full bg-background border rounded-md shadow-lg max-h-96 overflow-auto"
        >
          {loading ? (
            <div className="p-4 text-center">Loading...</div>
          ) : results.length > 0 ? (
            <div className="p-2">
              {results.map((item) => (
                <div 
                  key={item.id}
                  className="flex items-start gap-3 p-2 hover:bg-accent rounded cursor-pointer"
                  onClick={() => handleSelect(item)}
                >
                  <div className="flex-shrink-0 w-16 h-24 relative">
                    <img
                      src={getImageUrl(item.poster_path, 'w92')}
                      alt={item.title || item.name || 'Poster'}
                      className="w-full h-full object-cover rounded"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder-poster.png';
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm truncate">
                      {item.title || item.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {item.release_date || item.first_air_date 
                        ? new Date(item.release_date || item.first_air_date || '').getFullYear() 
                        : 'Unknown year'}
                    </p>
                    <p className="text-xs line-clamp-2 mt-1 text-muted-foreground">
                      {item.overview || 'No overview available'}
                    </p>
                    <div className="mt-1">
                      <Badge variant="secondary" className="text-xs">
                        ★ {item.vote_average.toFixed(1)}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : query.trim() !== '' ? (
            <div className="p-4 text-center">No results found</div>
          ) : null}
        </div>
      )}
    </div>
  );
}
