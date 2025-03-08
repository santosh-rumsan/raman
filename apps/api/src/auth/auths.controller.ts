import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { xRC } from '@rumsan/extensions/decorators';
import { OtpLoginDto } from '@rumsan/extensions/dtos';
import { tRC } from '@rumsan/sdk/types';
import { AuthService } from './auths.service';

@Controller('auth')
@ApiTags('Auth')
export class AuthsController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  loginOtp(@Body() dto: OtpLoginDto, @xRC() rdetails: tRC) {
    return this.authService.loginByOtp(dto, rdetails);
  }
}
