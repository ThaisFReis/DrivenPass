import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { clearDb } from './utils/e2e-utils';
import { faker } from '@faker-js/faker';

describe('NotesController (e2e)', () => {
    let app: INestApplication;
    let prisma: PrismaService;
    let authToken: string;

    const createUserDto = {
        email: faker.internet.email(),
        password: faker.internet.password(),
    };

    const createNoteDto = {
        title: faker.lorem.word(),
        content: faker.lorem.sentences(),
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

    it('POST /notes => should create a note', async () => {
        const user = await request(app.getHttpServer())
            .post('/users/register')
            .send(createUserDto)
            .expect(HttpStatus.CREATED);

        const login = await request(app.getHttpServer())
            .post('/users/login')
            .send(createUserDto)
            .expect(HttpStatus.OK);

        authToken = login.body.access_token;

        const note = await request(app.getHttpServer())
            .post('/notes')
            .set('Authorization', `Bearer ${authToken}`)
            .send(createNoteDto)
            .expect(HttpStatus.CREATED);

        expect(note.body).toHaveProperty('id');
        expect(note.body).toHaveProperty('title', createNoteDto.title);
        expect(note.body).toHaveProperty('content', createNoteDto.content);
    });

    it('GET /notes => should return all notes', async () => {
        const user = await request(app.getHttpServer())
            .post('/users/register')
            .send(createUserDto)
            .expect(HttpStatus.CREATED);

        const login = await request(app.getHttpServer())
            .post('/users/login')
            .send(createUserDto)
            .expect(HttpStatus.OK);

        authToken = login.body.access_token;

        await request(app.getHttpServer())
            .post('/notes')
            .set('Authorization', `Bearer ${authToken}`)
            .send(createNoteDto)
            .expect(HttpStatus.CREATED);

        const notes = await request(app.getHttpServer())
            .get('/notes')
            .set('Authorization', `Bearer ${authToken}`)
            .expect(HttpStatus.OK);

        expect(notes.body).toHaveLength(1);
    });

    it('GET /notes/:id => should return a note by id', async () => {
        const user = await request(app.getHttpServer())
            .post('/users/register')
            .send(createUserDto)
            .expect(HttpStatus.CREATED);

        const login = await request(app.getHttpServer())
            .post('/users/login')
            .send(createUserDto)
            .expect(HttpStatus.OK);

        authToken = login.body.access_token;

        const note = await request(app.getHttpServer())
            .post('/notes')
            .set('Authorization', `Bearer ${authToken}`)
            .send(createNoteDto)
            .expect(HttpStatus.CREATED);

        const notes = await request(app.getHttpServer())
            .get(`/notes/${note.body.id}`)
            .set('Authorization', `Bearer ${authToken}`)
            .expect(HttpStatus.OK);

        expect(notes.body).toHaveProperty('id', note.body.id);
        expect(notes.body).toHaveProperty('title', note.body.title);
        expect(notes.body).toHaveProperty('content', note.body.content);
    });

    it('PUT /notes/:id => should update a note by id', async () => {
        const user = await request(app.getHttpServer())
            .post('/users/register')
            .send(createUserDto)
            .expect(HttpStatus.CREATED);

        const login = await request(app.getHttpServer())
            .post('/users/login')
            .send(createUserDto)
            .expect(HttpStatus.OK);

        authToken = login.body.access_token;

        const note = await request(app.getHttpServer())
            .post('/notes')
            .set('Authorization', `Bearer ${authToken}`)
            .send(createNoteDto)
            .expect(HttpStatus.CREATED);

        const updateNoteDto = {
            title: faker.lorem.word(),
            content: faker.lorem.sentences(),
        };

        const response = await request(app.getHttpServer())
            .put(`/notes/${note.body.id}`)
            .set('Authorization', `Bearer ${authToken}`)
            .send(updateNoteDto)
            .expect(HttpStatus.OK);

        expect(response.body).toHaveProperty('message', 'Note updated successfully');
    });

    it('DELETE /notes/:id => should delete a note by id', async () => {
        const user = await request(app.getHttpServer())
            .post('/users/register')
            .send(createUserDto)
            .expect(HttpStatus.CREATED);

        const login = await request(app.getHttpServer())
            .post('/users/login')
            .send(createUserDto)
            .expect(HttpStatus.OK);

        authToken = login.body.access_token;

        const note = await request(app.getHttpServer())
            .post('/notes')
            .set('Authorization', `Bearer ${authToken}`)
            .send(createNoteDto)
            .expect(HttpStatus.CREATED);

        const notes = await request(app.getHttpServer())
            .delete(`/notes/${note.body.id}`)
            .set('Authorization', `Bearer ${authToken}`)
            .expect(HttpStatus.NO_CONTENT);
    });

    it('GET /notes/:id => should return a 404 error if note not found', async () => {
        const user = await request(app.getHttpServer())
            .post('/users/register')
            .send(createUserDto)
            .expect(HttpStatus.CREATED);

        const login = await request(app.getHttpServer())
            .post('/users/login')
            .send(createUserDto)
            .expect(HttpStatus.OK);

        authToken = login.body.access_token;

        const notes = await request(app.getHttpServer())
            .get('/notes/1')
            .set('Authorization', `Bearer ${authToken}`)
            .expect(HttpStatus.NOT_FOUND);

        expect(notes.body).toHaveProperty('message', 'Note not found');
    });

    it('GET /notes/:id => should return a 401 error if token is not provided', async () => {
        const notes = await request(app.getHttpServer())
            .get('/notes/1')
            .expect(HttpStatus.UNAUTHORIZED);

        expect(notes.body).toHaveProperty('message', 'Unauthorized');
    });

    it('GET /notes/:id => should return a 401 error if token is invalid', async () => {
        const notes = await request(app.getHttpServer())
            .get('/notes/1')
            .set('Authorization', `Bearer ${authToken}abc`)
            .expect(HttpStatus.UNAUTHORIZED);

        expect(notes.body).toHaveProperty('message', 'Unauthorized');
    });

    it('GET /notes/:id => should return a 401 error if token is expired', async () => {
        const notes = await request(app.getHttpServer())
            .get('/notes/1')
            .set('Authorization', `Bearer ${authToken}`)
            .expect(HttpStatus.NOT_FOUND);

        expect(notes.body).toHaveProperty('message', 'Note not found');
    });
});
