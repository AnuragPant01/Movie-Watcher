# Movie Watcher

An Angular 18 app to discover, search, and view movie details using TMDB.

## Prerequisites
- Node 20+
- TMDB API key (v4 auth token). Create one at https://www.themoviedb.org/.

## API Key Setup
Set the API key at runtime via a global variable injected in `index.html` for simplicity during the exercise. Replace `YOUR_TMDB_V4_BEARER` with your token.

```html
<script>
  // Expose as global for the interceptor
  window.NG_APP_TMDB_API_KEY = 'YOUR_TMDB_V4_BEARER';
</script>
```

Alternatively, you can export before running:

```bash
export NG_APP_TMDB_API_KEY=YOUR_TMDB_V4_BEARER
```

## Development
```bash
npm install
npm start
```

## Testing
```bash
npm test
```

## Notes on Architecture
- Standalone components by default
- Signals for state in components
- Lazy-loaded feature pages
- HTTP Interceptor via `provideHttpClient(withInterceptors)`
- OnPush change detection, reactive forms, native control flow

## License
MIT
