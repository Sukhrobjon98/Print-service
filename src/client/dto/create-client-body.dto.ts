import { IsNotEmpty, IsString } from 'class-validator';

export declare class CreateClientBody {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  phone: string;
}
