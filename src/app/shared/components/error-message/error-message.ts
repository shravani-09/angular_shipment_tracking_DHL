import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-error-message',
  standalone: true,
  templateUrl: './error-message.html',
})
export class ErrorMessage {
  @Input() error: string = '';
}
