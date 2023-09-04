import { PrismaService } from "../../src/prisma/prisma.service";

export const clearDb = async (prisma: PrismaService) => {
    await prisma.note.deleteMany();
    await prisma.credential.deleteMany();
    await prisma.user.deleteMany();
}
