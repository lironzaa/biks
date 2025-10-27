import { ChangeDetectionStrategy, Component, inject, Inject } from "@angular/core";
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef
} from "@angular/material/dialog";

import { ConfirmationDialogProps } from "../../../interfaces/components/dialogs/confirmation-dialog-interface";
import { Button } from "../../buttons/button/button";

@Component({
  selector: "app-confirmation-dialog",
  templateUrl: "./confirmation-dialog.component.html",
  styleUrl: "./confirmation-dialog.component.scss",
  imports: [
    Button,
    MatDialogActions,
    MatDialogContent,
    MatDialogClose
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfirmationDialogComponent {
  message: string = "Are you sure?";
  confirmButtonText = "Yes";
  cancelButtonText = "Cancel";
  dialogRef = inject(MatDialogRef<ConfirmationDialogComponent>);

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: ConfirmationDialogProps) {
    if (data) {
      this.message = data.message || this.message;
      if (data.buttonText) {
        this.confirmButtonText = data.buttonText.ok || this.confirmButtonText;
        this.cancelButtonText = data.buttonText.cancel || this.cancelButtonText;
      }
    }
  }

  onConfirmClick(): void {
    this.dialogRef.close(true);
  }
}
