import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-person-chip',
  standalone: true,
  imports: [],
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