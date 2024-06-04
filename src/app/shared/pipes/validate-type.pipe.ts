import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "validateType",
  pure: true
})
export class ValidateTypePipe implements PipeTransform {
  transform(value: string | number): string | number {
    return value;
  }
}
