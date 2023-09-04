import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { clearDb } from './utils/e2e-utils'
import { faker } from '@faker-js/faker';
import { CardService } from 'src/cards/cards.service';
const Cryptr = require("cryptr");

describe('CardsController (e2e)', () => {
    let app: INestApplication;
    let prisma: PrismaService;
    let cardService: CardService;
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

    const cardTypeOptions = ['CREDIT', 'DEBIT', 'BOTH'];
    const cardType = cardTypeOptions[Math.floor(Math.random() * cardTypeOptions.length)];


    const createCardDto = {
        title: faker.lorem.word(),
        cardNumber: faker.finance.creditCardNumber(),
        cardName: faker.internet.userName(),
        securityCode: faker.finance.creditCardCVV(),
        expiration: faker.date.future(),
        virtual: faker.datatype.boolean(),
        cardType: cardType
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

    describe('POST /cards', () => {
        it('should create a card', async () => {
            const { email, password } = createUserDto;

            await request(app.getHttpServer())
                .post('/auth/signup')
                .send({ email, password })
                .expect(HttpStatus.CREATED);

            const loginResponse = await request(app.getHttpServer())
                .post('/auth/login')
                .send({ email, password })
                .expect(HttpStatus.CREATED);

            authToken = loginResponse.body.access_token;

            const { title, cardNumber, cardName, securityCode, expiration, virtual, cardType } = createCardDto;

            const response = await request(app.getHttpServer())
                .post('/cards')
                .set('Authorization', `Bearer ${authToken}`)
                .send({ title, cardNumber, cardName, securityCode, expiration, virtual, cardType })
                .expect(HttpStatus.CREATED);

            expect(response.body).toEqual({
                id: expect.any(Number),
                title,
                cardNumber: crypt.encrypt(cardNumber),
                cardName,
                securityCode: crypt.encrypt(securityCode),
                expiration,
                virtual,
                cardType,
            });
        });

        it('should not create a card if missing required fields', async () => {
            const { email, password } = createUserDto;

            await request(app.getHttpServer())
                .post('/auth/signup')
                .send({ email, password })
                .expect(HttpStatus.CREATED);

            const loginResponse = await request(app.getHttpServer())
                .post('/auth/login')
                .send({ email, password })
                .expect(HttpStatus.CREATED);

            authToken = loginResponse.body.access_token;

            const { title, cardNumber, cardName, securityCode, expiration, virtual, cardType } = createCardDto;

            await request(app.getHttpServer())
                .post('/cards')
                .set('Authorization', `Bearer ${authToken}`)
                .send({ title, cardNumber, cardName, securityCode, expiration, virtual })
                .expect(HttpStatus.BAD_REQUEST);

            await request(app.getHttpServer())
                .post('/cards')
                .set('Authorization', `Bearer ${authToken}`)
                .send({ title, cardNumber, cardName, securityCode, expiration, cardType })
                .expect(HttpStatus.BAD_REQUEST);

            await request(app.getHttpServer())
                .post('/cards')
                .set('Authorization', `Bearer ${authToken}`)
                .send({ title, cardNumber, cardName, securityCode, virtual, cardType })
                .expect(HttpStatus.BAD_REQUEST);

            await request(app.getHttpServer())
                .post('/cards')
                .set('Authorization', `Bearer ${authToken}`)
                .send({ title, cardNumber, cardName, expiration, virtual, cardType })
                .expect(HttpStatus.BAD_REQUEST);

            await request(app.getHttpServer())
                .post('/cards')
                .set('Authorization', `Bearer ${authToken}`)
                .send({ title, cardNumber, securityCode, expiration, virtual, cardType })
                .expect(HttpStatus.BAD_REQUEST);

            await request(app.getHttpServer())
                .post('/cards')
                .set('Authorization', `Bearer ${authToken}`)
                .send({ title, cardName, securityCode, expiration, virtual, cardType })
                .expect(HttpStatus.BAD_REQUEST);

            await request(app.getHttpServer())
                .post('/cards')
                .set('Authorization', `Bearer ${authToken}`)
                .send({ cardNumber, cardName, securityCode, expiration, virtual, cardType })
                .expect(HttpStatus.BAD_REQUEST);
        });
    });
});