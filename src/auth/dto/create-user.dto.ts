import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, Matches, MaxLength, MinLength } from "class-validator";


export class CreateUserDto{

    @ApiProperty({
        description: 'User email address',
        example: 'user@google.com',
        nullable: false,
    })
    @IsString()
    @IsEmail()
    email!: string;


    @ApiProperty({
        description: 'User password (must contain uppercase, lowercase letter and a number)',
        example: 'Abc123456',
        minLength: 6,
        maxLength: 50,
        nullable: false,
    })
    @IsString()
    @MinLength(6)
    @MaxLength(50)
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'The password must have a Uppercase, lowercase letter and a number'
    })
    password!: string;



    @ApiProperty({
        description: 'User full name',
        example: 'John Doe',
        minLength: 1,
        nullable: false,
    })
    @IsString()
    @MinLength(1)
    fullName!: string;
}