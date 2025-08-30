import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { MovieCardComponent } from './movie-card.component';

describe('MovieCardComponent', () => {
  let fixture: ComponentFixture<MovieCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovieCardComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(MovieCardComponent);
    fixture.componentRef.setInput('id', 1);
    fixture.componentRef.setInput('title', 'Inception');
    fixture.componentRef.setInput('posterPath', '/x.png');
    fixture.componentRef.setInput('releaseDate', '2010-07-16');
    fixture.componentRef.setInput('voteAverage', 8.8);
    fixture.detectChanges();
  });

  it('should render title and year', () => {
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Inception');
    expect(text).toContain('2010');
  });

  it('imageUrl should build correct URL', () => {
    const comp = fixture.componentInstance;
    expect(comp.imageUrl()).toContain('/w342/x.png');
  });
}); 