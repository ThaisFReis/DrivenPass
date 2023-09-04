import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { clearDb } from './utils/e2e-utils'
import { faker } from '@faker-js/faker';

describe('UsersController (e2e)', () => {
    let app: INestApplication;
    let prisma: PrismaService;

    const createUserDto = {
        email: faker.internet.email(),
        password: faker.internet.password(),
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

    it('POST /users/register => should register a user', async () => {
        const response = await request(app.getHttpServer())
            .post('/users/register')
            .send(createUserDto)
            .expect(HttpStatus.CREATED);


        // Test if the response indicates a successful user registration
        expect(response.body).toHaveProperty('message', 'User created successfully');

        // Test if the user was actually created in the database
        const registeredUser = await prisma.user.findUnique({
            where: { email: createUserDto.email },
        });

        expect(registeredUser).toBeTruthy();
    });

    it('POST /users/login => should login a user', async () => {
        const user = await request(app.getHttpServer())
            .post('/users/register')
            .send(createUserDto)
            .expect(HttpStatus.CREATED);

        if (user) {
            const response = await request(app.getHttpServer())
                .post('/users/login')
                .send(createUserDto)
                .expect(HttpStatus.OK);

            expect(response.body).toHaveProperty('access_token');
        }
    });

    it('GET /users => should return all users', async () => {
        const user = await request(app.getHttpServer())
            .post('/users/register')
            .send(createUserDto)
            .expect(HttpStatus.CREATED);

        if (user) {
            const response = await request(app.getHttpServer())
                .get('/users')
                .expect(HttpStatus.OK);

            expect(response.body).toHaveLength(1);
        }
    });

    it('POST /users/register => should return 400 if email is not provided', async () => {
        const response = await request(app.getHttpServer())
            .post('/users/register')
            .send({ password: faker.internet.password() })
            .expect(HttpStatus.BAD_REQUEST);

        expect(response.body).toHaveProperty('message[0]', "email must be an email");
        expect(response.body).toHaveProperty('message[1]', "email should not be empty");
    });

    it('POST /users/register => should return 400 if password is not provided', async () => {
        const response = await request(app.getHttpServer())
            .post('/users/register')
            .send({ email: faker.internet.email() })
            .expect(HttpStatus.BAD_REQUEST);

        expect(response.body).toHaveProperty('message[0]', "password must be longer than or equal to 6 characters");
    });

    it('POST /users/login => should return 401 if user does not exist', async () => {
        const response = await request(app.getHttpServer())
            .post('/users/login')
            .send(createUserDto)
            .expect(HttpStatus.UNAUTHORIZED);

        expect(response.body).toHaveProperty('message', "Invalid credentials");
    });

    it('POST /users/login => should return 401 if password is incorrect', async () => {
        const user = await request(app.getHttpServer())
            .post('/users/register')
            .send(createUserDto)
            .expect(HttpStatus.CREATED);

        if (user) {
            const response = await request(app.getHttpServer())
                .post('/users/login')
                .send({ email: createUserDto.email, password: faker.internet.password() })
                .expect(HttpStatus.UNAUTHORIZED);

            expect(response.body).toHaveProperty('message', "Invalid credentials");
        }
    });

});
