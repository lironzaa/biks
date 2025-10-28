import { Pipe, PipeTransform } from '@angular/core';
import { PASS_THRESHOLD } from '../../features/monitor/constants/monitor-constants';

@Pipe({
  name: 'traineeRowClass',
  standalone: true
})
export class TraineeRowClassPipe implements PipeTransform {
  transform(item: { average?: number } | null): string {
    if (!item || item.average === undefined) return '';
    const isPassed = item.average >= PASS_THRESHOLD;
    return isPassed ? 'row-passed' : 'row-failed';
  }
}