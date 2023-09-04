import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { NoteRepository } from './notes.repository';
import { CreateNoteDto } from './notes.dto';
import { Note } from './notes.entity';

@Injectable()
export class NotesService {
    constructor(private readonly noteRepository: NoteRepository) { }

    async create(createNoteDto: CreateNoteDto, userId: number): Promise<Note> {
        const { title, content } = createNoteDto;

        if (!title || !content) {
            throw new NotFoundException('Missing required fields');
        }

        // Verifique se a nota com o mesmo título já existe
        const existingNote = await this.noteRepository.findByTitle(title, userId);
        if (existingNote) {
            throw new ConflictException('Note with the same title already exists');
        }

        return this.noteRepository.create(title, content, userId);
    }

    async findAll(userId: number): Promise<Note[]> {
        return this.noteRepository.findUserNotes(userId);
    }

    async findOne(id: number, userId: number): Promise<Note> {

        const note = await this.noteRepository.findNoteById(id, userId);
        if (!note || note.userId !== userId) {
            throw new NotFoundException('Note not found');
        }

        return note;
    }

    async update(id: number, createNoteDto: CreateNoteDto, userId: number): Promise<Note> {
        const { title, content } = createNoteDto;

        const note = await this.noteRepository.findNoteById(id, userId);
        if (!note || note.userId !== userId) {
            throw new NotFoundException('Note not found');
        }

        return this.noteRepository.update(id, title, content);
    }

    async remove(id: number, userId: number): Promise<void> {
        const note = await this.noteRepository.findNoteById(id, userId);
        if (!note || note.userId !== userId) {
            throw new NotFoundException('Note not found');
        }

        await this.noteRepository.delete(id);
    }
}
