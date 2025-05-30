import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Form, FormDocument } from './forms.model';
import { CreateFormDto } from './dto/create-form.dto';
import { UpdateFormDto } from './dto/update-form.dto';

@Injectable()
export class FormsService {
  constructor(
    @InjectModel(Form.name) private formModel: Model<FormDocument>,
  ) {}

  async findAll(): Promise<Form[]> {
    return this.formModel.find().exec();
  }

  async findOne(id: string): Promise<Form | null> {
    return this.formModel.findById(id).exec();
  }

  async findByTemplateId(templateId: string): Promise<Form[]> {
    return this.formModel.find({ templateId }).exec();
  }

  async create(createFormDto: CreateFormDto): Promise<Form> {
    const newForm = new this.formModel(createFormDto);
    return newForm.save();
  }

  async update(id: string, updateFormDto: UpdateFormDto): Promise<Form | null> {
    return this.formModel
      .findByIdAndUpdate(id, updateFormDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<Form | null> {
    return this.formModel.findByIdAndDelete(id).exec();
  }
}
