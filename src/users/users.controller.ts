import { Controller, Post, Body, ValidationPipe, HttpException, HttpStatus, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, LoginUserDto } from './users.dto';
import { v4 as uuidv4 } from 'uuid';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async register(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    if(!createUserDto.email || !createUserDto.password) {
      throw new HttpException('Email and password are required', HttpStatus.BAD_REQUEST);
    }

    try{
      const id = uuidv4();
      const user = await this.usersService.register(createUserDto, id);
      return {
        message: 'User created successfully',
        statusCode: HttpStatus.CREATED,
      }
    }
    catch(error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('login')
  async login(@Body(ValidationPipe) loginUserDto: LoginUserDto) {
    return this.usersService.login(loginUserDto);
  }

  @Get()
  async findAll() {
    return this.usersService.findAll();
  }
}
