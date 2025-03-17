import { MailerModule as NestMailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    NestMailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          transport: `smtps://${configService.get<string>('MAILER_USER')}:${configService.get<string>('MAILER_PASSWORD')}@${configService.get<string>('MAILER_HOST')}`,
          defaults: {
            from: `"${configService.get<string>('MAILER_NAME')}" <${configService.get<string>('MAILER_USER')}>`,
          },
          template: {
            dir: __dirname + '/templates',
            adapter: new HandlebarsAdapter(),
            options: {
              strict: true,
            },
          },
        };
      },
    }),
  ],
})
export class MailerModule {}
