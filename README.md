# 🎬 Movie Watcher

A modern, responsive movie discovery application built with Angular 18 that helps you find the perfect movie based on your mood. Discover, search, and save your favorite movies with a beautiful, intuitive interface.

## 🌐 Live Demo

**🎬 [View Live Application](https://watch-listly.netlify.app/)**

Experience the full application with all features including mood-based movie discovery, search functionality, and personal watchlist management.

## ✨ Features

### 🎯 **Movie Discovery by Mood**
- **Feel Good** - Comedy, family, and romance movies
- **Action Fix** - High-octane action and thriller films  
- **Mind Benders** - Mystery, sci-fi, and psychological thrillers

### 🔍 **Advanced Search**
- Search movies by title
- Search people (actors, directors)
- Real-time search with debouncing
- Responsive search results

### 💾 **Personal Watchlist**
- Add/remove movies to your watchlist
- Persistent storage using localStorage
- Watchlist counter in navigation
- Dedicated watchlist page with clear all functionality

### 🎬 **Detailed Movie Information**
- Comprehensive movie details
- Cast and crew information
- Movie trailers and videos
- Similar movie recommendations
- Movie ratings and release dates

### 🎨 **Modern UI/UX**
- Responsive design for all devices
- Dark/light mode support
- Smooth animations and transitions
- Professional loading states
- SEO optimized

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- TMDB API key (see configuration below)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/AnuragPant01/Movie-Watcher
   cd movie-watcher
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure TMDB API Key** (see configuration section below)

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Open your browser**
   Navigate to `http://localhost:4200`

## 🔑 TMDB API Configuration

This application uses The Movie Database (TMDB) API to fetch movie data. Follow these steps to get your API key:

### Step 1: Get TMDB API Key

1. **Visit TMDB Website**
   - Go to [https://www.themoviedb.org/](https://www.themoviedb.org/)
   - Create a free account or sign in

2. **Request API Access**
   - Go to your [Account Settings](https://www.themoviedb.org/settings/api)
   - Click on "API" in the left sidebar
   - Request an API key for "Developer" use

3. **Get Your API Key**
   - Once approved, you'll receive:
     - **API Key (v3 auth)**: `your_api_key_here`
     - **Bearer Token**: `eyJhbGciOiJIUzI1NiJ9...`

### Step 2: Configure the Application

#### Option A: Environment Variables (Recommended)

1. **Update Environment Files**

   Edit `src/environments/environment.ts`:
   ```typescript
   export const environment = {
     production: true,
     tmdbApiKey: 'your_bearer_token_here'
   };
   ```

   Edit `src/environments/environment.development.ts`:
   ```typescript
   export const environment = {
     production: false,
     tmdbApiKey: 'your_bearer_token_here'
   };
   ```

2. **Replace the placeholder**
   - Replace `your_bearer_token_here` with your actual TMDB Bearer Token
   - **Important**: Use the Bearer Token, not the API Key

#### Option B: Direct Configuration (Quick Setup)

If you want to test quickly, you can directly update the app configuration:

1. **Edit `src/app/app.config.ts`**
   ```typescript
   // Replace this line:
   const apiKey = environment.tmdbApiKey;
   
   // With your Bearer Token:
   const apiKey = 'eyJhbGciOiJIUzI1NiJ9.your_actual_bearer_token_here';
   ```

### Step 3: Verify Configuration

1. **Start the application**
   ```bash
   npm start
   ```

2. **Test the API**
   - Navigate to the home page
   - Select a mood (e.g., "Feel Good")
   - If movies load, your API key is working correctly

## 🛠️ Development

### Available Scripts

```bash
# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Build and watch for changes
npm run watch
```

### Key Technologies

- **Angular 18** - Modern framework with signals
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **RxJS** - Reactive programming
- **TMDB API** - Movie database

## 🎨 Customization

### Styling
The application uses Tailwind CSS for styling. You can customize:

- **Colors**: Edit `tailwind.config.js` for brand colors
- **Components**: Modify component-specific SCSS files
- **Global styles**: Update `src/styles.scss`

### Features
- **Add new moods**: Update `src/app/core/tmdb.service.ts`
- **Modify movie cards**: Edit `src/app/shared/movie-card/`
- **Change layout**: Modify component templates

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy Options
- **Netlify**: Drag and drop the `dist/movie-watcher/browser` folder

### Environment Variables for Production
Make sure to set your TMDB API key in your hosting platform's environment variables.

## 📞 Support

If you encounter any issues:

1. Check the [TMDB API documentation](https://developers.themoviedb.org/3)
2. Verify your API key configuration
3. Open an issue on GitHub

---

**Built with ❤️ by [Anurag Pant](https://anurag-pant-portfolio.netlify.app/)**

*Movie Watcher - Discover your next favorite film! 🎬*
