import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    JwtModule.register({
      secret: 'secret',
      signOptions: { expiresIn: '1d' },
    }),
    PrismaModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
})

export class UsersModule {}
