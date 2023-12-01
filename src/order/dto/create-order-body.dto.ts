import {
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';
import { Types } from 'mongoose';
import { Transform, Type } from 'class-transformer';
import { BadRequestException } from '@nestjs/common';

export function toMongoObjectId({ value, key }): Types.ObjectId {
  if (Types.ObjectId.isValid(value)) {
    return new Types.ObjectId(value);
  } else {
    throw new BadRequestException(`${key} is not a valid MongoId`);
  }
}

export default class CreateOrderBody {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  price: number;

  @IsNotEmpty()
  @IsMongoId()
  client: string;
}
