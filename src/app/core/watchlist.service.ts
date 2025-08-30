import { Injectable, signal, computed } from '@angular/core';

export interface WatchlistMovie {
  id: number;
  title: string;
  posterPath: string | null;
  releaseDate: string | null;
  voteAverage: number;
  addedAt: string;
}

@Injectable({ providedIn: 'root' })
export class WatchlistService {
  private readonly STORAGE_KEY = 'movie-watcher-watchlist';
  
  private readonly _watchlist = signal<WatchlistMovie[]>([]);
  
  readonly watchlist = this._watchlist.asReadonly();
  readonly watchlistCount = computed(() => this._watchlist().length);

  constructor() {
    this.loadWatchlist();
  }

  private loadWatchlist(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      const watchlist = stored ? JSON.parse(stored) : [];
      this._watchlist.set(watchlist);
    } catch (error) {
      console.error('Error loading watchlist:', error);
      this._watchlist.set([]);
    }
  }

  private saveWatchlist(watchlist: WatchlistMovie[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(watchlist));
      this._watchlist.set(watchlist);
    } catch (error) {
      console.error('Error saving watchlist:', error);
    }
  }

  addToWatchlist(movie: Omit<WatchlistMovie, 'addedAt'>): void {
    const currentWatchlist = this._watchlist();
    const exists = currentWatchlist.some(m => m.id === movie.id);
    
    if (!exists) {
      const watchlistMovie: WatchlistMovie = {
        ...movie,
        addedAt: new Date().toISOString()
      };
      this.saveWatchlist([...currentWatchlist, watchlistMovie]);
    }
  }

  removeFromWatchlist(movieId: number): void {
    const currentWatchlist = this._watchlist();
    const filteredWatchlist = currentWatchlist.filter(m => m.id !== movieId);
    this.saveWatchlist(filteredWatchlist);
  }

  isInWatchlist(movieId: number): boolean {
    return this._watchlist().some(m => m.id === movieId);
  }

  clearWatchlist(): void {
    this.saveWatchlist([]);
  }
} 