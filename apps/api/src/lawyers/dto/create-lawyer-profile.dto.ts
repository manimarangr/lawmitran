import { ApiProperty } from "@nestjs/swagger";
import {
  ArrayNotEmpty,
  IsArray,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from "class-validator";

export class CreateLawyerProfileDto {
  @ApiProperty({ example: "DL/1234/2012" })
  @IsString()
  barCouncilNumber: string;

  @ApiProperty({ example: 12 })
  @IsInt()
  @Min(0)
  @Max(60)
  experience: number;

  @ApiProperty({ example: 1500 })
  @IsNumber()
  @Min(0)
  consultationFee: number;

  @ApiProperty({ example: "Delhi" })
  @IsString()
  city: string;

  @ApiProperty({ example: "Civil litigation and family dispute specialist." })
  @IsString()
  bio: string;

  @ApiProperty({ example: ["Hindi", "English"] })
  @IsArray()
  @ArrayNotEmpty()
  languages: string[];

  @ApiProperty({ example: ["Family Law", "Property Law"] })
  @IsArray()
  @ArrayNotEmpty()
  practiceAreas: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  educations?: { degree: string; institute: string; year: number }[];

  @ApiProperty({ required: false })
  @IsOptional()
  experiences?: { title: string; institution: string; years: number }[];
}
