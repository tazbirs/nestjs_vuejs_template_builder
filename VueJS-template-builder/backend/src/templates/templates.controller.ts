import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { TemplatesService } from './templates.service';
import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';
import { Template } from './templates.model';

@Controller('templates')
export class TemplatesController {
  constructor(private readonly templatesService: TemplatesService) {}

  @Get()
  async findAll(): Promise<Template[]> {
    return this.templatesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Template | null> {
    return this.templatesService.findOne(id);
  }

  @Post()
  async create(
    @Body() createTemplateDto: CreateTemplateDto,
  ): Promise<Template> {
    return this.templatesService.create(createTemplateDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTemplateDto: UpdateTemplateDto,
  ): Promise<Template | null> {
    return this.templatesService.update(id, updateTemplateDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Template | null> {
    return this.templatesService.remove(id);
  }
}
