import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { BillingMailData, OrderStatusMailData, OtpMailData } from './dto/mail.dto';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(private readonly mailerService: MailerService) {}

  async sendOtpEmail(email: string, data: OtpMailData): Promise<void> {
    const subject = data.isRegister ? 'Mã OTP đăng ký - MarketNest' : 'Mã OTP quên mật khẩu - MarketNest';
    
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: subject,
        template: './otp',
        context: {
          otp: data.generatedOtp
        },
      });
    } catch (e) {
      this.logger.error(`Lỗi gửi mail OTP tới ${email}: ${e.message}`, e.stack);
      throw e;
    }
  }

  async sendOrderStatusUpdateEmail(email: string, data: OrderStatusMailData): Promise<void> {
    this.mailerService.sendMail({
      to: email,
      subject: `Cập nhật trạng thái đơn hàng #${data.orderCode}`,
      template: './order-status-update',
      context: data,
    }).catch(e => {
      this.logger.error(`Lỗi gửi mail trạng thái tới ${email}: ${e.message}`, e.stack);
    });
  }

  async sendBillingEmail(email: string, data: BillingMailData): Promise<void> {
    this.mailerService.sendMail({
      to: email,
      subject: `Hóa đơn đơn hàng #${data.orderCode} - MarketNest`,
      template: './billing',
      context: data,
    }).catch(e => {
      this.logger.error(`Lỗi gửi mail hóa đơn tới ${email}: ${e.message}`, e.stack);
    });
  }

  async sendStaffAccountMail(data: any): Promise<void> {
    this.mailerService.sendMail({
      to: data.email,
      subject: `Thông tin tài khoản nhân viên - MarketNest`,
      template: './staff-account',
      context: data,
    }).catch(e => {
      this.logger.error(`Lỗi gửi mail tài khoản nhân viên tới ${data.email}: ${e.message}`, e.stack);
    });
  }
}
