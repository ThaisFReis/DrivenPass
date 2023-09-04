import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, HttpException, HttpStatus, HttpCode } from '@nestjs/common';

import { NotesService } from './notes.service';
import { Note } from './notes.entity';
import { CreateNoteDto } from './notes.dto';
import { AuthGuard } from '../guard/auth.guard';
import { User } from '../decorators/user.decorator';

@Controller('notes')
@UseGuards(AuthGuard) // Use o seu guard de autenticação aqui
export class NotesController {
    constructor(private readonly notesService: NotesService) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(
        @Body() createNoteDto: CreateNoteDto,
        @User('id') userId: number,
    ): Promise<Note> {
        return this.notesService.create(createNoteDto, userId);
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    async findAll(@User('id') userId: number): Promise<Note[]> {
        return this.notesService.findAll(userId);
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    async findOne(
        @Param('id') id: number,
        @User('id') userId: number,
    ): Promise<Note> {
        const noteId = Number(id);

        if (isNaN(noteId)) {
            throw new HttpException('Invalid id', HttpStatus.BAD_REQUEST);
        }

        return this.notesService.findOne(noteId, userId);
    }

    @Put(':id')
    @HttpCode(HttpStatus.OK)
    async update(
        @Param('id') id: number,
        @Body() createNoteDto: CreateNoteDto,
        @User('id') userId: number,
    ): Promise<Note> {
        const noteId = Number(id);

        if (isNaN(noteId)) {
            throw new HttpException('Invalid id', HttpStatus.BAD_REQUEST);
        }

        return this.notesService.update(noteId, createNoteDto, userId);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async remove(@Param('id') id: number, @User('id') userId: number): Promise<void> {
        const noteId = Number(id);

        if (isNaN(noteId)) {
            throw new HttpException('Invalid id', HttpStatus.BAD_REQUEST);
        }

        await this.notesService.remove(noteId, userId);
    }
}
