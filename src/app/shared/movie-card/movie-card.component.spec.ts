import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { MovieCardComponent } from './movie-card.component';
import { WatchlistService } from '../../core/watchlist.service';

describe('MovieCardComponent', () => {
  let component: MovieCardComponent;
  let fixture: ComponentFixture<MovieCardComponent>;
  let watchlistService: jasmine.SpyObj<WatchlistService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('WatchlistService', ['addToWatchlist', 'removeFromWatchlist', 'isInWatchlist']);
    
    await TestBed.configureTestingModule({
      imports: [MovieCardComponent],
      providers: [
        provideRouter([]),
        { provide: WatchlistService, useValue: spy }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MovieCardComponent);
    component = fixture.componentInstance;
    watchlistService = TestBed.inject(WatchlistService) as jasmine.SpyObj<WatchlistService>;
    fixture.componentRef.setInput('id', 1);
    fixture.componentRef.setInput('title', 'Inception');
    fixture.componentRef.setInput('posterPath', '/x.png');
    fixture.componentRef.setInput('releaseDate', '2010-07-16');
    fixture.componentRef.setInput('voteAverage', 8.8);
    fixture.componentRef.setInput('compact', false);
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render title and year', () => {
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Inception');
    expect(text).toContain('2010');
  });

  it('should display movie poster when posterPath is provided', () => {
    const img = fixture.nativeElement.querySelector('img');
    expect(img).toBeTruthy();
    expect(img.src).toContain('https://image.tmdb.org/t/p/w342/x.png');
  });

  it('should display "No Image" when posterPath is null', () => {
    fixture.componentRef.setInput('posterPath', null);
    fixture.detectChanges();
    
    const noImageDiv = fixture.nativeElement.querySelector('.text-gray-400');
    expect(noImageDiv.textContent.trim()).toBe('No Image');
  });

  it('should display rating with star emoji', () => {
    const ratingElement = fixture.nativeElement.querySelector('.text-xs');
    expect(ratingElement.textContent).toContain('⭐');
    expect(ratingElement.textContent).toContain('8.8');
  });

  it('should display release year correctly', () => {
    expect(component.releaseYear()).toBe(2010);
  });

  it('should display dash for invalid release date', () => {
    fixture.componentRef.setInput('releaseDate', 'invalid-date');
    fixture.detectChanges();
    expect(component.releaseYear()).toBe('—');
  });

  it('should display dash for null release date', () => {
    fixture.componentRef.setInput('releaseDate', null);
    fixture.detectChanges();
    expect(component.releaseYear()).toBe('—');
  });

  it('should display dash for null release date', () => {
    fixture.componentRef.setInput('releaseDate', null);
    fixture.detectChanges();
    expect(component.releaseYear()).toBe('—');
  });

  it('should have watchlist button', () => {
    const watchlistButton = fixture.nativeElement.querySelector('button');
    expect(watchlistButton).toBeTruthy();
  });

  it('should call addToWatchlist when movie is not in watchlist', () => {
    watchlistService.isInWatchlist.and.returnValue(false);
    
    const watchlistButton = fixture.nativeElement.querySelector('button');
    watchlistButton.click();
    
    expect(watchlistService.addToWatchlist).toHaveBeenCalledWith({
      id: 1,
      title: 'Inception',
      posterPath: '/x.png',
      releaseDate: '2010-07-16',
      voteAverage: 8.8
    });
  });



  it('should call addToWatchlist when movie is not in watchlist', () => {
    watchlistService.isInWatchlist.and.returnValue(false);
    
    const event = new MouseEvent('click');
    component.toggleWatchlist(event);
    
    expect(watchlistService.addToWatchlist).toHaveBeenCalledWith({
      id: 1,
      title: 'Inception',
      posterPath: '/x.png',
      releaseDate: '2010-07-16',
      voteAverage: 8.8
    });
  });

  it('should prevent event propagation on watchlist button click', () => {
    const event = new MouseEvent('click');
    spyOn(event, 'preventDefault');
    spyOn(event, 'stopPropagation');
    
    component.toggleWatchlist(event);
    
    expect(event.preventDefault).toHaveBeenCalled();
    expect(event.stopPropagation).toHaveBeenCalled();
  });

  it('should not call watchlist methods if movie ID is null', () => {
    fixture.componentRef.setInput('id', null);
    fixture.detectChanges();
    
    const event = new MouseEvent('click');
    component.toggleWatchlist(event);
    
    expect(watchlistService.addToWatchlist).not.toHaveBeenCalled();
    expect(watchlistService.removeFromWatchlist).not.toHaveBeenCalled();
  });

  it('should show filled bookmark when movie is in watchlist', () => {
    watchlistService.isInWatchlist.and.returnValue(true);
    fixture.detectChanges();
    
    const filledBookmark = fixture.nativeElement.querySelector('svg[class*="text-brand-600"]');
    expect(filledBookmark).toBeTruthy();
  });

  it('should show outline bookmark when movie is not in watchlist', () => {
    watchlistService.isInWatchlist.and.returnValue(false);
    fixture.detectChanges();
    
    const outlineBookmark = fixture.nativeElement.querySelector('svg[class*="text-gray-600"]');
    expect(outlineBookmark).toBeTruthy();
  });

  it('should not render movie info when compact is true', () => {
    fixture.componentRef.setInput('compact', true);
    fixture.detectChanges();
    
    const movieInfo = fixture.nativeElement.querySelector('.p-3');
    expect(movieInfo).toBeFalsy();
  });

  it('should render movie info when compact is false', () => {
    fixture.componentRef.setInput('compact', false);
    fixture.detectChanges();
    
    const movieInfo = fixture.nativeElement.querySelector('.p-3');
    expect(movieInfo).toBeTruthy();
  });
}); 