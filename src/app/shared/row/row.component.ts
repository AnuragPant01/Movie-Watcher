import { ChangeDetectionStrategy, Component, ElementRef, HostListener, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'app-row',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './row.component.html',
  styleUrl: './row.component.scss',
  host: { class: 'block' }
})
export class RowComponent {
  @Input({ required: true }) title!: string;
  @ViewChild('scroller', { static: true }) scroller!: ElementRef<HTMLDivElement>;

  scrollBy(delta: number): void {
    this.scroller.nativeElement.scrollBy({ left: delta, behavior: 'smooth' });
  }
} 