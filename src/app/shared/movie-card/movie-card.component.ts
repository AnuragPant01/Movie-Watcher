import { ChangeDetectionStrategy, Component, computed, input, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { TMDB_IMAGE_BASE, TMDB_POSTER_SIZE } from '../../core/tmdb.models';
import { WatchlistService } from '../../core/watchlist.service';

@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [RouterLink, DecimalPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'inline-block rounded overflow-hidden bg-white dark:bg-gray-900',
    '[style.width.px]': 'compact() ? 180 : null',
    '[style.flex]': 'compact() ? "0 0 auto" : null',
  },
  templateUrl: './movie-card.component.html',
  styleUrl: './movie-card.component.scss'
})
export class MovieCardComponent {
  private readonly watchlistService = inject(WatchlistService);

  id = input.required<number>();
  title = input.required<string>();
  posterPath = input<string | null>(null);
  releaseDate = input<string | null>(null);
  voteAverage = input<number>(0);
  compact = input<boolean>(false);

  readonly releaseYear = computed(() => {
    const date = this.releaseDate();
    return date ? new Date(date).getFullYear() : '—';
  });

  readonly isInWatchlist = computed(() => {
    const movieId = this.id();
    return movieId ? this.watchlistService.isInWatchlist(movieId) : false;
  });

  toggleWatchlist(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    
    const movieId = this.id();
    if (!movieId) return;
    
    const isInWatchlist = this.isInWatchlist();
    
    if (isInWatchlist) {
      this.watchlistService.removeFromWatchlist(movieId);
    } else {
      this.watchlistService.addToWatchlist({
        id: movieId,
        title: this.title(),
        posterPath: this.posterPath(),
        releaseDate: this.releaseDate(),
        voteAverage: this.voteAverage()
      });
    }
  }
} 