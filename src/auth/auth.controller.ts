import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, SetMetadata } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { AuthGuard } from '@nestjs/passport';

import { User } from './entities/users.entity';
import { Auth, GetUser, RawHeaders } from './decorators';
import { UserRoleGuard } from './guards/user-role/user-role.guard';
import { RoleProtected } from './decorators/role-protected.decorator';
import { ValidRoles } from './interfaces';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';



@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user', description: 'Creates a new user account and returns user details along with JWT token' })
  @ApiResponse({ status: 201, description: 'User created successfully', type: User })
  @ApiResponse({ status: 400, description: 'Bad Request (Validation error or email already exists)' })
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'User login', description: 'Authenticates user credentials and returns JWT token' })
  @ApiResponse({ status: 200, description: 'User logged in successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized (Invalid credentials)' })
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('check-status')
  @Auth()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Check authentication status', description: 'Validates current JWT token and returns updated token with user data' })
  @ApiResponse({ status: 200, description: 'Authentication status valid', type: User })
  @ApiResponse({ status: 401, description: 'Unauthorized (Token invalid or expired)' })
  checkAuthStatus(
    @GetUser() user:User
  ){

    return this.authService.checkAuthStatus(user)
  }

  @Get('private')
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Testing private route (AuthGuard)' })
  @ApiResponse({ status: 200, description: 'Access granted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
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

  //@SetMetadata('roles',['admin','super-user'])

  @Get('private2')
  @RoleProtected(ValidRoles.superUser, ValidRoles.admin)
  @UseGuards(AuthGuard(),UserRoleGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Testing private route 2 (RoleProtected - SuperUser / Admin)' })
  @ApiResponse({ status: 200, description: 'Access granted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden (Role not allowed)' })
  privateRoute2(
    @GetUser() user:User
  ){

    return{
      ok:true,
      user
    }
  }


  @Get('private3')
  @Auth(ValidRoles.admin)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Testing private route 3 (Auth decorator - Admin)' })
  @ApiResponse({ status: 200, description: 'Access granted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden (Role not allowed)' })
  privateRoute3(
    @GetUser() user:User
  ){

    return{
      ok:true,
      user
    }
  }
}
