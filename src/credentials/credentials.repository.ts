import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Credential } from './credentials.entity';

@Injectable()
export class CredentialRepository {
    constructor(private readonly prisma: PrismaService) { }

    async create(title: string, url: string, username: string, password: string, userId: number): Promise<Credential> {
        const user = await this.prisma.user.findFirst({
            where: {
                id: userId,
            },
        });

        return this.prisma.credential.create({
            data: {
                title: title,
                url: url,
                username: username,
                password: password,
                userId: user.id,
            },
        });
    }

    async findById(id: number, userId: number) {
        return this.prisma.credential.findFirst({
            where: {
                id: id,
                userId: userId,
            },

        });
    }

    async findAll(userId: number) {
        const user = await this.prisma.user.findFirst({
            where: {
                id: userId,
            },
        });

        return this.prisma.credential.findMany({
            where: {
                userId: user.id,
            },
        });
    }

    async update(id: number, title: string, url: string, username: string, password: string, userId: number) {
        const user = await this.prisma.user.findFirst({
            where: {
                id: userId,
            },
        });

        return this.prisma.credential.update({
            where: {
                id: id,
                userId: user.id,
            },
            data: {
                title,
                url,
                username,
                password,
            },
        });
    }

    async delete(id: number, userId: number) {
        const user = await this.prisma.user.findFirst({
            where: {
                id: userId,
            },
        });

        const credential = await this.findById(id, user.id);

        if (!credential) {
            throw new NotFoundException('Credential not found.');
        }

        await this.prisma.credential.delete({
            where: {
                id: id,
            },
        });
    }
}

export default CredentialRepository;
