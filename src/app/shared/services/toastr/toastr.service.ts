import { inject, Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import { ToastrTypeEnum } from '../../enums/toastr/toastr-type.enum';

@Injectable({
  providedIn: 'root'
})
export class AppToastrService {
  private toastr = inject(ToastrService);

  showToastr(message: string, type: ToastrTypeEnum.Error | ToastrTypeEnum.Warning | ToastrTypeEnum.Success): void {
    switch (type) {
      case ToastrTypeEnum.Success:
        this.toastr.success(message);
        break;
      case ToastrTypeEnum.Warning:
        this.toastr.warning(message);
        break
      case ToastrTypeEnum.Error:
        this.toastr.error(message);
        break
    }
  }
}
