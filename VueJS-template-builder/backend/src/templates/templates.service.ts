import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Template, TemplateDocument } from './templates.model';
import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';

@Injectable()
export class TemplatesService {
  constructor(
    @InjectModel(Template.name) private templateModel: Model<TemplateDocument>,
  ) {}

  async findAll(): Promise<Template[]> {
    return this.templateModel.find().exec();
  }

  async findOne(id: string): Promise<Template | null> {
    return this.templateModel.findById(id).exec();
  }

  async create(createTemplateDto: CreateTemplateDto): Promise<Template> {
    try {
      // Log creation data for debugging but trim it to avoid excessive output
      const loggableDto = {
        ...createTemplateDto,
        elements: createTemplateDto.elements ? 
          `[${createTemplateDto.elements.length} elements]` : 
          'No elements'
      };
      console.log('Template create - DTO:', JSON.stringify(loggableDto));
      
      const newTemplate = new this.templateModel(createTemplateDto);
      return newTemplate.save();
    } catch (error) {
      console.error('Error creating template:', error);
      throw error;
    }
  }

  async update(id: string, updateTemplateDto: UpdateTemplateDto): Promise<Template | null> {
    try {
      console.log('Template update - ID:', id);
      
      // Log update data for debugging but trim it to avoid excessive output
      const loggableDto = {
        ...updateTemplateDto,
        elements: updateTemplateDto.elements ? 
          `[${updateTemplateDto.elements.length} elements]` : 
          'No elements'
      };
      console.log('Template update - DTO:', JSON.stringify(loggableDto));
      
      // We'll just pass the DTO directly now that we've updated the FormElement interface
      return this.templateModel
        .findByIdAndUpdate(id, updateTemplateDto, { new: true, runValidators: true })
        .exec();
    } catch (error) {
      console.error('Error updating template:', error);
      throw error;
    }
  }

  async remove(id: string): Promise<Template | null> {
    return this.templateModel.findByIdAndDelete(id).exec();
  }
}
