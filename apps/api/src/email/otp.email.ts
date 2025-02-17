import { Injectable, Logger } from '@nestjs/common';

import {
  loadTemplateAndReplacePlaceholders,
  sendEmail,
} from '../utils/emails.utils';

@Injectable()
export class EmailOTP {
  private readonly logger = new Logger(EmailOTP.name);
  constructor() {}

  async send(address: string, otp: string) {
    const { text, html } = loadTemplateAndReplacePlaceholders(
      `${__dirname}/../assets/email-templates/otp.html`,
      { otp },
    );

    sendEmail({
      address: address,
      subject: `Your login OTP: ${otp}`,
      text,
      html,
    })
      .then(() => this.logger.log(`OTP sent to ${address}`))
      .catch((e) => this.logger.error(`sendOTPEmail: ${e.message}`));
  }
}
