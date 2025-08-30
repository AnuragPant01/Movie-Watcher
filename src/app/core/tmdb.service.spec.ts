import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { TmdbService } from './tmdb.service';

describe('TmdbService', () => {
  let service: TmdbService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        TmdbService,
      ],
    });
    service = TestBed.inject(TmdbService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should discover by mood with correct params', () => {
    service.discoverByMood('feel-good').subscribe();

    const req = httpMock.expectOne((r) => r.url.endsWith('/discover/movie'));
    expect(req.request.params.get('with_genres')).toBe('35,10751,10749');
    req.flush({ page: 1, results: [], total_pages: 0, total_results: 0 });
  });

  it('should search movies', () => {
    service.searchMovies('inception').subscribe((res) => {
      expect(res.results.length).toBe(1);
    });
    const req = httpMock.expectOne((r) => r.url.endsWith('/search/movie'));
    expect(req.request.params.get('query')).toBe('inception');
    req.flush({ page: 1, results: [{ id: 1, title: 'Inception', poster_path: null, release_date: '2010-01-01', vote_average: 8.8, overview: '' }], total_pages: 1, total_results: 1 });
  });

  it('should get details by id', () => {
    service.getMovieDetails(42).subscribe((res) => {
      expect(res.id).toBe(42);
    });
    const req = httpMock.expectOne('/movie/42');
    req.flush({ id: 42, title: 'X', poster_path: null, release_date: null, vote_average: 0, overview: '', genres: [], runtime: 0, status: '', tagline: null, homepage: null });
  });
}); 