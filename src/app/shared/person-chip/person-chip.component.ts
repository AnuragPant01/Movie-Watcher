import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-person-chip',
  standalone: true,
  imports: [NgOptimizedImage],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'inline-flex flex-col items-center text-center',
  },
  templateUrl: './person-chip.component.html',
  styleUrl: './person-chip.component.scss'
})
export class PersonChipComponent {
  name = input.required<string>();
  role = input<string>('');
  profileUrl = input<string | null>(null);
} 