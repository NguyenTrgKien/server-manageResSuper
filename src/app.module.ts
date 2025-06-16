import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { ConfigModule } from '@nestjs/config';
import { RolesModule } from './modules/roles/roles.module';
import { CustomersModule } from './modules/customers/customers.module';
import { EmployessModule } from './modules/employess/employess.module';
import { ReservationModule } from './modules/reservation/reservation.module';
import { TablesModule } from './modules/tables/tables.module';
import { AreasModule } from './modules/areas/areas.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { OrdersModule } from './modules/orders/orders.module';
import { OrderItemModule } from './modules/order_item/order_item.module';
import { DishsModule } from './modules/dishs/dishs.module';
import { CategoryModule } from './modules/category/category.module';
import { CombosModule } from './modules/combos/combos.module';
import { ComboItemModule } from './modules/combo_item/combo_item.module';
dotenv.config();

@Module({
  imports: [
    ConfigModule.forRoot({
      // Cấu hình để có thể sử dụng biến mối trường
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      // Cấu hình kết nối đến database
      type: 'postgres',
      host: process.env.DB_HOST || '',
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      ssl: {
        rejectUnauthorized: false, // Supabase yêu cầu ssl
      },
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, //Chỉ dùng trong dev!
    }),
    UsersModule,
    RolesModule,
    CustomersModule,
    EmployessModule,
    ReservationModule,
    TablesModule,
    AreasModule,
    PaymentsModule,
    OrdersModule,
    OrderItemModule,
    DishsModule,
    CategoryModule,
    CombosModule,
    ComboItemModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
