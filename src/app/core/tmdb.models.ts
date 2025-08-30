export interface TmdbMovieSummary {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string | null;
  vote_average: number;
  overview: string;
}

export interface TmdbDiscoverResponse {
  page: number;
  results: TmdbMovieSummary[];
  total_pages: number;
  total_results: number;
}

export interface TmdbSearchMovieResponse extends TmdbDiscoverResponse {}

export interface TmdbPersonSummary {
  id: number;
  name: string;
  profile_path: string | null;
  known_for_department: string | null;
}

export interface TmdbSearchPersonResponse {
  page: number;
  results: TmdbPersonSummary[];
  total_pages: number;
  total_results: number;
}

export interface TmdbMovieDetails extends TmdbMovieSummary {
  genres: { id: number; name: string }[];
  runtime: number | null;
  status: string;
  tagline: string | null;
  homepage: string | null;
}

export interface TmdbCreditsResponse {
  id: number;
  cast: Array<{
    id: number;
    name: string;
    character: string | null;
    profile_path: string | null;
  }>;
  crew: Array<{
    id: number;
    name: string;
    job: string | null;
    profile_path: string | null;
  }>;
}

export interface TmdbVideosResponse {
  id: number;
  results: Array<{
    id: string;
    key: string;
    name: string;
    site: string;
    type: string;
  }>;
}

export const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p';
export const TMDB_POSTER_SIZE = 'w342'; 