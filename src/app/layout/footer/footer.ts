import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { APP_CONSTANTS } from '../../core/constants/app.constants';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.html',
})
export class Footer {
  constants = APP_CONSTANTS;
}
