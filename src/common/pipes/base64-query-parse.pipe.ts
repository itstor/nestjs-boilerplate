import { Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class Base64QueryParsePipe implements PipeTransform {
  transform(value: string) {
    return Buffer.from(value, 'base64').toString('ascii');
  }
}
