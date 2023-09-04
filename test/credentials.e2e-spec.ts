import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { clearDb } from './utils/e2e-utils'
import { faker } from '@faker-js/faker';
import { CredentialsService } from '../src/credentials/credentials.service';
const Cryptr = require("cryptr");



describe('CredentialsController (e2e)', () => {
    let app: INestApplication;
    let prisma: PrismaService;
    let credentialsService: CredentialsService;
    let authToken: string;
    const crypt = new Cryptr(process.env.CRYPT_SECRET);

    const createUserDto = {
        email: faker.internet.email(),
        password: faker.internet.password(),
    };

    const createCredentialDto = {
        title: faker.lorem.word(),
        name: faker.lorem.word(),
        username: faker.internet.userName(),
        password: faker.internet.password(),
        url: faker.internet.url()
    };

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        prisma = moduleFixture.get<PrismaService>(PrismaService);

        await app.init();
    });

    afterEach(async () => {
        await clearDb(prisma);
    });

    afterAll(async () => {
        await app.close();
        await prisma.$disconnect();
    });

    it('POST /credentials => should create a credential', async () => {
        const user = await request(app.getHttpServer())
            .post('/users/register')
            .send(createUserDto)
            .expect(HttpStatus.CREATED);

        const login = await request(app.getHttpServer())
            .post('/users/login')
            .send(createUserDto)
            .expect(HttpStatus.OK);

        authToken = login.body.access_token;

        const credential = await request(app.getHttpServer())
            .post('/credentials')
            .set('Authorization', `Bearer ${authToken}`)
            .send(createCredentialDto)
            .expect(HttpStatus.CREATED);

        expect(credential.body).toHaveProperty('id', credential.body.id);
        expect(credential.body).toHaveProperty('title', credential.body.title);
        expect(credential.body).toHaveProperty('username', credential.body.username);
        expect(credential.body).toHaveProperty('password', credential.body.password);
        expect(credential.body).toHaveProperty('url', credential.body.url);
        expect(credential.body).toHaveProperty('userId', credential.body.userId);
    });

    it('GET /credentials => should return all credentials', async () => {
        const user = await request(app.getHttpServer())
            .post('/users/register')
            .send(createUserDto)
            .expect(HttpStatus.CREATED);

        const login = await request(app.getHttpServer())
            .post('/users/login')
            .send(createUserDto)
            .expect(HttpStatus.OK);

        authToken = login.body.access_token;

        const credential = await request(app.getHttpServer())
            .post('/credentials')
            .set('Authorization', `Bearer ${authToken}`)
            .send(createCredentialDto)
            .expect(HttpStatus.CREATED);

        const credentials = await request(app.getHttpServer())
            .get('/credentials')
            .set('Authorization', `Bearer ${authToken}`)
            .expect(HttpStatus.OK);

        expect(credentials.body).toHaveLength(1);
    });

    it('GET /credentials/:id => should return a credential by id', async () => {
        const user = await request(app.getHttpServer())
            .post('/users/register')
            .send(createUserDto)
            .expect(HttpStatus.CREATED);

        const login = await request(app.getHttpServer())
            .post('/users/login')
            .send(createUserDto)
            .expect(HttpStatus.OK);

        authToken = login.body.access_token;

        const credential = await request(app.getHttpServer())
            .post('/credentials')
            .set('Authorization', `Bearer ${authToken}`)
            .send(createCredentialDto)
            .expect(HttpStatus.CREATED);

        const credentials = await request(app.getHttpServer())
            .get(`/credentials/${credential.body.id}`)
            .set('Authorization', `Bearer ${authToken}`)
            .expect(HttpStatus.OK);

        expect(credentials.body).toHaveProperty('id', credential.body.id);
        expect(credentials.body).toHaveProperty('title', credential.body.title);
        expect(credentials.body).toHaveProperty('username', credential.body.username);
        expect(credentials.body).toHaveProperty('password', credential.body.password);
        expect(credentials.body).toHaveProperty('url', credential.body.url);
        expect(credentials.body).toHaveProperty('userId', credential.body.userId);
    });

    it('PUT /credentials/:id => should update a credential by id', async () => {
        const user = await request(app.getHttpServer())
            .post('/users/register')
            .send(createUserDto)
            .expect(HttpStatus.CREATED);

        const login = await request(app.getHttpServer())
            .post('/users/login')
            .send(createUserDto)
            .expect(HttpStatus.OK);

        authToken = login.body.access_token;

        const credential = await request(app.getHttpServer())
            .post('/credentials')
            .set('Authorization', `Bearer ${authToken}`)
            .send(createCredentialDto)
            .expect(HttpStatus.CREATED);

        const updateCredentialDto = {
            title: faker.lorem.word(),
            name: faker.lorem.word(),
            username: faker.internet.userName(),
            password: faker.internet.password(),
            url: faker.internet.url()
        };

        const response = await request(app.getHttpServer())
            .put(`/credentials/${credential.body.id}`)
            .set('Authorization', `Bearer ${authToken}`)
            .send(updateCredentialDto)
            .expect(HttpStatus.OK);

        expect(response.body).toHaveProperty('message', 'Credential updated successfully');
    });

    it('DELETE /credentials/:id => should delete a credential by id', async () => {
        const user = await request(app.getHttpServer())
            .post('/users/register')
            .send(createUserDto)
            .expect(HttpStatus.CREATED);

        const login = await request(app.getHttpServer())
            .post('/users/login')
            .send(createUserDto)
            .expect(HttpStatus.OK);

        authToken = login.body.access_token;

        const credential = await request(app.getHttpServer())
            .post('/credentials')
            .set('Authorization', `Bearer ${authToken}`)
            .send(createCredentialDto)
            .expect(HttpStatus.CREATED);

        const credentials = await request(app.getHttpServer())
            .delete(`/credentials/${credential.body.id}`)
            .set('Authorization', `Bearer ${authToken}`)
            .expect(HttpStatus.OK);

        expect(credentials.body).toHaveProperty('message', 'Credential deleted successfully');
    });

    it('GET /credentials/:id/decrypt => should decrypt a credential password by id', async () => {
        const user = await request(app.getHttpServer())
            .post('/users/register')
            .send(createUserDto)
            .expect(HttpStatus.CREATED);

        const login = await request(app.getHttpServer())
            .post('/users/login')
            .send(createUserDto)
            .expect(HttpStatus.OK);

        authToken = login.body.access_token;

        const credential = await request(app.getHttpServer())
            .post('/credentials')
            .set('Authorization', `Bearer ${authToken}`)
            .send(createCredentialDto)
            .expect(HttpStatus.CREATED);

        const credentials = await request(app.getHttpServer())
            .get(`/credentials/${credential.body.id}/decrypt`)
            .set('Authorization', `Bearer ${authToken}`)

    });

    it('GET /credentials/:id/decrypt => should return a 404 error if credential not found', async () => {
        const user = await request(app.getHttpServer())
            .post('/users/register')
            .send(createUserDto)
            .expect(HttpStatus.CREATED);

        const login = await request(app.getHttpServer())
            .post('/users/login')
            .send(createUserDto)
            .expect(HttpStatus.OK);

        authToken = login.body.access_token;

        const credentials = await request(app.getHttpServer())
            .get(`/credentials/1/decrypt`)
            .set('Authorization', `Bearer ${authToken}`)
            .expect(HttpStatus.NOT_FOUND);

        expect(credentials.body).toHaveProperty('message', 'Credential not found');
    });

    it('GET /credentials/:id/decrypt => should return a 404 error if credential not found', async () => {
        const credentials = await request(app.getHttpServer())
            .get(`/credentials/1/decrypt`)
            .set('Authorization', `Bearer ${authToken}`)
            .expect(HttpStatus.NOT_FOUND);

        expect(credentials.body).toHaveProperty('message', 'Credential not found');
    });

    it('GET /credentials/:id/decrypt => should return a 400 error if id is not a number', async () => {
        const credentials = await request(app.getHttpServer())
            .get(`/credentials/abc/decrypt`)
            .set('Authorization', `Bearer ${authToken}`)
            .expect(HttpStatus.BAD_REQUEST);

        expect(credentials.body).toHaveProperty('message', 'Invalid id');
    });

    it('GET /credentials/:id/decrypt => should return a 401 error if token is not provided', async () => {
        const credentials = await request(app.getHttpServer())
            .get(`/credentials/1/decrypt`)
            .expect(HttpStatus.UNAUTHORIZED);

        expect(credentials.body).toHaveProperty('message', 'Unauthorized');
    });

    it('GET /credentials/:id/decrypt => should return a 401 error if token is invalid', async () => {
        const credentials = await request(app.getHttpServer())
            .get(`/credentials/1/decrypt`)
            .set('Authorization', `Bearer ${authToken}abc`)
            .expect(HttpStatus.UNAUTHORIZED);

        expect(credentials.body).toHaveProperty('message', 'Unauthorized');
    });

    it('GET /credentials/:id/decrypt => should return a 401 error if token is expired', async () => {
        const credentials = await request(app.getHttpServer())
            .get(`/credentials/1/decrypt`)
            .set('Authorization', `Bearer ${authToken}`)
            .expect(HttpStatus.NOT_FOUND);

        expect(credentials.body).toHaveProperty('message', 'Credential not found');
    });
});