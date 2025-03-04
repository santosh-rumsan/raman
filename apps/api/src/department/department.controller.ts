import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { xRC } from '@rumsan/extensions/decorators';
import { ACTIONS, APP, SUBJECTS } from '@rumsan/raman/constants/index';
import { tRC } from '@rumsan/sdk/types';
import { AbilitiesGuard, CheckAbilities, JwtGuard } from '@rumsan/user';
import { DepartmentService } from './department.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import {
  DepartmentFilterDto,
  ListDepartmentDto,
  UpdateDepartmentDto,
} from './dto/update-department.dto';

@Controller('departments')
@ApiTags('Department')
@ApiBearerAuth(APP.JWT_BEARER)
@UseGuards(JwtGuard, AbilitiesGuard)
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) { }

  @Post()
  @CheckAbilities({ actions: ACTIONS.CREATE, subject: SUBJECTS.DEPARTMENT })
  createEntity(
    @Body() createDepartmentDto: CreateDepartmentDto,
    @xRC() rc: tRC,
  ) {
    return this.departmentService.create(createDepartmentDto, rc);
  }

  @Get()
  @CheckAbilities({ actions: ACTIONS.READ, subject: SUBJECTS.DEPARTMENT })
  //TODO: fix any
  getDepartments(@Query() query: ListDepartmentDto): any {
    return this.departmentService.findAll(query);
  }

  @Post('search')
  @CheckAbilities({ actions: ACTIONS.READ, subject: SUBJECTS.DEPARTMENT })
  //TODO:fix any
  listDepartmentsWithFilter(
    @Query() query: ListDepartmentDto,
    @Body() filters: DepartmentFilterDto
  ): any {
    return this.departmentService.findAll(query, filters)
  }

  @Get(':id')
  @CheckAbilities({ actions: ACTIONS.READ, subject: SUBJECTS.DEPARTMENT })
  getEntity(@Param('id') id: string) {
    return this.departmentService.findOne(id);
  }

  @Put(':id')
  @CheckAbilities({ actions: ACTIONS.UPDATE, subject: SUBJECTS.DEPARTMENT })
  updateEntity(
    @Param('id') id: string,
    @Body() updateDepartmentDto: UpdateDepartmentDto,
    @xRC() rc: tRC,
  ) {
    return this.departmentService.update(id, updateDepartmentDto, rc);
  }

  @Delete(':id')
  @CheckAbilities({ actions: ACTIONS.DELETE, subject: SUBJECTS.DEPARTMENT })
  deleteCategory(@Param('id') id: string, @xRC() rc: tRC) {
    return this.departmentService.delete(id, rc);
  }
}
