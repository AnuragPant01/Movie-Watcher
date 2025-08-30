import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/landing/landing.page').then(m => m.LandingPage),
    title: 'What Should I Watch Tonight?'
  },
  {
    path: 'search',
    loadComponent: () => import('./features/search/search.page').then(m => m.SearchPage),
    title: 'Search Movies'
  },
  {
    path: 'movie/:id',
    loadComponent: () => import('./features/detail/movie-detail.page').then(m => m.MovieDetailPage),
    title: 'Movie Details'
  },
  { path: '**', redirectTo: '' }
];
