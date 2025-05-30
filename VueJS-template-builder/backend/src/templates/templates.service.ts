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
    const newTemplate = new this.templateModel(createTemplateDto);
    return newTemplate.save();
  }

  async update(id: string, updateTemplateDto: UpdateTemplateDto): Promise<Template | null> {
    return this.templateModel
      .findByIdAndUpdate(id, updateTemplateDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<Template | null> {
    return this.templateModel.findByIdAndDelete(id).exec();
  }
}
