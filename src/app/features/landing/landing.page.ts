import { ChangeDetectionStrategy, Component, inject, signal, OnInit } from '@angular/core';
import { DecimalPipe, AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TmdbService, MoodKey } from '../../core/tmdb.service';
import { TmdbDiscoverResponse } from '../../core/tmdb.models';
import { MovieCardComponent } from '../../shared/movie-card/movie-card.component';
import { RowComponent } from '../../shared/row/row.component';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [RouterLink, MovieCardComponent, RowComponent, DecimalPipe, AsyncPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  templateUrl: './landing.page.html',
  styleUrl: './landing.page.scss'
})
export class LandingPage implements OnInit {
  private readonly api = inject(TmdbService);

  readonly selectedMood = signal<MoodKey>('feel-good');
  readonly loading = signal(false);
  readonly loadingMore = signal(false);
  readonly error = signal<string | null>(null);
  readonly movies = signal<TmdbDiscoverResponse['results']>([]);
  readonly currentPage = signal(1);
  readonly hasMorePages = signal(true);

  ngOnInit(): void {
    this.fetch();
  }

  selectMood(mood: MoodKey): void {
    if (this.selectedMood() === mood) return;
    this.selectedMood.set(mood);
    this.currentPage.set(1);
    this.hasMorePages.set(true);
    this.fetch();
  }

  loadMore(): void {
    if (this.loadingMore() || !this.hasMorePages()) return;
    
    const nextPage = this.currentPage() + 1;
    this.loadingMore.set(true);
    
    this.api.discoverByMood(this.selectedMood(), nextPage).subscribe({
      next: (res) => {
        const currentMovies = this.movies();
        this.movies.set([...currentMovies, ...res.results]);
        this.currentPage.set(nextPage);
        this.hasMorePages.set(nextPage < res.total_pages);
        this.loadingMore.set(false);
      },
      error: (err) => {
        this.loadingMore.set(false);
        console.error('Error loading more movies:', err);
      },
    });
  }

  private fetch(): void {
    const mood = this.selectedMood();
    if (!mood) return;
    
    this.loading.set(true);
    this.error.set(null);
    setTimeout(() => {
      this.api.discoverByMood(mood, 1).subscribe({
        next: (res) => {
          this.movies.set(res.results);
          this.currentPage.set(1);
          this.hasMorePages.set(res.total_pages > 1);
          this.loading.set(false);
        },
        error: (err) => {
          this.error.set('Failed to load movies.');
          this.loading.set(false);
          console.error(err);
        },
      });
    }, 100);
  }
} 