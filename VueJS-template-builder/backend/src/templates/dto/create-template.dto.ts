import { IsString, IsOptional, IsBoolean, IsArray } from 'class-validator';
import { FormElement } from '../../forms/forms.model';

export class CreateTemplateDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  elements: FormElement[];

  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;

  @IsString()
  @IsOptional()
  createdBy?: string;
}
