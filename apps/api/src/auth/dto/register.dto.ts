import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { IsEmail, IsEnum, IsOptional, IsPhoneNumber, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'Asha Sharma' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'asha@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '+919876543210', required: false })
  @IsOptional()
  @IsPhoneNumber('IN')
  phone?: string;

  @ApiProperty({ example: 'Password123!' })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({ enum: UserRole, default: UserRole.CUSTOMER })
  @IsEnum(UserRole)
  role: UserRole = UserRole.CUSTOMER;
}
