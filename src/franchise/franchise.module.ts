import { Module } from '@nestjs/common';
import { FranchiseService } from './franchise.service';
import { FranchiseController } from './franchise.controller';
import { PassportModule } from '@nestjs/passport';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule, PassportModule.register({ defaultStrategy: 'jwt' })],
  controllers: [FranchiseController],
  providers: [FranchiseService],
})
export class FranchiseModule {}
