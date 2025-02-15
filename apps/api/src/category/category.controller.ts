import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { xRC } from '@rumsan/extensions/decorators';
import { ACTIONS, APP, SUBJECTS } from '@rumsan/raman/constants';
import { tRC } from '@rumsan/sdk/types';
import { AbilitiesGuard, CheckAbilities, JwtGuard } from '@rumsan/user';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
@ApiTags('Category')
@ApiBearerAuth(APP.JWT_BEARER)
@UseGuards(JwtGuard, AbilitiesGuard)
export class CategoryController {
  private logger = new Logger('CategoryController');
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @CheckAbilities({ actions: ACTIONS.CREATE, subject: SUBJECTS.CATEGORY })
  createCategory(@Body() createCategory: CreateCategoryDto, @xRC() rc: tRC) {
    return this.categoryService.create(createCategory, rc);
  }

  @Get()
  @CheckAbilities({ actions: ACTIONS.READ, subject: SUBJECTS.CATEGORY })
  getCategories() {
    return this.categoryService.findAll();
  }

  @Get(':id')
  @CheckAbilities({ actions: ACTIONS.READ, subject: SUBJECTS.CATEGORY })
  getCategory(@Param('id') id: string) {
    return this.categoryService.findOne(id);
  }

  @Put(':id')
  @CheckAbilities({ actions: ACTIONS.UPDATE, subject: SUBJECTS.CATEGORY })
  updateCategory(
    @Param('id') id: string,
    @Body() updateCategory: UpdateCategoryDto,
    @xRC() rc: tRC,
  ) {
    return this.categoryService.update(id, updateCategory, rc);
  }

  @Delete(':id')
  @CheckAbilities({ actions: ACTIONS.DELETE, subject: SUBJECTS.CATEGORY })
  deleteCategory(@Param('id') id: string, @xRC() rc: tRC) {
    return this.categoryService.delete(id, rc);
  }
}
