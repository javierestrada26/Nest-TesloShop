import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsIn, IsInt, IsNumber, IsOptional, IsPositive, IsString, MinLength } from "class-validator";


export class CreateProductDto {

    @ApiProperty({
        description: 'Product title (unique)',
        example: 'Teslo T-Shirt',
        nullable: false,
        minLength: 1,
    })
    @IsString()
    @MinLength(1)
    title!:string;


    @ApiProperty({
        description: 'Product price in USD',
        example: 35.00,
        nullable: true,
        default: 0,
    })
    @IsNumber()
    @IsPositive()
    @IsOptional()
    price?:number;

    @ApiProperty({
        description: 'Product detailed description',
        example: 'Designed for comfort and style, this basic t-shirt features a modern fit.',
        nullable: true,
        required: false,
    })
    @IsString()
    @IsOptional()
    description?:string;


    @ApiProperty({
        description: 'Product slug - for SEO friendly URLs',
        example: 'teslo_t_shirt',
        nullable: true,
        required: false,
    })
    @IsString()
    @IsOptional()
    slug?: string;


    @ApiProperty({
        description: 'Available stock quantity',
        example: 10,
        nullable: true,
        default: 0,
        required: false,
    })
    @IsInt()
    @IsOptional()
    @IsPositive()
    stock?:number;


    @ApiProperty({
        description: 'Product sizes',
        example: ['S', 'M', 'L', 'XL'],
        type: [String],
    })
    @IsString({each:true})
    @IsArray()
    sizes!: string[];


    @ApiProperty({
        description: 'Target product gender category',
        example: 'men',
        enum: ['men', 'women', 'kid', 'unisex'],
    })
    @IsIn(['men','women','kid','unisex'])
    gender!:string;


    @ApiProperty({
        description: 'Product search tags',
        example: ['shirt', 'clothing', 'teslo'],
        required: false,
        type: [String],
    })
    @IsString({each:true})
    @IsArray()
    @IsOptional()
    tags!:string[];

    @ApiProperty({
        description: 'Product image filenames or URLs',
        example: ['1733884-00-A_0_2000.jpg', '1733884-00-A_1_2000.jpg'],
        required: false,
        type: [String],
    })
    @IsString({each:true})
    @IsArray()
    @IsOptional()
    images!:string[];

}
