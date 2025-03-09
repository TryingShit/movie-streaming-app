// TMDb API response types
export interface TMDbSearchResult {
    id: number;
    title?: string;
    name?: string; // for TV shows
    poster_path: string | null;
    backdrop_path: string | null;
    overview: string;
    release_date?: string;
    first_air_date?: string; // for TV shows
    vote_average: number;
    media_type?: 'movie' | 'tv';
  }
  
  export interface TMDbResponse {
    page: number;
    results: TMDbSearchResult[];
    total_pages: number;
    total_results: number;
  }
  
  // Application state types
  export type ContentType = 'movie' | 'tv';
  
  export interface SelectedContent {
    id: number;
    title: string;
    type: ContentType;
    posterPath: string | null;
    overview: string;
    releaseDate?: string;
  }