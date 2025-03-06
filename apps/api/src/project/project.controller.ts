import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { xRC } from '@rumsan/extensions/decorators';
import { ACTIONS, APP, SUBJECTS } from '@rumsan/raman/constants';
import { tRC } from '@rumsan/sdk/types';
import { AbilitiesGuard, CheckAbilities, JwtGuard } from '@rumsan/user';
import { CreateProjectDto } from './dto/create-project.dto';
import {
  ListProjectDto,
  ProjectFilterDto,
  UpdateProjectDto,
} from './dto/update-project.dto';
import { ProjectService } from './project.service';

@Controller('projects')
@ApiTags('Project')
@ApiBearerAuth(APP.JWT_BEARER)
@UseGuards(JwtGuard, AbilitiesGuard)
export class ProjectController {
  private logger = new Logger('ProjectController');
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  @CheckAbilities({ actions: ACTIONS.CREATE, subject: SUBJECTS.PROJECT })
  createEntity(@Body() createProjectDto: CreateProjectDto, @xRC() rc: tRC) {
    return this.projectService.create(createProjectDto, rc);
  }

  @Get()
  @CheckAbilities({ actions: ACTIONS.READ, subject: SUBJECTS.PROJECT })
  //TODO: fix any
  getProjects(@Query() query: ListProjectDto): any {
    return this.projectService.findAll(query);
  }

  @Post('search')
  @CheckAbilities({ actions: ACTIONS.READ, subject: SUBJECTS.PROJECT })
  //TODO:fix any
  listExpensesWithFilter(
    @Query() query: ListProjectDto,
    @Body() filters: ProjectFilterDto,
  ): any {
    return this.projectService.findAll(query, filters);
  }

  @Get(':id')
  @CheckAbilities({ actions: ACTIONS.READ, subject: SUBJECTS.PROJECT })
  getEntity(@Param('id') id: string) {
    return this.projectService.findOne(id);
  }

  @Put(':id')
  @CheckAbilities({ actions: ACTIONS.UPDATE, subject: SUBJECTS.PROJECT })
  updateEntity(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
    @xRC() rc: tRC,
  ) {
    return this.projectService.update(id, updateProjectDto, rc);
  }

  @Delete(':id')
  @CheckAbilities({ actions: ACTIONS.DELETE, subject: SUBJECTS.PROJECT })
  deleteCategory(@Param('id') id: string, @xRC() rc: tRC) {
    return this.projectService.delete(id, rc);
  }
}
