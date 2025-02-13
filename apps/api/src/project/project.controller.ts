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
import { ACTIONS, APP, SUBJECTS } from '@rumsan/raman/constants/index';
import { tRC } from '@rumsan/sdk/types';
import { AbilitiesGuard, CheckAbilities, JwtGuard } from '@rumsan/user';
import { CreateProjectDto } from './dto/create-project.dto';
import {
  DeleteProjectDto,
  GetProjectDto,
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
  getCategories(@Query() query: GetProjectDto): any {
    return this.projectService.findAll(query);
  }

  @Get(':id')
  @CheckAbilities({ actions: ACTIONS.READ, subject: SUBJECTS.PROJECT })
  getEntity(@Param('id') id: string) {
    return this.projectService.findOne(id);
  }

  @Put(':id')
  @CheckAbilities({ actions: ACTIONS.UPDATE, subject: SUBJECTS.DEPARTMENT })
  updateEntity(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
    @xRC() rc: tRC,
  ) {
    return this.projectService.update(id, updateProjectDto, rc);
  }

  @Delete(':id')
  @CheckAbilities({ actions: ACTIONS.DELETE, subject: SUBJECTS.DEPARTMENT })
  deleteCategory(
    @Param('id') id: string,
    @Body() deleteProjectDto: DeleteProjectDto,
    @xRC() rc: tRC,
  ) {
    return this.projectService.delete(id, deleteProjectDto, rc);
  }
}
