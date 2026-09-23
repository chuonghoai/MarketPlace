import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './core/common/filters/http-exception.filter';
import { LoggingInterceptor } from './core/common/interceptors/logging.interceptor';
import { NestExpressApplication } from '@nestjs/platform-express';
import cookieParser from 'cookie-parser';
import { exec } from 'child_process';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './module/users/entities/user.entity';
import { EUserRole } from './module/users/enums/user.enum';
import * as bcrypt from 'bcrypt';

async function seedUsers(app: NestExpressApplication) {
  const userRepository = app.get(getRepositoryToken(User));
  const usersToCreate = [
    { email: 'admin@example.com', role: EUserRole.ADMIN },
    { email: 'staff@example.com', role: EUserRole.STAFF },
    { email: 'client@example.com', role: EUserRole.USER },
  ];

  for (const u of usersToCreate) {
    const exists = await userRepository.findOne({ where: { email: u.email } });
    if (!exists) {
      const hashedPassword = await bcrypt.hash('password123', 10);
      const newUser = userRepository.create({
        email: u.email,
        password: hashedPassword,
        fullName: u.role,
        role: u.role,
      });
      await userRepository.save(newUser);
      console.log(`[Seeder] Created ${u.role} user: ${u.email}`);
    }
  }
}

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(cookieParser());

  app.set('trust proxy', 'loopback');

  const activeEnv = process.env.APP_ENV;
  if (!activeEnv) {
    throw new Error('APP_ENV is required in environment variables (dev or prod)');
  }
  console.log(`[Bootstrap] Starting MarketNest Backend in [${activeEnv.toUpperCase()}] mode (NODE_ENV: ${process.env.NODE_ENV})...`);

  const rawCors = process.env.CORS_ALLOWED_ORIGINS;
  if (!rawCors) {
    throw new Error('CORS_ALLOWED_ORIGINS is required in environment variables');
  }
  const allowedOrigins = rawCors.split(',').map((o) => o.trim()).filter(Boolean);

  app.enableCors({
    origin: allowedOrigins.length === 1 ? allowedOrigins[0] : allowedOrigins,
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new LoggingInterceptor());

  await seedUsers(app);

  const ngrokCmd = process.env.CMD_NGROK;
  if (ngrokCmd) {
    const killCmd = process.platform === 'win32' ? 'taskkill /f /im ngrok.exe' : 'killall ngrok';
    exec(killCmd, () => {
      console.log(`[Ngrok] Starting ngrok: ${ngrokCmd}`);
      const ngrokProcess = exec(ngrokCmd);

      ngrokProcess.stdout?.on('data', (data) => {
        console.log(`[Ngrok] ${data.toString().trim()}`);
      });

      ngrokProcess.stderr?.on('data', (data) => {
        const msg = data.toString().trim();
        if (msg) console.error(`[Ngrok Error] ${msg}`);
      });
    });
  }

  const port = process.env.PORT;
  if (!port) {
    throw new Error('PORT is required in environment variables');
  }
  await app.listen(port, '0.0.0.0');
  console.log(`[Bootstrap] MarketNest Backend is running at http://localhost:${port} [${activeEnv.toUpperCase()}]`);
}
bootstrap();

