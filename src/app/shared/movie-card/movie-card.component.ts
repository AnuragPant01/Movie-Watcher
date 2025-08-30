import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DecimalPipe, NgOptimizedImage } from '@angular/common';
import { TMDB_IMAGE_BASE, TMDB_POSTER_SIZE } from '../../core/tmdb.models';

@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [RouterLink, DecimalPipe, NgOptimizedImage],
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

  readonly imageUrl = computed(() => {
    const path = this.posterPath();
    return path ? `${TMDB_IMAGE_BASE}/${TMDB_POSTER_SIZE}${path}` : '';
  });
} 