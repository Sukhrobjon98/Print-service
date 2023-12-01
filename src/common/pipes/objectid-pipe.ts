import { Types } from 'mongoose';
import { BadRequestException, PipeTransform } from '@nestjs/common';

export default class ObjectIdPipe
  implements PipeTransform<string, Types.ObjectId>
{
  transform(value: string): Types.ObjectId {
    try {
      return new Types.ObjectId(value);
    } catch {
      throw new BadRequestException('Validation failed');
    }
  }
}
