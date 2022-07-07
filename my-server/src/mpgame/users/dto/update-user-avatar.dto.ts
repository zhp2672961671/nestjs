import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserAvatarDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly avatar: string;

  updatedAt: Date;
}
