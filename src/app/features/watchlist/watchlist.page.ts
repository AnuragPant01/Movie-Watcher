import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { WatchlistService } from '../../core/watchlist.service';
import { MovieCardComponent } from '../../shared/movie-card/movie-card.component';

@Component({
  selector: 'app-watchlist-page',
  standalone: true,
  imports: [CommonModule, RouterLink, MovieCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './watchlist.page.html',
  styleUrl: './watchlist.page.scss'
})
export class WatchlistPage implements OnInit {
  private readonly watchlistService = inject(WatchlistService);
  
  readonly watchlist = this.watchlistService.watchlist;
  readonly watchlistCount = this.watchlistService.watchlistCount;

  ngOnInit(): void {
    // Scroll to top when the page loads
    this.scrollToTop();
  }

  private scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  clearWatchlist(): void {
    if (confirm('Are you sure you want to clear your entire watchlist?')) {
      this.watchlistService.clearWatchlist();
    }
  }
} 