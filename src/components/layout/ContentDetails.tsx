import { SelectedContent } from '@/types';
import { getImageUrl } from '@/lib/services/tmdb';
import { Badge } from '@/components/ui/badge';

interface ContentDetailsProps {
  content: SelectedContent;
}

export function ContentDetails({ content }: ContentDetailsProps) {
  return (
    <div className="flex flex-col md:flex-row gap-6 mt-6">
      <div className="flex-shrink-0 w-full md:w-1/4">
        <img
          src={getImageUrl(content.posterPath)}
          alt={content.title}
          className="w-full h-auto rounded-lg shadow-md"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/placeholder-poster.png';
          }}
        />
      </div>
      <div className="flex-1">
        <h1 className="text-2xl font-bold mb-2">{content.title}</h1>
        <div className="mb-4 flex gap-2">
          {content.releaseDate && (
            <Badge variant="outline">
              {new Date(content.releaseDate).getFullYear()}
            </Badge>
          )}
          <Badge variant="secondary">
            {content.type === 'movie' ? 'Movie' : 'TV Show'}
          </Badge>
        </div>
        <p className="text-muted-foreground">{content.overview || "No overview available"}</p>
      </div>
    </div>
  );
}