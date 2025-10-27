import { ChangeDetectionStrategy, Component } from '@angular/core';

import { Data } from '../data/data';
import { TraineeForm } from '../trainee-form/trainee-form';

@Component({
  selector: 'app-page-wrapper',
  imports: [
    Data,
    TraineeForm
  ],
  templateUrl: './data-page-wrapper.html',
  styleUrl: './data-page-wrapper.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataPageWrapper {
}
