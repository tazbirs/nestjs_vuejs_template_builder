import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { FormsService } from './forms.service';
import { CreateFormDto } from './dto/create-form.dto';
import { UpdateFormDto } from './dto/update-form.dto';
import { Form } from './forms.model';

@Controller('forms')
export class FormsController {
  constructor(private readonly formsService: FormsService) {}

  @Get()
  async findAll(): Promise<Form[]> {
    return this.formsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Form | null> {
    return this.formsService.findOne(id);
  }

  @Get('template/:templateId')
  async findByTemplateId(
    @Param('templateId') templateId: string,
  ): Promise<Form[]> {
    return this.formsService.findByTemplateId(templateId);
  }

  @Post()
  async create(@Body() createFormDto: CreateFormDto): Promise<Form> {
    return this.formsService.create(createFormDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateFormDto: UpdateFormDto,
  ): Promise<Form | null> {
    return this.formsService.update(id, updateFormDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Form | null> {
    return this.formsService.remove(id);
  }
}
