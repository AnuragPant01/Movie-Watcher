import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { environment } from '../environments/environment';

import { routes } from './app.routes';

export const TMDB_API_URL = 'https://api.themoviedb.org/3';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(
      withInterceptors([
        (req, next) => {
          const apiKey = environment.tmdbApiKey;
          const hasAbsoluteUrl = /^https?:\/\//i.test(req.url);
          const url = hasAbsoluteUrl ? req.url : `${TMDB_API_URL}${req.url}`;
          const headers = req.headers
            .set('Accept', 'application/json')
            .set('Authorization', apiKey ? `Bearer ${apiKey}` : req.headers.get('Authorization') || '');
          const cloned = req.clone({ url, headers });
          return next(cloned);
        },
      ])
    ),
  ],
};
