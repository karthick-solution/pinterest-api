// src/user/user.service.ts
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from '../schemas/user.schema';
import { LoginDto } from './dto/login.dto';
import { JwtPayload, Tokens } from 'src/common/types';
import { JwtService } from '@nestjs/jwt';
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import { RegisterDto } from './dto/register.dto';
dotenv.config();

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name, 'app') private userModel: Model<UserDocument>, private jwtService: JwtService,) { }


  async register(dto: RegisterDto) {
    const existingUser = await this.userModel.findOne({ email: dto.email }).exec();
    
    if (existingUser) {
      throw new BadRequestException('Email is already in use');
    }
  
    const hashedPassword = await bcrypt.hash(dto.password, 10);
  
    const newUser = new this.userModel({
      username: dto.username,
      email: dto.email,
      password: hashedPassword,
    });
  
    await newUser.save();
  
    return {
      message: 'User registration successful',
      data: { newUser }
    };
  }

  async signin(dto: LoginDto) {
    let userQuery: any = {};
    if (dto.email) {
      userQuery.email = new RegExp(`${dto.email}$`, 'i');
    }
    const user: any = await this.userModel.findOne({ email: userQuery.email }).exec();
    if (!user) {
      throw new BadRequestException('Incorrect email for this user');
    }
    const passwordMatches = await bcrypt.compare(dto.password, user.password);
    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid password');
    }

    const tokens = await this.getTokens(user.email,user._id);

    return {
      message: 'Login Successful',
      data: {user, tokens },
    };
  }

  async getProfile(user: any) {
    
    const users = await this.userModel.findById(user.userId).exec();
    
    return {
      message: 'Current user',
      data:  users 
    };
  }

  
  async userList() {
    const users = await this.userModel.find().exec();
    
    return {
      message: 'User lists',
      data: users 
    };
  }

  async followUser(userId: string, followUserId: string): Promise<{ message: string; data: any }> {
    const updatedUser = await this.userModel.findByIdAndUpdate(
      userId,
      { $addToSet: { following: followUserId } },
      { new: true },
    );
    
    return {
      message: 'User followed successfully',
      data: updatedUser,
    };
  }
  
  async unfollowUser(userId: string, unfollowUserId: string): Promise<{ message: string; data: any }> {
    const updatedUser = await this.userModel.findByIdAndUpdate(
      userId,
      { $pull: { following: unfollowUserId } },
      { new: true },
    );
  
    return {
      message: 'User unfollowed successfully',
      data: updatedUser,
    };
  }

  async getTokens(email: string, userId: string): Promise<Tokens> {
    const jwtPayload: JwtPayload = {
      email: email,
      sub: userId,
    };
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: process.env.AT_SECRET,
        expiresIn: process.env.AT_EXPIRY,
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: process.env.RT_SECRET,
        expiresIn: process.env.RT_EXPIRY,
      }),
    ]);
    return {
      access_token: at,
      refresh_token: rt,
    };
  }

}
