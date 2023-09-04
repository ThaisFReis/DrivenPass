import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCredentialDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsString()
    url?: string;

    @IsString()
    username?: string;

    @IsNotEmpty()
    @IsString()
    password: string;
}
