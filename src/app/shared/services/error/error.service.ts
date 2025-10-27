import { inject, Injectable } from '@angular/core';

import { AppToastrService } from '../toastr/toastr.service';
import { ToastrTypeEnum } from '../../enums/toastr/toastr-type.enum';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {
  toastrService = inject(AppToastrService);

  throwError(errorMessage: string): Error {
    this.toastrService.showToastr(errorMessage, ToastrTypeEnum.Error);
    return new Error(errorMessage);
  }
}
