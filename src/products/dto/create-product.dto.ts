import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsIn, IsInt, IsNumber, IsOptional, IsPositive, IsString,MinLength } from "class-validator";


export class CreateProductDto {

    @ApiProperty({
        description: 'Product title (unique)',
        nullable: false,
        minLength: 1,
    })
    @IsString()
    @MinLength(1)
    title!:string;


    @ApiProperty({
        description: 'Product price',
        nullable: true,
        default: 0,
    })
    @IsNumber()
    @IsPositive()
    @IsOptional()
    price?:number;

    @ApiProperty({
        description: 'Product description',
        nullable: true,
    })
    @IsString()
    @IsOptional()
    description?:string;


    @ApiProperty({
        description: 'Product slug - for SEO friendly URLs',
        nullable: true,
    })
    @IsString()
    @IsOptional()
    slug?: string;


    @ApiProperty({
        description: 'Stock quantity',
        nullable: true,
        default: 0,
    })
    @IsInt()
    @IsOptional()
    @IsPositive()
    stock?:number;


    @ApiProperty({
        description: 'Product sizes',
        example: ['M', 'L'],
    })
    @IsString({each:true})
    @IsArray()
    sizes!: string[];


    @ApiProperty({
        description: 'Product gender',
        example: 'men',
    })
    @IsIn(['men','women','kid','unisex'])
    gender!:string;


    @ApiProperty({
        description: 'Product tags',
        example: ['shirt'],
        required: false,
    })
    @IsString({each:true})
    @IsArray()
    @IsOptional()
    tags!:string[]

    @ApiProperty({
        description: 'Product images',
        required: false,
    })
    @IsString({each:true})
    @IsArray()
    @IsOptional()
    images!:string[]

}
