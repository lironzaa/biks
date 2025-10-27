import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-button',
  imports: [ MatButtonModule ],
  templateUrl: './button.html',
  styleUrl: './button.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Button {
  ariaLabel = input<string>();
  color = input<'primary' | 'accent' | 'warn'>('primary');
  isDisabled = input<boolean>(false);
  text = input<string>();
  title = input<string>();
  type = input<'button' | 'submit'>('button');
  variant = input<'raised' | 'stroked' | 'flat' | 'fab'>('raised');
  buttonClicked = output<Event>();

  onButtonClick(event: Event): void {
    this.buttonClicked.emit(event);
  }
}
