import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsOptional, IsPositive, Min } from "class-validator";


export class PaginationDto {

    @ApiProperty({
        default: 10,
        example: 10,
        description: 'How many rows do you need?',
        required: false,
        type: Number,
    })
    @IsOptional()
    @IsPositive()
    @Type(()=> Number)
    @Min(1)
    limit? : number;


    @ApiProperty({
        default: 0,
        example: 0,
        description: 'How many rows do you want to skip?',
        required: false,
        type: Number,
    })
    @IsOptional()
    @Type(()=> Number)
    @Min(0)
    offset?:number;
}