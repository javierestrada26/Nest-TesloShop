import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { AuthGuard } from '@nestjs/passport';

import { User } from './entities/users.entity';
import { GetUser, RawHeaders } from './decorators';



@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('private')
  @UseGuards(AuthGuard())
  testingPrivateRoute(
    //@Req() request:Express.Request
    @GetUser() user: User,
    @GetUser('email') userEmail:string,
    @RawHeaders() rawHeaders: string[],
  ){
  
    return{
      ok:true,
      message:'Hola Mundo Private',
      user,
      userEmail,
      rawHeaders
    }
  }

}
