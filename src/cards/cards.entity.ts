// src/cards/entities/card.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, Unique, ManyToOne } from 'typeorm';
import { User } from '../users/users.entity';
import { CardType } from './enums/card-type.enum';

@Entity()
@Unique(['title'])
export class Card {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    cardNumber: string;

    @Column()
    cardName: string;

    @Column()
    securityCode: string;

    @Column()
    expiration: string;

    @Column({ default: false })
    virtual: boolean;

    @Column({
        type: 'enum',
        enum: CardType,
        default: CardType.CREDIT, // Define um valor padrão
    })
    type: CardType;
}
