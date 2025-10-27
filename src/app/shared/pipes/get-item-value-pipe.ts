import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'getItemValue',
})
export class GetItemValuePipe implements PipeTransform {
  transform(item: any, property: any): any {
    return item?.[property];
  }

}
