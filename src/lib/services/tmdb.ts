import { TMDbResponse, TMDbSearchResult, ContentType } from "@/types";

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

// Search for movies and TV shows
export async function searchContent(query: string, type?: ContentType): Promise<TMDbSearchResult[]> {
  if (!query.trim()) return [];
  
  try {
    // If type is specified, search only for that type
    let endpoint = "";
    if (type) {
      endpoint = `${TMDB_BASE_URL}/search/${type}?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`;
    } else {
      // Otherwise search for both via multi search
      endpoint = `${TMDB_BASE_URL}/search/multi?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`;
    }
    
    const response = await fetch(endpoint);
    const data: TMDbResponse = await response.json();
    
    // Filter out person results and other non-movie/tv results
    return data.results.filter(item => item.media_type === 'movie' || item.media_type === 'tv' || 
      (type === 'movie' && item.title) || (type === 'tv' && item.name));
  } catch (error) {
    console.error("Error searching TMDb:", error);
    return [];
  }
}

// Get trending content
export async function getTrendingContent(type: ContentType = 'movie', timeWindow: 'day' | 'week' = 'week'): Promise<TMDbSearchResult[]> {
  try {
    const endpoint = `${TMDB_BASE_URL}/trending/${type}/${timeWindow}?api_key=${TMDB_API_KEY}`;
    const response = await fetch(endpoint);
    const data: TMDbResponse = await response.json();
    
    return data.results;
  } catch (error) {
    console.error("Error fetching trending content:", error);
    return [];
  }
}

// Get poster or backdrop image URL
export function getImageUrl(path: string | null, size: string = 'w500'): string {
  if (!path) return '/placeholder-poster.png'; // Path to your placeholder image
  return `https://image.tmdb.org/t/p/${size}${path}`;
}