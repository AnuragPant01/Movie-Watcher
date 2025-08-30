import { ChangeDetectionStrategy, Component, computed, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AsyncPipe, DecimalPipe, DatePipe, NgIf, NgFor } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { TmdbService } from '../../core/tmdb.service';
import { TMDB_IMAGE_BASE, TMDB_POSTER_SIZE } from '../../core/tmdb.models';
import { MovieCardComponent } from '../../shared/movie-card/movie-card.component';
import { RowComponent } from '../../shared/row/row.component';
import { PersonChipComponent } from '../../shared/person-chip/person-chip.component';

@Component({
  selector: 'app-movie-detail-page',
  standalone: true,
  imports: [RouterLink, AsyncPipe, DecimalPipe, DatePipe, NgIf, NgFor, MovieCardComponent, RowComponent, PersonChipComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  templateUrl: './movie-detail.page.html',
  styleUrl: './movie-detail.page.scss'
})
export class MovieDetailPage implements OnInit {
  private readonly api = inject(TmdbService);
  private readonly route = inject(ActivatedRoute);
  private readonly sanitizer = inject(DomSanitizer);

  readonly id = signal<number | null>(null);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  readonly details = signal<any | null>(null);
  readonly videos = signal<any[]>([]);
  readonly cast = signal<any[]>([]);
  readonly similar = signal<any[]>([]);

  readonly genreList = computed(() => {
    const d = this.details();
    return d?.genres?.map((g: any) => g.name).join(', ') || '';
    });

  readonly genres = computed(() => (this.details()?.genres ?? []) as Array<{ id: number; name: string }>);

  readonly primaryTrailerKey = computed(() => {
    const v = this.videos();
    const yt = v.filter(x => x.site === 'YouTube');
    const trailer = yt.find(x => x.type === 'Trailer') || yt[0];
    return trailer?.key ?? null;
  });

  constructor() {
    this.route.paramMap.subscribe((p) => {
      const id = Number(p.get('id'));
      if (!Number.isFinite(id)) return;
      this.id.set(id);
      this.fetch(id);
      this.scrollToTop();
    });
  }

  ngOnInit(): void {
    this.scrollToTop();
  }

  private scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  private fetch(id: number): void {
    this.loading.set(true);
    this.error.set(null);
    this.api.getMovieDetails(id).subscribe({
      next: (d) => this.details.set(d),
      error: () => this.error.set('Failed to load details'),
    });
    this.api.getMovieVideos(id).subscribe({ next: (v) => this.videos.set(v.results) });
    this.api.getMovieCredits(id).subscribe({ next: (c) => this.cast.set(c.cast) });
    this.api.getSimilarMovies(id).subscribe({ next: (s) => this.similar.set(s.results) });
    this.loading.set(false);
  }

  imageUrl(path: string): string {
    return `${TMDB_IMAGE_BASE}/${TMDB_POSTER_SIZE}${path}`;
  }

  youtubeEmbed(key: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${key}`);
  }

  onThumbnailError(event: Event, videoKey: string): void {
    const img = event.target as HTMLImageElement;
    img.src = `https://img.youtube.com/vi/${videoKey}/hqdefault.jpg`;
  }
} 