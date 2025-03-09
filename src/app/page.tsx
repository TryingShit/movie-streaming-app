'use client';

import React, { useState, useEffect } from 'react';
import { SearchBar } from '@/components/search/SearchBar';
import { VideoPlayer } from '@/components/player/VideoPlayer';
import { ContentToggle } from '@/components/ui/ContentToggle';
import { LegalDisclaimer } from '@/components/layout/LegalDisclaimer';
import { ContentDetails } from '@/components/layout/ContentDetails';
import { ContentType, SelectedContent, TMDbSearchResult } from '@/types';
import { getTrendingContent } from '@/lib/services/tmdb';
import { Card, CardContent } from '@/components/ui/card';

export default function Home() {
  const [contentType, setContentType] = useState<ContentType>('movie');
  const [selectedContent, setSelectedContent] = useState<SelectedContent | null>(null);
  const [trendingContent, setTrendingContent] = useState<TMDbSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch trending content when content type changes
  useEffect(() => {
    async function fetchTrending() {
      setIsLoading(true);
      const trending = await getTrendingContent(contentType);
      setTrendingContent(trending);
      setIsLoading(false);
    }

    fetchTrending();
  }, [contentType]);

  const handleContentTypeChange = (type: ContentType) => {
    setContentType(type);
    setSelectedContent(null); // Reset selected content when changing types
  };

  const handleSelectContent = (content: SelectedContent) => {
    setSelectedContent(content);
  };

  const handleSelectTrending = (item: TMDbSearchResult) => {
    const selected: SelectedContent = {
      id: item.id,
      title: item.title || item.name || 'Unknown Title',
      type: contentType,
      posterPath: item.poster_path,
      overview: item.overview,
      releaseDate: item.release_date || item.first_air_date
    };
    
    setSelectedContent(selected);
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center mb-8">
          <h1 className="text-3xl font-bold mb-6">Movie & TV Show Streaming</h1>
          
          <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
            <ContentToggle 
              contentType={contentType} 
              onChange={handleContentTypeChange} 
            />
            <SearchBar 
              contentType={contentType} 
              onSelectContent={handleSelectContent} 
            />
          </div>
          
          <VideoPlayer selectedContent={selectedContent} />
          
          {selectedContent && <ContentDetails content={selectedContent} />}
          
          {!selectedContent && (
            <div className="w-full mt-8">
              <h2 className="text-xl font-semibold mb-4">
                Trending {contentType === 'movie' ? 'Movies' : 'TV Shows'}
              </h2>
              
              {isLoading ? (
                <div className="text-center py-8">Loading trending content...</div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {trendingContent.slice(0, 10).map((item) => (
                    <Card 
                      key={item.id}
                      className="cursor-pointer hover:shadow-lg transition-shadow"
                      onClick={() => handleSelectTrending(item)}
                    >
                      <CardContent className="p-2">
                        <div className="aspect-[2/3] mb-2 overflow-hidden rounded">
                          <img
                            src={item.poster_path ? `https://image.tmdb.org/t/p/w300${item.poster_path}` : '/placeholder-poster.png'}
                            alt={item.title || item.name || 'Poster'}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <h3 className="text-sm font-medium truncate">
                          {item.title || item.name}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {item.release_date || item.first_air_date 
                            ? new Date(item.release_date || item.first_air_date || '').getFullYear() 
                            : ''}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        
        <LegalDisclaimer />
      </div>
    </main>
  );
}