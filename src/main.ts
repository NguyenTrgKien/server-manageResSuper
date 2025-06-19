import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('/api/v1');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // tự động loại bỏ các field không nằm trong DTO
      forbidNonWhitelisted: true, // Báo lỗi nếu có field lạ
      transform: true, // Tự động chuyển đổi dữ liệu theo kiểu class
      exceptionFactory(errors) {
        const message = errors.map((error) => {
          const constraints = error.constraints;
          const firstError = constraints
            ? Object.values(constraints)[0]
            : 'Lỗi không xác định!';
          return firstError;
        });
        return new BadRequestException({
          statusCode: 400,
          error: 'Bad request',
          message: message,
        });
      },
    }),
  );
  await app.listen(process.env.PORT ?? 8080);
}
bootstrap();
