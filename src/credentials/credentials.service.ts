import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CredentialRepository } from './credentials.repository';
import { CreateCredentialDto } from './credentials.dto';
import { Credential } from './credentials.entity';
const Cryptr = require("cryptr");

@Injectable()
export class CredentialsService {

    constructor(private readonly repository: CredentialRepository) { }

    crypt = new Cryptr(process.env.CRYPT_SECRET);

    async create(createCredentialDto: CreateCredentialDto, userId: number): Promise<Credential> {
        const { title, url, username, password } = createCredentialDto;

        if (!title || !url || !username || !password) {
            throw new NotFoundException('Missing required fields');
        }

        // Encrypt password
        const encryptedPassword = await this.encryptPassword(password);

        const credential = await this.repository.create(
            title,
            url,
            username,
            encryptedPassword,
            userId
        );

        return credential;
    }

    async encryptPassword(password: string){
        const encryptedPassword = this.crypt.encrypt(password);

        return encryptedPassword;
    }

    async update(id: number, createCredentialDto: CreateCredentialDto, userId: number): Promise<Credential> {
        const { title, url, username, password } = createCredentialDto;

        const credential = await this.repository.findById(id, userId);

        if (!credential) {
            throw new NotFoundException('Credential not found');
        }

        // Encrypt password
        const encryptedPassword = await this.encryptPassword(password);

        await this.repository.update(
            id,
            title,
            url,
            username,
            encryptedPassword,
            userId
        );

        throw new HttpException('Credential updated successfully', 200);
    }

    async remove(id: number, userId: number): Promise<void> {
        const credential = await this.repository.findById(id, userId);

        if (!credential) {
            throw new NotFoundException('Credential not found');
        }

        await this.repository.delete(id, userId);

        throw new HttpException('Credential deleted successfully', 200);
    }

    async decryptPassword(id: number, userId: number): Promise<string> {
        const credential = await this.repository.findById(id, userId);

        if (!credential) {
            throw new NotFoundException('Credential not found');
        }

        const decryptPassword = this.crypt.decrypt(credential.password);

        throw new HttpException("Decrypted password: " + decryptPassword, 200);
    }

    async findAll(userId: number): Promise<Credential[]> {
        return this.repository.findAll(userId);
    }

    async findById(id: number, userId: number): Promise<Credential> {
        return this.repository.findById(id, userId);
    }
}