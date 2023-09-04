import { Module } from '@nestjs/common';
import { CredentialsService } from './credentials.service';
import { CredentialsController } from './credentials.controller';
import { CredentialRepository } from './credentials.repository';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [CredentialsController],
    providers: [CredentialsService, CredentialRepository],
    exports: [CredentialsService],
})

export class CredentialsModule { }