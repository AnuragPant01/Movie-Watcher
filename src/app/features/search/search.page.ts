import { ChangeDetectionStrategy, Component, inject, signal, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { DecimalPipe, AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { debounceTime, distinctUntilChanged, filter, switchMap } from 'rxjs/operators';
import { TmdbService } from '../../core/tmdb.service';
import { MovieCardComponent } from '../../shared/movie-card/movie-card.component';
import { TmdbMovieSummary, TmdbPersonSummary } from '../../core/tmdb.models';

@Component({
  selector: 'app-search-page',
  standalone: true,
  imports: [ReactiveFormsModule, DecimalPipe, AsyncPipe, RouterLink, MovieCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  templateUrl: './search.page.html',
  styleUrl: './search.page.scss'
})
export class SearchPage implements OnInit {
  private readonly api = inject(TmdbService);

  q = new FormControl<string>('', { nonNullable: true });

  readonly loading = signal(false);
  readonly movieResults = signal<TmdbMovieSummary[]>([]);
  readonly peopleResults = signal<TmdbPersonSummary[]>([]);

  constructor() {
    this.q.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        filter((v) => v.trim().length > 0),
        switchMap((term) => {
          this.loading.set(true);
          return this.api.searchMovies(term);
        })
      )
      .subscribe((res) => {
        this.movieResults.set(res.results);
        this.loading.set(false);
      });

    this.q.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        filter((v) => v.trim().length > 0),
        switchMap((term) => this.api.searchPeople(term))
      )
      .subscribe((res) => {
        this.peopleResults.set(res.results);
      });
  }

  ngOnInit(): void {
    // Scroll to top when the page loads
    this.scrollToTop();
  }

  private scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
} 