import { TestBed } from '@angular/core/testing';
import { WatchlistService, WatchlistMovie } from './watchlist.service';

describe('WatchlistService', () => {
  let service: WatchlistService;
  let mockLocalStorage: { [key: string]: string } = {};

  beforeEach(() => {
    mockLocalStorage = {};
    spyOn(localStorage, 'getItem').and.callFake((key: string) => mockLocalStorage[key] || null);
    spyOn(localStorage, 'setItem').and.callFake((key: string, value: string) => {
      mockLocalStorage[key] = value;
    });
    spyOn(localStorage, 'removeItem').and.callFake((key: string) => {
      delete mockLocalStorage[key];
    });

    TestBed.configureTestingModule({
      providers: [WatchlistService]
    });
    service = TestBed.inject(WatchlistService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with empty watchlist', () => {
    expect(service.watchlist()).toEqual([]);
    expect(service.watchlistCount()).toBe(0);
  });

  it('should load existing watchlist from localStorage', () => {
    const mockWatchlist: WatchlistMovie[] = [
      {
        id: 1,
        title: 'Test Movie',
        posterPath: '/test.jpg',
        releaseDate: '2023-01-01',
        voteAverage: 8.5,
        addedAt: '2023-01-01T00:00:00.000Z'
      }
    ];
    
    // Set up localStorage before creating service
    mockLocalStorage['movie-watcher-watchlist'] = JSON.stringify(mockWatchlist);
    
    // Create new service instance to trigger load
    const newService = new WatchlistService();
    
    expect(newService.watchlist()).toEqual(mockWatchlist);
    expect(newService.watchlistCount()).toBe(1);
  });

  it('should handle localStorage errors gracefully', () => {
    // Reset spies for this specific test
    (localStorage.getItem as jasmine.Spy).and.throwError('Storage error');
    spyOn(console, 'error');
    
    const newService = new WatchlistService();
    
    expect(newService.watchlist()).toEqual([]);
    expect(console.error).toHaveBeenCalledWith('Error loading watchlist:', jasmine.any(Error));
  });

  it('should add movie to watchlist', () => {
    const movie = {
      id: 1,
      title: 'Test Movie',
      posterPath: '/test.jpg',
      releaseDate: '2023-01-01',
      voteAverage: 8.5
    };

    service.addToWatchlist(movie);

    expect(service.watchlistCount()).toBe(1);
    expect(service.watchlist()[0].id).toBe(1);
    expect(service.watchlist()[0].title).toBe('Test Movie');
    expect(service.watchlist()[0].addedAt).toBeDefined();
    expect(localStorage.setItem).toHaveBeenCalled();
  });

  it('should not add duplicate movies to watchlist', () => {
    const movie = {
      id: 1,
      title: 'Test Movie',
      posterPath: '/test.jpg',
      releaseDate: '2023-01-01',
      voteAverage: 8.5
    };

    service.addToWatchlist(movie);
    service.addToWatchlist(movie);

    expect(service.watchlistCount()).toBe(1);
  });

  it('should remove movie from watchlist', () => {
    const movie = {
      id: 1,
      title: 'Test Movie',
      posterPath: '/test.jpg',
      releaseDate: '2023-01-01',
      voteAverage: 8.5
    };

    service.addToWatchlist(movie);
    expect(service.watchlistCount()).toBe(1);

    service.removeFromWatchlist(1);
    expect(service.watchlistCount()).toBe(0);
    expect(service.watchlist()).toEqual([]);
  });

  it('should check if movie is in watchlist', () => {
    const movie = {
      id: 1,
      title: 'Test Movie',
      posterPath: '/test.jpg',
      releaseDate: '2023-01-01',
      voteAverage: 8.5
    };

    expect(service.isInWatchlist(1)).toBe(false);

    service.addToWatchlist(movie);
    expect(service.isInWatchlist(1)).toBe(true);
    expect(service.isInWatchlist(2)).toBe(false);
  });

  it('should clear entire watchlist', () => {
    const movie1 = {
      id: 1,
      title: 'Test Movie 1',
      posterPath: '/test1.jpg',
      releaseDate: '2023-01-01',
      voteAverage: 8.5
    };

    const movie2 = {
      id: 2,
      title: 'Test Movie 2',
      posterPath: '/test2.jpg',
      releaseDate: '2023-01-02',
      voteAverage: 7.5
    };

    service.addToWatchlist(movie1);
    service.addToWatchlist(movie2);
    expect(service.watchlistCount()).toBe(2);

    service.clearWatchlist();
    expect(service.watchlistCount()).toBe(0);
    expect(service.watchlist()).toEqual([]);
  });

  it('should handle localStorage setItem errors', () => {
    // Reset spy for this specific test
    (localStorage.setItem as jasmine.Spy).and.throwError('Storage error');
    spyOn(console, 'error');

    const movie = {
      id: 1,
      title: 'Test Movie',
      posterPath: '/test.jpg',
      releaseDate: '2023-01-01',
      voteAverage: 8.5
    };

    service.addToWatchlist(movie);
    expect(console.error).toHaveBeenCalledWith('Error saving watchlist:', jasmine.any(Error));
  });

  it('should maintain watchlist order', () => {
    const movie1 = {
      id: 1,
      title: 'First Movie',
      posterPath: '/first.jpg',
      releaseDate: '2023-01-01',
      voteAverage: 8.5
    };

    const movie2 = {
      id: 2,
      title: 'Second Movie',
      posterPath: '/second.jpg',
      releaseDate: '2023-01-02',
      voteAverage: 7.5
    };

    service.addToWatchlist(movie1);
    service.addToWatchlist(movie2);

    const watchlist = service.watchlist();
    expect(watchlist[0].id).toBe(1);
    expect(watchlist[1].id).toBe(2);
  });

  it('should update watchlist count correctly', () => {
    expect(service.watchlistCount()).toBe(0);

    const movie = {
      id: 1,
      title: 'Test Movie',
      posterPath: '/test.jpg',
      releaseDate: '2023-01-01',
      voteAverage: 8.5
    };

    service.addToWatchlist(movie);
    expect(service.watchlistCount()).toBe(1);

    service.removeFromWatchlist(1);
    expect(service.watchlistCount()).toBe(0);
  });

  it('should add timestamp when adding movie', () => {
    const movie = {
      id: 1,
      title: 'Test Movie',
      posterPath: '/test.jpg',
      releaseDate: '2023-01-01',
      voteAverage: 8.5
    };

    const beforeAdd = Date.now();
    service.addToWatchlist(movie);
    const afterAdd = Date.now();

    const addedMovie = service.watchlist()[0];
    const addedAt = new Date(addedMovie.addedAt).getTime();

    expect(addedAt).toBeGreaterThanOrEqual(beforeAdd);
    expect(addedAt).toBeLessThanOrEqual(afterAdd);
  });
}); 