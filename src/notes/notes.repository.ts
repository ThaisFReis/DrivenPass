import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NoteRepository {
    constructor(private readonly prisma: PrismaService) { }

    async create(title: string, content: string, userId: number) {
        const user = await this.prisma.user.findFirst({
            where: {
                id: userId,
            },
        });

        return this.prisma.note.create({
            data: {
                title: title,
                content: content,
                userId: user.id,
            },
        });
    }

    async findAll() {
        return this.prisma.note.findMany();
    }

    async findUserNotes(userId: number) {
        const user = await this.prisma.user.findFirst({
            where: {
                id: userId,
            },
        });

        return this.prisma.note.findMany({
            where: {
                userId: user.id,
            },
        });
    }

    async findNoteById(id: number, userId: number) {
        const user = await this.prisma.user.findFirst({
            where: {
                id: userId,
            },
        });

        return this.prisma.note.findFirst({
            where: {
                id,
                userId: user.id,
            },
        });
    }

    async findByTitle(title: string, userId: number) {
        const user = await this.prisma.user.findFirst({
            where: {
                id: userId,
            },
        });

        return this.prisma.note.findFirst({
            where: {
                title,
                userId: user.id,
            },
        });
    }

    async update(id: number, title: string, content: string) {
        return this.prisma.note.update({
            where: {
                id,
            },
            data: {
                title,
                content,
            },
        });
    }

    async delete(id: number) {
        return this.prisma.note.delete({
            where: {
                id,
            },
        });
    }
}