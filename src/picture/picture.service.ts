import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Picture, PictureDocument } from '../schemas/picture.schema';

@Injectable()
export class PictureService {
  constructor(@InjectModel(Picture.name,  'app') private pictureModel: Model<PictureDocument>) { }

  async addPicture(pictureDto: any) {
    console.log(545454545);
    
    const newPicture = new this.pictureModel(pictureDto);
    const savedPicture = await newPicture.save();
    return {
      message: 'Picture added successfully',
      data: savedPicture,
    };
  }

  async likePicture(pictureId: string, userId: string): Promise<{ message: string; data: Picture }> {
    const updatedPicture = await this.pictureModel.findByIdAndUpdate(
      pictureId,
      { $addToSet: { likedBy: userId } },
      { new: true },
    );
    return {
      message: 'Picture liked successfully',
      data: updatedPicture,
    };
  }

  async unlikePicture(pictureId: string, userId: string): Promise<{ message: string; data: Picture }> {
    const updatedPicture = await this.pictureModel.findByIdAndUpdate(
      pictureId,
      { $pull: { likedBy: userId } },
      { new: true },
    );
    return {
      message: 'Picture unliked successfully',
      data: updatedPicture,
    };
  }


  async tagPicture(pictureId: string, tags: string[]): Promise<{ message: string; data: Picture }> {
    const updatedPicture = await this.pictureModel.findByIdAndUpdate(
      pictureId,
      { $addToSet: { tags: { $each: tags } } },
      { new: true },
    );
    return {
      message: 'Tags added successfully',
      data: updatedPicture,
    };
  }

  async getPictures(user: any){
    console.log('userId ', user.userId);
  
    // Retrieve pictures and populate creator details
    const pictures:any = await this.pictureModel.find()
      .populate('createdBy', 'username email following')
      .sort({ createdAt: -1 })
      .exec();
  
    // Add isFollowing key to each picture object
    const updatedPictures = await pictures.map((picture:any) => {
      const isFollowing = picture.createdBy?.following.includes(user.userId);
      const isLiked = picture.likedBy.includes(user.userId);

      return {
        ...picture.toObject(), // Convert Mongoose document to plain object
        isFollowing,
        isLiked
      };
    });
  
    return {
      message: 'Post lists retrieved successfully',
      data: updatedPictures,
    };
  }

}
