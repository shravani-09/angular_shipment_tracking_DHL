import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { APP_CONSTANTS } from '../../../core/constants/app.constants';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loader.html',
  styleUrl: './loader.css',
})
export class Loader {
  constants = APP_CONSTANTS;
}
