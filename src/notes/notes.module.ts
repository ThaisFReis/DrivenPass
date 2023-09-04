import { Module } from '@nestjs/common';
import { NotesController } from './notes.controller';
import { NotesService } from './notes.service';
import { NoteRepository } from './notes.repository';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [NotesController],
    providers: [NotesService, NoteRepository],
    exports: [NotesService],
})

export class NotesModule { }