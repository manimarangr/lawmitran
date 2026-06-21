import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsDate, IsOptional, IsString } from "class-validator";

export class CreateConsultationDto {
  @ApiProperty()
  @IsString()
  lawyerId: string;

  @ApiProperty({ example: "2026-07-01T10:30:00.000Z" })
  @Type(() => Date)
  @IsDate()
  consultationDate: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ required: false, type: [String] })
  @IsOptional()
  @IsArray()
  documentUrls?: string[];
}
