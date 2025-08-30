import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app.component';
import { WatchlistService } from './core/watchlist.service';

describe('AppComponent', () => {
  let watchlistService: jasmine.SpyObj<WatchlistService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('WatchlistService', [], {
      watchlistCount: 0
    });

    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideRouter([]),
        { provide: WatchlistService, useValue: spy }
      ],
    }).compileComponents();

    watchlistService = TestBed.inject(WatchlistService) as jasmine.SpyObj<WatchlistService>;
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the 'movie-watcher' title`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('movie-watcher');
  });

  it('should have watchlist count', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.watchlistCount).toBeDefined();
  });
});
