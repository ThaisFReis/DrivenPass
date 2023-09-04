// src/cards/dto/create-card.dto.ts
import { IsNotEmpty, IsString, IsBoolean, IsCreditCard, IsDateString, IsEnum } from 'class-validator';
import { CardType } from './enums/card-type.enum';

export class CreateCardDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsCreditCard()
    cardNumber: string;

    @IsNotEmpty()
    @IsString()
    cardName: string;

    @IsNotEmpty()
    @IsString()
    securityCode: string;

    @IsNotEmpty()
    @IsDateString()
    expiration: string;

    @IsNotEmpty()
    @IsBoolean()
    virtual: boolean;

    @IsNotEmpty()
    @IsEnum(CardType, { message: 'Invalid card type' })
    cardType: CardType;
}
