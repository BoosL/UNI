import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'stripChinese'})
export class StripChinesePipe implements PipeTransform {

  transform(text: string): string {
    return text.replace(/[\u4E00-\u9FA5]/g, '');
  }

}
