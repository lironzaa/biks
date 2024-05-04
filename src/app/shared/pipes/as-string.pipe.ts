import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "asString",
  pure: true
})
export class AsStringPipe implements PipeTransform {

  transform(value: string | number | []): string {
    return typeof value === "string" ? value : "";
  }

}
