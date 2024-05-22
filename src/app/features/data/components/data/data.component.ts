import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "app-data",
  templateUrl: "./data.component.html",
  styleUrl: "./data.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DataComponent {
}
