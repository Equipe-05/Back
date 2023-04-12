import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import configuration from './common/config/configuration';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProductModule } from './product/product.module';
import { FranchiseModule } from './franchise/franchise.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    PrismaModule,
    UserModule,
    AuthModule,
    ProductModule,
    FranchiseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
