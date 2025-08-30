import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  TmdbCreditsResponse,
  TmdbDiscoverResponse,
  TmdbMovieDetails,
  TmdbSearchMovieResponse,
  TmdbSearchPersonResponse,
  TmdbVideosResponse,
} from './tmdb.models';

export type MoodKey = 'feel-good' | 'action-fix' | 'mind-benders';

@Injectable({ providedIn: 'root' })
export class TmdbService {
  private readonly http = inject(HttpClient);

  discoverByMood(mood: MoodKey, page: number = 1): Observable<TmdbDiscoverResponse> {
    const params = this.buildDiscoverParams(mood, page);
    return this.http.get<TmdbDiscoverResponse>('/discover/movie', { params });
  }

  searchMovies(query: string, page: number = 1): Observable<TmdbSearchMovieResponse> {
    const params = new HttpParams().set('query', query).set('page', page);
    return this.http.get<TmdbSearchMovieResponse>('/search/movie', { params });
  }

  searchPeople(query: string, page: number = 1): Observable<TmdbSearchPersonResponse> {
    const params = new HttpParams().set('query', query).set('page', page);
    return this.http.get<TmdbSearchPersonResponse>('/search/person', { params });
  }

  getMovieDetails(id: number): Observable<TmdbMovieDetails> {
    return this.http.get<TmdbMovieDetails>(`/movie/${id}`);
  }

  getMovieCredits(id: number): Observable<TmdbCreditsResponse> {
    return this.http.get<TmdbCreditsResponse>(`/movie/${id}/credits`);
  }

  getMovieVideos(id: number): Observable<TmdbVideosResponse> {
    return this.http.get<TmdbVideosResponse>(`/movie/${id}/videos`);
  }

  getSimilarMovies(id: number, page: number = 1): Observable<TmdbDiscoverResponse> {
    const params = new HttpParams().set('page', page);
    return this.http.get<TmdbDiscoverResponse>(`/movie/${id}/similar`, { params });
  }

  private buildDiscoverParams(mood: MoodKey, page: number): HttpParams {
    let params = new HttpParams().set('page', page);
    switch (mood) {
      case 'feel-good':
        params = params
          .set('with_genres', '35,10751,10749')
          .set('sort_by', 'popularity.desc')
          .set('vote_average.gte', '6.8');
        break;
      case 'action-fix':
        params = params.set('with_genres', '28,53').set('sort_by', 'vote_count.desc');
        break;
      case 'mind-benders':
        params = params
          .set('with_genres', '9648,878,53')
          .set('sort_by', 'vote_average.desc')
          .set('vote_count.gte', '500');
        break;
    }
    return params;
  }
} 