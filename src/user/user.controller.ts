import { Controller, Post, Body, Param, UseGuards, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { GetCurrentUser, Public } from 'src/common/decorators';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AtGuard } from 'src/common/guards/at.guard';

@Controller('users')
export class UserController {
    constructor(private userService: UserService) {}

    @Post('login')
    signin(@Body() dto: LoginDto) {
      return this.userService.signin(dto);
    }

    @UseGuards(AtGuard)
    @Post('register')
    register(@Body() dto: RegisterDto) {
      return this.userService.register(dto);
    }

    @UseGuards(AtGuard)
    @Get('get-profile')
    getProfile(@GetCurrentUser() user: any) {
      return this.userService.getProfile(user);
    }

    @UseGuards(AtGuard)
    @Get('get-users')
    userList() {
      return this.userService.userList();
    }

    @UseGuards(AtGuard)
    @Post(':userId/follow/:followUserId')
    followUser(@Param('userId') userId: string, @Param('followUserId') followUserId: string) {
      return this.userService.followUser(userId, followUserId);
    }

    @UseGuards(AtGuard)
    @Post(':userId/unfollow/:unfollowUserId')
    unfollowUser(@Param('userId') userId: string, @Param('unfollowUserId') unfollowUserId: string) {
      return this.userService.unfollowUser(userId, unfollowUserId);
    }
    
}
