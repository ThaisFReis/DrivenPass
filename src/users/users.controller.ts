import { Controller, Post, Body, ValidationPipe, HttpException, HttpStatus, Get, HttpCode } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, LoginUserDto } from './users.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    if (!createUserDto.email || !createUserDto.password) {
      throw new HttpException('Email and password are required', HttpStatus.BAD_REQUEST);
    }

    try {
      await this.usersService.register(createUserDto);

      return {
        message: 'User created successfully'
      }
    }
    catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body(ValidationPipe) loginUserDto: LoginUserDto) {
    return this.usersService.login(loginUserDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll() {
    return this.usersService.findAll();
  }
}
