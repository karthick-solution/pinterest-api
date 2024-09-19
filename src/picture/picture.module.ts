import { Module } from '@nestjs/common';
import { PictureController } from './picture.controller';
import { PictureService } from './picture.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Picture, PictureSchema } from 'src/schemas/picture.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Picture.name, schema: PictureSchema },
    ], 'app'),
  ],
  controllers: [PictureController],
  providers: [PictureService]
})
export class PictureModule {}
