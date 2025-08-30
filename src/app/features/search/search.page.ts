import { ChangeDetectionStrategy, Component, inject, signal, OnInit, HostListener } from '@angular/core';
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
  readonly loadingMore = signal(false);
  readonly movieResults = signal<TmdbMovieSummary[]>([]);
  readonly peopleResults = signal<TmdbPersonSummary[]>([]);
  readonly currentPage = signal(1);
  readonly hasMorePages = signal(true);
  readonly searchTerm = signal('');

  constructor() {
    this.q.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        filter((v) => v.trim().length > 0),
        switchMap((term) => {
          this.loading.set(true);
          this.currentPage.set(1);
          this.hasMorePages.set(true);
          this.searchTerm.set(term);
          return this.api.searchMovies(term, 1);
        })
      )
      .subscribe((res) => {
        this.movieResults.set(res.results);
        this.hasMorePages.set(res.total_pages > 1);
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
    this.scrollToTop();
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(): void {
    if (this.shouldLoadMore()) {
      this.loadMore();
    }
  }

  private shouldLoadMore(): boolean {
    if (this.loading() || this.loadingMore() || !this.hasMorePages() || !this.searchTerm().trim()) {
      return false;
    }

    const scrollPosition = window.scrollY + window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const threshold = 200;

    return scrollPosition >= documentHeight - threshold;
  }

  private loadMore(): void {
    if (this.loadingMore()) return;
    
    const nextPage = this.currentPage() + 1;
    this.loadingMore.set(true);
    
    this.api.searchMovies(this.searchTerm(), nextPage).subscribe({
      next: (res) => {
        const currentMovies = this.movieResults();
        this.movieResults.set([...currentMovies, ...res.results]);
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

  private scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
} 