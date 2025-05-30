import {
  IsString,
  IsOptional,
  IsBoolean,
  IsArray,
} from 'class-validator';
import { FormElement } from '../forms.model';

export class CreateFormDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  elements: FormElement[];

  @IsString()
  @IsOptional()
  templateId?: string;

  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;

  @IsString()
  @IsOptional()
  createdBy?: string;
}
