import { Injectable } from '@nestjs/common';
import { OtpLoginDto } from '@rumsan/extensions/dtos';
import { PrismaService } from '@rumsan/prisma';
import { tRC } from '@rumsan/sdk';
import { AuthsService } from '@rumsan/user';

@Injectable()
export class AuthService {
  constructor(
    private readonly rsauth: AuthsService,
    private readonly prisma: PrismaService,
  ) {}

  async loginByOtp(dto: OtpLoginDto, rdetails: tRC) {
    const { currentUser, accessToken } = await this.rsauth.loginByOtp(
      dto,
      rdetails,
    );

    const userDetails = await this.prisma.userDetails.findUnique({
      where: { cuid: currentUser.cuid },
    });

    return {
      accessToken,
      currentUser,
      userDetails,
    };
  }
}
