import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/adapters/handlebars.adapter';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import { ENV_VARS } from 'src/constants/env.constants';
import { MailService } from './mail.service';

@Module({
  imports: [
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const mailTransport = config.get<string>(ENV_VARS.MAIL_TRANSPORT);
        const mailHost = config.get<string>(ENV_VARS.MAIL_HOST);
        const mailPort = Number(config.get(ENV_VARS.MAIL_PORT));
        const mailUser = config.get<string>(ENV_VARS.MAIL_USER);
        const mailPass = config.get<string>(ENV_VARS.MAIL_PASS);

        const isTestTransport =
          mailTransport === 'test' ||
          mailTransport === 'json' ||
          mailHost === 'test' ||
          mailHost === 'jsonTransport' ||
          config.get<string>('APP_ENV') === 'test' ||
          config.get<string>('NODE_ENV') === 'test';

        const transport = isTestTransport
          ? {
              jsonTransport: true,
            }
          : {
              host: mailHost,
              port: mailPort,
              secure: mailPort === 465,
              auth: {
                user: mailUser,
                pass: mailPass,
              },
            };

        return {
          transport,
          defaults: {
            from: config.get<string>(ENV_VARS.MAIL_FROM) || '"MarketNest" <no-reply@marketnest.com>',
          },
          template: {
            dir: join(__dirname, 'templates'),
            adapter: new HandlebarsAdapter(),
            options: {
              strict: true,
            },
          },
        };
      },
    }),
  ],
  providers: [MailService],
  exports: [MailerModule, MailService],
})
export class MailModule {}
