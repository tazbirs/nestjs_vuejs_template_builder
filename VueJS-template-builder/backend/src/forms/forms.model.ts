import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type FormDocument = Form & Document;

export class FormElementValidation {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  min?: number;
  max?: number;
  options?: string[];
}

export class FormElementStyle {
  width?: string;
  height?: string;
  backgroundColor?: string;
  textColor?: string;
  fontSize?: string;
  padding?: string;
  margin?: string;
  borderRadius?: string;
  border?: string;
}

export class FormElement {
  id: string;
  type: string; // text, textarea, select, checkbox, radio, date, etc.
  label: string;
  name: string;
  placeholder?: string;
  defaultValue?: string;
  helperText?: string;
  validation?: FormElementValidation;
  style?: FormElementStyle;
  options?: { label: string; value: string }[];
  required?: boolean;
  order?: number;
  x?: number; // For drag and drop positioning
  y?: number; // For drag and drop positioning
  width?: number; // For responsive layouts
  height?: number;
}

@Schema({ timestamps: true })
export class Form {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ type: [Object] })
  elements: FormElement[];

  @Prop({ type: String, ref: 'Template' })
  templateId: string;

  @Prop({ default: false })
  isPublished: boolean;

  @Prop()
  createdBy: string;
}

export const FormSchema = SchemaFactory.createForClass(Form);
