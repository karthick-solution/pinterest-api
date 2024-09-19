import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PictureModule } from './picture/picture.module';
import { UserModule } from './user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';
import { MongooseModule } from '@nestjs/mongoose';
import { AtStrategy } from './common/strategies/at.strategy';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
dotenv.config();

@Module({
  controllers: [AppController],
  providers: [AppService,AtStrategy, 
    //  {
    // provide: APP_GUARD,
    // useClass: AtGuard,
    // },
  ],
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
      isGlobal: true, // Makes the ConfigModule global
      
    }),

    MongooseModule.forRoot(process.env.MONGO_HOST, {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
       connectionName: "app"
    }),

    ServeStaticModule.forRoot({
      rootPath: join('./assets'),
      serveRoot: '/images',
    }),

    PictureModule,
    UserModule
  ],
})
export class AppModule {}
