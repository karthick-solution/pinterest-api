import { Controller, Get, Post, Body, Param, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { PictureService } from './picture.service';
import { AtGuard } from 'src/common/guards/at.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { GetCurrentUser } from 'src/common/decorators';
const { v4: uuidV4 } = require('uuid');

@Controller('pictures')
export class PictureController {
    constructor(private pictureService: PictureService) {}

    @UseInterceptors(
      FileInterceptor('file', {
        storage: diskStorage({
          destination: function (req, file, cb) {
            cb(null, './assets');
          },
          filename(req, file, callback) {
            let extension;
            if (file && file.originalname) {
              const arr = file.originalname.split('.');
              if (arr && Array.isArray(arr) && arr.length > 1) {
                extension = arr[arr.length - 1];
              }
            }
            req.body.uniqueId = uuidV4();
            const fName = req?.body?.uniqueId
              ? req?.body?.uniqueId + '.' + extension
              : file.originalname;
            req.body.image = `images/${fName}`;
            callback(null, fName);
          },
        }),
        limits: {
          fileSize: 5 * 1024 * 1024,
        },
      }),
    )
    @UseGuards(AtGuard)
    @Post('add')
    addPicture(@Body() pictureDto: any, @UploadedFile() file: any, @GetCurrentUser() user: any) {
      pictureDto.url = `images/${file.filename}`;
      pictureDto.tags = JSON.parse(pictureDto.tags);
      pictureDto.createdBy = user.userId;
      return this.pictureService.addPicture(pictureDto);
    }
  
    @UseGuards(AtGuard)
    @Post(':pictureId/like/:userId')
    likePicture(@Param('pictureId') pictureId: string, @Param('userId') userId: string) {
      return this.pictureService.likePicture(pictureId, userId);
    }
  
    @UseGuards(AtGuard)
    @Post(':pictureId/unlike/:userId')
    unlikePicture(@Param('pictureId') pictureId: string, @Param('userId') userId: string) {
      return this.pictureService.unlikePicture(pictureId, userId);
    }
    
    @UseGuards(AtGuard)
    @Get()
    getPictures(@GetCurrentUser() user: any) {
      return this.pictureService.getPictures(user);
    }
}
