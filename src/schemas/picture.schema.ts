import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type PictureDocument = Picture & Document;

@Schema({ timestamps: true })
export class Picture extends Document {
  @Prop({ required: true })
  url: string;

  @Prop({ default: [] })
  tags: string[];

  @Prop({ default: 0 })
  likes: number;

  @Prop({ default: [] })
  likedBy: string[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  createdBy: string;

}

export const PictureSchema = SchemaFactory.createForClass(Picture);
