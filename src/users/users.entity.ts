import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

@Entity()
@Unique(['email'])
export class User {
    @Column()
    email: string;

    @Column()
    password: string;
}