import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class JsonQueryParsePipe implements PipeTransform {
  transform(value: string) {
    try {
      return JSON.parse(value);
    } catch (error) {
      throw new BadRequestException();
    }
  }
}
