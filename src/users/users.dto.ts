import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    password: string;
}

export class LoginUserDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}