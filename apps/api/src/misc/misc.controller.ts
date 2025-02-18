import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MiscService } from './misc.service';

@Controller('misc')
@ApiTags('Misc')
export class MiscController {
  constructor(private readonly miscService: MiscService) {}

  @Get('lookup')
  getLookupData() {
    return this.miscService.getLookupData();
  }
}
