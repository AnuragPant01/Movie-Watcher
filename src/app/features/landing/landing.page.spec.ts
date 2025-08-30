import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { LandingPage } from './landing.page';
import { TmdbService } from '../../core/tmdb.service';

describe('LandingPage', () => {
  let component: LandingPage;
  let fixture: ComponentFixture<LandingPage>;
  let tmdbService: jasmine.SpyObj<TmdbService>;

  const mockMovies = {
    page: 1,
    results: [
      {
        id: 1,
        title: 'Test Movie 1',
        poster_path: '/test1.jpg',
        release_date: '2023-01-01',
        vote_average: 8.5,
        overview: 'Test overview 1'
      },
      {
        id: 2,
        title: 'Test Movie 2',
        poster_path: '/test2.jpg',
        release_date: '2023-01-02',
        vote_average: 7.5,
        overview: 'Test overview 2'
      }
    ],
    total_pages: 1,
    total_results: 2
  };

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('TmdbService', ['discoverByMood']);
    
    await TestBed.configureTestingModule({
      imports: [LandingPage],
      providers: [
        provideRouter([]),
        { provide: TmdbService, useValue: spy }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LandingPage);
    component = fixture.componentInstance;
    tmdbService = TestBed.inject(TmdbService) as jasmine.SpyObj<TmdbService>;
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with feel-good mood selected', () => {
    expect(component.selectedMood()).toBe('feel-good');
  });

  it('should have three mood buttons', () => {
    const buttons = fixture.nativeElement.querySelectorAll('button');
    expect(buttons.length).toBe(3);
    
    const buttonTexts = Array.from(buttons).map((btn: any) => btn.textContent.trim());
    expect(buttonTexts).toContain('Feel Good');
    expect(buttonTexts).toContain('Action Fix');
    expect(buttonTexts).toContain('Mind Benders');
  });

  it('should highlight selected mood button', () => {
    const buttons = fixture.nativeElement.querySelectorAll('button');
    const feelGoodButton = Array.from(buttons).find((btn: any) => btn.textContent.trim() === 'Feel Good') as HTMLElement;
    expect(feelGoodButton.classList.contains('bg-brand-600')).toBe(true);
    expect(feelGoodButton.classList.contains('text-white')).toBe(true);
  });

  it('should call API when mood is selected', (done) => {
    tmdbService.discoverByMood.and.returnValue(of(mockMovies));
    component.selectMood('action-fix');
    setTimeout(() => {
      expect(tmdbService.discoverByMood).toHaveBeenCalledWith('action-fix');
      done();
    }, 150);
  });

  it('should not call API when same mood is selected again', () => {
    tmdbService.discoverByMood.and.returnValue(of(mockMovies));
    
    const buttons = fixture.nativeElement.querySelectorAll('button');
    const feelGoodButton = Array.from(buttons).find((btn: any) => btn.textContent.trim() === 'Feel Good') as HTMLElement;
    feelGoodButton.click();
    
    expect(tmdbService.discoverByMood).not.toHaveBeenCalled();
  });

  it('should update selected mood when different mood is clicked', () => {
    tmdbService.discoverByMood.and.returnValue(of(mockMovies));
    
    // Call selectMood directly to test mood update
    component.selectMood('action-fix');
    
    expect(component.selectedMood()).toBe('action-fix');
  });

  it('should show loading state when fetching movies', () => {
    tmdbService.discoverByMood.and.returnValue(of(mockMovies));
    
    component.selectMood('action-fix');
    
    expect(component.loading()).toBe(true);
  });

  it('should hide loading and show movies when API call succeeds', (done) => {
    tmdbService.discoverByMood.and.returnValue(of(mockMovies));
    
    component.selectMood('action-fix');
    
    setTimeout(() => {
      expect(component.loading()).toBe(false);
      expect(component.movies()).toEqual(mockMovies.results);
      expect(component.error()).toBeNull();
      done();
    }, 150); // Account for the 100ms delay in fetch method
  });

  it('should show error when API call fails', (done) => {
    const errorMessage = 'API Error';
    tmdbService.discoverByMood.and.returnValue(throwError(() => new Error(errorMessage)));
    
    component.selectMood('action-fix');
    
    setTimeout(() => {
      expect(component.loading()).toBe(false);
      expect(component.error()).toBe('Failed to load movies.');
      expect(component.movies()).toEqual([]);
      done();
    }, 150);
  });

  it('should display movies when available', (done) => {
    tmdbService.discoverByMood.and.returnValue(of(mockMovies));
    
    component.selectMood('action-fix');
    
    setTimeout(() => {
      fixture.detectChanges();
      
      const movieCards = fixture.nativeElement.querySelectorAll('app-movie-card');
      expect(movieCards.length).toBe(2);
      done();
    }, 150);
  });

  it('should display "No results" when no movies are returned', (done) => {
    tmdbService.discoverByMood.and.returnValue(of({ ...mockMovies, results: [] }));
    
    component.selectMood('action-fix');
    
    setTimeout(() => {
      fixture.detectChanges();
      
      const noResultsText = fixture.nativeElement.textContent;
      expect(noResultsText).toContain('No results');
      done();
    }, 150);
  });

  it('should disable buttons during loading', () => {
    tmdbService.discoverByMood.and.returnValue(of(mockMovies));
    
    component.selectMood('action-fix');
    
    const buttons = fixture.nativeElement.querySelectorAll('button');
    buttons.forEach((button: any) => {
      expect(button.disabled).toBe(true);
    });
  });

  it('should enable buttons after loading completes', (done) => {
    tmdbService.discoverByMood.and.returnValue(of(mockMovies));
    
    component.selectMood('action-fix');
    
    setTimeout(() => {
      fixture.detectChanges();
      
      const buttons = fixture.nativeElement.querySelectorAll('button');
      buttons.forEach((button: any) => {
        expect(button.disabled).toBe(false);
      });
      done();
    }, 150);
  });

  it('should have search link', () => {
    const searchLink = fixture.nativeElement.querySelector('a[routerLink="/search"]');
    expect(searchLink).toBeTruthy();
    expect(searchLink.textContent.trim()).toContain('Go to Search');
  });

  it('should call fetch on ngOnInit', () => {
    spyOn(component as any, 'fetch');
    
    component.ngOnInit();
    
    expect((component as any).fetch).toHaveBeenCalled();
  });
}); 