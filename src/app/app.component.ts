import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { WatchlistService } from './core/watchlist.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'app-root' }
})
export class AppComponent {
  private readonly watchlistService = inject(WatchlistService);
  
  readonly watchlistCount = this.watchlistService.watchlistCount;
  
  title = 'movie-watcher';
  get currentYear(): number {
    return new Date().getFullYear();
  }
}
