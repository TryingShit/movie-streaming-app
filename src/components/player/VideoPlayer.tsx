import React, { useRef, useState, useEffect } from 'react';
import { SelectedContent } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { useAdBlocker } from '@/lib/hooks/useAdBlocker';
import { Loader2 } from 'lucide-react';

interface VideoPlayerProps {
  selectedContent: SelectedContent | null;
}

export function VideoPlayer({ selectedContent }: VideoPlayerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Use our custom ad blocker hook
  useAdBlocker(iframeRef);
  
  // Reset loading state when content changes
  useEffect(() => {
    setIsLoading(true);
  }, [selectedContent]);

  // Construct the embed URL based on the selected content
  const getEmbedUrl = () => {
    if (!selectedContent) return 'about:blank';
    
    return `https://vidsrc.net/embed/${selectedContent.type}/${selectedContent.id}`;
  };

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  return (
    <Card className="w-full overflow-hidden relative">
      <CardContent className="p-0 aspect-video relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/10 z-10">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        )}
        
        <iframe
          ref={iframeRef}
          src={getEmbedUrl()}
          allowFullScreen
          onLoad={handleIframeLoad}
          className="w-full h-full border-0"
          sandbox="allow-scripts allow-same-origin allow-forms"
          title={selectedContent?.title || "Video Player"}
        />
        
        {!selectedContent && !isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 text-white p-6 text-center">
            <h3 className="text-xl font-bold mb-2">No Content Selected</h3>
            <p>Search for a movie or TV show to start watching</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}