import { Pipe, PipeTransform} from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
    name: 'dateFormat'
  })
  export class DateComComponent extends DatePipe implements PipeTransform {
    transform(value: any, args?: any): any {
       return super.transform(value, "dd/MMM/yyyy");
    }

    transformDate(value: any, args?: any): any {
      return super.transform(value, "yyyy-MM-dd");
   }
  }