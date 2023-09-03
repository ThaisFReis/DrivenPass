import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { CreateUserDto, LoginUserDto } from './users.dto';
import * as bcrypt from 'bcrypt';
import { JwtService }  from '@nestjs/jwt';

@Injectable()
export class UsersService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly usersRepository: UsersRepository,
    ) { }

    async register(createUserDto: CreateUserDto, id: string) {
        const { email, password } = createUserDto;

        // Verifique se o usuário com o mesmo email já existe
        const existingUser = await this.usersRepository.findByEmail(email);
        if (existingUser) {
            throw new NotFoundException('User with this email alrea dy exists');
        }

        const saltRounds = 10; // Número de rounds para o bcrypt
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = await this.usersRepository.create(email, hashedPassword, id);

        // Retorne os detalhes do usuário registrado (sem a senha)
        const { password: _, ...userDetails } = newUser;
        return userDetails;
    }

    async login(loginUserDto: LoginUserDto) {
        const { email, password } = loginUserDto;

        // Encontre o usuário com base no email
        const user = await this.usersRepository.findByEmail(email);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        // Verifique a senha
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid password');
        }

        // Gere um token JWT
        const payload = { sub: user.id, email: user.email };

        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    async findAll() {
        return this.usersRepository.findAll();
    }
}
