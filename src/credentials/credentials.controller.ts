import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, HttpException, HttpStatus, HttpCode } from '@nestjs/common';
import { CredentialsService } from './credentials.service';
import { CreateCredentialDto } from './credentials.dto';
import { Credential } from './credentials.entity';
import { AuthGuard } from '../guard/auth.guard';
import { User } from '../decorators/user.decorator';

@Controller('credentials')
@UseGuards(AuthGuard)
export class CredentialsController {
    constructor(private readonly credentialsService: CredentialsService) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() createCredentialDto: CreateCredentialDto, @User('id') userId: number): Promise<Credential> {
        const { title, url, username, password } = createCredentialDto;

        if (!title || !url || !username || !password) {
            throw new HttpException('Missing required fields', HttpStatus.BAD_REQUEST);
        }

        const credential = {
            title,
            url,
            username,
            password,
            userId,
        }

        return this.credentialsService.create(credential, userId);
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    async findAll(@User('id') userId: number): Promise<Credential[]> {
        return this.credentialsService.findAll(userId);
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    async findById(@Param('id') id: number, @User('id') userId: number): Promise<Credential> {
        const credentialId = Number(id);

        if (isNaN(credentialId)) {
            throw new HttpException('Invalid id', HttpStatus.BAD_REQUEST);
        }

        return this.credentialsService.findById(credentialId, userId);
    }

    @Put(':id')
    @HttpCode(HttpStatus.OK)
    async update(
        @Param('id') id: number,
        @Body() createCredentialDto: CreateCredentialDto,
        @User('id') userId: number,
    ): Promise<Credential> {
        const credentialId = Number(id);

        if (isNaN(credentialId)) {
            throw new HttpException('Invalid id', HttpStatus.BAD_REQUEST);
        }

        return this.credentialsService.update(credentialId, createCredentialDto, userId);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async remove(@Param('id') id: number, @User('id') userId: number) {
        const credentialId = Number(id);

        if (isNaN(credentialId)) {
            throw new HttpException('Invalid id', HttpStatus.BAD_REQUEST);
        }

        return this.credentialsService.remove(credentialId, userId);
    }

    @Get(':id/decrypt')
    async decryptPassword(@Param('id') id: number, @User('id') userId: number) {
        const credentialId = Number(id);

        if (isNaN(credentialId)) {
            throw new HttpException('Invalid id', HttpStatus.BAD_REQUEST);
        }

        return this.credentialsService.decryptPassword(credentialId, userId);
    }
}
