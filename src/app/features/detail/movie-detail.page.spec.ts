import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { MovieDetailPage } from './movie-detail.page';

describe('MovieDetailPage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovieDetailPage],
      providers: [provideRouter([]), provideHttpClient()],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(MovieDetailPage);
    const comp = fixture.componentInstance;
    expect(comp).toBeTruthy();
  });
}); 