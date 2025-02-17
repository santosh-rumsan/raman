import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EVENTS } from '@rumsan/user';

import { EmailOTP } from 'src/email/otp.email';

@Injectable()
export class AuthListener {
  private readonly logger = new Logger(AuthListener.name);
  constructor(private email: EmailOTP) {}

  @OnEvent(EVENTS.OTP_CREATED)
  async sendOTPEmail(data: { address: string; otp: string }) {
    this.email.send(data.address, data.otp);
  }
}
