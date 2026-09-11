import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, SetMetadata } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { AuthGuard } from '@nestjs/passport';

import { User } from './entities/users.entity';
import { GetUser, RawHeaders } from './decorators';
import { UserRoleGuard } from './guards/user-role/user-role.guard';




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


  @Get('private2')
  @SetMetadata('roles',['admin','superUser'])
  @UseGuards(AuthGuard(),UserRoleGuard)
  privateRoute2(
    @GetUser() user:User
  ){

    return{
      ok:true,
      user
    }
  }
}
