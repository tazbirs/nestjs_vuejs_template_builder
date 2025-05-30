import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type FormDocument = Form & Document;

export class FormElementValidation {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: string; // For regex validation
  patternDescription?: string; // Description of the pattern for user feedback
  min?: number;
  max?: number;
  minDate?: Date | string; // Minimum date for date validation
  maxDate?: Date | string; // Maximum date for date validation
  dateRangeEnabled?: boolean; // Enable date range selection
  mobileNumberFormat?: string; // Format for mobile number validation
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
  type: string; // text, textarea, select, checkbox, radio, date, date-range, mobile, etc.
  label: string;
  name: string;
  placeholder?: string;
  defaultValue?: string | string[]; // Can be array for date range
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
  
  // Additional fields for specific element types
  image?: string; // For image and header elements
  startPlaceholder?: string; // For date-range elements
  endPlaceholder?: string; // For date-range elements
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
