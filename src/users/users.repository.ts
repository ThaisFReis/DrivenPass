import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersRepository {
    constructor(private readonly prisma: PrismaService) { }

    async create(email: string, password: string, id: string){
        return this.prisma.user.create({
            data: {
                email,
                password,
                id,
            },
        });
    }

    async findByEmail(email: string){
        return this.prisma.user.findUnique({
            where: {
                email,
            },
        });
    }

    async findAll(){
        return this.prisma.user.findMany();
    }
}

export default UsersRepository;