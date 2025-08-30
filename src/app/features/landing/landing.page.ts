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
  readonly error = signal<string | null>(null);
  readonly movies = signal<TmdbDiscoverResponse['results']>([]);

  ngOnInit(): void {
    this.fetch();
  }

  selectMood(mood: MoodKey): void {
    if (this.selectedMood() === mood) return;
    this.selectedMood.set(mood);
    this.fetch();
  }

  private fetch(): void {
    const mood = this.selectedMood();
    if (!mood) return;
    
    this.loading.set(true);
    this.error.set(null);
    setTimeout(() => {
      this.api.discoverByMood(mood).subscribe({
        next: (res) => {
          this.movies.set(res.results);
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