import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { FormElement } from '../forms/forms.model';

export type TemplateDocument = Template & Document;

@Schema({ timestamps: true })
export class Template {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ type: [Object] })
  elements: FormElement[];

  @Prop({ default: false })
  isPublished: boolean;

  @Prop()
  createdBy: string;
}

export const TemplateSchema = SchemaFactory.createForClass(Template);
