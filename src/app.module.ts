import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UsersModule } from './users/users.module';
import { CredentialsModule } from './credentials/credentials.module';
import { NotesModule } from './notes/notes.module';

@Module({
  imports: [
    UsersModule,
    CredentialsModule,
    NotesModule,
  ],

  controllers: [ AppController ],
})

export class AppModule {}