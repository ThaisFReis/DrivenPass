import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CardType } from './enums/card-type.enum';
import { Card } from './cards.entity';

@Injectable()
export class CardService {
    constructor(private readonly prisma: PrismaService) { }

    async createCard(
        title: string,
        cardNumber: string,
        cardName: string,
        securityCode: string,
        expiration: string,
        virtual: boolean,
        cardType: string,
        userId: number,
    ) {
        const user = await this.prisma.user.findFirst({
            where: {
                id: userId,
            },
        });

        return this.prisma.card.create({
            data: {
                title,
                cardNumber,
                cardName,
                securityCode,
                expiration,
                virtual,
                cardType,
                userId: user.id,
            },
        });
    }

    async findAllCards(userId: number) {
        const user = await this.prisma.user.findFirst({
            where: {
                id: userId,
            },
        });

        return this.prisma.card.findMany({
            where: {
                userId: user.id,
            },
        });
    }

    async findCardById(cardId: number, userId: number) {
        const card = await this.prisma.card.findUnique({
            where: {
                id: cardId,
            },
        });

        return card || null;
    }

    async deleteCard(cardId: number, userId: number) {
        const card = await this.findCardById(cardId, userId);

        if (!card) {
            throw new NotFoundException('Card not found.');
        }

        if (card.userId !== userId) {
            throw new ForbiddenException('You do not have permission to delete this card.');
        }

        await this.prisma.card.delete({
            where: {
                id: cardId,
            },
        });
    }

    async updateCard(
        cardId: number,
        title: string,
        cardNumber: string,
        cardName: string,
        securityCode: string,
        expiration: string,
        virtual: boolean,
        cardType: string,
        userId: number,
    ) {
        const card = await this.findCardById(cardId, userId);

        if (!card) {
            throw new NotFoundException('Card not found.');
        }

        if (card.userId !== userId) {
            throw new ForbiddenException('You do not have permission to update this card.');
        }

        return this.prisma.card.update({
            where: {
                id: cardId,
            },
            data: {
                title,
                cardNumber,
                cardName,
                securityCode,
                expiration,
                virtual,
                cardType,
            },
        });
    }
}
