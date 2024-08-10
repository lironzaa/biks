import { inject, Injectable } from "@angular/core";
import { ToastrService } from "ngx-toastr";

@Injectable({
  providedIn: "root"
})
export class ErrorService {
  toastr = inject(ToastrService);

  throwError(errorMessage: string): Error {
    this.toastr.error(errorMessage);
    return new Error(errorMessage);
  }
}
