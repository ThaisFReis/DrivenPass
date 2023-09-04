import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, HttpException, HttpStatus, HttpCode } from '@nestjs/common';
import { CardService } from './cards.service';
import { CardType } from './enums/card-type.enum';
import { AuthGuard } from '../guard/auth.guard';
import { User } from '../decorators/user.decorator';
import { CreateCardDto } from './cards.dto';

@Controller('cards')
@UseGuards(AuthGuard)
export class CardsController {
    constructor(private readonly cardService: CardService) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async createCard(
        @Body() createCardDto: CreateCardDto,
        @User('id') userId: number,
    ){
        const { title, cardNumber, cardName, securityCode, expiration, virtual, cardType } = createCardDto;

        if (!title || !cardNumber || !cardName || !securityCode || !expiration || !virtual || !cardType) {
            throw new HttpException('Missing required fields', HttpStatus.BAD_REQUEST);
        }

        return this.cardService.createCard(title, cardNumber, cardName, securityCode, expiration, virtual, cardType, userId);
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    async findAllCards(@User('id') userId: number){
        return this.cardService.findAllCards(userId);
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    async findCardById(@Param('id') id: number, @User('id') userId: number){
        const cardId = Number(id);

        if (isNaN(cardId)) {
            throw new HttpException('Invalid id', HttpStatus.BAD_REQUEST);
        }

        return this.cardService.findCardById(cardId, userId);
    }

    @Put(':id')
    @HttpCode(HttpStatus.OK)
    async updateCard(
        @Param('id') id: number,
        @Body() createCardDto: CreateCardDto,
        @User('id') userId: number,
    ){
        const cardId = Number(id);

        if (isNaN(cardId)) {
            throw new HttpException('Invalid id', HttpStatus.BAD_REQUEST);
        }

        const { title, cardNumber, cardName, securityCode, expiration, virtual, cardType } = createCardDto;

        if (!title || !cardNumber || !cardName || !securityCode || !expiration || !virtual || !cardType) {
            throw new HttpException('Missing required fields', HttpStatus.BAD_REQUEST);
        }

        return this.cardService.updateCard(cardId, title, cardNumber, cardName, securityCode, expiration, virtual, cardType, userId);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteCard(@Param('id') id: number, @User('id') userId: number){
        const cardId = Number(id);

        if (isNaN(cardId)) {
            throw new HttpException('Invalid id', HttpStatus.BAD_REQUEST);
        }

        return this.cardService.deleteCard(cardId, userId);
    }
}
